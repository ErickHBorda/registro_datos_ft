// Sección 3 — Familiares y derecho habientes
import { useState } from "react"
import { Users, Plus, Trash2, ChevronDown, ChevronUp, UserCheck } from "lucide-react"
import { Input, Select, Checkbox, SectionTitle, FieldGrid } from "../ui/FormField"
import { SEXO, PARENTESCO } from "../../utils/constants"

// ── Familiar vacío por defecto ─────────────────────────────
const FAMILIAR_VACIO = {
  apellido_paterno:    "",
  apellido_materno:    "",
  nombres:             "",
  parentesco:          "",
  dni:                 "",
  fecha_nacimiento:    "",
  sexo:                "",
  nac_pais:            "Perú",
  nac_departamento:    "",
  nac_provincia:       "",
  nac_distrito:        "",
  nac_anexo:           "",
  vive_con_trabajador: false,
}

// ── Card de un familiar individual ────────────────────────
function FamiliarCard({ familiar, index, onActualizar, onEliminar }) {
  const [expandido, setExpandido] = useState(true)

  const set = (campo, valor) => onActualizar(index, campo, valor)

  const titulo = familiar.nombres && familiar.apellido_paterno
    ? `${familiar.apellido_paterno} ${familiar.apellido_materno}, ${familiar.nombres}`
    : `Familiar ${index + 1}`

  const subtitulo = familiar.parentesco || "Sin parentesco definido"

  return (
    <div className="border border-slate-200 rounded-form overflow-hidden
                    transition-all duration-200 hover:border-slate-300">

      {/* ── Cabecera colapsable ────────────────────────── */}
      <div
        className="flex items-center justify-between px-4 py-3
                   bg-slate-50 cursor-pointer select-none
                   hover:bg-slate-100 transition-colors"
        onClick={() => setExpandido(!expandido)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center
                          justify-center shrink-0">
            <UserCheck size={15} className="text-primary-600" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {titulo}
            </p>
            <p className="text-xs text-slate-400">{subtitulo}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onEliminar(index) }}
            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50
                       rounded-lg transition-colors"
            title="Eliminar familiar"
          >
            <Trash2 size={14} />
          </button>
          {expandido
            ? <ChevronUp   size={16} className="text-slate-400" />
            : <ChevronDown size={16} className="text-slate-400" />
          }
        </div>
      </div>

      {/* ── Formulario del familiar ───────────────────── */}
      {expandido && (
        <div className="p-4 space-y-4">

          {/* Datos principales */}
          <FieldGrid cols={3}>
            <Input
              label="Apellido Paterno" required
              value={familiar.apellido_paterno}
              onChange={(e) => set("apellido_paterno", e.target.value)}
              placeholder="Ej: García"
            />
            <Input
              label="Apellido Materno" required
              value={familiar.apellido_materno}
              onChange={(e) => set("apellido_materno", e.target.value)}
              placeholder="Ej: López"
            />
            <Input
              label="Nombres" required
              value={familiar.nombres}
              onChange={(e) => set("nombres", e.target.value)}
              placeholder="Ej: María"
            />
          </FieldGrid>

          <FieldGrid cols={3}>
            <Select
              label="Parentesco" required opciones={PARENTESCO}
              value={familiar.parentesco}
              onChange={(e) => set("parentesco", e.target.value)}
            />
            <Input
              label="DNI" maxLength={8}
              value={familiar.dni}
              onChange={(e) => set("dni", e.target.value.replace(/\D/g, ""))}
              placeholder="12345678"
            />
            <Select
              label="Sexo" opciones={SEXO}
              value={familiar.sexo}
              onChange={(e) => set("sexo", e.target.value)}
            />
          </FieldGrid>

          <FieldGrid cols={2}>
            <Input
              label="Fecha de Nacimiento" type="date"
              value={familiar.fecha_nacimiento}
              onChange={(e) => set("fecha_nacimiento", e.target.value)}
            />
            <div className="flex items-end pb-1">
              <Checkbox
                label="Vive con el trabajador"
                checked={familiar.vive_con_trabajador}
                onChange={(e) => set("vive_con_trabajador", e.target.checked)}
              />
            </div>
          </FieldGrid>

          {/* Lugar de nacimiento */}
          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase
                          tracking-wide mb-3">
              Lugar de Nacimiento
            </p>
            <FieldGrid cols={2}>
              <Input
                label="País"
                value={familiar.nac_pais}
                onChange={(e) => set("nac_pais", e.target.value)}
              />
              <Input
                label="Departamento"
                value={familiar.nac_departamento}
                onChange={(e) => set("nac_departamento", e.target.value)}
                placeholder="Ej: Apurímac"
              />
              <Input
                label="Provincia"
                value={familiar.nac_provincia}
                onChange={(e) => set("nac_provincia", e.target.value)}
                placeholder="Ej: Abancay"
              />
              <Input
                label="Distrito"
                value={familiar.nac_distrito}
                onChange={(e) => set("nac_distrito", e.target.value)}
                placeholder="Ej: Abancay"
              />
              <Input
                label="Anexo / Centro Poblado"
                value={familiar.nac_anexo}
                onChange={(e) => set("nac_anexo", e.target.value)}
                placeholder="Opcional"
              />
            </FieldGrid>
          </div>

        </div>
      )}
    </div>
  )
}

