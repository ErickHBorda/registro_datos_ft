import { useState } from "react"
import {
    Briefcase, GraduationCap, Plus, Trash2,
    ChevronDown, ChevronUp, Building, Info
} from "lucide-react"
import { Input, Select, SectionTitle, FieldGrid } from "../ui/FormField"
import { TIPO_INSTITUCION } from "../../utils/constants"
import { useValidacion } from "../../hooks/useValidacion"

// ── Registros vacíos (sin tiempo_cargo) ───────────────────
const EXP_LABORAL_VACIA = (tipo, orden) => ({
    tipo_institucion: tipo,
    nombre_entidad: "",
    cargo: "",
    documento_acredita: "",
    fecha_inicio: "",
    fecha_culminacion: "",
    orden,
})

const EXP_DOCENTE_VACIA = (orden) => ({
    nombre_entidad: "",
    categoria: "",
    documento_acredita: "",
    fecha_inicio: "",
    fecha_culminacion: "",
    orden,
})

// ── Reglas de validación ───────────────────────────────────
const reglasExpLaboral = {
    nombre_entidad: {
        requerido: true,
        minLength: 2,
        mensajeRequerido: "Nombre de la entidad es obligatorio",
    },
    cargo: {
        requerido: true,
        minLength: 2,
        mensajeRequerido: "Cargo desempeñado es obligatorio",
    },
    fecha_inicio: {
        requerido: true,
        mensajeRequerido: "Fecha de inicio es obligatoria",
    },
}

const reglasExpDocente = {
    nombre_entidad: {
        requerido: true,
        minLength: 2,
        mensajeRequerido: "Nombre de la entidad es obligatorio",
    },
    fecha_inicio: {
        requerido: true,
        mensajeRequerido: "Fecha de inicio es obligatoria",
    },
}

// ── Calcula tiempo en el cargo automáticamente ─────────────
function calcularTiempo(fechaInicio, fechaFin) {
    if (!fechaInicio) return ""
    const inicio = new Date(fechaInicio)
    const fin = fechaFin ? new Date(fechaFin) : new Date()
    if (isNaN(inicio.getTime())) return ""
    const meses = (fin.getFullYear() - inicio.getFullYear()) * 12
        + (fin.getMonth() - inicio.getMonth())
    const anios = Math.floor(meses / 12)
    const mesesR = meses % 12
    if (anios === 0) return `${mesesR} mes${mesesR !== 1 ? "es" : ""}`
    if (mesesR === 0) return `${anios} año${anios !== 1 ? "s" : ""}`
    return `${anios} año${anios !== 1 ? "s" : ""} ${mesesR} mes${mesesR !== 1 ? "es" : ""}`
}

// ── Card colapsable ────────────────────────────────────────
function ExpCard({ titulo, subtitulo, badge, onEliminar, children }) {
    const [expandido, setExpandido] = useState(true)

    return (
        <div className="border border-slate-200 rounded-form overflow-hidden
                    hover:border-slate-300 transition-colors">
            <div
                className="flex items-center justify-between px-4 py-3
                   bg-slate-50 cursor-pointer select-none
                   hover:bg-slate-100 transition-colors"
                onClick={() => setExpandido(!expandido)}
            >
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center
                          justify-center shrink-0">
                        <Building size={13} className="text-primary-600" />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-slate-800 truncate">
                                {titulo}
                            </p>
                            {badge && (
                                <span className="text-xs px-1.5 py-0.5 rounded-full font-medium
                                 bg-blue-100 text-blue-700 shrink-0">
                                    {badge}
                                </span>
                            )}
                        </div>
                        {subtitulo && (
                            <p className="text-xs text-slate-400 truncate">{subtitulo}</p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onEliminar() }}
                        className="p-1.5 text-red-400 hover:text-red-600
                       hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <Trash2 size={13} />
                    </button>
                    {expandido
                        ? <ChevronUp size={15} className="text-slate-400" />
                        : <ChevronDown size={15} className="text-slate-400" />
                    }
                </div>
            </div>

            {expandido && (
                <div className="p-4">{children}</div>
            )}
        </div>
    )
}

