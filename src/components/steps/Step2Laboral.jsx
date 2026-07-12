import { Building2, Calendar, Award, Clock, FlaskConical, Info } from "lucide-react"
import { Input, Select, Checkbox, SectionTitle, FieldGrid } from "../ui/FormField"
import {
  CONDICION, TIPO_PERSONAL, DEDICACION,
  CATEGORIA_REGIMEN, NIVEL_REMUNERATIVO, NIVEL_RENACYT,
} from "../../utils/constants"

export default function Step2Laboral({ datos, onChange }) {
  const set = (campo, valor) => onChange("datos_laborales", campo, valor)

  // ── Determinar configuración de régimen según condición+tipo
  const claveRegimen = datos.condicion && datos.tipo_personal
    ? `${datos.condicion}-${datos.tipo_personal}`
    : null

  const configRegimen = claveRegimen
    ? CATEGORIA_REGIMEN[claveRegimen]
    : null

  // ── Limpiar campos de régimen al cambiar condición o tipo ──
  const limpiarRegimen = () => {
    onChange("datos_laborales", "categoria_regimen",  "")
    onChange("datos_laborales", "regimen_dl276",       "")
    onChange("datos_laborales", "regimen_cas",         "")
    onChange("datos_laborales", "regimen_ordinario",   "")
    onChange("datos_laborales", "regimen_contratado",  "")
    onChange("datos_laborales", "nivel_remunerativo",  "")
    onChange("datos_laborales", "dedicacion",          "")
    onChange("datos_laborales", "horas_semanales",     null)
  }

  const handleCondicion = (valor) => {
    set("condicion", valor)
    limpiarRegimen()
  }

  const handleTipoPersonal = (valor) => {
    set("tipo_personal", valor)
    limpiarRegimen()
    // Limpiar RENACYT si cambia a administrativo
    if (valor === "Administrativo") {
      set("es_renacyt",    false)
      set("renacyt_codigo", "")
      set("renacyt_nivel",  "")
    }
  }

  // ── Valor actual del sub-régimen ───────────────────────────
  const valorSubRegimen = configRegimen
    ? datos[configRegimen.campo] || ""
    : ""

  const handleSubRegimen = (valor) => {
    if (!configRegimen) return
    // Limpiar todos los sub-regímenes primero
    onChange("datos_laborales", "regimen_dl276",      "")
    onChange("datos_laborales", "regimen_cas",         "")
    onChange("datos_laborales", "regimen_ordinario",   "")
    onChange("datos_laborales", "regimen_contratado",  "")
    // Setear el correcto y la categoría
    onChange("datos_laborales", configRegimen.campo,   valor)
    onChange("datos_laborales", "categoria_regimen",   configRegimen.value)
  }

  const esDocente = datos.tipo_personal === "Docente"

  return (
    <div className="space-y-5">

      {/* ══ 1. UBICACIÓN INSTITUCIONAL ════════════════════ */}
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
          titulo="Condición y Tipo de Personal"
          subtitulo="La combinación determina el régimen laboral aplicable"
        />
        <FieldGrid cols={2}>
          <Select
            label="Condición" required opciones={CONDICION}
            value={datos.condicion}
            onChange={(e) => handleCondicion(e.target.value)}
          />
          <Select
            label="Tipo de Personal" required opciones={TIPO_PERSONAL}
            value={datos.tipo_personal}
            onChange={(e) => handleTipoPersonal(e.target.value)}
          />
        </FieldGrid>

        {/* Indicador visual de la combinación */}
        {configRegimen && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2
                          bg-primary-50 border border-primary-200 rounded-lg">
            <Info size={13} className="text-primary-500 shrink-0" />
            <p className="text-xs text-primary-700">
              Régimen aplicable:{" "}
              <strong>{configRegimen.label}</strong>
            </p>
          </div>
        )}

        {/* Aviso si falta seleccionar */}
        {datos.condicion && !datos.tipo_personal && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2
                          bg-amber-50 border border-amber-200 rounded-lg">
            <Info size={13} className="text-amber-500 shrink-0" />
            <p className="text-xs text-amber-700">
              Seleccione el tipo de personal para ver el régimen aplicable.
            </p>
          </div>
        )}
      </div>

      {/* ══ 3. RÉGIMEN LABORAL (dinámico) ═════════════════ */}
      {configRegimen && (
        <div className="form-card">
          <SectionTitle
            icono={Award}
            titulo={configRegimen.label}
            subtitulo={`Aplica para personal ${datos.condicion?.toLowerCase()} ${datos.tipo_personal?.toLowerCase()}`}
          />

          <FieldGrid cols={2}>
            {/* Sub-régimen */}
            <Select
              label="Categoría / Nivel" required
              opciones={configRegimen.opciones}
              value={valorSubRegimen}
              onChange={(e) => handleSubRegimen(e.target.value)}
            />

            {/* Nivel remunerativo — solo DL 276 */}
            {configRegimen.mostrarNivel && (
              <Select
                label="Nivel Remunerativo" required
                opciones={NIVEL_REMUNERATIVO}
                value={datos.nivel_remunerativo || ""}
                onChange={(e) => set("nivel_remunerativo", e.target.value)}
              />
            )}

            {/* Dedicación — solo docentes */}
            {configRegimen.mostrarDedicacion && (
              <Select
                label="Dedicación" required
                opciones={DEDICACION}
                value={datos.dedicacion || ""}
                onChange={(e) => {
                  set("dedicacion", e.target.value)
                  if (e.target.value !== "Horas") set("horas_semanales", null)
                }}
              />
            )}

            {/* Horas semanales — solo si dedicación = Horas */}
            {configRegimen.mostrarDedicacion &&
             datos.dedicacion === "Horas" && (
              <Input
                label="Horas Semanales" required type="number"
                min={1} max={40}
                value={datos.horas_semanales ?? ""}
                onChange={(e) =>
                  set("horas_semanales", parseInt(e.target.value) || null)
                }
                placeholder="Ej: 20"
              />
            )}

            {/* Otro régimen */}
            <div className="sm:col-span-2">
              <Input
                label="Otro Régimen (especificar si aplica)"
                value={datos.regimen_otros || ""}
                onChange={(e) => set("regimen_otros", e.target.value)}
                placeholder="Solo si no aplica ninguna categoría anterior"
              />
            </div>
          </FieldGrid>
        </div>
      )}

      {/* ══ 4. RENACYT — solo docentes ════════════════════ */}
      {esDocente && (
        <div className="form-card">
          <SectionTitle
            icono={FlaskConical}
            titulo="Investigador RENACYT"
            subtitulo="Registro Nacional Científico, Tecnológico y de Innovación Tecnológica"
          />

          {/* Toggle */}
          <div className="flex items-center gap-4 p-4 bg-slate-50
                          rounded-lg border border-slate-200 mb-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-700">
                ¿Es investigador RENACYT?
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Registrado en CONCYTEC
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  set("es_renacyt",     false)
                  set("renacyt_codigo", "")
                  set("renacyt_nivel",  "")
                  set("renacyt_activo", true)
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold
                            transition-all duration-150 border
                  ${!datos.es_renacyt
                    ? "bg-slate-700 text-white border-slate-700"
                    : "bg-white text-slate-500 border-slate-300 hover:bg-slate-50"
                  }`}
              >
                No
              </button>
              <button
                type="button"
                onClick={() => set("es_renacyt", true)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold
                            transition-all duration-150 border
                  ${datos.es_renacyt
                    ? "bg-primary-600 text-white border-primary-600"
                    : "bg-white text-slate-500 border-slate-300 hover:bg-slate-50"
                  }`}
              >
                Sí
              </button>
            </div>
          </div>

          {/* Campos RENACYT */}
          {datos.es_renacyt && (
            <div className="space-y-4">
              <FieldGrid cols={2}>
                <Input
                  label="Código RENACYT" required
                  value={datos.renacyt_codigo || ""}
                  onChange={(e) => set("renacyt_codigo", e.target.value)}
                  placeholder="Ej: P0012345"
                />
                <Select
                  label="Nivel RENACYT" required
                  opciones={NIVEL_RENACYT}
                  value={datos.renacyt_nivel || ""}
                  onChange={(e) => set("renacyt_nivel", e.target.value)}
                />
              </FieldGrid>

              {/* Estado activo */}
              <div className="flex items-center gap-4 px-3 py-2.5
                              bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-700">
                    Estado en RENACYT
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => set("renacyt_activo", false)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                                transition-all duration-150 border
                      ${!datos.renacyt_activo
                        ? "bg-red-500 text-white border-red-500"
                        : "bg-white text-slate-500 border-slate-300"
                      }`}
                  >
                    Inactivo
                  </button>
                  <button
                    type="button"
                    onClick={() => set("renacyt_activo", true)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                                transition-all duration-150 border
                      ${datos.renacyt_activo
                        ? "bg-green-500 text-white border-green-500"
                        : "bg-white text-slate-500 border-slate-300"
                      }`}
                  >
                    Activo
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Aviso si no es RENACYT */}
          {!datos.es_renacyt && (
            <div className="flex items-start gap-2 px-3 py-2.5
                            bg-slate-50 border border-slate-200 rounded-lg">
              <Info size={13} className="text-slate-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-500">
                Si no está registrado en RENACYT, este campo no es obligatorio.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ══ 5. FECHA DE INGRESO ════════════════════════════ */}
      <div className="form-card">
        <SectionTitle
          icono={Calendar}
          titulo="Ingreso a la UNAMBA"
        />
        <FieldGrid cols={2}>
          <Input
            label="Fecha de Ingreso" required type="date"
            value={datos.fecha_ingreso}
            onChange={(e) => set("fecha_ingreso", e.target.value)}
          />
        </FieldGrid>
      </div>

    </div>
  )
}