// Layout principal del formulario multi-paso

import { useRef, useState } from "react"
import { Toaster, toast } from "react-hot-toast"
import { useFicha } from "../hooks/useFicha"
import { personalService, fotosService } from "../services/api"
import { PASOS_FICHA } from "../utils/constants"
import Stepper from "../components/ui/Stepper"
import NavButtons from "../components/ui/NavButtons"
import Step1Personal from "../components/steps/Step1Personal"
import Step2Laboral from "../components/steps/Step2Laboral"
import Step3Familiares from "../components/steps/Step3Familiares"
import Step4Formacion from "../components/steps/Step4Formacion"
import Step5Experiencia from "../components/steps/Step5Experiencia"
import Step6Otros from "../components/steps/Step6Otros"
import Step7Revision from "../components/steps/Step7Revision"
import ModalConfirmacion from "../components/ui/ModalConfirmacion"

// ── Placeholders de pasos (los iremos reemplazando paso a paso) ──
function PasoPlaceholder({ numero, titulo }) {
  return (
    <div className="form-card min-h-[300px] flex flex-col items-center
                    justify-center text-center space-y-3">
      <div className="w-14 h-14 rounded-full bg-primary-50 border-2
                      border-primary-200 flex items-center justify-center">
        <span className="text-2xl font-bold text-primary-400">{numero}</span>
      </div>
      <h3 className="text-base font-semibold text-slate-700">{titulo}</h3>
      <p className="text-xs text-slate-400">Este paso se construirá a continuación</p>
    </div>
  )
}

