// Componentes reutilizables de formulario con manejo de errores integrado

import { forwardRef } from "react"
import { AlertCircle, ChevronDown } from "lucide-react"

// ── Mensaje de error ───────────────────────────────────────
export function ErrorMsg({ mensaje }) {
  if (!mensaje) return null
  return (
    <p className="input-error-msg">
      <AlertCircle size={12} />
      {mensaje}
    </p>
  )
}

// ── Input de texto ─────────────────────────────────────────
export const Input = forwardRef(function Input(
  { label, error, required, className = "", ...props },
  ref
) {
  return (
    <div className={`space-y-0.5 ${className}`}>
      {label && (
        <label className={`input-label ${required ? "input-label-required" : ""}`}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={error ? "input-field-error" : "input-field"}
        {...props}
      />
      <ErrorMsg mensaje={error} />
    </div>
  )
})

// ── Select ────────────────────────────────────────────────
export const Select = forwardRef(function Select(
  { label, error, required, opciones = [], placeholder = "Seleccione...", className = "", ...props },
  ref
) {
  return (
    <div className={`space-y-0.5 ${className}`}>
      {label && (
        <label className={`input-label ${required ? "input-label-required" : ""}`}>
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={`${error ? "input-field-error" : "input-field"} appearance-none pr-8`}
          {...props}
        >
          <option value="">{placeholder}</option>
          {opciones.map((op) => (
            <option key={op.value} value={op.value}>
              {op.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
      </div>
      <ErrorMsg mensaje={error} />
    </div>
  )
})

// ── Checkbox ──────────────────────────────────────────────
export function Checkbox({ label, error, className = "", ...props }) {
  return (
    <div className={`space-y-0.5 ${className}`}>
      <label className="flex items-center gap-2 cursor-pointer group">
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-slate-300 text-primary-600
                     focus:ring-primary-500 focus:ring-offset-0 cursor-pointer"
          {...props}
        />
        <span className="text-sm text-slate-700 group-hover:text-slate-900 select-none">
          {label}
        </span>
      </label>
      <ErrorMsg mensaje={error} />
    </div>
  )
}

// ── Textarea ───────────────────────────────────────────────
export const Textarea = forwardRef(function Textarea(
  { label, error, required, rows = 3, className = "", ...props },
  ref
) {
  return (
    <div className={`space-y-0.5 ${className}`}>
      {label && (
        <label className={`input-label ${required ? "input-label-required" : ""}`}>
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`${error ? "input-field-error" : "input-field"} resize-none`}
        {...props}
      />
      <ErrorMsg mensaje={error} />
    </div>
  )
})

// ── Separador de sección ───────────────────────────────────
export function SectionTitle({ icono: Icono, titulo, subtitulo }) {
  return (
    <div className="form-section-title">
      {Icono && <Icono size={18} className="text-primary-600" />}
      <div>
        <span>{titulo}</span>
        {subtitulo && (
          <p className="text-xs font-normal text-slate-400 mt-0.5">{subtitulo}</p>
        )}
      </div>
    </div>
  )
}

// ── Grid de campos ─────────────────────────────────────────
export function FieldGrid({ cols = 2, children, className = "" }) {
  const colsMap = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  }
  return (
    <div className={`grid ${colsMap[cols] || colsMap[2]} gap-4 ${className}`}>
      {children}
    </div>
  )
}