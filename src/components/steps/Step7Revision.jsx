import {
    User, Briefcase, Users, GraduationCap,
    Building2, Award, CheckCircle2, AlertCircle,
    ChevronDown, ChevronUp,
} from "lucide-react"
import { useState } from "react"

// ── Card de sección revisable ──────────────────────────────
function RevisionCard({ icono: Icono, titulo, completo, children, onEditar, paso }) {
    const [expandido, setExpandido] = useState(true)

    return (
        <div className={`border rounded-form overflow-hidden transition-all
      ${completo
                ? "border-green-200 bg-green-50/30"
                : "border-amber-200 bg-amber-50/30"
            }`}
        >
            {/* Cabecera */}
            <div
                className="flex items-center justify-between px-4 py-3
                   cursor-pointer select-none hover:bg-white/50 transition-colors"
                onClick={() => setExpandido(!expandido)}
            >
                <div className="flex items-center gap-3">
                    {completo
                        ? <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                        : <AlertCircle size={16} className="text-amber-500 shrink-0" />
                    }
                    <div className="flex items-center gap-2">
                        <Icono size={14} className="text-slate-500" />
                        <span className="text-sm font-semibold text-slate-700">{titulo}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onEditar(paso) }}
                        className="text-xs text-primary-600 font-semibold
                       hover:text-primary-800 transition-colors px-2 py-1
                       rounded hover:bg-primary-50"
                    >
                        Editar
                    </button>
                    {expandido
                        ? <ChevronUp size={14} className="text-slate-400" />
                        : <ChevronDown size={14} className="text-slate-400" />
                    }
                </div>
            </div>

            {/* Contenido */}
            {expandido && (
                <div className="px-4 pb-4 pt-1 space-y-1.5">
                    {children}
                </div>
            )}
        </div>
    )
}

// ── Fila de dato individual ────────────────────────────────
function Dato({ label, valor, destacado = false }) {
    if (!valor && valor !== false && valor !== 0) return null
    return (
        <div className="flex items-start gap-2 text-xs py-0.5">
            <span className="text-slate-400 shrink-0 w-40">{label}</span>
            <span className={`font-medium ${destacado ? "text-primary-700" : "text-slate-700"}`}>
                {typeof valor === "boolean" ? (valor ? "Sí" : "No") : valor}
            </span>
        </div>
    )
}

// ── Lista de items (familiares, formación, etc.) ───────────
function ListaItems({ items, renderItem, vacio = "Sin registros" }) {
    if (!items || items.length === 0) {
        return <p className="text-xs text-slate-400 italic">{vacio}</p>
    }
    return (
        <div className="space-y-2">
            {items.map((item, i) => (
                <div key={i} className="bg-white rounded-lg px-3 py-2 border border-slate-100">
                    {renderItem(item, i)}
                </div>
            ))}
        </div>
    )
}

