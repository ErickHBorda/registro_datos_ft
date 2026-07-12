import { useState } from "react"
import {
    Building2, Award, Plus, Trash2,
    ChevronDown, ChevronUp, Star, Info
} from "lucide-react"
import { Input, Select, Checkbox, SectionTitle, FieldGrid } from "../ui/FormField"
import { TIPO_PERSONAL } from "../../utils/constants"

// ── Reconocimiento vacío ───────────────────────────────────
const RECONOCIMIENTO_VACIO = (orden) => ({
    nombre_entidad: "",
    tipo_reconocimiento: "",
    documento_acredita: "",
    fecha_documento: "",
    orden,
})

// ── Card colapsable para reconocimientos ───────────────────
function ReconocimientoCard({ item, index, onActualizar, onEliminar }) {
    const [expandido, setExpandido] = useState(true)

    const set = (campo, valor) => onActualizar(index, campo, valor)

    const titulo = item.tipo_reconocimiento || `Reconocimiento ${index + 1}`
    const subtitulo = item.nombre_entidad || "Entidad no definida"

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
                    <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center
                          justify-center shrink-0">
                        <Star size={13} className="text-amber-500" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                            {titulo}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{subtitulo}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onEliminar(index) }}
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
                <div className="p-4 space-y-4">
                    <div className="sm:col-span-2">
                        <Input
                            label="Nombre de la Entidad que Otorga" required
                            value={item.nombre_entidad}
                            onChange={(e) => set("nombre_entidad", e.target.value)}
                            placeholder="Ej: Universidad Nacional Micaela Bastidas"
                        />
                    </div>
                    <Input
                        label="Tipo de Reconocimiento / Felicitación" required
                        value={item.tipo_reconocimiento}
                        onChange={(e) => set("tipo_reconocimiento", e.target.value)}
                        placeholder="Ej: Felicitación por labor docente destacada"
                    />
                    <FieldGrid cols={2}>
                        <Input
                            label="Documento que Acredita"
                            value={item.documento_acredita}
                            onChange={(e) => set("documento_acredita", e.target.value)}
                            placeholder="Ej: Resolución N° 089-2022"
                        />
                        <Input
                            label="Fecha del Documento" type="date"
                            value={item.fecha_documento}
                            onChange={(e) => set("fecha_documento", e.target.value)}
                        />
                    </FieldGrid>
                </div>
            )}
        </div>
    )
}

