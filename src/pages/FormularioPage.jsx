import { useRef, useState, useMemo } from "react"
import { Toaster, toast } from "react-hot-toast"
import { useFicha } from "../hooks/useFicha"
import { personalService, fotosService } from "../services/api"
import { useModalBienvenida } from "../hooks/useModal"
import ModalBienvenida from "../components/ui/ModalBienvenida"
import { PASOS_FICHA } from "../utils/constants"
import Stepper from "../components/ui/Stepper"
import BarraProgreso from "../components/ui/BarraProgreso"
import NavButtons from "../components/ui/NavButtons"
import Step1Personal from "../components/steps/Step1Personal"
import Step2Laboral from "../components/steps/Step2Laboral"
import Step3Familiares from "../components/steps/Step3Familiares"
import Step4Formacion from "../components/steps/Step4Formacion"
import Step5Experiencia from "../components/steps/Step5Experiencia"
import Step6Otros from "../components/steps/Step6Otros"
import Step7Revision from "../components/steps/Step7Revision"
import ModalConfirmacion from "../components/ui/ModalConfirmacion"
import {
  validarPaso1, validarPaso2, validarPaso3,
  validarPaso4, validarPaso5, validarPaso6,
} from "../utils/validators"
import { mostrarErroresPaso } from "../components/ui/ToastErrores"

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
    actualizarCampo, tocados, personalId,
    getCamposObligatoriosPaso,
  } = useFicha()

  // Ref que persiste la URL de preview entre navegaciones sin causar re-renders
  const fotoPreviewRef = useRef(null)

  // Ref para subir al inicio al cambiar de paso
  const { mostrar: mostrarBienvenida, cerrar: cerrarBienvenida } =
    useModalBienvenida()

  // Progreso = pasos completados / total de pasos
  // En paso 1 = 0%, paso 2 = 14%, ..., paso 7 = 86%
  const progresoPaso = useMemo(() => {
    const totalPasos = 7
    const pasosCompletados = getCamposObligatoriosPaso(pasoActual).length

    return Math.round(((pasosCompletados + 1) / totalPasos) * 100)
  }, [getCamposObligatoriosPaso, pasoActual])

  const topRef = useRef(null)
  const estadoGuardado = !!localStorage.getItem("unamba_ficha_2025")

  const scrollTop = () =>
    topRef.current?.scrollIntoView({ behavior: "smooth" })

  const [modalVisible, setModalVisible] = useState(false)

  // ── Navegación con validación por paso ────────────────────
  const handleSiguiente = () => {
    let errores = []

    switch (pasoActual) {
      case 1:
        errores = validarPaso1(ficha.personal)
        if (errores.length > 0) {
          mostrarErroresPaso(errores, "Datos Personales")
          scrollTop()
          return
        }
        break

      case 2:
        errores = validarPaso2(ficha.datos_laborales)
        if (errores.length > 0) {
          mostrarErroresPaso(errores, "Datos Laborales")
          scrollTop()
          return
        }
        break

      case 3:
        errores = validarPaso3(ficha.familiares)
        if (errores.length > 0) {
          mostrarErroresPaso(errores, "Familiares")
          scrollTop()
          return
        }
        break

      case 4:
        errores = validarPaso4(
          ficha.formacion_academica,
          ficha.otros_estudios,
        )
        if (errores.length > 0) {
          mostrarErroresPaso(errores, "Formación Académica")
          scrollTop()
          return
        }
        break

      case 5:
        errores = validarPaso5(
          ficha.experiencia_laboral,
          ficha.experiencia_docente,
        )
        if (errores.length > 0) {
          mostrarErroresPaso(errores, "Experiencia Laboral")
          scrollTop()
          return
        }
        break

      case 6:
        errores = validarPaso6(
          ficha.otras_instituciones,
          ficha.reconocimientos,
        )
        if (errores.length > 0) {
          mostrarErroresPaso(errores, "Otros e Instituciones")
          scrollTop()
          return
        }
        break

      default:
        break
    }

    siguientePaso()
    scrollTop()
  }
  const handleAnterior = () => { pasoAnterior(); scrollTop() }
  // ── Ir a un paso solo si ya fue completado ────────────────
  const handleIrAlPaso = (paso) => {
    // Solo permitir ir hacia atrás o a pasos ya visitados
    if (paso < pasoActual) {
      irAlPaso(paso)
      scrollTop()
    }
  }

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
      console.log("PAYLOAD ENVIADO:", JSON.stringify(payload, null, 2))
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
          tocados={tocados}
          fotoPreviewPersistida={fotoPreviewRef.current}
          onFotoCargada={(url) => { fotoPreviewRef.current = url }}
        />
      )
      case 2: return (
        <Step2Laboral
          datos={ficha.datos_laborales}
          onChange={actualizarCampo}
          tocados={tocados}
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

      {/* ── Modal de bienvenida ───────────────────────────── */}
      {mostrarBienvenida && (
        <ModalBienvenida onComenzar={cerrarBienvenida} />
      )}

      {/* ── Barra de progreso fija (reemplaza el header) ──── */}
      <BarraProgreso
        pasoActual={pasoActual}
        onIrAlPaso={handleIrAlPaso}
        progresoPaso={progresoPaso}
      />

      {/* ── Contenido principal ───────────────────────────── */}
      {/* pt-32 para compensar la altura de la barra fija */}
      <main className="max-w-3xl mx-auto px-4 pt-32 pb-6 space-y-5">

        <div ref={topRef} />

        {/* Aviso de borrador guardado */}
        {estadoGuardado && pasoActual > 1 && (
          <div className="flex items-center justify-between px-4 py-2.5
                          bg-blue-50 border border-blue-200 rounded-form
                          text-xs">
            <div className="flex items-center gap-2 text-blue-700">
              <span>💾</span>
              <span>Borrador guardado automáticamente</span>
            </div>
            <button
              type="button"
              onClick={resetFicha}
              className="text-blue-500 hover:text-blue-700 font-medium
                         underline underline-offset-2 transition-colors"
            >
              Limpiar y empezar de nuevo
            </button>
          </div>
        )}

        {/* Título del paso actual */}
        <div className="flex items-center gap-2 px-1">
          <span className="text-xs font-semibold text-primary-600
                           uppercase tracking-widest">
            Paso {pasoActual}
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-sm font-semibold text-slate-700">
            {PASOS_FICHA[pasoActual - 1].label}
          </span>
        </div>

        {/* Formulario del paso actual */}
        {renderPaso()}

        {/* Botones de navegación fijos */}
        <NavButtons
          pasoActual={pasoActual}
          totalPasos={PASOS_FICHA.length}
          onAnterior={handleAnterior}
          onSiguiente={handleSiguiente}
          onEnviar={handleEnviar}
          cargando={cargando}
        />

      </main>

      {/* Modal de confirmación */}
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