// ── Componente principal ───────────────────────────────────
export default function Step3Familiares({ datos, onChange }) {

  const agregar = () => {
    onChange("familiares", null, [...datos, { ...FAMILIAR_VACIO }])
  }

  const actualizar = (index, campo, valor) => {
    const lista = [...datos]
    lista[index] = { ...lista[index], [campo]: valor }
    onChange("familiares", null, lista)
  }

  const eliminar = (index) => {
    onChange("familiares", null, datos.filter((_, i) => i !== index))
  }

  // Verificar si ya hay un cónyuge registrado
  const tieneConyuge = datos.some((f) => f.parentesco === "Cónyuge")

  return (
    <div className="space-y-5">

      {/* ── Encabezado informativo ─────────────────────── */}
      <div className="form-card">
        <SectionTitle
          icono={Users}
          titulo="Familiares y Derecho Habientes"
          subtitulo="Cónyuge, hijos, padres — beneficiarios de seguros y pensiones"
        />

        {/* Aviso si ya hay cónyuge */}
        {tieneConyuge && (
          <div className="mb-4 px-3 py-2 bg-blue-50 border border-blue-200
                          rounded-lg text-xs text-blue-700">
            ℹ️ Ya registró un cónyuge. Solo se permite un cónyuge por trabajador.
          </div>
        )}

        {/* Estado vacío — Zeigarnik: invita a completar */}
        {datos.length === 0 && (
          <div className="text-center py-8 space-y-3">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center
                            justify-center mx-auto">
              <Users size={24} className="text-slate-300" />
            </div>
            <p className="text-sm text-slate-500">
              No hay familiares registrados aún
            </p>
            <p className="text-xs text-slate-400">
              Agregue a su cónyuge, hijos y padres como derecho habientes
            </p>
          </div>
        )}

        {/* Lista de familiares */}
        <div className="space-y-3">
          {datos.map((familiar, index) => (
            <FamiliarCard
              key={index}
              familiar={familiar}
              index={index}
              onActualizar={actualizar}
              onEliminar={eliminar}
            />
          ))}
        </div>

        {/* Botón agregar */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={agregar}
            className="btn-secondary w-full justify-center gap-2"
          >
            <Plus size={15} />
            Agregar familiar
          </button>
        </div>

      </div>

      {/* ── Resumen ────────────────────────────────────── */}
      {datos.length > 0 && (
        <div className="form-card bg-slate-50">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Resumen de familiares registrados
          </p>
          <div className="space-y-2">
            {datos.map((f, i) => (
              <div key={i}
                className="flex items-center justify-between text-xs
                           py-1.5 border-b border-slate-200 last:border-0">
                <span className="text-slate-700 font-medium">
                  {f.nombres || "—"} {f.apellido_paterno || ""}
                </span>
                <span className={`px-2 py-0.5 rounded-full font-semibold
                  ${f.parentesco === "Cónyuge" ? "bg-purple-100 text-purple-700" :
                    f.parentesco === "Hijo" || f.parentesco === "Hija"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-200 text-slate-600"
                  }`}>
                  {f.parentesco || "Sin parentesco"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}