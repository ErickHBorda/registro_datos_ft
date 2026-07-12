import { useState, useCallback } from "react"

const ESTADO_INICIAL = {
  personal: {
    apellido_paterno:   "",
    apellido_materno:   "",
    nombres:            "",
    dni:                "",
    libreta_militar:    "",
    sexo:               "",
    fecha_nacimiento:   "",
    estado_civil:       "",
    nac_pais:           "Perú",
    nac_departamento:   "",
    nac_provincia:      "",
    nac_distrito:       "",
    telefono_fijo:      "",
    celular:            "",
    email_personal_1:   "",
    email_personal_2:   "",
    dom_tipo_via:       "",
    dom_direccion:      "",
    dom_referencia:     "",
    tipo_vivienda:      "",
    ruc:                "",
    licencia_conducir:  "",
    afiliacion_essalud: "",
    grupo_sanguineo:    "",
    donador_organos:    false,
    banco:              "",
    cuenta_numero:      "",
    cuenta_cci:         "",
    denominacion_prof:  "",
    abreviatura_prof:   "",
    colegio_prof_nombre: "",
    colegio_prof_numero: "",
    colegio_prof_fecha:  "",
    sistema_pension:    "",
    afp_nombre:         "",
    tiene_discapacidad: false,
    conadis_registro:   "",
    realizo_serv_militar:      false,
    serv_militar_rama:         "",
    serv_militar_cargo:        "",
    serv_militar_fecha_inicio: "",
    serv_militar_fecha_fin:    "",
    idiomas_nativos: [],
    ofimatica:       [],
  },
  datos_laborales: {
    dependencia:         "",
    cargo:               "",
    fecha_ingreso:       "",
    email_institucional: "",
    condicion:           "",
    tipo_personal:       "",
    regimen_276:         "",
    regimen_1057:        "",
    regimen_otros:       "",
    nivel_remunerativo:  "",
    dedicacion:          "",
    horas_semanales:     null,
  },
  familiares:          [],
  formacion_academica: [],
  otros_estudios:      [],
  experiencia_laboral: [],
  experiencia_docente: [],
  otras_instituciones: {
    labora_otra_inst: false,
    tipo_personal:    "",
    nombre_entidad:   "",
    dia_lunes:        false,
    dia_martes:       false,
    dia_miercoles:    false,
    dia_jueves:       false,
    dia_viernes:      false,
    horas_diarias:    null,
  },
  reconocimientos: [],
}

export function useFicha() {
  const [ficha,       setFicha]       = useState(ESTADO_INICIAL)
  const [pasoActual,  setPasoActual]  = useState(1)
  const [cargando,    setCargando]    = useState(false)
  const [personalId,  setPersonalId]  = useState(null)
  const [completado,  setCompletado]  = useState(false)

  // ── Actualizar una sección completa ───────────────────────
  const actualizarSeccion = useCallback((seccion, datos) => {
    setFicha((prev) => ({ ...prev, [seccion]: datos }))
  }, [])

  // ── Actualizar un campo individual de una sección ─────────
  const actualizarCampo = useCallback((seccion, campo, valor) => {
    console.log("actualizarCampo:", seccion, campo, valor)
    setFicha((prev) => ({
      ...prev,
      [seccion]: { ...prev[seccion], [campo]: valor },
    }))
  }, [])

  // ── Navegación entre pasos ────────────────────────────────
  const irAlPaso      = useCallback((paso) => setPasoActual(paso), [])
  const siguientePaso = useCallback(() => setPasoActual((p) => Math.min(p + 1, 7)), [])
  const pasoAnterior  = useCallback(() => setPasoActual((p) => Math.max(p - 1, 1)), [])

  // ── Preparar payload limpio para el backend ───────────────
  const prepararPayload = useCallback(() => {
    const limpiar = (valor) => valor === "" ? null : valor

    const personal = { ...ficha.personal }

    // Limpiar campos opcionales vacíos
    const camposOpcionalesPersonal = [
      "libreta_militar", "telefono_fijo", "email_personal_2",
      "dom_tipo_via", "dom_referencia", "tipo_vivienda",
      "ruc", "licencia_conducir", "afiliacion_essalud",
      "grupo_sanguineo", "banco", "cuenta_numero", "cuenta_cci",
      "denominacion_prof", "abreviatura_prof", "colegio_prof_nombre",
      "colegio_prof_numero", "colegio_prof_fecha", "sistema_pension",
      "afp_nombre", "conadis_registro", "serv_militar_rama",
      "serv_militar_cargo", "serv_militar_fecha_inicio",
      "serv_militar_fecha_fin",
    ]
    camposOpcionalesPersonal.forEach((campo) => {
      personal[campo] = limpiar(personal[campo])
    })

    const laboral = { ...ficha.datos_laborales }
    const camposOpcionalesLaboral = [
      "regimen_276", "regimen_1057", "regimen_otros",
      "nivel_remunerativo", "dedicacion",
    ]
    camposOpcionalesLaboral.forEach((campo) => {
      laboral[campo] = limpiar(laboral[campo])
    })

    const otraInst = { ...ficha.otras_instituciones }
    if (!otraInst.labora_otra_inst) {
      otraInst.tipo_personal  = null
      otraInst.nombre_entidad = null
      otraInst.horas_diarias  = null
    } else {
      otraInst.tipo_personal = limpiar(otraInst.tipo_personal)
      otraInst.horas_diarias = otraInst.horas_diarias || null
    }

    return {
      personal,
      datos_laborales:     laboral,
      familiares:          ficha.familiares,
      formacion_academica: ficha.formacion_academica,
      otros_estudios:      ficha.otros_estudios,
      experiencia_laboral: ficha.experiencia_laboral,
      experiencia_docente: ficha.experiencia_docente,
      otras_instituciones: otraInst,
      reconocimientos:     ficha.reconocimientos,
    }
  }, [ficha])

  // ── Reset completo ────────────────────────────────────────
  const resetFicha = useCallback(() => {
    setFicha(ESTADO_INICIAL)
    setPasoActual(1)
    setPersonalId(null)
    setCompletado(false)
  }, [])

  return {
    ficha,
    pasoActual,
    cargando,
    personalId,
    completado,
    setCargando,
    setPersonalId,
    setCompletado,
    actualizarSeccion,
    actualizarCampo,
    irAlPaso,
    siguientePaso,
    pasoAnterior,
    prepararPayload,
    resetFicha,
  }
}
export { ESTADO_INICIAL }