// ── Formulario experiencia laboral ─────────────────────────
function FormExpLaboral({ item, onActualizar }) {
    const set = (campo, valor) => onActualizar(campo, valor)

    // ── Hook de validación en tiempo real ─────────────────
    const { props: validarProps, validar } = useValidacion(reglasExpLaboral)

    // ── Handler genérico ──────────────────────────────────
    const handleChange = (campo, valor) => {
        set(campo, valor)
        validar(campo, valor)
    }

    // ✅ Calcular tiempo en cada render (derivado, no almacenado)
    const tiempo = calcularTiempo(item.fecha_inicio, item.fecha_culminacion)

    return (
        <div className="space-y-4">
            <FieldGrid cols={2}>
                <div className="sm:col-span-2">
                    <Input
                        label="Nombre de la Entidad" required
                        value={item.nombre_entidad || ""}
                        {...validarProps("nombre_entidad", item.nombre_entidad)}
                        onChange={(e) => handleChange("nombre_entidad", e.target.value)}
                        placeholder="Ej: Gobierno Regional de Apurímac"
                    />
                </div>
                <Input
                    label="Cargo Desempeñado" required
                    value={item.cargo || ""}
                    {...validarProps("cargo", item.cargo)}
                    onChange={(e) => handleChange("cargo", e.target.value)}
                    placeholder="Ej: Analista de Sistemas"
                />
                <Input
                    label="Documento que Acredita"
                    value={item.documento_acredita || ""}
                    onChange={(e) => set("documento_acredita", e.target.value)}
                    placeholder="Ej: Resolución N° 045-2012"
                />
            </FieldGrid>

            <FieldGrid cols={3}>
                <Input
                    label="Fecha de Inicio" required type="date"
                    value={item.fecha_inicio || ""}
                    {...validarProps("fecha_inicio", item.fecha_inicio)}
                    onChange={(e) => handleChange("fecha_inicio", e.target.value)}
                />
                <Input
                    label="Fecha de Culminación" type="date"
                    value={item.fecha_culminacion || ""}
                    onChange={(e) => set("fecha_culminacion", e.target.value)}
                    placeholder="Dejar vacío si es actual"
                />
                <div className="space-y-0.5">
                    <label className="input-label">Tiempo en el Cargo</label>
                    <div className="input-field bg-slate-50 text-slate-500 text-xs">
                        {tiempo || "Se calcula automáticamente"}
                    </div>
                </div>
            </FieldGrid>
        </div>
    )
}

// ── Formulario experiencia docente ─────────────────────────
function FormExpDocente({ item, onActualizar }) {
    const set = (campo, valor) => onActualizar(campo, valor)

    // ── Hook de validación en tiempo real ─────────────────
    const { props: validarProps, validar } = useValidacion(reglasExpDocente)

    const handleChange = (campo, valor) => {
        set(campo, valor)
        validar(campo, valor)
    }

    // ✅ Calcular tiempo en cada render
    const tiempo = calcularTiempo(item.fecha_inicio, item.fecha_culminacion)

    return (
        <div className="space-y-4">
            <FieldGrid cols={2}>
                <div className="sm:col-span-2">
                    <Input
                        label="Nombre de la Entidad / Universidad" required
                        value={item.nombre_entidad || ""}
                        {...validarProps("nombre_entidad", item.nombre_entidad)}
                        onChange={(e) => handleChange("nombre_entidad", e.target.value)}
                        placeholder="Ej: Universidad Nacional del Cusco"
                    />
                </div>
                <Input
                    label="Categoría Docente"
                    value={item.categoria || ""}
                    onChange={(e) => set("categoria", e.target.value)}
                    placeholder="Ej: Principal, Asociado, Auxiliar"
                />
                <Input
                    label="Documento que Acredita"
                    value={item.documento_acredita || ""}
                    onChange={(e) => set("documento_acredita", e.target.value)}
                    placeholder="Ej: Resolución N° 120-2015"
                />
            </FieldGrid>

            <FieldGrid cols={3}>
                <Input
                    label="Fecha de Inicio" required type="date"
                    value={item.fecha_inicio || ""}
                    {...validarProps("fecha_inicio", item.fecha_inicio)}
                    onChange={(e) => handleChange("fecha_inicio", e.target.value)}
                />
                <Input
                    label="Fecha de Culminación" type="date"
                    value={item.fecha_culminacion || ""}
                    onChange={(e) => set("fecha_culminacion", e.target.value)}
                    placeholder="Dejar vacío si es actual"
                />
                <div className="space-y-0.5">
                    <label className="input-label">Tiempo en el Cargo</label>
                    <div className="input-field bg-slate-50 text-slate-500 text-xs">
                        {tiempo || "Se calcula automáticamente"}
                    </div>
                </div>
            </FieldGrid>
        </div>
    )
}

// ── Sección reutilizable con lista de items ────────────────
function SeccionExperiencia({
    titulo, subtitulo, icono: Icono, color,
    items, limite, onAgregar, onEliminar, onActualizar,
    renderForm, badgeFn,
}) {
    return (
        <div className="form-card">
            <div className="flex items-start justify-between mb-4">
                <SectionTitle
                    icono={Icono}
                    titulo={titulo}
                    subtitulo={`${subtitulo} · ${items.length}/${limite} registrados`}
                />
                {items.length < limite && (
                    <button
                        type="button"
                        onClick={onAgregar}
                        className="btn-secondary text-xs px-3 py-1.5 gap-1 shrink-0 mt-0.5"
                    >
                        <Plus size={12} /> Agregar
                    </button>
                )}
            </div>

            {items.length === 0 ? (
                <div className="text-center py-6 space-y-2">
                    <Icono size={28} className="text-slate-200 mx-auto" />
                    <p className="text-xs text-slate-400 italic">
                        No hay registros aún — haga clic en "Agregar" para ingresar
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {items.map((item) => (
                        <ExpCard
                            key={item._index}
                            titulo={item.nombre_entidad || `Registro ${item.orden}`}
                            subtitulo={item.cargo || item.categoria || "Sin cargo definido"}
                            badge={badgeFn ? badgeFn(item) : null}
                            onEliminar={() => onEliminar(item._index)}
                        >
                            {renderForm(item)}
                        </ExpCard>
                    ))}
                </div>
            )}
        </div>
    )
}

