import { z } from "zod"

const dniRegex    = /^\d{8}$/
const rucRegex    = /^\d{11}$/
const celularRegex = /^\d{9}$/
const emailRegex        = /^[^@]+@[^@]+\.[^@]+$/
const emailEduPeRegex   = /edu\.pe$/i

// ── Sección 1: Datos Personales ────────────────────────────
export const personalSchema = z.object({
  apellido_paterno:   z.string().min(2, "Ingrese el apellido paterno"),
  apellido_materno:   z.string().min(2, "Ingrese el apellido materno"),
  nombres:            z.string().min(2, "Ingrese los nombres"),
  dni:                z.string().regex(dniRegex, "El DNI debe tener 8 dígitos"),
  libreta_militar:    z.string().optional().or(z.literal("")),
  sexo:               z.string().min(1, "Seleccione el sexo"),
  fecha_nacimiento:   z.string().min(1, "Ingrese la fecha de nacimiento"),
  estado_civil:       z.string().min(1, "Seleccione el estado civil"),
  nac_pais:           z.string().default("Perú"),
  nac_departamento:   z.string().min(1, "Ingrese el departamento"),
  nac_provincia:      z.string().min(1, "Ingrese la provincia"),
  nac_distrito:       z.string().min(1, "Ingrese el distrito"),
  telefono_fijo:      z.string().optional().or(z.literal("")),
  celular:            z.string().regex(celularRegex, "El celular debe tener 9 dígitos"),
  email_personal_1:   z.string().regex(emailRegex, "Ingrese un email válido"),
  email_personal_2:   z.string().optional().or(z.literal("")),
  dom_tipo_via:       z.string().optional().or(z.literal("")),
  dom_direccion:      z.string().min(5, "Ingrese la dirección"),
  dom_referencia:     z.string().optional().or(z.literal("")),
  tipo_vivienda:      z.string().optional().or(z.literal("")),
  ruc:                z.string().regex(rucRegex, "El RUC debe tener 11 dígitos")
                        .optional().or(z.literal("")),
  licencia_conducir:  z.string().optional().or(z.literal("")),
  afiliacion_essalud: z.string().optional().or(z.literal("")),
  grupo_sanguineo:    z.string().optional().or(z.literal("")),
  donador_organos:    z.boolean().default(false),
  banco:              z.string().optional().or(z.literal("")),
  cuenta_numero:      z.string().regex(/^\d{6,20}$/, "Solo dígitos, entre 6 y 20")
                        .optional().or(z.literal("")),
  cuenta_cci:         z.string().optional().or(z.literal("")),
  denominacion_prof:  z.string().optional().or(z.literal("")),
  abreviatura_prof:   z.string().optional().or(z.literal("")),
  colegio_prof_nombre: z.string().optional().or(z.literal("")),
  colegio_prof_numero: z.string().optional().or(z.literal("")),
  colegio_prof_fecha:  z.string().optional().or(z.literal("")),
  sistema_pension:    z.string().optional().or(z.literal("")),
  afp_nombre:         z.string().optional().or(z.literal("")),
  tiene_discapacidad: z.boolean().default(false),
  conadis_registro:   z.string().optional().or(z.literal("")),
  realizo_serv_militar: z.boolean().default(false),
  serv_militar_rama:    z.string().optional().or(z.literal("")),
  serv_militar_cargo:   z.string().optional().or(z.literal("")),
  serv_militar_fecha_inicio: z.string().optional().or(z.literal("")),
  serv_militar_fecha_fin:    z.string().optional().or(z.literal("")),
  idiomas_nativos: z.array(z.object({
    idioma: z.string().min(1, "Ingrese el idioma"),
    nivel:  z.string().min(1, "Seleccione el nivel"),
    documento_acredita: z.string().optional().or(z.literal("")),
  })).max(3, "Máximo 3 idiomas").default([]),
  ofimatica: z.array(z.object({
    programa: z.string().min(1, "Ingrese el programa"),
    nivel: z.string().min(1, "Seleccione el nivel"),
    documento_acredita: z.string().optional().or(z.literal("")),
  })).max(3, "Máximo 3 programas").default([]),
})

// ── Sección 2: Datos Laborales ─────────────────────────────
export const laboralSchema = z.object({
  dependencia:         z.string().min(2, "Ingrese la dependencia"),
  cargo:               z.string().min(2, "Ingrese el cargo"),
  fecha_ingreso:       z.string().min(1, "Ingrese la fecha de ingreso"),
  email_institucional: z.string()
    .regex(/@unamba\.edu\.pe$/, "Debe terminar en @unamba.edu.pe"),
  condicion:           z.string().min(1, "Seleccione la condición"),
  tipo_personal:       z.string().min(1, "Seleccione el tipo"),
  regimen_276:         z.string().optional().or(z.literal("")),
  regimen_1057:        z.string().optional().or(z.literal("")),
  regimen_otros:       z.string().optional().or(z.literal("")),
  nivel_remunerativo:  z.string().optional().or(z.literal("")),
  dedicacion:          z.string().optional().or(z.literal("")),
  horas_semanales:     z.number().optional().nullable(),
})

