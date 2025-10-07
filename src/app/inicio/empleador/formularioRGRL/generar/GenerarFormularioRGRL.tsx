'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CustomButton from '@/utils/ui/button/CustomButton';
import CustomModal from '@/utils/ui/form/CustomModal';
import dayjs from 'dayjs';

const API_BASE = 'http://arttest.intersistemas.ar:8302/api';

/* ===== Tipos ===== */
type Establecimiento = {
  interno: number;
  cuit: number;
  nroSucursal: number;
  nombre: string;
  domicilioCalle: string | null;
  domicilioNro: string | null;
  superficie: number | null;
  cantTrabajadores: number | null;
  localidad?: string | null;
  provincia?: string | null;
  numero?: number | null;
  ciiu?: number | null;
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

type GremioUI = { legajo?: number; nombre?: string };
type ContratistaUI = { cuit?: number; contratista?: string };
type ResponsableUI = {
  cuit?: number;
  responsable?: string;
  cargo?: string;
  representacion?: number;
  esContratado?: number;
  tituloHabilitante?: string;
  matricula?: string;
  entidadOtorganteTitulo?: string;
};


const toIsoOrNull = (v?: string | Date | null) => {
  if (!v) return null;
  const d = dayjs(v);
  return d.isValid() ? d.toISOString() : null;
};


const addRow = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, empty: T) =>
  setter((rows) => [...rows, empty]);
const removeRow = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, idx: number) =>
  setter((rows) => rows.filter((_, i) => i !== idx));
const changeRow = <T extends object>(
  setter: React.Dispatch<React.SetStateAction<T[]>>,
  idx: number,
  field: keyof T,
  value: any
) => setter((rows) => rows.map((r, i) => (i === idx ? { ...r, [field]: value } as T : r)));

const fetchRazonSocial = async (cuit: number): Promise<string> => {
  const url = `${API_BASE}/FormulariosRGRL/CUIT/${encodeURIComponent(cuit)}`;
  const res = await fetch(url, { cache: 'no-store', headers: { Accept: 'application/json, text/json' } });
  if (res.status === 404) return '';
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  const data = (await res.json()) as Array<{ razonSocial?: string }>;
  return (data?.[0]?.razonSocial ?? '').toString();
};

const fetchEstablecimientos = async (cuit: number): Promise<Establecimiento[]> => {
  const url = `${API_BASE}/Establecimientos/Empresa/${encodeURIComponent(cuit)}`;
  const res = await fetch(url, { cache: 'no-store', headers: { Accept: 'application/json, text/json' } });
  if (res.status === 404) return []; 
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  return (await res.json()) as Establecimiento[];
};

const fetchTipos = async (): Promise<TipoFormulario[]> => {
  const url = `${API_BASE}/TiposFormulariosRGRL`;
  const res = await fetch(url, { cache: 'no-store', headers: { Accept: 'application/json, text/json' } });
  if (res.status === 404) return []; 
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  return (await res.json()) as TipoFormulario[];
};

const fetchFormularioById = async (id: number): Promise<FormularioVm> => {
  const url = `${API_BASE}/FormulariosRGRL/${id}`;
  const res = await fetch(url, { cache: 'no-store', headers: { Accept: 'application/json, text/json' } });
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  return (await res.json()) as FormularioVm;
};