export default function FormularioPage() {
  const {
    ficha, pasoActual, cargando, completado,
    setCargando, setPersonalId, setCompletado,
    actualizarSeccion, irAlPaso,
    siguientePaso, pasoAnterior,
    prepararPayload, resetFicha,
    actualizarCampo,
  } = useFicha()

  // Ref para subir al inicio al cambiar de paso
  const topRef = useRef(null)

  const scrollTop = () =>
    topRef.current?.scrollIntoView({ behavior: "smooth" })

  const [modalVisible, setModalVisible] = useState(false)

  // ── Navegación con scroll ─────────────────────────────────
  const handleSiguiente = () => {
    siguientePaso()
    scrollTop()
  }
  const handleAnterior = () => { pasoAnterior(); scrollTop() }
  const handleIrAlPaso = (n) => { irAlPaso(n); scrollTop() }

  // ── Envío final ───────────────────────────────────────────
  const handleEnviar = () => {
    // Validar campos mínimos antes de abrir el modal
    const p = ficha.personal
    if (!p.dni || !p.nombres || !p.apellido_paterno ||
      !p.celular || !p.email_personal_1 || !p.dom_direccion) {
      toast.error("Complete los campos obligatorios del Paso 1 antes de enviar")
      return
    }
    const l = ficha.datos_laborales
    if (!l.dependencia || !l.cargo || !l.email_institucional ||
      !l.condicion || !l.tipo_personal) {
      toast.error("Complete los campos obligatorios del Paso 2 antes de enviar")
      return
    }
    // Abrir modal
    setModalVisible(true)
  }

  // ── Envío real tras confirmar en el modal ─────────────────
  const handleConfirmar = async () => {
    setCargando(true)
    try {
      const payload = prepararPayload()
      const respuesta = await personalService.crear(payload)
      const nuevoId = respuesta.personal.id

      // Subir foto si existe
      const archivoFoto = ficha.personal._foto_archivo
      if (archivoFoto && nuevoId) {
        try {
          await fotosService.subir(nuevoId, archivoFoto)
        } catch {
          toast("Ficha guardada. La foto no pudo subirse — puede actualizarla después.",
            { icon: "⚠️", duration: 5000 })
        }
      }

      setModalVisible(false)
      setPersonalId(nuevoId)
      setCompletado(true)
      toast.success("¡Ficha registrada correctamente!")

    } catch (error) {
      if (error.message?.includes("DNI")) {
        toast.error(`DNI ya registrado: ${ficha.personal.dni}`)
        setModalVisible(false)
        irAlPaso(1)
      } else {
        toast.error(error.message || "Error al enviar la ficha")
      }
    } finally {
      setCargando(false)
    }
  }

  // ── Pantalla de éxito ─────────────────────────────────────
  if (completado) {
    return (
      <div className="min-h-screen bg-unamba-light flex items-center
                      justify-center p-4">
        <div className="form-card max-w-md w-full text-center space-y-5">

          {/* Ícono de éxito animado */}
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center
                          justify-center mx-auto">
            <svg className="w-10 h-10 text-green-500" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-800">
              ¡Ficha registrada con éxito!
            </h2>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Sus datos han sido guardados correctamente en el sistema
              de la Oficina de Recursos Humanos de la UNAMBA.
            </p>
          </div>

          {/* Número de registro */}
          {personalId && (
            <div className="bg-primary-50 border border-primary-200
                            rounded-lg p-4 space-y-1">
              <p className="text-xs text-primary-600 font-semibold uppercase tracking-wide">
                Número de Registro
              </p>
              <p className="text-3xl font-black text-primary-700">
                #{String(personalId).padStart(5, "0")}
              </p>
              <p className="text-xs text-slate-400">
                Guarde este número para futuras consultas
              </p>
            </div>
          )}

          {/* Datos del registrado */}
          <div className="bg-slate-50 rounded-lg p-3 text-left space-y-1.5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Datos registrados
            </p>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Nombre</span>
              <span className="font-medium text-slate-700">
                {ficha.personal.apellido_paterno} {ficha.personal.apellido_materno},
                {" "}{ficha.personal.nombres}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">DNI</span>
              <span className="font-medium text-slate-700">{ficha.personal.dni}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Cargo</span>
              <span className="font-medium text-slate-700">
                {ficha.datos_laborales.cargo || "—"}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Dependencia</span>
              <span className="font-medium text-slate-700 text-right max-w-[200px]">
                {ficha.datos_laborales.dependencia || "—"}
              </span>
            </div>
          </div>

          {/* Declaración jurada */}
          <p className="text-xs text-slate-400 italic leading-relaxed">
            Información registrada bajo juramento conforme a la
            Ley N° 27444 — Ley de Procedimiento Administrativo General.
          </p>

          {/* Acciones */}
          <div className="flex flex-col gap-2 pt-1">
            <button
              onClick={resetFicha}
              className="btn-primary w-full justify-center"
            >
              Registrar otro trabajador
            </button>
            <button
              onClick={() => window.print()}
              className="btn-secondary w-full justify-center"
            >
              Imprimir constancia
            </button>
          </div>

        </div>
      </div>
    )
  }

  // ── Render del paso actual ────────────────────────────────
  const renderPaso = () => {
    switch (pasoActual) {
      case 1: return (
        <Step1Personal
          datos={ficha.personal}
          onChange={actualizarCampo}
        />
      )
      case 2: return (
        <Step2Laboral
          datos={ficha.datos_laborales}
          onChange={actualizarCampo}
        />
      )
      case 3: return (
        <Step3Familiares
          datos={ficha.familiares}
          onChange={(seccion, campo, valor) =>
            actualizarSeccion("familiares", valor)
          }
        />
      )
      case 4: return (
        <Step4Formacion
          formacion={ficha.formacion_academica}
          otrosEstudios={ficha.otros_estudios}
          onChangeFormacion={(lista) =>
            actualizarSeccion("formacion_academica", lista)
          }
          onChangeOtros={(lista) =>
            actualizarSeccion("otros_estudios", lista)
          }
        />
      )
      case 5: return (
        <Step5Experiencia
          expLaboral={ficha.experiencia_laboral}
          expDocente={ficha.experiencia_docente}
          tipoPersonal={ficha.datos_laborales.tipo_personal}
          onChangeLaboral={(lista) =>
            actualizarSeccion("experiencia_laboral", lista)
          }
          onChangeDocente={(lista) =>
            actualizarSeccion("experiencia_docente", lista)
          }
        />
      )
      case 6: return (
        <Step6Otros
          otrasInstituciones={ficha.otras_instituciones}
          reconocimientos={ficha.reconocimientos}
          onChangeInstituciones={(datos) =>
            actualizarSeccion("otras_instituciones", datos)
          }
          onChangeReconocimientos={(lista) =>
            actualizarSeccion("reconocimientos", lista)
          }
        />
      )
      case 7: return (
        <Step7Revision
          ficha={ficha}
          onIrAlPaso={handleIrAlPaso}
        />
      )
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-unamba-light">
      <Toaster position="top-right" />

      {/* ── Header institucional ──────────────────────────── */}
      <header className="bg-unamba-blue shadow-md sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center
                          justify-center shrink-0">
            <span className="text-white font-black text-sm">U</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-white font-bold text-sm leading-tight truncate">
              Ficha Digital de Registro de Personal
            </h1>
            <p className="text-blue-200 text-xs truncate">
              UNAMBA — Oficina de RR.HH. · Sub Oficina de Escalafón
            </p>
          </div>
        </div>
      </header>

      {/* ── Contenido principal ───────────────────────────── */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">

        {/* Ancla para scroll top */}
        <div ref={topRef} />

        {/* ── Stepper con Zeigarnik ─────────────────────── */}
        <div className="form-card">
          <Stepper
            pasoActual={pasoActual}
            onIrAlPaso={handleIrAlPaso}
          />
        </div>

        {/* ── Título del paso actual ────────────────────── */}
        <div className="flex items-center gap-2 px-1">
          <span className="text-xs font-semibold text-primary-600 uppercase tracking-widest">
            Paso {pasoActual}
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-sm font-semibold text-slate-700">
            {PASOS_FICHA[pasoActual - 1].label}
          </span>
        </div>

        {/* ── Formulario del paso actual ────────────────── */}
        {renderPaso()}

        {/* ── Botones de navegación fijos ───────────────── */}
        <NavButtons
          pasoActual={pasoActual}
          totalPasos={PASOS_FICHA.length}
          onAnterior={handleAnterior}
          onSiguiente={handleSiguiente}
          onEnviar={handleEnviar}
          cargando={cargando}
        />

      </main>
      {/* ── Modal de confirmación ──────────────────────── */}
      <ModalConfirmacion
        visible={modalVisible}
        onConfirmar={handleConfirmar}
        onCancelar={() => !cargando && setModalVisible(false)}
        cargando={cargando}
        ficha={ficha}
      />
    </div>
  )
}