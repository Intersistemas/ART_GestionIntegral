'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CustomButton from '../../../../../utils/ui/button/CustomButton';

const API_BASE = 'http://arttest.intersistemas.ar:8302/api';

type RespuestaCuestionarioVm = {
    interno?: number;
    internoCuestionario?: number;
    internoRespuestaFormulario?: number;
    respuesta?: string;
    fechaRegularizacion?: number | null;
    observaciones?: string | null;
    estadoAccion?: string | null;
    estadoFecha?: number | null;
    estadoSituacion?: string | null;
    bajaMotivo?: number | null;
};

type FormularioVm = {
    interno: number;
    creacionFechaHora: string;
    completadoFechaHora?: string | null;
    notificacionFecha?: string | null;
    internoFormulario: number;
    internoEstablecimiento: number;
    respuestasCuestionario: RespuestaCuestionarioVm[];
    respuestasGremio: any[];
    respuestasContratista: any[];
    respuestasResponsable: any[];
    internoPresentacion?: number;
    fechaSRT?: string | null;
};

type TipoFormulario = {
    interno: number;
    descripcion: string;
    secciones?: Array<{
        interno: number;
        orden: number;
        descripcion: string;
        tieneNoAplica: number;
        comentario?: string;
        cuestionarios?: Array<{
            internoSeccion: number;
            orden: number;
            codigo: number;
            pregunta: string;
            comentario: string;
        }>;
    }>;
};

const toIsoOrNull = (v?: string | Date | null) => {
    if (!v) return null;
    const d = typeof v === 'string' ? new Date(v) : v;
    return isNaN(d.getTime()) ? null : d.toISOString();
};

const fetchFormularioById = async (id: number): Promise<FormularioVm> => {
    const url = `${API_BASE}/FormulariosRGRL/${id}`;
    const res = await fetch(url, { cache: 'no-store', headers: { Accept: 'application/json, text/json' } });
    if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
    return (await res.json()) as FormularioVm;
};

const fetchTipos = async (): Promise<TipoFormulario[]> => {
    const url = `${API_BASE}/TiposFormulariosRGRL`;
    const res = await fetch(url, { cache: 'no-store', headers: { Accept: 'application/json, text/json' } });
    if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
    return (await res.json()) as TipoFormulario[];
};

