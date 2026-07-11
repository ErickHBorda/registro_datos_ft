// Sección 1 de la ficha — Datos Personales
import { useState } from "react"
import { User, Phone, Home, CreditCard, Briefcase, Shield, Globe, Monitor, Plus, Trash2, Camera } from "lucide-react"
import { Input, Select, Checkbox, SectionTitle, FieldGrid } from "../ui/FormField"
import {
  SEXO, ESTADO_CIVIL, TIPO_VIVIENDA, GRUPO_SANGUINEO,
  SISTEMA_PENSION, AFP, RAMA_MILITAR, NIVEL_IDIOMA,
} from "../../utils/constants"

export default function Step1Personal({ datos, onChange }) {
  const [fotoPreview, setFotoPreview] = useState(null)

  const set = (campo, valor) => onChange("personal", campo, valor)

  // ── Manejo de foto ─────────────────────────────────────
  const handleFoto = (e) => {
    const archivo = e.target.files[0]
    if (!archivo) return
    const url = URL.createObjectURL(archivo)
    setFotoPreview(url)
    set("_foto_archivo", archivo)
  }

  // ── Idiomas nativos ────────────────────────────────────
  const agregarIdioma = () => {
    if (datos.idiomas_nativos.length >= 3) return
    onChange("personal", "idiomas_nativos", [
      ...datos.idiomas_nativos,
      { idioma: "", nivel: "" },
    ])
  }
  const actualizarIdioma = (i, campo, valor) => {
    const lista = [...datos.idiomas_nativos]
    lista[i] = { ...lista[i], [campo]: valor }
    onChange("personal", "idiomas_nativos", lista)
  }
  const eliminarIdioma = (i) => {
    onChange("personal", "idiomas_nativos",
      datos.idiomas_nativos.filter((_, idx) => idx !== i))
  }

  // ── Ofimática ──────────────────────────────────────────
  const agregarOfimatica = () => {
    if (datos.ofimatica.length >= 3) return
    onChange("personal", "ofimatica", [
      ...datos.ofimatica,
      { programa: "", nivel: "" },
    ])
  }
  const actualizarOfimatica = (i, campo, valor) => {
    const lista = [...datos.ofimatica]
    lista[i] = { ...lista[i], [campo]: valor }
    onChange("personal", "ofimatica", lista)
  }
  const eliminarOfimatica = (i) => {
    onChange("personal", "ofimatica",
      datos.ofimatica.filter((_, idx) => idx !== i))
  }

  return (
    <div className="space-y-5">

      {/* ══ 1. FOTO Y NOMBRES ══════════════════════════════ */}
      <div className="form-card">
        <SectionTitle icono={User} titulo="Identificación Personal" />

        {/* Foto de perfil */}
        <div className="flex items-start gap-5 mb-5">
          <div className="shrink-0">
            <div className="w-24 h-28 rounded-lg border-2 border-dashed border-slate-300
                            bg-slate-50 overflow-hidden flex items-center justify-center
                            relative group cursor-pointer hover:border-primary-400
                            transition-colors">
              {fotoPreview
                ? <img src={fotoPreview} alt="Foto"
                       className="w-full h-full object-cover" />
                : <div className="text-center">
                    <Camera size={22} className="text-slate-300 mx-auto mb-1" />
                    <span className="text-xs text-slate-400">Foto</span>
                  </div>
              }
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFoto}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1 text-center">JPG/PNG<br/>Máx. 5MB</p>
          </div>

          <div className="flex-1 space-y-4">
            <FieldGrid cols={2}>
              <Input label="Apellido Paterno" required
                value={datos.apellido_paterno}
                onChange={(e) => set("apellido_paterno", e.target.value)}
                placeholder="Ej: Quispe" />
              <Input label="Apellido Materno" required
                value={datos.apellido_materno}
                onChange={(e) => set("apellido_materno", e.target.value)}
                placeholder="Ej: Mamani" />
            </FieldGrid>
            <Input label="Nombres Completos" required
              value={datos.nombres}
              onChange={(e) => set("nombres", e.target.value)}
              placeholder="Ej: Juan Carlos" />
          </div>
        </div>

        <FieldGrid cols={3}>
          <Input label="DNI" required maxLength={8}
            value={datos.dni}
            onChange={(e) => set("dni", e.target.value.replace(/\D/g, ""))}
            placeholder="12345678" />
          <Input label="Libreta Militar"
            value={datos.libreta_militar}
            onChange={(e) => set("libreta_militar", e.target.value)}
            placeholder="Opcional" />
          <Select label="Sexo" required opciones={SEXO}
            value={datos.sexo}
            onChange={(e) => set("sexo", e.target.value)} />
        </FieldGrid>

        <FieldGrid cols={2} className="mt-4">
          <Input label="Fecha de Nacimiento" required type="date"
            value={datos.fecha_nacimiento}
            onChange={(e) => set("fecha_nacimiento", e.target.value)} />
          <Select label="Estado Civil" required opciones={ESTADO_CIVIL}
            value={datos.estado_civil}
            onChange={(e) => set("estado_civil", e.target.value)} />
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
            value={datos.nac_departamento}
            onChange={(e) => set("nac_departamento", e.target.value)}
            placeholder="Ej: Apurímac" />
          <Input label="Provincia" required
            value={datos.nac_provincia}
            onChange={(e) => set("nac_provincia", e.target.value)}
            placeholder="Ej: Abancay" />
          <Input label="Distrito" required
            value={datos.nac_distrito}
            onChange={(e) => set("nac_distrito", e.target.value)}
            placeholder="Ej: Abancay" />
        </FieldGrid>
      </div>

      {/* ══ 3. CONTACTO ════════════════════════════════════ */}
      <div className="form-card">
        <SectionTitle icono={Phone} titulo="Medios de Contacto" />
        <FieldGrid cols={2}>
          <Input label="Teléfono Fijo"
            value={datos.telefono_fijo}
            onChange={(e) => set("telefono_fijo", e.target.value.replace(/\D/g, ""))}
            placeholder="Ej: 083-321456" maxLength={9} />
          <Input label="Celular" required maxLength={9}
            value={datos.celular}
            onChange={(e) => set("celular", e.target.value.replace(/\D/g, ""))}
            placeholder="Ej: 987654321" />
          <Input label="Email Personal 1" required type="email"
            value={datos.email_personal_1}
            onChange={(e) => set("email_personal_1", e.target.value)}
            placeholder="correo@gmail.com" />
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
              { value: "Jr",   label: "Jr."  },
              { value: "Av",   label: "Av."  },
              { value: "Psje", label: "Psje."},
              { value: "Otro", label: "Otro" },
            ]}
            value={datos.dom_tipo_via}
            onChange={(e) => set("dom_tipo_via", e.target.value)} />
          <div className="sm:col-span-2">
            <Input label="Dirección" required
              value={datos.dom_direccion}
              onChange={(e) => set("dom_direccion", e.target.value)}
              placeholder="Ej: Av. Arenas 123" />
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
            value={datos.ruc}
            onChange={(e) => set("ruc", e.target.value.replace(/\D/g, ""))}
            placeholder="20123456789" />
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

        {/* Cuenta bancaria */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase
                        tracking-wide mb-3">Cuenta Bancaria</p>
          <FieldGrid cols={3}>
            <Input label="Banco"
              value={datos.banco}
              onChange={(e) => set("banco", e.target.value)}
              placeholder="Ej: BCP" />
            <Input label="N° de Cuenta"
              value={datos.cuenta_numero}
              onChange={(e) => set("cuenta_numero", e.target.value)} />
            <Input label="CCI"
              value={datos.cuenta_cci}
              onChange={(e) => set("cuenta_cci", e.target.value)} />
          </FieldGrid>
        </div>

        {/* Discapacidad */}
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Discapacidad
          </p>
          <Checkbox label="Persona con discapacidad"
            checked={datos.tiene_discapacidad}
            onChange={(e) => set("tiene_discapacidad", e.target.checked)} />
          {datos.tiene_discapacidad && (
            <Input label="N° Registro CONADIS"
              value={datos.conadis_registro}
              onChange={(e) => set("conadis_registro", e.target.value)}
              placeholder="Ej: 123456" />
          )}
        </div>
      </div>

      {/* ══ 6. DENOMINACIÓN Y COLEGIO PROFESIONAL ══════════ */}
      <div className="form-card">
        <SectionTitle icono={Briefcase} titulo="Denominación y Colegio Profesional" />
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
          onChange={(e) => set("realizo_serv_militar", e.target.checked)} />

        {datos.realizo_serv_militar && (
          <FieldGrid cols={2} className="mt-4">
            <Select label="Rama" opciones={RAMA_MILITAR}
              value={datos.serv_militar_rama}
              onChange={(e) => set("serv_militar_rama", e.target.value)} />
            <Input label="Cargo"
              value={datos.serv_militar_cargo}
              onChange={(e) => set("serv_militar_cargo", e.target.value)} />
            <Input label="Fecha de Inicio" type="date"
              value={datos.serv_militar_fecha_inicio}
              onChange={(e) => set("serv_militar_fecha_inicio", e.target.value)} />
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
            <div key={i} className="flex items-end gap-2">
              <Input label={i === 0 ? "Idioma" : ""} className="flex-1"
                value={item.idioma}
                onChange={(e) => actualizarIdioma(i, "idioma", e.target.value)}
                placeholder="Ej: Quechua" />
              <Select label={i === 0 ? "Nivel" : ""} className="w-36"
                opciones={NIVEL_IDIOMA}
                value={item.nivel}
                onChange={(e) => actualizarIdioma(i, "nivel", e.target.value)} />
              <button type="button" onClick={() => eliminarIdioma(i)}
                className="btn-danger mb-0.5 px-2.5 py-2">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {datos.idiomas_nativos.length < 3 && (
            <button type="button" onClick={agregarIdioma}
              className="btn-secondary text-xs gap-1.5">
              <Plus size={13} /> Agregar idioma
            </button>
          )}
        </div>

        <div className="mt-5 pt-5 border-t border-slate-100">
          <SectionTitle icono={Monitor} titulo="Conocimiento de Ofimática"
            subtitulo="Máximo 3 registros" />
          <div className="space-y-3">
            {datos.ofimatica.map((item, i) => (
              <div key={i} className="flex items-end gap-2">
                <Input label={i === 0 ? "Programa" : ""} className="flex-1"
                  value={item.programa}
                  onChange={(e) => actualizarOfimatica(i, "programa", e.target.value)}
                  placeholder="Ej: Microsoft Excel" />
                <Select label={i === 0 ? "Nivel" : ""} className="w-36"
                  opciones={NIVEL_IDIOMA}
                  value={item.nivel}
                  onChange={(e) => actualizarOfimatica(i, "nivel", e.target.value)} />
                <button type="button" onClick={() => eliminarOfimatica(i)}
                  className="btn-danger mb-0.5 px-2.5 py-2">
                  <Trash2 size={14} />
                </button>
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