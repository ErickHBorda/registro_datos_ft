import { useState } from "react"
import {
    GraduationCap, BookOpen, Plus, Trash2,
    ChevronDown, ChevronUp, Award
} from "lucide-react"
import { Input, Select, SectionTitle, FieldGrid } from "../ui/FormField"
import {
    NIVEL_EDUCATIVO, ESTADO_ESTUDIO,
    TIPO_OTRO_ESTUDIO, TIPO_CONSTANCIA,
} from "../../utils/constants"
import { useValidacion } from "../../hooks/useValidacion"

// ── Niveles que van en formacion_academica ─────────────────
const NIVELES_FORMACION = NIVEL_EDUCATIVO.filter((n) =>
    ["Primaria", "Secundaria", "Técnico",
        "Bachiller Universitario", "Título Universitario",
        "Segunda Especialidad", "Maestría", "Doctorado"
    ].includes(n.value)
)

// ── Límites por nivel ──────────────────────────────────────
const LIMITES = {
    "Primaria": 1,
    "Secundaria": 1,
    "Técnico": 1,
    "Bachiller Universitario": 3,
    "Título Universitario": 3,
    "Segunda Especialidad": 3,
    "Maestría": 3,
    "Doctorado": 3,
}

// ── Registro vacío de formación ────────────────────────────
const FORMACION_VACIA = (nivel, orden) => ({
    nivel,
    estado: "",
    centro_estudios: "",
    grado_obtenido: "",
    mencion: "",
    fecha_inicio: "",
    fecha_conclusion: "",
    documento_acredita: "",
    orden,
})

// ── Registro vacío de otros estudios ───────────────────────
const OTRO_ESTUDIO_VACIO = (tipo, orden) => ({
    tipo,
    nombre_curso: "",
    centro_estudios: "",
    fecha_inicio: "",
    fecha_fin: "",
    fecha_emision: "",
    duracion_horas: "",
    tipo_constancia: "",
    orden,
})

// ── Reglas de validación para formación ────────────────────
const reglasFormacion = (esBasica) => ({
    estado: {
        requerido: true,
        mensajeRequerido: "Seleccione el estado",
    },
    centro_estudios: {
        requerido: !esBasica,
        minLength: 2,
        mensajeRequerido: "Centro de estudios es obligatorio",
    },
})

// ── Reglas de validación para otros estudios ───────────────
const reglasOtroEstudio = {
    nombre_curso: {
        requerido: true,
        minLength: 2,
        mensajeRequerido: "Nombre del curso es obligatorio",
    },
    centro_estudios: {
        requerido: true,
        minLength: 2,
        mensajeRequerido: "Centro de estudios es obligatorio",
    },
}