export default function Page() {
    const router = useRouter();
    const search = useSearchParams();
    const idFromQuery = useMemo(() => {
        const v = search?.get('id');
        return v ? Number(v) : undefined;
    }, [search]);

    const PAGE_SIZE = 20;
    const [page, setPage] = useState(0);

    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const [form, setForm] = useState<FormularioVm | null>(null);
    const [tipos, setTipos] = useState<TipoFormulario[]>([]);
    const [respuestas, setRespuestas] = useState<Record<number, RespuestaCuestionarioVm>>({}); // key: internoCuestionario

    const secciones = useMemo(() => {
        const t = tipos.find((x) => x.interno === form?.internoFormulario);
        return (t?.secciones ?? []).slice().sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
    }, [tipos, form]);
    const [secIdx, setSecIdx] = useState(0);
    const totalSecs = secciones.length;
    const secActual = secciones[secIdx];

    const cargar = useCallback(async () => {
        if (!idFromQuery) return;
        setLoading(true);
        setError('');
        try {
            const [tfs, frm] = await Promise.all([fetchTipos(), fetchFormularioById(idFromQuery)]);
            setTipos(tfs);
            setForm(frm);
            const dict: Record<number, RespuestaCuestionarioVm> = {};
            for (const r of frm.respuestasCuestionario || []) {
                if (r.internoCuestionario != null) dict[r.internoCuestionario] = { ...r };
            }
            setRespuestas(dict);
            setSecIdx(0);
            setPage(0);
        } catch (e: any) {
            setError(e?.message ?? 'Error al cargar el formulario.');
        } finally {
            setLoading(false);
        }
    }, [idFromQuery]);

    useEffect(() => { cargar(); }, [cargar]);


    useEffect(() => {
        setPage(Math.floor(secIdx / PAGE_SIZE));
    }, [secIdx]);


    const onCambiarRespuesta = (internoCuestionario: number, cambios: Partial<RespuestaCuestionarioVm>) => {
        setRespuestas((prev) => {
            const base = prev[internoCuestionario] ?? { internoCuestionario, respuesta: '' };
            return { ...prev, [internoCuestionario]: { ...base, ...cambios } };
        });
    };

    const guardarPUT = async () => {
        if (!form) return;
        setSaving(true);
        setError('');
        try {
            const fullCuest: any[] = [];
            for (const sec of secciones) {
                const qs = (sec.cuestionarios ?? []).slice().sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
                for (const q of qs) {
                    const key = q.codigo as number;
                    const r = respuestas[key] ?? {};
                    fullCuest.push({
                        interno: r.interno ?? 0,
                        internoCuestionario: key,
                        internoRespuestaFormulario: r.internoRespuestaFormulario ?? form.interno ?? 0,
                        respuesta: r.respuesta ?? '',
                        fechaRegularizacion: r.fechaRegularizacion ?? 0,
                        observaciones: r.observaciones ?? '',
                        fechaRegularizacionNormal: null as string | null,
                        estadoAccion: r.estadoAccion ?? 'A',
                        estadoFecha: r.estadoFecha ?? 0,
                        estadoSituacion: r.estadoSituacion ?? '',
                        bajaMotivo: r.bajaMotivo ?? 0,
                    });
                }
            }

            const payloadPUT = {
                internoFormulario: form.internoFormulario,
                internoEstablecimiento: form.internoEstablecimiento,
                creacionFechaHora: form.creacionFechaHora ?? toIsoOrNull(new Date()),
                completadoFechaHora: toIsoOrNull(new Date()),
                notificacionFecha: form.notificacionFecha ?? toIsoOrNull(new Date()),
                respuestasCuestionario: fullCuest,
                respuestasGremio: (form.respuestasGremio ?? []).map((g: any, i: number) => ({
                    interno: g?.interno ?? 0,
                    internoRespuestaFormulario: g?.internoRespuestaFormulario ?? form.interno ?? 0,
                    legajo: g?.legajo ?? 0,
                    nombre: g?.nombre ?? '',
                    estadoAccion: g?.estadoAccion ?? 'A',
                    estadoFecha: g?.estadoFecha ?? 0,
                    estadoSituacion: g?.estadoSituacion ?? '',
                    bajaMotivo: g?.bajaMotivo ?? 0,
                    renglon: g?.renglon ?? i,
                })),
                respuestasContratista: (form.respuestasContratista ?? []).map((c: any, i: number) => ({
                    interno: c?.interno ?? 0,
                    internoRespuestaFormulario: c?.internoRespuestaFormulario ?? form.interno ?? 0,
                    cuit: c?.cuit ?? 0,
                    contratista: c?.contratista ?? '',
                    estadoAccion: c?.estadoAccion ?? 'A',
                    estadoFecha: c?.estadoFecha ?? 0,
                    estadoSituacion: c?.estadoSituacion ?? '',
                    bajaMotivo: c?.bajaMotivo ?? 0,
                    renglon: c?.renglon ?? i,
                })),
                respuestasResponsable: (form.respuestasResponsable ?? []).map((r: any, i: number) => ({
                    interno: r?.interno ?? 0,
                    internoRespuestaFormulario: r?.internoRespuestaFormulario ?? form.interno ?? 0,
                    cuit: r?.cuit ?? 0,
                    responsable: r?.responsable ?? '',
                    cargo: r?.cargo ?? '',
                    representacion: r?.representacion ?? 0,
                    esContratado: r?.esContratado ?? 0,
                    tituloHabilitante: r?.tituloHabilitante ?? '',
                    matricula: r?.matricula ?? '',
                    entidadOtorganteTitulo: r?.entidadOtorganteTitulo ?? '',
                    estadoAccion: r?.estadoAccion ?? 'A',
                    estadoFecha: r?.estadoFecha ?? 0,
                    estadoSituacion: r?.estadoSituacion ?? '',
                    bajaMotivo: r?.bajaMotivo ?? 0,
                    renglon: r?.renglon ?? i,
                })),
                internoPresentacion: form.internoPresentacion ?? 0,
                fechaSRT: form.fechaSRT ?? toIsoOrNull(new Date()),
            };

            const res = await fetch(`${API_BASE}/FormulariosRGRL/${form.interno}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payloadPUT),
            });

            const data = await res.json().catch(() => null);
            if (!res.ok) throw new Error(`PUT /FormulariosRGRL/${form.interno} -> ${res.status}`);

            setForm(data as FormularioVm);
            alert('Formulario guardado correctamente.');
        } catch (e: any) {
            setError(e?.message ?? 'Error al guardar.');
        } finally {
            setSaving(false);
        }
    };

    if (!idFromQuery) {
        return (
            <div style={{ padding: 16 }}>
                <div style={{ marginBottom: 8, color: '#b00020' }}>Falta el parámetro <code>id</code> en la URL.</div>
                <CustomButton onClick={() => router.back()}>VOLVER</CustomButton>
            </div>
        );
    }

    if (loading || !form || !secciones.length) {
        return <div style={{ padding: 16 }}>{loading ? 'Cargando…' : 'No hay secciones para editar.'}</div>;
    }

    const preguntas = (secActual?.cuestionarios ?? []).slice().sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));

    return (
        <div style={{ padding: 16, maxWidth: 960, margin: '0 auto' }}>



            <h2 style={{ margin: 0 }}>
                Editar Formulario RGRL — #{form.interno}
            </h2>
            <div style={{ marginTop: 6, opacity: 0.95, fontWeight: 700 }}>
                Sección {secIdx + 1} de {totalSecs} — {secActual.descripcion}
            </div>




            {(() => {
                const totalSecs = secciones.length;
                const totalPages = Math.max(1, Math.ceil(totalSecs / PAGE_SIZE));
                const pageStart = page * PAGE_SIZE;
                const pageEnd = Math.min(pageStart + PAGE_SIZE, totalSecs);

                const btnBase: React.CSSProperties = {
                    padding: '6px 10px',
                    borderRadius: 8,
                    border: '1px solid #c9c9c9',
                    background: '#fff',
                    cursor: 'pointer'
                };

                return (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '10px 0 14px', alignItems: 'center' }}>
                        <button
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            disabled={page === 0}
                            style={{ ...btnBase, width: 36, opacity: page === 0 ? 0.5 : 1 }}
                        >
                            &lt;
                        </button>

                        {Array.from({ length: pageEnd - pageStart }, (_, k) => {
                            const i = pageStart + k;
                            const active = i === secIdx;
                            return (
                                <button
                                    key={secciones[i].interno ?? i}
                                    onClick={() => setSecIdx(i)}
                                    style={{ ...btnBase, background: active ? '#ffecb3' : '#fff', fontWeight: active ? 700 : 400 }}
                                    title={secciones[i].descripcion}
                                >
                                    {i + 1}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={page === totalPages - 1}
                            style={{ ...btnBase, width: 36, opacity: page === totalPages - 1 ? 0.5 : 1 }}
                        >
                            &gt;
                        </button>
                    </div>
                );
            })()}

            <div style={{ border: '1px solid #e5e5e5', borderRadius: 10, padding: 12, marginTop: 10, marginBottom: 12 }}>
                {preguntas.map((q) => {
                    const key = q.codigo as number;
                    const rr = respuestas[key] ?? {};
                    const value = rr.respuesta ?? '';
                    const tieneNA = secActual.tieneNoAplica === 1;

                    return (
                        <div key={key} style={{ padding: 10, border: '1px dashed #ddd', borderRadius: 8, marginBottom: 10 }}>
                            <div style={{ marginBottom: 6, fontWeight: 500 }}>
                                {q.orden}. {q.pregunta}{' '}
                                {q.comentario ? <span style={{ opacity: 0.7 }}>— {q.comentario}</span> : null}
                            </div>

                            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                                <label>
                                    <input
                                        type="radio"
                                        name={`r-${key}`}
                                        checked={value === 'SI'}
                                        onChange={() => onCambiarRespuesta(key, { respuesta: 'SI' })}
                                    />{' '}
                                    SI
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name={`r-${key}`}
                                        checked={value === 'NO'}
                                        onChange={() => onCambiarRespuesta(key, { respuesta: 'NO' })}
                                    />{' '}
                                    NO
                                </label>
                                {tieneNA ? (
                                    <label>
                                        <input
                                            type="radio"
                                            name={`r-${key}`}
                                            checked={value === 'NA'}
                                            onChange={() => onCambiarRespuesta(key, { respuesta: 'NA' })}
                                        />{' '}
                                        No aplica
                                    </label>
                                ) : null}
                                <span style={{ opacity: 0.6, fontSize: 13 }}>{value ? '' : '(Sin respuesta)'}</span>
                            </div>

                            <div style={{ marginBottom: 8 }}>
                                <textarea
                                    value={rr.observaciones ?? ''}
                                    onChange={(e) => onCambiarRespuesta(key, { observaciones: e.target.value })}
                                    placeholder="Observaciones…"
                                    style={{ width: '100%', minHeight: 60, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <label style={{ minWidth: 210 }}>Fecha regularización (AAAAMMDD):</label>
                                <input
                                    type="number"
                                    value={rr.fechaRegularizacion ?? ''}
                                    onChange={(e) =>
                                        onCambiarRespuesta(key, { fechaRegularizacion: e.target.value ? Number(e.target.value) : 0 })
                                    }
                                    placeholder="20251030"
                                    style={{ height: 36, padding: '6px 10px', border: '1px solid #c7c7c7', borderRadius: 6, width: 180 }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
                <CustomButton onClick={() => router.back()} disabled={saving}>VOLVER</CustomButton>
                <CustomButton onClick={guardarPUT} disabled={saving}>GUARDAR</CustomButton>
            </div>

            {saving && <div style={{ marginTop: 12, opacity: 0.7 }}>Guardando…</div>}
            {!!error && <div style={{ marginTop: 12, color: '#b00020' }}>{error}</div>}
        </div>
    );
}
