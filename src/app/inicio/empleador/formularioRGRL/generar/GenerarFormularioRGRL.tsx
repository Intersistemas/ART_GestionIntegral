'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CustomButton from '@/utils/ui/button/CustomButton';
import CustomModal from '@/utils/ui/form/CustomModal';
import dayjs from 'dayjs';
import styles from './GenerarFormularioRGRL.module.css';

import type {
  Establecimiento,
  TipoFormulario,
  RespuestaCuestionarioVm,
  FormularioVm,
  GremioUI,
  ContratistaUI,
  ResponsableUI
} from './types/generar';

// URL base de la API (entorno de pruebas)
const API_BASE = 'http://arttest.intersistemas.ar:8302/api';

// Helper: convierte fecha a ISO (o null)
const toIsoOrNull = (v?: string | Date | null) => {
  if (!v) return null;
  const d = dayjs(v);
  return d.isValid() ? d.toISOString() : null;
};

const addRow = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, empty: T) =>
  setter((rows) => [...rows, empty]);
// Helpers para manipular arrays de estado (add/remove/change)
const removeRow = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, idx: number) =>
  setter((rows) => rows.filter((_, i) => i !== idx));
const changeRow = <T extends object>(
  setter: React.Dispatch<React.SetStateAction<T[]>>,
  idx: number,
  field: keyof T,
  value: any
) => setter((rows) => rows.map((r, i) => (i === idx ? { ...r, [field]: value } as T : r)));

// Llamadas a la API para obtener datos (razón social, establecimientos, tipos, formulario)
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
// Trae un formulario existente por ID (para edición o réplica)
const fetchFormularioById = async (id: number): Promise<FormularioVm> => {
  const url = `${API_BASE}/FormulariosRGRL/${id}`;
  const res = await fetch(url, { cache: 'no-store', headers: { Accept: 'application/json, text/json' } });
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  return (await res.json()) as FormularioVm;
};