// ── Sección 3: Familiar individual ────────────────────────
export const familiarSchema = z.object({
  apellido_paterno:    z.string().min(2, "Ingrese el apellido paterno"),
  apellido_materno:    z.string().min(2, "Ingrese el apellido materno"),
  nombres:             z.string().min(2, "Ingrese los nombres"),
  parentesco:          z.string().min(1, "Seleccione el parentesco"),
  dni:                 z.string().regex(dniRegex, "DNI debe tener 8 dígitos")
                         .optional().or(z.literal("")),
  fecha_nacimiento:    z.string().optional().or(z.literal("")),
  sexo:                z.string().optional().or(z.literal("")),
  nac_pais:            z.string().default("Perú"),
  nac_departamento:    z.string().optional().or(z.literal("")),
  nac_provincia:       z.string().optional().or(z.literal("")),
  nac_distrito:        z.string().optional().or(z.literal("")),
  nac_anexo:           z.string().optional().or(z.literal("")),
  vive_con_trabajador: z.boolean().default(false),
})

// ── Validadores por paso ───────────────────────────────────
export function validarPaso1(personal) {
  const errores = []

  if (!personal.apellido_paterno?.trim())
    errores.push("Apellido paterno es obligatorio")
  if (!personal.apellido_materno?.trim())
    errores.push("Apellido materno es obligatorio")
  if (!personal.nombres?.trim())
    errores.push("Nombres son obligatorios")
  if (!personal.dni || !/^\d{8}$/.test(personal.dni))
    errores.push("DNI debe tener exactamente 8 dígitos")
  if (!personal.sexo)
    errores.push("Sexo es obligatorio")
  if (!personal.fecha_nacimiento)
    errores.push("Fecha de nacimiento es obligatoria")
  if (!personal.estado_civil)
    errores.push("Estado civil es obligatorio")
  if (!personal.nac_departamento?.trim())
    errores.push("Departamento de nacimiento es obligatorio")
  if (!personal.nac_provincia?.trim())
    errores.push("Provincia de nacimiento es obligatoria")
  if (!personal.nac_distrito?.trim())
    errores.push("Distrito de nacimiento es obligatorio")
  if (!personal.celular || !/^\d{9}$/.test(personal.celular))
    errores.push("Celular debe tener exactamente 9 dígitos")
  if (!personal.email_personal_1 ||
      !/^[^@]+@[^@]+\.[^@]+$/.test(personal.email_personal_1))
    errores.push("Email personal inválido")
  if (personal.email_personal_1 &&
      /edu\.pe$/i.test(personal.email_personal_1))
    errores.push("Email 1: use su correo personal, no el institucional")
  if (personal.email_personal_2 &&
      /edu\.pe$/i.test(personal.email_personal_2))
    errores.push("Email 2: use su correo personal, no el institucional")
  if (!personal.dom_direccion?.trim())
    errores.push("Dirección de domicilio es obligatoria")

  // Foto obligatoria
  if (!personal._foto_archivo && !personal.foto_url)
    errores.push("La foto es obligatoria")

  // Cuenta bancaria obligatoria
  if (!personal.banco?.trim())
    errores.push("Banco es obligatorio")
  if (!personal.cuenta_numero?.trim())
    errores.push("Número de cuenta es obligatorio")
  if (personal.cuenta_numero &&
      !/^\d{6,20}$/.test(personal.cuenta_numero))
    errores.push("N° de cuenta: solo dígitos, entre 6 y 20 caracteres")
  if (!personal.cuenta_cci || !/^\d{20}$/.test(personal.cuenta_cci))
    errores.push("CCI debe tener exactamente 20 dígitos")

  // Condicionales
  if (personal.tiene_discapacidad && !personal.conadis_registro?.trim())
    errores.push("N° de registro CONADIS es obligatorio")

  if (personal.realizo_serv_militar) {
    if (!personal.serv_militar_rama)
      errores.push("Rama del servicio militar es obligatoria")
    if (!personal.serv_militar_cargo?.trim())
      errores.push("Cargo en servicio militar es obligatorio")
    if (!personal.serv_militar_fecha_inicio)
      errores.push("Fecha de inicio del servicio militar es obligatoria")
  }

  if (personal.tipo_vivienda === "Otro" && !personal.tipo_vivienda_otro?.trim())
    errores.push("Especifique el tipo de vivienda")

  if (personal.sistema_pension === "AFP" && !personal.afp_nombre)
    errores.push("Seleccione la AFP")

  // Idiomas y ofimática — si se agregaron deben estar completos
  personal.idiomas_nativos?.forEach((item, i) => {
    if (!item.idioma?.trim())
      errores.push(`Idioma ${i + 1}: ingrese el nombre del idioma`)
    if (!item.nivel)
      errores.push(`Idioma ${i + 1}: seleccione el nivel`)
  })

  personal.ofimatica?.forEach((item, i) => {
    if (!item.programa?.trim())
      errores.push(`Ofimática ${i + 1}: ingrese el programa`)
    if (!item.nivel)
      errores.push(`Ofimática ${i + 1}: seleccione el nivel`)
  })

  return errores
}