// ══ Componente principal ═══════════════════════════════════
export default function Step5Experiencia({
    expLaboral, expDocente, tipoPersonal,
    onChangeLaboral, onChangeDocente,
}) {

    const porTipo = (tipo) => expLaboral
        .map((e, i) => ({ ...e, _index: i }))
        .filter((e) => e.tipo_institucion === tipo)

    const agregarLaboral = (tipo) => {
        const existentes = expLaboral.filter((e) => e.tipo_institucion === tipo)
        if (existentes.length >= 10) return
        onChangeLaboral([...expLaboral, EXP_LABORAL_VACIA(tipo, existentes.length + 1)])
    }

    const actualizarLaboral = (index, campo, valor) => {
        const lista = [...expLaboral]
        lista[index] = { ...lista[index], [campo]: valor }
        onChangeLaboral(lista)
    }

    const eliminarLaboral = (index) => {
        onChangeLaboral(expLaboral.filter((_, i) => i !== index))
    }

    const expDocenteConIdx = expDocente.map((e, i) => ({ ...e, _index: i }))

    const agregarDocente = () => {
        if (expDocente.length >= 15) return
        onChangeDocente([...expDocente, EXP_DOCENTE_VACIA(expDocente.length + 1)])
    }

    const actualizarDocente = (index, campo, valor) => {
        const lista = [...expDocente]
        lista[index] = { ...lista[index], [campo]: valor }
        onChangeDocente(lista)
    }

    const eliminarDocente = (index) => {
        onChangeDocente(expDocente.filter((_, i) => i !== index))
    }

    const esDocente = tipoPersonal === "Docente"
    const esAdministrativo = tipoPersonal === "Administrativo"
    const sinDefinir = !tipoPersonal

    return (
        <div className="space-y-5">

            {sinDefinir && (
                <div className="flex items-start gap-3 px-4 py-3 bg-amber-50
                        border border-amber-200 rounded-form">
                    <Info size={15} className="text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">
                        No definió el tipo de personal en el Paso 2. Complete ese campo
                        para ver si aplica la sección de experiencia docente.
                    </p>
                </div>
            )}

            <SeccionExperiencia
                titulo="Experiencia en Institución Estatal"
                subtitulo="Máximo 10 registros"
                icono={Briefcase}
                items={porTipo("Estatal")}
                limite={10}
                onAgregar={() => agregarLaboral("Estatal")}
                onEliminar={eliminarLaboral}
                onActualizar={actualizarLaboral}
                badgeFn={(item) => item.fecha_culminacion ? null : "Actual"}
                renderForm={(item) => (
                    <FormExpLaboral
                        item={item}
                        onActualizar={(campo, valor) =>
                            actualizarLaboral(item._index, campo, valor)
                        }
                    />
                )}
            />

            <SeccionExperiencia
                titulo="Experiencia en Institución Privada"
                subtitulo="Máximo 10 registros"
                icono={Briefcase}
                items={porTipo("Privada")}
                limite={10}
                onAgregar={() => agregarLaboral("Privada")}
                onEliminar={eliminarLaboral}
                onActualizar={actualizarLaboral}
                badgeFn={(item) => item.fecha_culminacion ? null : "Actual"}
                renderForm={(item) => (
                    <FormExpLaboral
                        item={item}
                        onActualizar={(campo, valor) =>
                            actualizarLaboral(item._index, campo, valor)
                        }
                    />
                )}
            />

            {esDocente && (
                <SeccionExperiencia
                    titulo="Experiencia Docente"
                    subtitulo="Máximo 15 registros"
                    icono={GraduationCap}
                    items={expDocenteConIdx}
                    limite={15}
                    onAgregar={agregarDocente}
                    onEliminar={eliminarDocente}
                    onActualizar={actualizarDocente}
                    badgeFn={(item) => item.fecha_culminacion ? null : "Actual"}
                    renderForm={(item) => (
                        <FormExpDocente
                            item={item}
                            onActualizar={(campo, valor) =>
                                actualizarDocente(item._index, campo, valor)
                            }
                        />
                    )}
                />
            )}

            {esAdministrativo && (
                <div className="flex items-start gap-3 px-4 py-3 bg-slate-50
                        border border-slate-200 rounded-form">
                    <Info size={15} className="text-slate-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-500">
                        La sección de <strong>Experiencia Docente</strong> no aplica
                        para personal administrativo. Si en algún momento ejerció
                        como docente, puede registrarlo en la experiencia laboral
                        de institución estatal o privada.
                    </p>
                </div>
            )}

        </div>
    )
}