const GenerarFormularioRGRL: React.FC<{
  initialCuit?: number;
  replicaDe?: number;
  onDone?: (nuevoId: number) => void;
}> = ({ initialCuit, replicaDe, onDone }) => {

  const router = useRouter();
  const search = useSearchParams();

  const isModal = Boolean(onDone);

  const cuitFromQuery = useMemo(() => {
    if (isModal) return undefined;
    const v = search?.get('cuit');
    return v ? Number(v) : undefined;
  }, [search, isModal]);


  const idFromQuery = useMemo(() => {
    if (isModal) return undefined;
    const v = search?.get('id');
    return v ? Number(v) : undefined;
  }, [search, isModal]);


  const replicaDeQuery = useMemo(() => {
    if (isModal) return undefined;
    const v = search?.get('replicaDe');
    return v ? Number(v) : undefined;
  }, [search, isModal]);

  const [original, setOriginal] = useState<FormularioVm | null>(null);
  /* ------------------------------------------------------------- */

  const esReplica = Boolean(replicaDe || replicaDeQuery || original);


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [cuit, setCuit] = useState<number | undefined>(initialCuit ?? cuitFromQuery);
  const [razonSocial, setRazonSocial] = useState('');
  const [establecimientos, setEstablecimientos] = useState<Establecimiento[]>([]);
  const [establecimientoSel, setEstablecimientoSel] = useState<number | undefined>(undefined);
  const [tipos, setTipos] = useState<TipoFormulario[]>([]);
  const [tipoSel, setTipoSel] = useState<number | undefined>(undefined);
  const [notificacionFecha, setNotificacionFecha] = useState<string>('');

  const estActual = useMemo(
    () => establecimientos.find((e) => e.interno === establecimientoSel),
    [establecimientos, establecimientoSel]
  );

  const labelEst = (e: Establecimiento) => {
    const num = e.numero ?? e.nroSucursal;
    const calle = e.domicilioCalle ?? '';
    const nro = e.domicilioNro ?? '';
    const loc = e.localidad ?? '';
    const prov = e.provincia ?? '';
    return `${num ?? ''} - ${calle} ${nro}`.trim() + (loc || prov ? ` - ${loc}${prov ? ` (${prov})` : ''}` : '');
  };

  const canBuscar = !!cuit && !Number.isNaN(cuit);

  const cargarTodoPaso1 = useCallback(async () => {
    if (!canBuscar) return;
    setLoading(true);
    setError('');
    try {
      const [rs, ests, tfs] = await Promise.all([fetchRazonSocial(cuit!), fetchEstablecimientos(cuit!), fetchTipos()]);
      setRazonSocial(rs);
      setEstablecimientos(ests);
      setTipos(tfs);
      setEstablecimientoSel(ests?.[0]?.interno);
      setTipoSel(tfs?.[0]?.interno);
    } catch (e: any) {
      setError(e?.message ?? 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  }, [cuit, canBuscar]);

  useEffect(() => {
    if (!idFromQuery && cuit && !(replicaDe || replicaDeQuery)) cargarTodoPaso1();
  }, [cuit, idFromQuery, replicaDe, replicaDeQuery, cargarTodoPaso1]);

  const cargarReplicaDe = useCallback(async () => {
    const replId = typeof replicaDe === 'number' ? replicaDe : replicaDeQuery;
    if (!replId) return;

    setLoading(true);
    setError('');
    try {
      const frm = await fetchFormularioById(replId);
      setOriginal(frm);

      const c = Number((frm as any).cuit ?? 0) || undefined;
      if (c) setCuit(c);

      const [rs, ests, tfs] = await Promise.all([
        c ? fetchRazonSocial(c) : Promise.resolve(''),
        c ? fetchEstablecimientos(c) : Promise.resolve([] as Establecimiento[]),
        fetchTipos(),
      ]);
      setRazonSocial(rs);
      setEstablecimientos(ests);
      setTipos(tfs);

      setEstablecimientoSel(frm.internoEstablecimiento);
      setTipoSel(frm.internoFormulario);

      const d = new Date();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      setNotificacionFecha(`${d.getFullYear()}-${mm}-${dd}`);
    } catch (e: any) {
      setError(e?.message ?? 'Error al cargar datos para replicar.');
    } finally {
      setLoading(false);
    }
  }, [replicaDe, replicaDeQuery]);


  useEffect(() => {
    if (!idFromQuery && (replicaDe || replicaDeQuery)) cargarReplicaDe();
  }, [idFromQuery, replicaDe, replicaDeQuery, cargarReplicaDe]);

  const crearFormulario = async () => {
    if (!cuit || !establecimientoSel || !tipoSel) {
      setError('Completá CUIT, Establecimiento y Tipo de formulario.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload = {
        internoFormulario: tipoSel!,
        internoEstablecimiento: establecimientoSel!,
        creacionFechaHora: toIsoOrNull(new Date()),
        completadoFechaHora: toIsoOrNull(new Date()),
        notificacionFecha: toIsoOrNull(notificacionFecha ? `${notificacionFecha}T00:00:00` : null),
        internoPresentacion: 0,
        fechaSRT: toIsoOrNull(new Date()),
      };

      const res = await fetch(`${API_BASE}/FormulariosRGRL`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(`POST /FormulariosRGRL -> ${res.status}`);

      const nuevoId = Number(data?.interno ?? 0);
      if (!nuevoId) throw new Error('No se obtuvo el ID del nuevo formulario.');


      if (original) {
        const fullCuest = (original.respuestasCuestionario || []).map((r) => ({
          interno: 0,
          internoCuestionario: r.internoCuestionario ?? 0,
          internoRespuestaFormulario: nuevoId,
          respuesta: r.respuesta ?? '',
          fechaRegularizacion: r.fechaRegularizacion ?? 0,
          observaciones: r.observaciones ?? '',

          estadoAccion: 'A',
          estadoFecha: 0,
          estadoSituacion: '',
          bajaMotivo: 0,
        }));

        const gremiosFull = (original.respuestasGremio || []).map((g: any, i: number) => ({
          interno: 0,
          internoRespuestaFormulario: nuevoId,
          legajo: g?.legajo ?? 0,
          nombre: g?.nombre ?? '',
          estadoAccion: 'A',
          estadoFecha: 0,
          estadoSituacion: '',
          bajaMotivo: 0,
          renglon: i,
        }));

        const contratistasFull = (original.respuestasContratista || []).map((c: any, i: number) => ({
          interno: 0,
          internoRespuestaFormulario: nuevoId,
          cuit: c?.cuit ?? 0,
          contratista: c?.contratista ?? c?.nombre ?? '',
          estadoAccion: 'A',
          estadoFecha: 0,
          estadoSituacion: '',
          bajaMotivo: 0,
          renglon: i,
        }));

        const responsablesFull = (original.respuestasResponsable || []).map((r: any, i: number) => ({
          interno: 0,
          internoRespuestaFormulario: nuevoId,
          cuit: r?.cuit ?? 0,
          responsable: r?.responsable ?? '',
          cargo: r?.cargo ?? '',
          representacion: r?.representacion ?? 0,
          esContratado: r?.esContratado ?? 0,
          tituloHabilitante: r?.tituloHabilitante ?? '',
          matricula: r?.matricula ?? '',
          entidadOtorganteTitulo: r?.entidadOtorganteTitulo ?? '',
          estadoAccion: 'A',
          estadoFecha: 0,
          estadoSituacion: '',
          bajaMotivo: 0,
          renglon: i,
        }));

        const payloadPUT = {
          internoFormulario: tipoSel!,
          internoEstablecimiento: establecimientoSel!,
          creacionFechaHora: payload.creacionFechaHora,
          completadoFechaHora: payload.completadoFechaHora,
          notificacionFecha: payload.notificacionFecha,
          respuestasCuestionario: fullCuest,
          respuestasGremio: gremiosFull,
          respuestasContratista: contratistasFull,
          respuestasResponsable: responsablesFull,
          internoPresentacion: 0,
          fechaSRT: payload.fechaSRT,
        };

        const resPut = await fetch(`${API_BASE}/FormulariosRGRL/${nuevoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payloadPUT),
        });

        await resPut.json().catch(() => null);
        if (!resPut.ok) throw new Error(`PUT /FormulariosRGRL/${nuevoId} -> ${resPut.status}`);




        onDone?.(nuevoId);
        router.push(`/inicio/empleador/formularioRGRL/editar?id=${nuevoId}`);
        return;
      }
      /* ----------------------------------------------------------------------------- */
      onDone?.(nuevoId);
      router.push(`/inicio/empleador/formularioRGRL/editar?id=${nuevoId}`);
    } catch (e: any) {
      setError(e?.message ?? 'Error al crear el formulario.');
    } finally {
      setLoading(false);
    }
  };

  const [form, setForm] = useState<FormularioVm | null>(null);
  const [respuestas, setRespuestas] = useState<Record<number, RespuestaCuestionarioVm>>({});
  const [gremiosUI, setGremiosUI] = useState<GremioUI[]>([]);
  const [contratistasUI, setContratistasUI] = useState<ContratistaUI[]>([]);
  const [responsablesUI, setResponsablesUI] = useState<ResponsableUI[]>([]);

  const [openGremios, setOpenGremios] = useState(false);
  const [openContratistas, setOpenContratistas] = useState(false);
  const [openResponsables, setOpenResponsables] = useState(false);

  const cargarPaso2 = useCallback(async () => {
    if (!idFromQuery) return;
    setLoading(true);
    setError('');
    try {
      const [tfs, frm] = await Promise.all([fetchTipos(), fetchFormularioById(idFromQuery)]);
      setTipos(tfs);
      setForm(frm);

      setGremiosUI((frm.respuestasGremio ?? []).map((g: any) => ({
        legajo: Number(g?.legajo ?? 0) || 0,
        nombre: g?.nombre ?? ''
      })));
      setContratistasUI((cfrm => (frm.respuestasContratista ?? []).map((c: any) => ({
        cuit: Number(c?.cuit ?? 0) || 0,
        contratista: c?.contratista ?? ''
      })))());
      setResponsablesUI((frm.respuestasResponsable ?? []).map((r: any) => ({
        cuit: Number(r?.cuit ?? 0) || 0,
        responsable: r?.responsable ?? '',
        cargo: r?.cargo ?? '',
        representacion: Number(r?.representacion ?? 0) || 0,
        esContratado: Number(r?.esContratado ?? 0) || 0,
        tituloHabilitante: r?.tituloHabilitante ?? '',
        matricula: r?.matricula ?? '',
        entidadOtorganteTitulo: r?.entidadOtorganteTitulo ?? '',
      })));

      const dict: Record<number, RespuestaCuestionarioVm> = {};
      for (const r of frm.respuestasCuestionario || []) {
        if (r.internoCuestionario != null) dict[r.internoCuestionario] = { ...r };
      }
      setRespuestas(dict);
    } catch (e: any) {
      setError(e?.message ?? 'Error al cargar formulario.');
    } finally {
      setLoading(false);
    }
  }, [idFromQuery]);

  useEffect(() => {
    if (idFromQuery && !isModal) cargarPaso2();
  }, [idFromQuery, isModal, cargarPaso2]);

  const tipoDeEsteFormulario = useMemo(() => {
    if (!form || !tipos?.length) return undefined;
    return tipos.find((t) => t.interno === form.internoFormulario);
  }, [form, tipos]);

  const onCambiarRespuesta = (internoCuestionario: number, cambios: Partial<RespuestaCuestionarioVm>) => {
    setRespuestas((prev) => {
      const base = prev[internoCuestionario] ?? { internoCuestionario, respuesta: '' };
      return { ...prev, [internoCuestionario]: { ...base, ...cambios } };
    });
  };

  const PAGE_SIZE = 20;
  const secciones = useMemo(() => {
    const t = tipos.find((x) => x.interno === form?.internoFormulario);
    return (t?.secciones ?? []).slice().sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
  }, [tipos, form]);

  const [secIdx, setSecIdx] = useState(0);
  const totalSecs = secciones.length;
  const [page, setPage] = useState(0);
  useEffect(() => { setPage(Math.floor(secIdx / PAGE_SIZE)); }, [secIdx]);

  const finalizarPUT = async () => {
    if (!form) return;
    setLoading(true);
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

      const gremiosFull = gremiosUI.map((g, i) => ({
        internoRespuestaFormulario: form.interno ?? 0,
        legajo: Number(g.legajo ?? 0),
        nombre: g.nombre ?? '',
        estadoAccion: 'A',
        estadoFecha: 0,
        estadoSituacion: '',
        bajaMotivo: 0,
        renglon: i,
      }));
      const contratistasFull = contratistasUI.map((c, i) => ({
        internoRespuestaFormulario: form.interno ?? 0,
        cuit: Number(c.cuit ?? 0),
        contratista: c.contratista ?? '',
        estadoAccion: 'A',
        estadoFecha: 0,
        estadoSituacion: '',
        bajaMotivo: 0,
        renglon: i,
      }));
      const responsablesFull = responsablesUI.map((r, i) => ({
        internoRespuestaFormulario: form.interno ?? 0,
        cuit: Number(r.cuit ?? 0),
        responsable: r.responsable ?? '',
        cargo: r.cargo ?? '',
        representacion: Number(r.representacion ?? 0),
        esContratado: Number(r.esContratado ?? 0),
        tituloHabilitante: r.tituloHabilitante ?? '',
        matricula: r.matricula ?? '',
        entidadOtorganteTitulo: r.entidadOtorganteTitulo ?? '',
        estadoAccion: 'A',
        estadoFecha: 0,
        estadoSituacion: '',
        bajaMotivo: 0,
        renglon: i,
      }));

      const payloadPUT = {
        internoFormulario: form.internoFormulario,
        internoEstablecimiento: form.internoEstablecimiento,
        creacionFechaHora: form.creacionFechaHora ?? toIsoOrNull(new Date()),
        completadoFechaHora: toIsoOrNull(new Date()),
        notificacionFecha: form.notificacionFecha ?? toIsoOrNull(new Date()),
        respuestasCuestionario: fullCuest,
        respuestasGremio: gremiosFull,
        respuestasContratista: contratistasFull,
        respuestasResponsable: responsablesFull,
        internoPresentacion: form.internoPresentacion ?? 0,
        fechaSRT: form.fechaSRT ?? toIsoOrNull(new Date()),
      };

      const res = await fetch(`${API_BASE}/FormulariosRGRL/${form.interno}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadPUT),
      });

      await res.json().catch(() => null);
      if (!res.ok) throw new Error(`PUT /FormulariosRGRL/${form.interno} -> ${res.status}`);


      router.replace('/inicio/empleador/formularioRGRL');
    } catch (e: any) {
      setError(e?.message ?? 'Error al finalizar.');
    } finally {
      setLoading(false);
    }
  };

  if (!isModal && idFromQuery && form && tipoDeEsteFormulario) {
    const secActual = secciones[secIdx];
    const preguntas = (secActual?.cuestionarios ?? []).slice().sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
    const tieneNA = secActual?.tieneNoAplica === 1;

    const renderPaginador = () => {
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
    };

    return (
      <div style={{ padding: 16, maxWidth: 960, margin: '0 auto' }}>
        <h2 style={{ margin: 0 }}>
        </h2>
        <div style={{ marginTop: 6, opacity: 0.95, fontWeight: 700 }}>
          Sección {secIdx + 1} de {totalSecs} — {secActual?.descripcion}
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <CustomButton onClick={() => setOpenGremios(true)}>Gremios</CustomButton>
          <CustomButton onClick={() => setOpenContratistas(true)}>Contratistas</CustomButton>
          <CustomButton onClick={() => setOpenResponsables(true)}>Responsables</CustomButton>
        </div>

        {renderPaginador()}
        <div style={{ border: '1px solid #e5e5e5', borderRadius: 10, padding: 12, marginTop: 10, marginBottom: 12 }}>
          {preguntas.map((q) => {
            const key = q.codigo as number;
            const rr = respuestas[key] ?? {};
            const value = rr.respuesta ?? '';
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
                    /> SI
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`r-${key}`}
                      checked={value === 'NO'}
                      onChange={() => onCambiarRespuesta(key, { respuesta: 'NO' })}
                    /> NO
                  </label>
                  {tieneNA ? (
                    <label>
                      <input
                        type="radio"
                        name={`r-${key}`}
                        checked={value === 'NA'}
                        onChange={() => onCambiarRespuesta(key, { respuesta: 'NA' })}
                      /> No aplica
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
          <CustomButton onClick={() => router.back()} disabled={loading}>VOLVER</CustomButton>
          <CustomButton onClick={finalizarPUT} disabled={loading}>FINALIZAR</CustomButton>
        </div>

        {loading && <div style={{ marginTop: 12, opacity: 0.7 }}>Guardando…</div>}
        {!!error && <div style={{ marginTop: 12, color: '#b00020' }}>{error}</div>}

        <CustomModal open={openGremios} onClose={() => setOpenGremios(false)} title="Representación Gremial" size="mid">
          <div className="formGrid">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ddd', padding: 6, width: 140 }}>Nro Legajo</th>
                  <th style={{ border: '1px solid #ddd', padding: 6 }}>Nombre</th>
                  <th style={{ width: 70 }}></th>
                </tr>
              </thead>
              <tbody>
                {gremiosUI.map((g, i) => (
                  <tr key={i}>
                    <td style={{ border: '1px solid #eee,', padding: 4 }}>
                      <input
                        type="number"
                        value={g.legajo ?? 0}
                        onChange={(e) => changeRow(setGremiosUI, i, 'legajo', Number(e.target.value || 0))}
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td style={{ border: '1px solid #eee', padding: 4 }}>
                      <input
                        type="text"
                        value={g.nombre ?? ''}
                        onChange={(e) => changeRow(setGremiosUI, i, 'nombre', e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td><CustomButton onClick={() => removeRow(setGremiosUI, i)}>−</CustomButton></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
              <CustomButton onClick={() => addRow<GremioUI>(setGremiosUI, { legajo: 0, nombre: '' })}>AGREGAR</CustomButton>
            </div>
          </div>
        </CustomModal>

        <CustomModal open={openContratistas} onClose={() => setOpenContratistas(false)} title="Contratistas" size="mid">
          <div className="formGrid">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ddd', padding: 6, width: 160 }}>CUIT</th>
                  <th style={{ border: '1px solid #ddd', padding: 6 }}>Contratista</th>
                  <th style={{ width: 70 }}></th>
                </tr>
              </thead>
              <tbody>
                {contratistasUI.map((c, i) => (
                  <tr key={i}>
                    <td style={{ border: '1px solid #eee', padding: 4 }}>
                      <input
                        type="number"
                        value={c.cuit ?? 0}
                        onChange={(e) => changeRow(setContratistasUI, i, 'cuit', Number(e.target.value || 0))}
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td style={{ border: '1px solid #eee', padding: 4 }}>
                      <input
                        type="text"
                        value={c.contratista ?? ''}
                        onChange={(e) => changeRow(setContratistasUI, i, 'contratista', e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td><CustomButton onClick={() => removeRow(setContratistasUI, i)}>−</CustomButton></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
              <CustomButton onClick={() => addRow<ContratistaUI>(setContratistasUI, { cuit: 0, contratista: '' })}>AGREGAR</CustomButton>
            </div>
          </div>
        </CustomModal>

        <CustomModal open={openResponsables} onClose={() => setOpenResponsables(false)} title="Profesional / Responsable" size="large">
          <div className="formGrid">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ddd', padding: 6, width: 130 }}>CUIT</th>
                  <th style={{ border: '1px solid #ddd', padding: 6 }}>Nombre y apellido</th>
                  <th style={{ border: '1px solid #ddd', padding: 6 }}>Cargo</th>
                  <th style={{ border: '1px solid #ddd', padding: 6, width: 120 }}>Representación</th>
                  <th style={{ border: '1px solid #ddd', padding: 6, width: 110 }}>Contratado (0/1)</th>
                  <th style={{ border: '1px solid #ddd', padding: 6 }}>Título</th>
                  <th style={{ border: '1px solid #ddd', padding: 6 }}>Matrícula</th>
                  <th style={{ border: '1px solid #ddd', padding: 6 }}>Entidad</th>
                  <th style={{ width: 70 }}></th>
                </tr>
              </thead>
              <tbody>
                {responsablesUI.map((r, i) => (
                  <tr key={i}>
                    <td style={{ border: '1px solid #eee', padding: 4 }}>
                      <input
                        type="number"
                        value={r.cuit ?? 0}
                        onChange={(e) => changeRow(setResponsablesUI, i, 'cuit', Number(e.target.value || 0))}
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td style={{ border: '1px solid #eee', padding: 4 }}>
                      <input
                        type="text"
                        value={r.responsable ?? ''}
                        onChange={(e) => changeRow(setResponsablesUI, i, 'responsable', e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td style={{ border: '1px solid #eee', padding: 4 }}>
                      <input
                        type="text"
                        value={r.cargo ?? ''}
                        onChange={(e) => changeRow(setResponsablesUI, i, 'cargo', e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td style={{ border: '1px solid #eee', padding: 4 }}>
                      <input
                        type="number"
                        value={r.representacion ?? 0}
                        onChange={(e) => changeRow(setResponsablesUI, i, 'representacion', Number(e.target.value || 0))}
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td style={{ border: '1px solid #eee', padding: 4 }}>
                      <input
                        type="number"
                        value={r.esContratado ?? 0}
                        onChange={(e) => changeRow(setResponsablesUI, i, 'esContratado', Number(e.target.value || 0))}
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td style={{ border: '1px solid #eee', padding: 4 }}>
                      <input
                        type="text"
                        value={r.tituloHabilitante ?? ''}
                        onChange={(e) => changeRow(setResponsablesUI, i, 'tituloHabilitante', e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td style={{ border: '1px solid #eee', padding: 4 }}>
                      <input
                        type="text"
                        value={r.matricula ?? ''}
                        onChange={(e) => changeRow(setResponsablesUI, i, 'matricula', e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td style={{ border: '1px solid #eee', padding: 4 }}>
                      <input
                        type="text"
                        value={r.entidadOtorganteTitulo ?? ''}
                        onChange={(e) => changeRow(setResponsablesUI, i, 'entidadOtorganteTitulo', e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td><CustomButton onClick={() => removeRow(setResponsablesUI, i)}>−</CustomButton></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
              <CustomButton
                onClick={() =>
                  addRow<ResponsableUI>(setResponsablesUI, {
                    cuit: 0,
                    responsable: '',
                    cargo: '',
                    representacion: 0,
                    esContratado: 0,
                    tituloHabilitante: '',
                    matricula: '',
                    entidadOtorganteTitulo: '',
                  })
                }
              >
                AGREGAR
              </CustomButton>
            </div>
          </div>
        </CustomModal>
      </div>
    );
  }

  return (
    <div style={{ padding: 16, maxWidth: 960, margin: '0 auto' }}>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <label style={{ minWidth: 80 }}>CUIT:</label>
        <input
          type="text"
          value={cuit ? String(cuit) : ''}
          onChange={(e) => setCuit(Number(e.target.value.replace(/[^\d]/g, '')) || undefined)}
          placeholder="Ingresá CUIT"
          style={{ height: 36, padding: '6px 10px', border: '1px solid #c7c7c7', borderRadius: 6, width: 220 }}
        />
        <CustomButton onClick={cargarTodoPaso1} disabled={!canBuscar}>
          CARGAR
        </CustomButton>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <label style={{ minWidth: 80 }}>Razón Social:</label>
        <input
          type="text"
          value={razonSocial}
          readOnly
          placeholder="Sin datos"
          style={{ flex: 1, height: 36, padding: '6px 10px', border: '1px solid #c7c7c7', borderRadius: 6 }}
        />
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <label style={{ minWidth: 80 }}>Notificación Fecha:</label>
        <input
          type="date"
          value={notificacionFecha}
          onChange={(e) => setNotificacionFecha(e.target.value)}
          style={{ height: 36, padding: '6px 10px', border: '1px solid #c7c7c7', borderRadius: 6 }}
        />
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <label style={{ minWidth: 80 }}>Establecimiento:</label>
        <select
          value={establecimientoSel ?? ''}
          onChange={(e) => setEstablecimientoSel(Number(e.target.value) || undefined)}
          style={{ flex: 1, height: 36, padding: '6px 10px', border: '1px solid #c7c7c7', borderRadius: 6 }}
        >
          <option value="" disabled>Seleccioná...</option>
          {establecimientos.map((e) => (
            <option key={e.interno} value={e.interno}>
              {labelEst(e)}
            </option>
          ))}
        </select>
      </div>

      {estActual && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, opacity: 0.7 }}>Superficie</label>
            <input
              type="text"
              value={estActual.superficie ?? ''}
              readOnly
              style={{ width: '100%', height: 36, padding: '6px 10px', border: '1px solid #c7c7c7', borderRadius: 6 }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, opacity: 0.7 }}>Cant. Trabajadores</label>
            <input
              type="text"
              value={estActual.cantTrabajadores ?? ''}
              readOnly
              style={{ width: '100%', height: 36, padding: '6px 10px', border: '1px solid #c7c7c7', borderRadius: 6 }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, opacity: 0.7 }}>CIIU</label>
            <input
              type="text"
              value={estActual.ciiu ?? ''}
              readOnly
              style={{ width: '100%', height: 36, padding: '6px 10px', border: '1px solid #c7c7c7', borderRadius: 6 }}
            />
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <label style={{ minWidth: 80 }}>Formulario:</label>
        <select
          value={tipoSel ?? ''}
          onChange={(e) => setTipoSel(Number(e.target.value) || undefined)}
          disabled={esReplica}
          title={esReplica ? 'Tipo fijado por replicación' : undefined}
          style={{ flex: 1, height: 36, padding: '6px 10px', border: '1px solid #c7c7c7', borderRadius: 6 }}
        >
          <option value="" disabled>Selecciona</option>
          {tipos.map((t) => (
            <option key={t.interno} value={t.interno}>{t.descripcion}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 16 }}>
        <CustomButton onClick={() => router.back()}>VOLVER</CustomButton>
        <CustomButton onClick={crearFormulario} disabled={!cuit}>CREAR FORMULARIO</CustomButton>
      </div>


    </div>
  );
};

export default GenerarFormularioRGRL;
