import { useState } from "react"
import {
  User, Phone, Home, CreditCard, Briefcase,
  Shield, Globe, Monitor, Plus, Trash2, Camera,
  AlertCircle,
} from "lucide-react"
import { Input, Select, Checkbox, SectionTitle, FieldGrid } from "../ui/FormField"
import TarjetaBancaria from "../ui/TarjetaBancaria"
import { useValidacion } from "../../hooks/useValidacion"
import {
  SEXO, ESTADO_CIVIL, TIPO_VIVIENDA, GRUPO_SANGUINEO,
  SISTEMA_PENSION, AFP, RAMA_MILITAR, NIVEL_IDIOMA,
} from "../../utils/constants"

export default function Step1Personal({ datos, onChange }) {
  const [fotoPreview, setFotoPreview] = useState(null)
  const [mostrarTarjeta, setMostrarTarjeta] = useState(false)

  const set = (campo, valor) => onChange("personal", campo, valor)

  // ── Validación en tiempo real ──────────────────────────
  const { props: vProps } = useValidacion({
    apellido_paterno: {
      requerido: true, mensajeRequerido: "El apellido paterno es obligatorio",
      minLength: 2,
    },
    apellido_materno: {
      requerido: true, mensajeRequerido: "El apellido materno es obligatorio",
      minLength: 2,
    },
    nombres: {
      requerido: true, mensajeRequerido: "Los nombres son obligatorios",
      minLength: 2,
    },
    dni: {
      requerido: true, mensajeRequerido: "El DNI es obligatorio",
      patron: /^\d{8}$/, mensajePatron: "Debe tener exactamente 8 dígitos",
    },
    sexo: {
      requerido: true, mensajeRequerido: "Seleccione el sexo",
    },
    fecha_nacimiento: {
      requerido: true, mensajeRequerido: "La fecha de nacimiento es obligatoria",
    },
    estado_civil: {
      requerido: true, mensajeRequerido: "Seleccione el estado civil",
    },
    celular: {
      requerido: true, mensajeRequerido: "El celular es obligatorio",
      patron: /^\d{9}$/, mensajePatron: "Debe tener 9 dígitos",
    },
    email_personal_1: {
      requerido: true, mensajeRequerido: "El email es obligatorio",
      patron: /^[^@]+@[^@]+\.[^@]+$/, mensajePatron: "Email inválido",
    },
    dom_direccion: {
      requerido: true, mensajeRequerido: "La dirección es obligatoria",
      minLength: 5,
    },
    nac_departamento: {
      requerido: true, mensajeRequerido: "El departamento es obligatorio",
    },
    nac_provincia: {
      requerido: true, mensajeRequerido: "La provincia es obligatoria",
    },
    nac_distrito: {
      requerido: true, mensajeRequerido: "El distrito es obligatorio",
    },
    banco: {
      requerido: true, mensajeRequerido: "El banco es obligatorio",
    },
    cuenta_numero: {
      requerido: true, mensajeRequerido: "El número de cuenta es obligatorio",
    },
    cuenta_cci: {
      requerido: true, mensajeRequerido: "El CCI es obligatorio",
      patron: /^\d{20}$/, mensajePatron: "El CCI debe tener 20 dígitos",
    },
    // Condicionales
    conadis_registro: {
      requerido: datos.tiene_discapacidad,
      mensajeRequerido: "El N° CONADIS es obligatorio si tiene discapacidad",
    },
    serv_militar_rama: {
      requerido: datos.realizo_serv_militar,
      mensajeRequerido: "Seleccione la rama militar",
    },
    serv_militar_cargo: {
      requerido: datos.realizo_serv_militar,
      mensajeRequerido: "Ingrese el cargo militar",
    },
    serv_militar_fecha_inicio: {
      requerido: datos.realizo_serv_militar,
      mensajeRequerido: "La fecha de inicio es obligatoria",
    },
    ruc: {
      patron: /^\d{11}$/, mensajePatron: "El RUC debe tener 11 dígitos",
    },
  })

  // ── Helper combinado: actualiza estado + valida ────────
  const campo = (nombre) => ({
    value: datos[nombre] ?? "",
    ...vProps(nombre, datos[nombre]),
    onChange: (e) => {
      const val = e.target.type === "checkbox" ? e.target.checked : e.target.value
      vProps(nombre, datos[nombre]).onChange(e)
      set(nombre, val)
    },
  })

  // ── Foto ───────────────────────────────────────────────
  const handleFoto = (e) => {
    const archivo = e.target.files[0]
    if (!archivo) return
    setFotoPreview(URL.createObjectURL(archivo))
    set("_foto_archivo", archivo)
  }

  // ── Idiomas ────────────────────────────────────────────
  const agregarIdioma = () => {
    if (datos.idiomas_nativos.length >= 3) return
    onChange("personal", "idiomas_nativos", [
      ...datos.idiomas_nativos, { idioma: "", nivel: "" },
    ])
  }
  const actualizarIdioma = (i, subcampo, valor) => {
    const lista = [...datos.idiomas_nativos]
    lista[i] = { ...lista[i], [subcampo]: valor }
    onChange("personal", "idiomas_nativos", lista)
  }
  const eliminarIdioma = (i) =>
    onChange("personal", "idiomas_nativos",
      datos.idiomas_nativos.filter((_, idx) => idx !== i))

  // ── Ofimática ──────────────────────────────────────────
  const agregarOfimatica = () => {
    if (datos.ofimatica.length >= 3) return
    onChange("personal", "ofimatica", [
      ...datos.ofimatica, { programa: "", nivel: "" },
    ])
  }
  const actualizarOfimatica = (i, subcampo, valor) => {
    const lista = [...datos.ofimatica]
    lista[i] = { ...lista[i], [subcampo]: valor }
    onChange("personal", "ofimatica", lista)
  }
  const eliminarOfimatica = (i) =>
    onChange("personal", "ofimatica",
      datos.ofimatica.filter((_, idx) => idx !== i))

  // ── Validación de idiomas y ofimática ──────────────────
  const idiomaIncompleto = (item) => !item.idioma || !item.nivel
  const ofimaticaIncompleta = (item) => !item.programa || !item.nivel

  return (
    <div className="space-y-5">

      {/* ══ 1. FOTO Y NOMBRES ══════════════════════════════ */}
      <div className="form-card">
        <SectionTitle icono={User} titulo="Identificación Personal" />

        <div className="flex items-start gap-5 mb-5">
          {/* Foto */}
          <div className="shrink-0">
            <div className="w-24 h-28 rounded-lg border-2 border-dashed
                            border-slate-300 bg-slate-50 overflow-hidden
                            flex items-center justify-center relative
                            group cursor-pointer hover:border-primary-400
                            transition-colors">
              {fotoPreview
                ? <img src={fotoPreview} alt="Foto"
                  className="w-full h-full object-cover" />
                : <div className="text-center">
                  <Camera size={22} className="text-slate-300 mx-auto mb-1" />
                  <span className="text-xs text-slate-400">Foto</span>
                </div>
              }
              <input type="file" accept="image/jpeg,image/png,image/webp"
                onChange={handleFoto}
                className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            <p className="text-xs text-slate-400 mt-1 text-center">
              JPG/PNG<br />Máx. 5MB
            </p>
          </div>

          <div className="flex-1 space-y-4">
            <FieldGrid cols={2}>
              <Input label="Apellido Paterno" required
                placeholder="Ej: Quispe" {...campo("apellido_paterno")} />
              <Input label="Apellido Materno" required
                placeholder="Ej: Mamani" {...campo("apellido_materno")} />
            </FieldGrid>
            <Input label="Nombres Completos" required
              placeholder="Ej: Juan Carlos" {...campo("nombres")} />
          </div>
        </div>

        <FieldGrid cols={3}>
          <Input label="DNI" required maxLength={8}
            placeholder="12345678"
            {...campo("dni")}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "")
              vProps("dni", datos.dni).onChange({
                ...e, target: { ...e.target, value: val }
              })
              set("dni", val)
            }}
          />
          <Input label="Libreta Militar"
            value={datos.libreta_militar}
            onChange={(e) => set("libreta_militar", e.target.value)}
            placeholder="Opcional" />
          <Select label="Sexo" required opciones={SEXO}
            {...campo("sexo")} />
        </FieldGrid>

        <FieldGrid cols={2} className="mt-4">
          <Input label="Fecha de Nacimiento" required type="date"
            {...campo("fecha_nacimiento")} />
          <Select label="Estado Civil" required opciones={ESTADO_CIVIL}
            {...campo("estado_civil")} />
        </FieldGrid>
      </div>

      {/* ══ 2. LUGAR DE NACIMIENTO ═════════════════════════ */}
      <div className="form-card">
        <SectionTitle icono={Globe} titulo="Lugar de Nacimiento" />
        <FieldGrid cols={2}>
          <Input label="País" required
            value={datos.nac_pais}
            onChange={(e) => set("nac_pais", e.target.value)} />
          <Input label="Departamento" required
            placeholder="Ej: Apurímac" {...campo("nac_departamento")} />
          <Input label="Provincia" required
            placeholder="Ej: Abancay" {...campo("nac_provincia")} />
          <Input label="Distrito" required
            placeholder="Ej: Abancay" {...campo("nac_distrito")} />
        </FieldGrid>
      </div>

      {/* ══ 3. CONTACTO ════════════════════════════════════ */}
      <div className="form-card">
        <SectionTitle icono={Phone} titulo="Medios de Contacto" />
        <FieldGrid cols={2}>
          <Input label="Teléfono Fijo"
            value={datos.telefono_fijo}
            onChange={(e) => set("telefono_fijo",
              e.target.value.replace(/\D/g, ""))}
            placeholder="Ej: 083321456" maxLength={9} />
          <Input label="Celular" required maxLength={9}
            placeholder="Ej: 987654321"
            {...campo("celular")}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "")
              vProps("celular", datos.celular).onChange({
                ...e, target: { ...e.target, value: val }
              })
              set("celular", val)
            }}
          />
          <Input label="Email Personal 1" required type="email"
            placeholder="correo@gmail.com" {...campo("email_personal_1")} />
          <Input label="Email Personal 2" type="email"
            value={datos.email_personal_2}
            onChange={(e) => set("email_personal_2", e.target.value)}
            placeholder="Opcional" />
        </FieldGrid>
      </div>

      {/* ══ 4. DOMICILIO ═══════════════════════════════════ */}
      <div className="form-card">
        <SectionTitle icono={Home} titulo="Domicilio Actual" />
        <FieldGrid cols={3}>
          <Select label="Tipo de Vía" opciones={[
            { value: "Jr", label: "Jr." },
            { value: "Av", label: "Av." },
            { value: "Psje", label: "Psje." },
            { value: "Otro", label: "Otro" },
          ]}
            value={datos.dom_tipo_via}
            onChange={(e) => set("dom_tipo_via", e.target.value)} />
          <div className="sm:col-span-2">
            <Input label="Dirección" required
              placeholder="Ej: Av. Arenas 123" {...campo("dom_direccion")} />
          </div>
        </FieldGrid>
        <FieldGrid cols={2} className="mt-4">
          <Input label="Referencia"
            value={datos.dom_referencia}
            onChange={(e) => set("dom_referencia", e.target.value)}
            placeholder="Ej: Frente al parque" />
          <Select label="Tipo de Vivienda" opciones={TIPO_VIVIENDA}
            value={datos.tipo_vivienda}
            onChange={(e) => set("tipo_vivienda", e.target.value)} />
        </FieldGrid>
      </div>

      {/* ══ 5. DATOS COMPLEMENTARIOS ═══════════════════════ */}
      <div className="form-card">
        <SectionTitle icono={CreditCard} titulo="Datos Complementarios" />
        <FieldGrid cols={3}>
          <Input label="RUC" maxLength={11}
            placeholder="20123456789"
            {...campo("ruc")}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "")
              vProps("ruc", datos.ruc).onChange({
                ...e, target: { ...e.target, value: val }
              })
              set("ruc", val)
            }}
          />
          <Input label="Licencia de Conducir"
            value={datos.licencia_conducir}
            onChange={(e) => set("licencia_conducir", e.target.value)}
            placeholder="Ej: Q12345678" />
          <Input label="Afil. ESSALUD"
            value={datos.afiliacion_essalud}
            onChange={(e) => set("afiliacion_essalud", e.target.value)} />
          <Select label="Grupo Sanguíneo" opciones={GRUPO_SANGUINEO}
            value={datos.grupo_sanguineo}
            onChange={(e) => set("grupo_sanguineo", e.target.value)} />
          <div className="flex items-end pb-1">
            <Checkbox label="Donador/a de órganos"
              checked={datos.donador_organos}
              onChange={(e) => set("donador_organos", e.target.checked)} />
          </div>
        </FieldGrid>

        {/* ── Cuenta Bancaria ──────────────────────────── */}
        <div className="mt-5 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Cuenta Bancaria <span className="text-red-500">*</span>
            </p>
            <button
              type="button"
              onClick={() => setMostrarTarjeta(!mostrarTarjeta)}
              className="text-xs text-primary-600 font-medium
                         hover:text-primary-800 transition-colors"
            >
              {mostrarTarjeta ? "Ocultar ejemplo" : "¿Dónde encuentro mis datos?"}
            </button>
          </div>

          {/* Tarjeta de ejemplo */}
          {mostrarTarjeta && (
            <div className="mb-5 p-4 bg-slate-50 rounded-xl
                            border border-slate-200">
              <p className="text-xs font-semibold text-slate-500 mb-3 text-center">
                Ejemplo de dónde encontrar tus datos bancarios
              </p>
              <TarjetaBancaria
                banco={datos.banco}
                cuenta={datos.cuenta_numero}
                cci={datos.cuenta_cci}
              />
            </div>
          )}

          <FieldGrid cols={3}>
            <Input label="Banco" required
              placeholder="Ej: BCP, BBVA" {...campo("banco")} />
            <Input label="N° de Cuenta" required
              {...campo("cuenta_numero")} />
            <Input label="CCI" required maxLength={20}
              placeholder="20 dígitos"
              {...campo("cuenta_cci")}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "")
                vProps("cuenta_cci", datos.cuenta_cci).onChange({
                  ...e, target: { ...e.target, value: val }
                })
                set("cuenta_cci", val)
              }}
            />
          </FieldGrid>
        </div>

        {/* ── Discapacidad ─────────────────────────────── */}
        <div className="mt-5 pt-5 border-t border-slate-100 space-y-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Discapacidad
          </p>
          <Checkbox label="Persona con discapacidad"
            checked={datos.tiene_discapacidad}
            onChange={(e) => {
              set("tiene_discapacidad", e.target.checked)
              if (!e.target.checked) set("conadis_registro", "")
            }} />
          {datos.tiene_discapacidad && (
            <Input label="N° Registro CONADIS" required
              placeholder="Ej: 123456"
              {...campo("conadis_registro")} />
          )}
        </div>
      </div>

      {/* ══ 6. DENOMINACIÓN Y COLEGIO PROFESIONAL ══════════ */}
      <div className="form-card">
        <SectionTitle icono={Briefcase}
          titulo="Denominación y Colegio Profesional" />
        <FieldGrid cols={2}>
          <Input label="Denominación Profesional"
            value={datos.denominacion_prof}
            onChange={(e) => set("denominacion_prof", e.target.value)}
            placeholder="Ej: Ingeniero de Sistemas" />
          <Input label="Abreviatura"
            value={datos.abreviatura_prof}
            onChange={(e) => set("abreviatura_prof", e.target.value)}
            placeholder="Ej: Ing." />
          <Input label="Colegio Profesional"
            value={datos.colegio_prof_nombre}
            onChange={(e) => set("colegio_prof_nombre", e.target.value)}
            placeholder="Ej: CIP" />
          <Input label="N° de Colegiatura"
            value={datos.colegio_prof_numero}
            onChange={(e) => set("colegio_prof_numero", e.target.value)} />
          <Input label="Fecha de Colegiatura" type="date"
            value={datos.colegio_prof_fecha}
            onChange={(e) => set("colegio_prof_fecha", e.target.value)} />
        </FieldGrid>
      </div>

      {/* ══ 7. SISTEMA DE PENSIONES ════════════════════════ */}
      <div className="form-card">
        <SectionTitle icono={CreditCard} titulo="Sistema de Pensiones" />
        <FieldGrid cols={2}>
          <Select label="Sistema de Pensiones" opciones={SISTEMA_PENSION}
            value={datos.sistema_pension}
            onChange={(e) => {
              set("sistema_pension", e.target.value)
              if (e.target.value !== "AFP") set("afp_nombre", "")
            }} />
          {datos.sistema_pension === "AFP" && (
            <Select label="AFP" required opciones={AFP}
              value={datos.afp_nombre}
              onChange={(e) => set("afp_nombre", e.target.value)} />
          )}
        </FieldGrid>
      </div>

      {/* ══ 8. SERVICIO MILITAR ════════════════════════════ */}
      <div className="form-card">
        <SectionTitle icono={Shield} titulo="Servicio Militar" />
        <Checkbox label="Realizó servicio militar"
          checked={datos.realizo_serv_militar}
          onChange={(e) => {
            set("realizo_serv_militar", e.target.checked)
            if (!e.target.checked) {
              set("serv_militar_rama", "")
              set("serv_militar_cargo", "")
              set("serv_militar_fecha_inicio", "")
              set("serv_militar_fecha_fin", "")
            }
          }} />

        {datos.realizo_serv_militar && (
          <FieldGrid cols={2} className="mt-4">
            <Select label="Rama" required opciones={RAMA_MILITAR}
              {...campo("serv_militar_rama")} />
            <Input label="Cargo" required
              {...campo("serv_militar_cargo")} />
            <Input label="Fecha de Inicio" required type="date"
              {...campo("serv_militar_fecha_inicio")} />
            <Input label="Fecha de Fin" type="date"
              value={datos.serv_militar_fecha_fin}
              onChange={(e) => set("serv_militar_fecha_fin", e.target.value)} />
          </FieldGrid>
        )}
      </div>

      {/* ══ 9. IDIOMAS Y OFIMÁTICA ═════════════════════════ */}
      <div className="form-card">
        <SectionTitle icono={Globe} titulo="Idiomas Nativos / Dialectos"
          subtitulo="Máximo 3 registros" />

        <div className="space-y-3">
          {datos.idiomas_nativos.map((item, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Input
                    label={i === 0 ? "Idioma" : ""}
                    value={item.idioma}
                    onChange={(e) => actualizarIdioma(i, "idioma", e.target.value)}
                    placeholder="Ej: Quechua"
                    error={idiomaIncompleto(item) && item.idioma === ""
                      ? "El idioma es obligatorio" : ""}
                    tocado={true}
                    valido={!!item.idioma}
                  />
                </div>
                <div className="w-36">
                  <Select
                    label={i === 0 ? "Nivel" : ""}
                    opciones={NIVEL_IDIOMA}
                    value={item.nivel}
                    onChange={(e) => actualizarIdioma(i, "nivel", e.target.value)}
                    error={idiomaIncompleto(item) && item.nivel === ""
                      ? "Seleccione el nivel" : ""}
                    tocado={true}
                    valido={!!item.nivel}
                  />
                </div>
                <button type="button" onClick={() => eliminarIdioma(i)}
                  className="btn-danger mb-0.5 px-2.5 py-2">
                  <Trash2 size={14} />
                </button>
              </div>
              {/* Alerta si incompleto */}
              {idiomaIncompleto(item) && (
                <p className="text-xs text-amber-600 flex items-center gap-1">
                  <AlertCircle size={11} />
                  Complete todos los campos del idioma
                </p>
              )}
            </div>
          ))}
          {datos.idiomas_nativos.length < 3 && (
            <button type="button" onClick={agregarIdioma}
              className="btn-secondary text-xs gap-1.5">
              <Plus size={13} /> Agregar idioma
            </button>
          )}
        </div>

        {/* ── Ofimática ─────────────────────────────────── */}
        <div className="mt-5 pt-5 border-t border-slate-100">
          <SectionTitle icono={Monitor} titulo="Conocimiento de Ofimática"
            subtitulo="Máximo 3 registros" />
          <div className="space-y-3">
            {datos.ofimatica.map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Input
                      label={i === 0 ? "Programa" : ""}
                      value={item.programa}
                      onChange={(e) => actualizarOfimatica(i, "programa", e.target.value)}
                      placeholder="Ej: Microsoft Excel"
                      error={ofimaticaIncompleta(item) && item.programa === ""
                        ? "El programa es obligatorio" : ""}
                      tocado={true}
                      valido={!!item.programa}
                    />
                  </div>
                  <div className="w-36">
                    <Select
                      label={i === 0 ? "Nivel" : ""}
                      opciones={NIVEL_IDIOMA}
                      value={item.nivel}
                      onChange={(e) => actualizarOfimatica(i, "nivel", e.target.value)}
                      error={ofimaticaIncompleta(item) && item.nivel === ""
                        ? "Seleccione el nivel" : ""}
                      tocado={true}
                      valido={!!item.nivel}
                    />
                  </div>
                  <button type="button" onClick={() => eliminarOfimatica(i)}
                    className="btn-danger mb-0.5 px-2.5 py-2">
                    <Trash2 size={14} />
                  </button>
                </div>
                {ofimaticaIncompleta(item) && (
                  <p className="text-xs text-amber-600 flex items-center gap-1">
                    <AlertCircle size={11} />
                    Complete todos los campos de ofimática
                  </p>
                )}
              </div>
            ))}
            {datos.ofimatica.length < 3 && (
              <button type="button" onClick={agregarOfimatica}
                className="btn-secondary text-xs gap-1.5">
                <Plus size={13} /> Agregar programa
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}