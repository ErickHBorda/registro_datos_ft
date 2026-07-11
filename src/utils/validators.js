import { z } from "zod"

const dniRegex    = /^\d{8}$/
const rucRegex    = /^\d{11}$/
const celularRegex = /^\d{9}$/
const emailRegex  = /^[^@]+@[^@]+\.[^@]+$/

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
  cuenta_numero:      z.string().optional().or(z.literal("")),
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
  })).max(3, "Máximo 3 idiomas").default([]),
  ofimatica: z.array(z.object({
    programa: z.string().min(1, "Ingrese el programa"),
    nivel:    z.string().min(1, "Seleccione el nivel"),
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