// ══ Componente principal ═══════════════════════════════════
export default function Step6Otros({
    otrasInstituciones, reconocimientos,
    onChangeInstituciones, onChangeReconocimientos,
}) {

    const set = (campo, valor) =>
        onChangeInstituciones({ ...otrasInstituciones, [campo]: valor })

    // ── Reconocimientos ────────────────────────────────────
    const agregar = () => {
        if (reconocimientos.length >= 6) return
        onChangeReconocimientos([
            ...reconocimientos,
            RECONOCIMIENTO_VACIO(reconocimientos.length + 1),
        ])
    }

    const actualizar = (index, campo, valor) => {
        const lista = [...reconocimientos]
        lista[index] = { ...lista[index], [campo]: valor }
        onChangeReconocimientos(lista)
    }

    const eliminar = (index) => {
        onChangeReconocimientos(reconocimientos.filter((_, i) => i !== index))
    }

    // Días de la semana
    const DIAS = [
        { campo: "dia_lunes", label: "Lun" },
        { campo: "dia_martes", label: "Mar" },
        { campo: "dia_miercoles", label: "Mié" },
        { campo: "dia_jueves", label: "Jue" },
        { campo: "dia_viernes", label: "Vie" },
    ]

    return (
        <div className="space-y-5">

            {/* ══ SECCIÓN 7: OTRAS INSTITUCIONES ════════════════ */}
            <div className="form-card">
                <SectionTitle
                    icono={Building2}
                    titulo="¿Labora en Otras Instituciones?"
                    subtitulo="Empleos adicionales al momento del registro"
                />

                {/* Toggle principal */}
                <div className="flex items-center gap-4 p-4 bg-slate-50
                        rounded-lg border border-slate-200 mb-4">
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-700">
                            ¿Actualmente labora en otra institución?
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Además de su cargo en la UNAMBA
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => onChangeInstituciones({
                                ...otrasInstituciones,
                                labora_otra_inst: false,
                                tipo_personal: "",
                                nombre_entidad: "",
                                horas_diarias: null,
                                dia_lunes: false,
                                dia_martes: false,
                                dia_miercoles: false,
                                dia_jueves: false,
                                dia_viernes: false,
                            })}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold
                          transition-all duration-150 border
                ${!otrasInstituciones.labora_otra_inst
                                    ? "bg-slate-700 text-white border-slate-700"
                                    : "bg-white text-slate-500 border-slate-300 hover:bg-slate-50"
                                }`}
                        >
                            No
                        </button>
                        <button
                            type="button"
                            onClick={() => onChangeInstituciones({
                                ...otrasInstituciones,
                                labora_otra_inst: true,
                            })}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold
                          transition-all duration-150 border
                ${otrasInstituciones.labora_otra_inst
                                    ? "bg-primary-600 text-white border-primary-600"
                                    : "bg-white text-slate-500 border-slate-300 hover:bg-slate-50"
                                }`}
                        >
                            Sí
                        </button>
                    </div>
                </div>

                {/* Formulario condicional */}
                {otrasInstituciones.labora_otra_inst && (
                    <div className="space-y-4 animate-in fade-in duration-200">

                        <FieldGrid cols={2}>
                            <div className="sm:col-span-2">
                                <Input
                                    label="Nombre de la Entidad" required
                                    value={otrasInstituciones.nombre_entidad}
                                    onChange={(e) => set("nombre_entidad", e.target.value)}
                                    placeholder="Ej: Universidad Andina del Cusco"
                                />
                            </div>
                            <Select
                                label="Tipo de Personal" required
                                opciones={TIPO_PERSONAL}
                                value={otrasInstituciones.tipo_personal}
                                onChange={(e) => set("tipo_personal", e.target.value)}
                            />
                            <Input
                                label="Horas Diarias" type="number"
                                min={1} max={12}
                                value={otrasInstituciones.horas_diarias ?? ""}
                                onChange={(e) =>
                                    set("horas_diarias", parseInt(e.target.value) || null)
                                }
                                placeholder="Ej: 4"
                            />
                        </FieldGrid>

                        {/* Días de asistencia */}
                        <div>
                            <label className="input-label mb-2">
                                Días de Asistencia Semanal
                            </label>
                            <div className="flex items-center gap-2 flex-wrap">
                                {DIAS.map(({ campo, label }) => (
                                    <button
                                        key={campo}
                                        type="button"
                                        onClick={() =>
                                            set(campo, !otrasInstituciones[campo])
                                        }
                                        className={`w-12 h-12 rounded-xl text-xs font-bold
                                transition-all duration-150 border-2
                      ${otrasInstituciones[campo]
                                                ? "bg-primary-600 text-white border-primary-600 shadow-md scale-105"
                                                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>

                            {/* Resumen de días seleccionados */}
                            {DIAS.some(({ campo }) => otrasInstituciones[campo]) && (
                                <p className="text-xs text-primary-600 font-medium mt-2">
                                    ✓ Asiste los días:{" "}
                                    {DIAS.filter(({ campo }) => otrasInstituciones[campo])
                                        .map(({ label }) => label)
                                        .join(", ")}
                                </p>
                            )}
                        </div>

                    </div>
                )}

                {/* Confirmación cuando es No */}
                {!otrasInstituciones.labora_otra_inst && (
                    <div className="flex items-start gap-2 px-3 py-2.5 bg-green-50
                          border border-green-200 rounded-lg">
                        <Info size={13} className="text-green-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-green-700">
                            Confirmado: no labora en otra institución además de la UNAMBA.
                        </p>
                    </div>
                )}
            </div>

            {/* ══ SECCIÓN 8: RECONOCIMIENTOS ════════════════════ */}
            <div className="form-card">
                <div className="flex items-start justify-between mb-4">
                    <SectionTitle
                        icono={Award}
                        titulo="Reconocimientos y Felicitaciones"
                        subtitulo={`De relevancia institucional · ${reconocimientos.length}/6 registrados`}
                    />
                    {reconocimientos.length < 6 && (
                        <button
                            type="button"
                            onClick={agregar}
                            className="btn-secondary text-xs px-3 py-1.5 gap-1 shrink-0 mt-0.5"
                        >
                            <Plus size={12} /> Agregar
                        </button>
                    )}
                </div>

                {/* Estado vacío */}
                {reconocimientos.length === 0 ? (
                    <div className="text-center py-8 space-y-2">
                        <Award size={32} className="text-slate-200 mx-auto" />
                        <p className="text-sm text-slate-400">
                            Sin reconocimientos registrados
                        </p>
                        <p className="text-xs text-slate-400">
                            Este campo es opcional — solo si cuenta con reconocimientos
                            de relevancia institucional
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {reconocimientos.map((rec, index) => (
                            <ReconocimientoCard
                                key={index}
                                item={rec}
                                index={index}
                                onActualizar={actualizar}
                                onEliminar={eliminar}
                            />
                        ))}
                    </div>
                )}

                {/* Límite alcanzado */}
                {reconocimientos.length === 6 && (
                    <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-amber-50
                          border border-amber-200 rounded-lg">
                        <Info size={13} className="text-amber-500 shrink-0" />
                        <p className="text-xs text-amber-700">
                            Ha alcanzado el límite máximo de 6 reconocimientos.
                        </p>
                    </div>
                )}
            </div>

        </div>
    )
}