// ══ Componente principal ═══════════════════════════════════
export default function Step7Revision({ ficha, onIrAlPaso }) {

    const { personal, datos_laborales, familiares,
        formacion_academica, otros_estudios,
        experiencia_laboral, experiencia_docente,
        otras_instituciones, reconocimientos } = ficha

    // ── Validaciones de completitud ────────────────────────
    const checks = {
        personal: !!(
            personal.apellido_paterno &&
            personal.apellido_materno &&
            personal.nombres &&
            personal.dni &&
            personal.sexo &&
            personal.fecha_nacimiento &&
            personal.estado_civil &&
            personal.celular &&
            personal.email_personal_1 &&
            personal.dom_direccion
        ),
        laboral: !!(
            datos_laborales.dependencia &&
            datos_laborales.cargo &&
            datos_laborales.fecha_ingreso &&
            datos_laborales.email_institucional &&
            datos_laborales.condicion &&
            datos_laborales.tipo_personal
        ),
        familiares: true, // Opcional
        formacion: formacion_academica.length > 0,
        experiencia: experiencia_laboral.length > 0,
        otros: true, // Opcional
    }

    const totalCompletos = Object.values(checks).filter(Boolean).length
    const totalSecciones = Object.keys(checks).length
    const listo = checks.personal && checks.laboral

    return (
        <div className="space-y-5">

            {/* ── Banner de estado general ───────────────────── */}
            <div className={`rounded-form p-4 border ${listo
                ? "bg-green-50 border-green-200"
                : "bg-amber-50 border-amber-200"
                }`}>
                <div className="flex items-center gap-3">
                    {listo
                        ? <CheckCircle2 size={22} className="text-green-500 shrink-0" />
                        : <AlertCircle size={22} className="text-amber-500 shrink-0" />
                    }
                    <div>
                        <p className={`text-sm font-bold ${listo ? "text-green-700" : "text-amber-700"
                            }`}>
                            {listo
                                ? "Todo listo para enviar"
                                : "Faltan campos obligatorios"
                            }
                        </p>
                        <p className={`text-xs mt-0.5 ${listo ? "text-green-600" : "text-amber-600"
                            }`}>
                            {totalCompletos} de {totalSecciones} secciones completas
                            {!listo && " — Revise los datos marcados con ⚠️"}
                        </p>
                    </div>
                </div>

                {/* Barra de completitud */}
                <div className="mt-3 h-1.5 bg-white/70 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500
              ${listo ? "bg-green-500" : "bg-amber-400"}`}
                        style={{ width: `${(totalCompletos / totalSecciones) * 100}%` }}
                    />
                </div>
            </div>

            {/* ══ 1. DATOS PERSONALES ════════════════════════ */}
            <RevisionCard
                icono={User}
                titulo="Datos Personales"
                completo={checks.personal}
                onEditar={onIrAlPaso}
                paso={1}
            >
                <Dato label="Apellidos y Nombres"
                    valor={`${personal.apellido_paterno} ${personal.apellido_materno}, ${personal.nombres}`}
                    destacado />
                <Dato label="DNI" valor={personal.dni} />
                <Dato label="Sexo" valor={personal.sexo} />
                <Dato label="Fecha Nacimiento" valor={personal.fecha_nacimiento} />
                <Dato label="Estado Civil" valor={personal.estado_civil} />
                <Dato label="Celular" valor={personal.celular} />
                <Dato label="Email Personal" valor={personal.email_personal_1} />
                <Dato label="Dirección" valor={personal.dom_direccion} />
                <Dato label="Grupo Sanguíneo" valor={personal.grupo_sanguineo} />
                <Dato label="Sistema Pensión" valor={personal.sistema_pension} />
                {personal.sistema_pension === "AFP" && (
                    <Dato label="AFP" valor={personal.afp_nombre} />
                )}
                <Dato label="Donador de Órganos" valor={personal.donador_organos} />
                {personal.idiomas_nativos?.length > 0 && (
                    <Dato label="Idiomas Nativos"
                        valor={personal.idiomas_nativos
                            .map((i) => `${i.idioma} (${i.nivel})`).join(", ")}
                    />
                )}
                {personal.ofimatica?.length > 0 && (
                    <Dato label="Ofimática"
                        valor={personal.ofimatica
                            .map((o) => `${o.programa} (${o.nivel})`).join(", ")}
                    />
                )}
                {!checks.personal && (
                    <p className="text-xs text-amber-600 font-medium mt-2">
                        ⚠️ Faltan campos obligatorios en Datos Personales
                    </p>
                )}
            </RevisionCard>

            {/* ══ 2. DATOS LABORALES ═════════════════════════ */}
            <RevisionCard
                icono={Briefcase}
                titulo="Datos Laborales"
                completo={checks.laboral}
                onEditar={onIrAlPaso}
                paso={2}
            >
                <Dato label="Dependencia" valor={datos_laborales.dependencia} destacado />
                <Dato label="Cargo" valor={datos_laborales.cargo} />
                <Dato label="Fecha de Ingreso" valor={datos_laborales.fecha_ingreso} />
                <Dato label="Email Institucional" valor={datos_laborales.email_institucional} />
                <Dato label="Condición" valor={datos_laborales.condicion} />
                <Dato label="Tipo Personal" valor={datos_laborales.tipo_personal} />
                <Dato label="Régimen DL 276" valor={datos_laborales.regimen_276} />
                <Dato label="Régimen DL 1057" valor={datos_laborales.regimen_1057} />
                <Dato label="Dedicación" valor={datos_laborales.dedicacion} />
                <Dato label="Nivel Remunerativo" valor={datos_laborales.nivel_remunerativo} />
                {!checks.laboral && (
                    <p className="text-xs text-amber-600 font-medium mt-2">
                        ⚠️ Faltan campos obligatorios en Datos Laborales
                    </p>
                )}
            </RevisionCard>

            {/* ══ 3. FAMILIARES ══════════════════════════════ */}
            <RevisionCard
                icono={Users}
                titulo={`Familiares (${familiares.length})`}
                completo={checks.familiares}
                onEditar={onIrAlPaso}
                paso={3}
            >
                <ListaItems
                    items={familiares}
                    vacio="No se registraron familiares"
                    renderItem={(f) => (
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-700">
                                {f.nombres} {f.apellido_paterno}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium
                               bg-purple-100 text-purple-700">
                                {f.parentesco}
                            </span>
                        </div>
                    )}
                />
            </RevisionCard>

            {/* ══ 4. FORMACIÓN ACADÉMICA ═════════════════════ */}
            <RevisionCard
                icono={GraduationCap}
                titulo={`Formación Académica (${formacion_academica.length + otros_estudios.length})`}
                completo={checks.formacion}
                onEditar={onIrAlPaso}
                paso={4}
            >
                <ListaItems
                    items={formacion_academica}
                    vacio="No se registró formación académica"
                    renderItem={(f) => (
                        <div>
                            <p className="text-xs font-medium text-slate-700">
                                {f.nivel} — {f.estado}
                            </p>
                            {f.centro_estudios && (
                                <p className="text-xs text-slate-400">{f.centro_estudios}</p>
                            )}
                        </div>
                    )}
                />
                {otros_estudios.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-100">
                        <p className="text-xs font-semibold text-slate-500 mb-1">
                            Otros estudios ({otros_estudios.length})
                        </p>
                        <ListaItems
                            items={otros_estudios}
                            renderItem={(e) => (
                                <div>
                                    <p className="text-xs font-medium text-slate-700">
                                        {e.tipo} — {e.nombre_curso}
                                    </p>
                                    {e.centro_estudios && (
                                        <p className="text-xs text-slate-400">{e.centro_estudios}</p>
                                    )}
                                </div>
                            )}
                        />
                    </div>
                )}
                {!checks.formacion && (
                    <p className="text-xs text-amber-600 font-medium mt-2">
                        ⚠️ Se recomienda registrar al menos un nivel de formación
                    </p>
                )}
            </RevisionCard>

            {/* ══ 5. EXPERIENCIA ═════════════════════════════ */}
            <RevisionCard
                icono={Briefcase}
                titulo={`Experiencia Laboral (${experiencia_laboral.length + experiencia_docente.length})`}
                completo={checks.experiencia}
                onEditar={onIrAlPaso}
                paso={5}
            >
                <ListaItems
                    items={experiencia_laboral}
                    vacio="No se registró experiencia laboral"
                    renderItem={(e) => (
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <p className="text-xs font-medium text-slate-700">
                                    {e.cargo}
                                </p>
                                <p className="text-xs text-slate-400">{e.nombre_entidad}</p>
                            </div>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full shrink-0
                font-medium
                ${e.tipo_institucion === "Estatal"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-slate-100 text-slate-600"
                                }`}>
                                {e.tipo_institucion}
                            </span>
                        </div>
                    )}
                />
                {experiencia_docente.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-100">
                        <p className="text-xs font-semibold text-slate-500 mb-1">
                            Experiencia Docente ({experiencia_docente.length})
                        </p>
                        <ListaItems
                            items={experiencia_docente}
                            renderItem={(e) => (
                                <div>
                                    <p className="text-xs font-medium text-slate-700">
                                        {e.nombre_entidad}
                                    </p>
                                    {e.categoria && (
                                        <p className="text-xs text-slate-400">{e.categoria}</p>
                                    )}
                                </div>
                            )}
                        />
                    </div>
                )}
                {!checks.experiencia && (
                    <p className="text-xs text-amber-600 font-medium mt-2">
                        ⚠️ Se recomienda registrar al menos una experiencia laboral
                    </p>
                )}
            </RevisionCard>

            {/* ══ 6. OTRAS INSTITUCIONES Y RECONOCIMIENTOS ══ */}
            <RevisionCard
                icono={Building2}
                titulo="Otras Instituciones y Reconocimientos"
                completo={checks.otros}
                onEditar={onIrAlPaso}
                paso={6}
            >
                <Dato
                    label="Labora en otras inst."
                    valor={otras_instituciones.labora_otra_inst ? "Sí" : "No"}
                />
                {otras_instituciones.labora_otra_inst && (
                    <>
                        <Dato label="Entidad" valor={otras_instituciones.nombre_entidad} />
                        <Dato label="Tipo Personal" valor={otras_instituciones.tipo_personal} />
                        <Dato label="Horas Diarias" valor={otras_instituciones.horas_diarias} />
                    </>
                )}

                {reconocimientos.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-100">
                        <p className="text-xs font-semibold text-slate-500 mb-1">
                            Reconocimientos ({reconocimientos.length})
                        </p>
                        <ListaItems
                            items={reconocimientos}
                            renderItem={(r) => (
                                <p className="text-xs font-medium text-slate-700">
                                    {r.tipo_reconocimiento} — {r.nombre_entidad}
                                </p>
                            )}
                        />
                    </div>
                )}
            </RevisionCard>

            {/* ── Declaración jurada ─────────────────────────── */}
            <div className="form-card bg-slate-50 border border-slate-200">
                <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-primary-600 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-xs font-semibold text-slate-700 mb-1">
                            Declaración Jurada
                        </p>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Declaro bajo juramento que la presente información expresa
                            la verdad, de conformidad a lo dispuesto por la Ley de
                            Procedimiento Administrativo General — Ley N° 27444.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}