export function validarPaso2(laboral) {
  const errores = []

  if (!laboral.dependencia?.trim())
    errores.push("Dependencia es obligatoria")
  if (!laboral.cargo?.trim())
    errores.push("Cargo es obligatorio")
  if (!laboral.fecha_ingreso)
    errores.push("Fecha de ingreso es obligatoria")
  if (!laboral.email_institucional ||
      !laboral.email_institucional.endsWith("@unamba.edu.pe"))
    errores.push("Email institucional debe terminar en @unamba.edu.pe")
  if (!laboral.condicion)
    errores.push("Condición laboral es obligatoria")
  if (!laboral.tipo_personal)
    errores.push("Tipo de personal es obligatorio")

  // Validar sub-régimen si se seleccionó categoría
  if (laboral.categoria_regimen) {
    const tieneSubRegimen =
      laboral.regimen_dl276     ||
      laboral.regimen_cas       ||
      laboral.regimen_ordinario ||
      laboral.regimen_contratado
    if (!tieneSubRegimen)
      errores.push("Seleccione una categoría dentro del régimen laboral")
  }

  // Nivel remunerativo obligatorio para DL 276
  if (laboral.categoria_regimen === "DL 276" && !laboral.nivel_remunerativo)
    errores.push("Nivel remunerativo es obligatorio para el régimen DL 276")

  // Dedicación obligatoria para docentes
  if (laboral.tipo_personal === "Docente" && !laboral.dedicacion)
    errores.push("Dedicación es obligatoria para personal docente")

  // Horas si dedicación es Por Horas
  if (laboral.dedicacion === "Horas" && !laboral.horas_semanales)
    errores.push("Ingrese las horas semanales")

  // RENACYT
  if (laboral.es_renacyt) {
    if (!laboral.renacyt_codigo?.trim())
      errores.push("Código RENACYT es obligatorio")
    if (!laboral.renacyt_nivel)
      errores.push("Nivel RENACYT es obligatorio")
  }

  return errores
}

export function validarPaso3(familiares) {
  const errores = []

  familiares.forEach((f, i) => {
    const n = i + 1
    if (!f.apellido_paterno?.trim())
      errores.push(`Familiar ${n}: apellido paterno es obligatorio`)
    if (!f.apellido_materno?.trim())
      errores.push(`Familiar ${n}: apellido materno es obligatorio`)
    if (!f.nombres?.trim())
      errores.push(`Familiar ${n}: nombres son obligatorios`)
    if (!f.parentesco)
      errores.push(`Familiar ${n}: parentesco es obligatorio`)
    if (f.dni && !/^\d{8}$/.test(f.dni))
      errores.push(`Familiar ${n}: DNI debe tener 8 dígitos`)
  })

  return errores
}

export function validarPaso4(formacion, otrosEstudios) {
  const errores = []

  formacion.forEach((f, i) => {
    if (!f.estado)
      errores.push(`Formación ${i + 1} (${f.nivel}): estado es obligatorio`)
    const esBasica = ["Primaria", "Secundaria"].includes(f.nivel)
    if (!esBasica && !f.centro_estudios?.trim())
      errores.push(`Formación ${i + 1} (${f.nivel}): centro de estudios es obligatorio`)
  })

  otrosEstudios.forEach((e, i) => {
    if (!e.nombre_curso?.trim())
      errores.push(`${e.tipo} ${i + 1}: nombre del curso es obligatorio`)
    if (!e.centro_estudios?.trim())
      errores.push(`${e.tipo} ${i + 1}: centro de estudios es obligatorio`)
  })

  return errores
}

export function validarPaso5(expLaboral, expDocente) {
  const errores = []

  expLaboral.forEach((e, i) => {
    if (!e.nombre_entidad?.trim())
      errores.push(`Experiencia laboral ${i + 1}: nombre de entidad es obligatorio`)
    if (!e.cargo?.trim())
      errores.push(`Experiencia laboral ${i + 1}: cargo es obligatorio`)
    if (!e.fecha_inicio)
      errores.push(`Experiencia laboral ${i + 1}: fecha de inicio es obligatoria`)
  })

  expDocente.forEach((e, i) => {
    if (!e.nombre_entidad?.trim())
      errores.push(`Experiencia docente ${i + 1}: nombre de entidad es obligatorio`)
    if (!e.fecha_inicio)
      errores.push(`Experiencia docente ${i + 1}: fecha de inicio es obligatoria`)
  })

  return errores
}

export function validarPaso6(otrasInst, reconocimientos) {
  const errores = []

  if (otrasInst.labora_otra_inst) {
    if (!otrasInst.nombre_entidad?.trim())
      errores.push("Ingrese el nombre de la otra institución")
    if (!otrasInst.tipo_personal)
      errores.push("Seleccione el tipo de personal en la otra institución")
  }

  reconocimientos.forEach((r, i) => {
    if (!r.nombre_entidad?.trim())
      errores.push(`Reconocimiento ${i + 1}: nombre de entidad es obligatorio`)
    if (!r.tipo_reconocimiento?.trim())
      errores.push(`Reconocimiento ${i + 1}: tipo de reconocimiento es obligatorio`)
  })

  return errores
}