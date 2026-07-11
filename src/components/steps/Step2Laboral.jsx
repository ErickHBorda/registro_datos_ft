// Sección 2 de la ficha — Datos Laborales en la UNAMBA
import { Building2, Calendar, Mail, Award, Clock } from "lucide-react"
import { Input, Select, Checkbox, SectionTitle, FieldGrid } from "../ui/FormField"
import {
  CONDICION, TIPO_PERSONAL, REGIMEN_276, REGIMEN_1057,
  NIVEL_REMUNERATIVO, DEDICACION,
} from "../../utils/constants"

export default function Step2Laboral({ datos, onChange }) {
  const set = (campo, valor) => onChange("datos_laborales", campo, valor)

  const tieneRegimen276  = datos.regimen_276  !== ""
  const tieneRegimen1057 = datos.regimen_1057 !== ""

  return (
    <div className="space-y-5">

      {/* ══ 1. UBICACIÓN EN LA UNIVERSIDAD ════════════════ */}
      <div className="form-card">
        <SectionTitle
          icono={Building2}
          titulo="Ubicación Institucional"
          subtitulo="Dependencia y cargo actual en la UNAMBA"
        />
        <FieldGrid cols={2}>
          <div className="sm:col-span-2">
            <Input
              label="Dependencia / Unidad Orgánica" required
              value={datos.dependencia}
              onChange={(e) => set("dependencia", e.target.value)}
              placeholder="Ej: Facultad de Ingeniería"
            />
          </div>
          <Input
            label="Cargo que Desempeña" required
            value={datos.cargo}
            onChange={(e) => set("cargo", e.target.value)}
            placeholder="Ej: Docente Ordinario"
          />
          <Input
            label="Correo Institucional" required type="email"
            value={datos.email_institucional}
            onChange={(e) => set("email_institucional", e.target.value)}
            placeholder="usuario@unamba.edu.pe"
          />
        </FieldGrid>

        {/* Validación visual del email institucional */}
        {datos.email_institucional &&
         !datos.email_institucional.endsWith("@unamba.edu.pe") && (
          <p className="input-error-msg mt-2">
            El correo debe terminar en @unamba.edu.pe
          </p>
        )}
      </div>

      {/* ══ 2. CONDICIÓN Y TIPO ════════════════════════════ */}
      <div className="form-card">
        <SectionTitle
          icono={Award}
          titulo="Condición Laboral"
          subtitulo="Régimen y tipo de vínculo con la universidad"
        />
        <FieldGrid cols={2}>
          <Select
            label="Condición" required opciones={CONDICION}
            value={datos.condicion}
            onChange={(e) => set("condicion", e.target.value)}
          />
          <Select
            label="Tipo de Personal" required opciones={TIPO_PERSONAL}
            value={datos.tipo_personal}
            onChange={(e) => set("tipo_personal", e.target.value)}
          />
        </FieldGrid>
      </div>

      {/* ══ 3. RÉGIMEN LABORAL ═════════════════════════════ */}
      <div className="form-card">
        <SectionTitle
          icono={Award}
          titulo="Régimen Laboral"
          subtitulo="Solo aplica un régimen a la vez"
        />

        {/* Alerta visual si ambos están seleccionados */}
        {tieneRegimen276 && tieneRegimen1057 && (
          <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200
                          rounded-lg text-xs text-red-600">
            ⚠️ Solo puede seleccionar un régimen laboral: DL 276 o DL 1057,
            no ambos simultáneamente.
          </div>
        )}

        <FieldGrid cols={2}>
          <div className="space-y-1">
            <Select
              label="Régimen D.L. 276"
              opciones={REGIMEN_276}
              value={datos.regimen_276}
              onChange={(e) => {
                set("regimen_276", e.target.value)
                if (e.target.value) set("regimen_1057", "")
              }}
              placeholder="No aplica"
            />
            {tieneRegimen276 && (
              <p className="text-xs text-green-600 font-medium">
                ✓ Régimen DL 276 seleccionado
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Select
              label="Régimen D.L. 1057 (CAS)"
              opciones={REGIMEN_1057}
              value={datos.regimen_1057}
              onChange={(e) => {
                set("regimen_1057", e.target.value)
                if (e.target.value) set("regimen_276", "")
              }}
              placeholder="No aplica"
            />
            {tieneRegimen1057 && (
              <p className="text-xs text-green-600 font-medium">
                ✓ Régimen DL 1057 seleccionado
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <Input
              label="Otro Régimen (especificar)"
              value={datos.regimen_otros}
              onChange={(e) => set("regimen_otros", e.target.value)}
              placeholder="Especificar si aplica otro régimen"
            />
          </div>
        </FieldGrid>
      </div>

      {/* ══ 4. NIVEL Y DEDICACIÓN ══════════════════════════ */}
      <div className="form-card">
        <SectionTitle
          icono={Clock}
          titulo="Nivel Remunerativo y Dedicación"
        />
        <FieldGrid cols={3}>
          <Select
            label="Nivel Remunerativo"
            opciones={NIVEL_REMUNERATIVO}
            value={datos.nivel_remunerativo}
            onChange={(e) => set("nivel_remunerativo", e.target.value)}
          />
          <Select
            label="Dedicación"
            opciones={DEDICACION}
            value={datos.dedicacion}
            onChange={(e) => {
              set("dedicacion", e.target.value)
              if (e.target.value !== "Horas") set("horas_semanales", null)
            }}
          />
          {datos.dedicacion === "Horas" && (
            <Input
              label="Horas Semanales" required type="number"
              min={1} max={40}
              value={datos.horas_semanales ?? ""}
              onChange={(e) => set("horas_semanales", parseInt(e.target.value) || null)}
              placeholder="Ej: 20"
            />
          )}
        </FieldGrid>
      </div>

      {/* ══ 5. FECHA DE INGRESO ════════════════════════════ */}
      <div className="form-card">
        <SectionTitle
          icono={Calendar}
          titulo="Ingreso a la UNAMBA"
        />
        <FieldGrid cols={2}>
          <Input
            label="Fecha de Ingreso a la UNAMBA" required type="date"
            value={datos.fecha_ingreso}
            onChange={(e) => set("fecha_ingreso", e.target.value)}
          />
        </FieldGrid>
      </div>

    </div>
  )
}