// ── Card colapsable genérica ───────────────────────────────
function ItemCard({ titulo, subtitulo, onEliminar, children }) {
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
                        <GraduationCap size={13} className="text-primary-600" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                            {titulo}
                        </p>
                        {subtitulo && (
                            <p className="text-xs text-slate-400 truncate">{subtitulo}</p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onEliminar() }}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50
                       rounded-lg transition-colors"
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

// ── Formulario de un registro de formación ─────────────────
function FormFormacion({ item, onActualizar, esBasica }) {
    const set = (campo, valor) => onActualizar(campo, valor)

    // ── Hook de validación en tiempo real ─────────────────
    const { props: validarProps, validar } = useValidacion(reglasFormacion(esBasica))

    // ── Handler genérico que actualiza y valida ───────────
    const handleChange = (campo, valor) => {
        set(campo, valor)
        validar(campo, valor)
    }

    return (
        <div className="space-y-4">
            <FieldGrid cols={2}>
                <Select
                    label="Estado" required opciones={ESTADO_ESTUDIO}
                    value={item.estado}
                    {...validarProps("estado", item.estado)}
                    onChange={(e) => handleChange("estado", e.target.value)}
                />
                {!esBasica && (
                    <Input
                        label="Centro de Estudios" required
                        value={item.centro_estudios}
                        {...validarProps("centro_estudios", item.centro_estudios)}
                        onChange={(e) => handleChange("centro_estudios", e.target.value)}
                        placeholder="Ej: UNMSM"
                    />
                )}
            </FieldGrid>

            {!esBasica && (
                <>
                    <FieldGrid cols={2}>
                        <Input
                            label="Grado Obtenido / Título"
                            value={item.grado_obtenido}
                            onChange={(e) => set("grado_obtenido", e.target.value)}
                            placeholder="Ej: Bachiller en Ing. de Sistemas"
                        />
                        <Input
                            label="Mención"
                            value={item.mencion}
                            onChange={(e) => set("mencion", e.target.value)}
                            placeholder="Ej: Cum Laude"
                        />
                    </FieldGrid>
                    <FieldGrid cols={2}>
                        <Input
                            label="Fecha de Inicio" type="date"
                            value={item.fecha_inicio}
                            onChange={(e) => set("fecha_inicio", e.target.value)}
                        />
                        <Input
                            label="Fecha de Conclusión" type="date"
                            value={item.fecha_conclusion}
                            onChange={(e) => set("fecha_conclusion", e.target.value)}
                        />
                    </FieldGrid>
                    <Input
                        label="Documento que Acredita"
                        value={item.documento_acredita}
                        onChange={(e) => set("documento_acredita", e.target.value)}
                        placeholder="Ej: Diploma de Bachiller, Resolución N°..."
                    />
                </>
            )}
        </div>
    )
}

// ── Formulario de un otro estudio ──────────────────────────
function FormOtroEstudio({ item, onActualizar }) {
    const set = (campo, valor) => onActualizar(campo, valor)

    // ── Hook de validación en tiempo real ─────────────────
    const { props: validarProps, validar } = useValidacion(reglasOtroEstudio)

    // ── Handler genérico que actualiza y valida ───────────
    const handleChange = (campo, valor) => {
        set(campo, valor)
        validar(campo, valor)
    }

    return (
        <div className="space-y-4">
            <FieldGrid cols={2}>
                <div className="sm:col-span-2">
                    <Input
                        label="Nombre del Curso / Programa" required
                        value={item.nombre_curso}
                        {...validarProps("nombre_curso", item.nombre_curso)}
                        onChange={(e) => handleChange("nombre_curso", e.target.value)}
                        placeholder="Ej: Diplomado en Gestión Pública"
                    />
                </div>
                <Input
                    label="Centro de Estudios" required
                    value={item.centro_estudios}
                    {...validarProps("centro_estudios", item.centro_estudios)}
                    onChange={(e) => handleChange("centro_estudios", e.target.value)}
                    placeholder="Ej: SERVIR, PUCP"
                />
                <Input
                    label="Duración (horas)" type="number" min={1}
                    value={item.duracion_horas}
                    onChange={(e) => set("duracion_horas", e.target.value)}
                    placeholder="Ej: 120"
                />
            </FieldGrid>
            <FieldGrid cols={3}>
                <Input
                    label="Fecha de Inicio" type="date"
                    value={item.fecha_inicio}
                    onChange={(e) => set("fecha_inicio", e.target.value)}
                />
                <Input
                    label="Fecha de Fin" type="date"
                    value={item.fecha_fin}
                    onChange={(e) => set("fecha_fin", e.target.value)}
                />
                <Input
                    label="Fecha de Emisión" type="date"
                    value={item.fecha_emision}
                    onChange={(e) => set("fecha_emision", e.target.value)}
                />
            </FieldGrid>
            <Select
                label="Tipo de Constancia" opciones={TIPO_CONSTANCIA}
                value={item.tipo_constancia}
                onChange={(e) => set("tipo_constancia", e.target.value)}
            />
        </div>
    )
}

// ── Componente principal ───────────────────────────────────
export default function Step4Formacion({
    formacion, otrosEstudios,
    onChangeFormacion, onChangeOtros,
}) {

    // ── Formación académica ────────────────────────────────
    const agregarFormacion = (nivel) => {
        const existentes = formacion.filter((f) => f.nivel === nivel)
        if (existentes.length >= LIMITES[nivel]) return
        const orden = existentes.length + 1
        onChangeFormacion([...formacion, FORMACION_VACIA(nivel, orden)])
    }

    const actualizarFormacion = (index, campo, valor) => {
        const lista = [...formacion]
        lista[index] = { ...lista[index], [campo]: valor }
        onChangeFormacion(lista)
    }

    const eliminarFormacion = (index) => {
        onChangeFormacion(formacion.filter((_, i) => i !== index))
    }

    // ── Otros estudios ─────────────────────────────────────
    const agregarOtro = (tipo) => {
        const existentes = otrosEstudios.filter((e) => e.tipo === tipo)
        if (existentes.length >= 10) return
        const orden = existentes.length + 1
        onChangeOtros([...otrosEstudios, OTRO_ESTUDIO_VACIO(tipo, orden)])
    }

    const actualizarOtro = (index, campo, valor) => {
        const lista = [...otrosEstudios]
        lista[index] = { ...lista[index], [campo]: valor }
        onChangeOtros(lista)
    }

    const eliminarOtro = (index) => {
        onChangeOtros(otrosEstudios.filter((_, i) => i !== index))
    }

    // ── Helpers de agrupación ──────────────────────────────
    const porNivel = (nivel) => formacion
        .map((f, i) => ({ ...f, _index: i }))
        .filter((f) => f.nivel === nivel)

    const porTipo = (tipo) => otrosEstudios
        .map((e, i) => ({ ...e, _index: i }))
        .filter((e) => e.tipo === tipo)

    // ── Grupos de niveles ──────────────────────────────────
    const grupos = [
        {
            titulo: "Educación Básica Regular",
            icono: BookOpen,
            niveles: ["Primaria", "Secundaria"],
        },
        {
            titulo: "Educación Superior",
            icono: GraduationCap,
            niveles: ["Técnico", "Bachiller Universitario",
                "Título Universitario", "Segunda Especialidad"],
        },
        {
            titulo: "Posgrado",
            icono: Award,
            niveles: ["Maestría", "Doctorado"],
        },
    ]

    return (
        <div className="space-y-5">

            {/* ══ FORMACIÓN ACADÉMICA ══════════════════════════ */}
            {grupos.map((grupo) => (
                <div key={grupo.titulo} className="form-card">
                    <SectionTitle icono={grupo.icono} titulo={grupo.titulo} />

                    <div className="space-y-4">
                        {grupo.niveles.map((nivel) => {
                            const items = porNivel(nivel)
                            const limite = LIMITES[nivel]
                            const esBasica = ["Primaria", "Secundaria"].includes(nivel)

                            return (
                                <div key={nivel}>
                                    {/* Encabezado del nivel */}
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-slate-600
                                     uppercase tracking-wide">
                                            {nivel}
                                            <span className="text-slate-400 font-normal ml-1">
                                                ({items.length}/{limite})
                                            </span>
                                        </span>
                                        {items.length < limite && (
                                            <button
                                                type="button"
                                                onClick={() => agregarFormacion(nivel)}
                                                className="btn-secondary text-xs px-2.5 py-1 gap-1"
                                            >
                                                <Plus size={11} /> Agregar
                                            </button>
                                        )}
                                    </div>

                                    {/* Items del nivel */}
                                    <div className="space-y-2 ml-2">
                                        {items.length === 0 && (
                                            <p className="text-xs text-slate-400 italic py-1">
                                                Sin registros — haga clic en "Agregar" para ingresar
                                            </p>
                                        )}
                                        {items.map((item) => (
                                            <ItemCard
                                                key={item._index}
                                                titulo={item.centro_estudios || item.grado_obtenido || nivel}
                                                subtitulo={item.estado || "Estado no definido"}
                                                onEliminar={() => eliminarFormacion(item._index)}
                                            >
                                                <FormFormacion
                                                    item={item}
                                                    esBasica={esBasica}
                                                    onActualizar={(campo, valor) =>
                                                        actualizarFormacion(item._index, campo, valor)
                                                    }
                                                />
                                            </ItemCard>
                                        ))}
                                    </div>

                                    {/* Separador entre niveles */}
                                    {nivel !== grupo.niveles[grupo.niveles.length - 1] && (
                                        <div className="border-b border-slate-100 mt-3" />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}

            {/* ══ OTROS ESTUDIOS ══════════════════════════════ */}
            {["Diplomado", "Especialización", "Otro"].map((tipo) => (
                <div key={tipo} className="form-card">
                    <div className="flex items-center justify-between mb-4">
                        <SectionTitle
                            icono={BookOpen}
                            titulo={tipo === "Otro" ? "Otros Estudios" : `${tipo}s`}
                            subtitulo={`Máximo 10 registros · ${porTipo(tipo).length}/10 ingresados`}
                        />
                        {porTipo(tipo).length < 10 && (
                            <button
                                type="button"
                                onClick={() => agregarOtro(tipo)}
                                className="btn-secondary text-xs px-3 py-1.5 gap-1 shrink-0"
                            >
                                <Plus size={12} /> Agregar
                            </button>
                        )}
                    </div>

                    {porTipo(tipo).length === 0 ? (
                        <p className="text-xs text-slate-400 italic text-center py-4">
                            No hay {tipo === "Otro" ? "otros estudios" : `${tipo.toLowerCase()}s`} registrados
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {porTipo(tipo).map((item) => (
                                <ItemCard
                                    key={item._index}
                                    titulo={item.nombre_curso || `${tipo} ${item.orden}`}
                                    subtitulo={item.centro_estudios || "Centro no definido"}
                                    onEliminar={() => eliminarOtro(item._index)}
                                >
                                    <FormOtroEstudio
                                        item={item}
                                        onActualizar={(campo, valor) =>
                                            actualizarOtro(item._index, campo, valor)
                                        }
                                    />
                                </ItemCard>
                            ))}
                        </div>
                    )}
                </div>
            ))}

        </div>
    )
}