// Componente principal: crea, edita o replica formularios RGRL
const GenerarFormularioRGRL: React.FC<{
  initialCuit?: number;
  replicaDe?: number;
  onDone?: (nuevoId: number) => void;
}> = ({ initialCuit, replicaDe, onDone }) => {

  const router = useRouter();
  const search = useSearchParams();
  // En modal (onDone) se ignoran query params.
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
   // Marca si el flujo actual es de réplica
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

  //trae razón social, establecimientos y tipos.
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

  // Carga datos cuando se solicita replicar un formulario
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

  // Crea el formulario y, si viene de una réplica, copia respuestas/listas
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
        // Copia respuestas y listas del original con nuevo ID
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
        router.push(`/inicio/empleador/formularioRGRL/generar?id=${nuevoId}`);
        return;
      }
      onDone?.(nuevoId);
      router.push(`/inicio/empleador/formularioRGRL/generar?id=${nuevoId}`);
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

  // Carga el formulario ya creado/edición (paso 2)
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
    
  // Obtiene el tipo de formulario actual según 'interno'
    if (!form || !tipos?.length) return undefined;
    return tipos.find((t) => t.interno === form.internoFormulario);
  }, [form, tipos]);

  // Actualiza una respuesta parcial del cuestionario
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

  // Envía PUT final con todas las respuestas y listas (finalizar)
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

  if (!isModal && idFromQuery && !form) {
    return null;
  }

  if (!isModal && idFromQuery && form) {
    const secActual = secciones[secIdx];
    const preguntas = (secActual?.cuestionarios ?? []).slice().sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
    const tieneNA = secActual?.tieneNoAplica === 1;

    const renderPaginador = () => {
      const totalPages = Math.max(1, Math.ceil(totalSecs / PAGE_SIZE));
      const pageStart = page * PAGE_SIZE;
      const pageEnd = Math.min(pageStart + PAGE_SIZE, totalSecs);


      return (
        <div className={styles.paginatorBar}>
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className={`${styles.pagerBtn} ${styles.pagerBtnNarrow}`}
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
                className={`${styles.pagerBtn} ${active ? styles.pagerBtnActive : ''}`}
                title={secciones[i].descripcion}
              >
                {i + 1}
              </button>
            );
          })}

          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className={`${styles.pagerBtn} ${styles.pagerBtnNarrow}`}
          >
            &gt;
          </button>
        </div>
      );
    };

    return (

      <div className={styles.container}>
        {/* Vista de edición del formulario — preguntas, paginador y listas (gremios/contratistas/responsables). */}
        <h2 style={{ margin: 0 }} />
        <div style={{ marginTop: 6, opacity: 0.95, fontWeight: 700 }}>

          Sección {secIdx + 1} de {totalSecs} — {secActual?.descripcion}
        </div>

        <div className={styles.row} style={{ marginTop: 10 }}>
          <CustomButton onClick={() => setOpenGremios(true)}>Gremios</CustomButton>
          <CustomButton onClick={() => setOpenContratistas(true)}>Contratistas</CustomButton>
          <CustomButton onClick={() => setOpenResponsables(true)}>Responsables</CustomButton>
        </div>

        {renderPaginador()}
        <div className={styles.questionsBox}>
          {preguntas.map((q) => {
            const key = q.codigo as number;
            const rr = respuestas[key] ?? {};
            const value = rr.respuesta ?? '';
            return (
              <div key={key} className={styles.questionCard}>
                <div className={styles.questionTitle}>
                  {q.orden}. {q.pregunta}{' '}
                  {q.comentario ? <span className={styles.questionComment}>— {q.comentario}</span> : null}
                </div>

                <div className={styles.radioRow}>
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
                  <span className={styles.radioHint}>{value ? '' : '(Sin respuesta)'}</span>
                </div>

                <div className={styles.obsArea}>
                  <textarea
                    value={rr.observaciones ?? ''}
                    onChange={(e) => onCambiarRespuesta(key, { observaciones: e.target.value })}
                    placeholder="Observaciones…"
                    className={styles.textarea}

                  />
                </div>

                <div className={styles.dateRow}>
                  <label className={styles.dateLabel}>Fecha regularización (AAAAMMDD):</label>
                  <input
                    type="number"
                    value={rr.fechaRegularizacion ?? ''}
                    onChange={(e) =>
                      onCambiarRespuesta(key, { fechaRegularizacion: e.target.value ? Number(e.target.value) : 0 })
                    }
                    placeholder="20251030"
                    className={styles.dateInputNum}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.row}>
          <CustomButton onClick={() => router.back()} disabled={loading}>VOLVER</CustomButton>
          <CustomButton onClick={finalizarPUT} disabled={loading}>FINALIZAR</CustomButton>
        </div>

        {loading && <div className={styles.savingMsg}>Guardando…</div>}
        {!!error && <div className={styles.errorMsg}>{error}</div>}

        <CustomModal open={openGremios} onClose={() => setOpenGremios(false)} title="Representación Gremial" size="mid">
          <div className="formGrid">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nro Legajo</th>
                  <th>Nombre</th>
                  <th className={styles.tableActionsCol}></th>
                </tr>
              </thead>
              <tbody>
                {gremiosUI.map((g, i) => (
                  <tr key={i}>
                    <td className={styles.tdPad4}>
                      <input
                        type="number"
                        value={g.legajo ?? 0}
                        onChange={(e) => changeRow(setGremiosUI, i, 'legajo', Number(e.target.value || 0))}
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td className={styles.tdPad4}>
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
            <div className={styles.tableFooter}>
              <CustomButton onClick={() => addRow<GremioUI>(setGremiosUI, { legajo: 0, nombre: '' })}>AGREGAR</CustomButton>
            </div>
          </div>
        </CustomModal>
        <CustomModal open={openContratistas} onClose={() => setOpenContratistas(false)} title="Contratistas" size="mid">
          <div className="formGrid">
            <table className={`${styles.table} ${styles.tableSmall}`}>
              <thead>
                <tr>
                  <th className={styles.tableWidth160}>CUIT</th>
                  <th>Contratista</th>
                  <th className={styles.tableActionsCol}></th>
                </tr>
              </thead>
              <tbody>
                {contratistasUI.map((c, i) => (
                  <tr key={i}>
                    <td className={styles.tdPad4}>
                      <input
                        type="number"
                        value={c.cuit ?? 0}
                        onChange={(e) => changeRow(setContratistasUI, i, 'cuit', Number(e.target.value || 0))}
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td className={styles.tdPad4}>
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
            <div className={styles.tableFooter}>
              <CustomButton onClick={() => addRow<ContratistaUI>(setContratistasUI, { cuit: 0, contratista: '' })}>AGREGAR</CustomButton>
            </div>
          </div>
        </CustomModal>
        <CustomModal open={openResponsables} onClose={() => setOpenResponsables(false)} title="Profesional / Responsable" size="large">
          <div className="formGrid">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.tableWidth130}>CUIT</th>
                  <th>Nombre y apellido</th>
                  <th>Cargo</th>
                  <th className={styles.tableWidth120}>Representación</th>
                  <th className={styles.tableWidth110}>Contratado (0/1)</th>
                  <th>Título</th>
                  <th>Matrícula</th>
                  <th>Entidad</th>
                  <th className={styles.tableActionsCol}></th>
                </tr>
              </thead>
              <tbody>
                {responsablesUI.map((r, i) => (
                  <tr key={i}>
                    <td className={styles.tdPad4}>
                      <input
                        type="number"
                        value={r.cuit ?? 0}
                        onChange={(e) => changeRow(setResponsablesUI, i, 'cuit', Number(e.target.value || 0))}
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td className={styles.tdPad4}>
                      <input
                        type="text"
                        value={r.responsable ?? ''}
                        onChange={(e) => changeRow(setResponsablesUI, i, 'responsable', e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td className={styles.tdPad4}>
                      <input
                        type="text"
                        value={r.cargo ?? ''}
                        onChange={(e) => changeRow(setResponsablesUI, i, 'cargo', e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td className={styles.tdPad4}>
                      <input
                        type="number"
                        value={r.representacion ?? 0}
                        onChange={(e) => changeRow(setResponsablesUI, i, 'representacion', Number(e.target.value || 0))}
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td className={styles.tdPad4}>
                      <input
                        type="number"
                        value={r.esContratado ?? 0}
                        onChange={(e) => changeRow(setResponsablesUI, i, 'esContratado', Number(e.target.value || 0))}
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td className={styles.tdPad4}>
                      <input
                        type="text"
                        value={r.tituloHabilitante ?? ''}
                        onChange={(e) => changeRow(setResponsablesUI, i, 'tituloHabilitante', e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td className={styles.tdPad4}>
                      <input
                        type="text"
                        value={r.matricula ?? ''}
                        onChange={(e) => changeRow(setResponsablesUI, i, 'matricula', e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td className={styles.tdPad4}>
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
            <div className={styles.tableFooter}>
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
    <div className={styles.container}>
      {/* Carga de datos inicial y botones para crear/replicar el formulario. */}
      <div className={styles.row}>
        <label className={styles.label}>CUIT:</label>
        <input
          type="text"
          value={cuit ? String(cuit) : ''}
          onChange={(e) => setCuit(Number(e.target.value.replace(/[^\d]/g, '')) || undefined)}
          placeholder="Ingresá CUIT"
          className={styles.input}
          style={{ width: 220 }}
        />
        <CustomButton onClick={cargarTodoPaso1} disabled={!canBuscar}>
          CARGAR
        </CustomButton>
      </div>

      <div className={styles.row}>
        <label className={styles.label}>Razón Social:</label>
        <input
          type="text"
          value={razonSocial}
          readOnly
          placeholder="Sin datos"
          className={`${styles.input} ${styles.inputFull}`}
        />
      </div>

      <div className={styles.row}>
        <label className={styles.label}>Notificación Fecha:</label>
        <input
          type="date"
          value={notificacionFecha}
          onChange={(e) => setNotificacionFecha(e.target.value)}
          className={styles.date}
        />
      </div>

      <div className={styles.row}>
        <label className={styles.label}>Establecimiento:</label>
        <select
          value={establecimientoSel ?? ''}
          onChange={(e) => setEstablecimientoSel(Number(e.target.value) || undefined)}
          className={`${styles.select} ${styles.inputFull}`}
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
        <div className={styles.grid3}>
          <div>
            <label className={styles.subLabel}>Superficie</label>
            <input
              type="text"
              value={estActual.superficie ?? ''}
              readOnly
              className={styles.inputRead}
            />
          </div>
          <div>
            <label className={styles.subLabel}>Cant. Trabajadores</label>
            <input
              type="text"
              value={estActual.cantTrabajadores ?? ''}
              readOnly
              className={styles.inputRead}
            />
          </div>
          <div>
            <label className={styles.subLabel}>CIIU</label>
            <input
              type="text"
              value={estActual.ciiu ?? ''}
              readOnly
              className={styles.inputRead}
            />
          </div>
        </div>
      )}
      <div className={styles.row}>
        <label className={styles.label}>Formulario:</label>
        <select
          value={tipoSel ?? ''}
          onChange={(e) => setTipoSel(Number(e.target.value) || undefined)}
          disabled={esReplica}
          title={esReplica ? 'Tipo fijado por replicación' : undefined}
          className={`${styles.select} ${styles.inputFull}`}
        >
          <option value="" disabled>Selecciona</option>
          {tipos.map((t) => (
            <option key={t.interno} value={t.interno}>{t.descripcion}</option>
          ))}
        </select>
      </div>
      <div className={styles.rowTopSpace}>
        <CustomButton onClick={() => router.back()}>VOLVER</CustomButton>
        <CustomButton onClick={crearFormulario} disabled={!cuit}>CREAR FORMULARIO</CustomButton>
      </div>
    </div>
  );
};

export default GenerarFormularioRGRL;
