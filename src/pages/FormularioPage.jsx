// Layout principal del formulario multi-paso

import { useRef }              from "react"
import { Toaster, toast }      from "react-hot-toast"
import { useFicha }            from "../hooks/useFicha"
import { personalService }     from "../services/api"
import { PASOS_FICHA }         from "../utils/constants"
import Stepper                 from "../components/ui/Stepper"
import NavButtons              from "../components/ui/NavButtons"
import Step1Personal from "../components/steps/Step1Personal"

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

  // ── Navegación con scroll ─────────────────────────────────
  const handleSiguiente = () => { siguientePaso(); scrollTop() }
  const handleAnterior  = () => { pasoAnterior();  scrollTop() }
  const handleIrAlPaso  = (n) => { irAlPaso(n);    scrollTop() }

  // ── Envío final ───────────────────────────────────────────
  const handleEnviar = async () => {
    setCargando(true)
    try {
      const payload  = prepararPayload()
      const respuesta = await personalService.crear(payload)
      setPersonalId(respuesta.personal.id)
      setCompletado(true)
      toast.success("¡Ficha registrada correctamente!")
    } catch (error) {
      toast.error(error.message || "Error al enviar la ficha")
    } finally {
      setCargando(false)
    }
  }

  // ── Pantalla de éxito ─────────────────────────────────────
  if (completado) {
    return (
      <div className="min-h-screen bg-unamba-light flex items-center justify-center p-4">
        <div className="form-card max-w-md w-full text-center space-y-5">
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
            <p className="text-sm text-slate-500 mt-2">
              Sus datos han sido guardados correctamente en el sistema
              de la Oficina de Recursos Humanos de la UNAMBA.
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-500">
            Guarde este número de registro para futuras consultas
          </div>
          <button
            onClick={resetFicha}
            className="btn-secondary w-full justify-center"
          >
            Registrar otro trabajador
          </button>
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
      case 2: return <PasoPlaceholder numero={2} titulo="Datos Laborales" />
      case 3: return <PasoPlaceholder numero={3} titulo="Familiares" />
      case 4: return <PasoPlaceholder numero={4} titulo="Formación Académica" />
      case 5: return <PasoPlaceholder numero={5} titulo="Experiencia Laboral" />
      case 6: return <PasoPlaceholder numero={6} titulo="Otros & Reconocimientos" />
      case 7: return <PasoPlaceholder numero={7} titulo="Revisión Final" />
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
    </div>
  )
}