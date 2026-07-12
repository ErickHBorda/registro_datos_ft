import { toast } from "react-hot-toast"
import { AlertCircle } from "lucide-react"

export function mostrarErroresPaso(errores, tituloPaso) {
  if (errores.length === 0) return

  toast.custom(
    (t) => (
      <div className={`
        bg-white border border-red-200 rounded-xl shadow-xl
        max-w-sm w-full p-4 space-y-2
        ${t.visible ? "animate-in fade-in slide-in-from-top-2" : "opacity-0"}
      `}>
        {/* Cabecera */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-red-100 flex items-center
                          justify-center shrink-0">
            <AlertCircle size={14} className="text-red-500" />
          </div>
          <p className="text-sm font-bold text-red-700">
            Complete los campos de {tituloPaso}
          </p>
        </div>

        {/* Lista de errores — máximo 4 visibles */}
        <ul className="space-y-1 pl-9">
          {errores.slice(0, 4).map((error, i) => (
            <li key={i} className="text-xs text-red-600 list-disc">
              {error}
            </li>
          ))}
          {errores.length > 4 && (
            <li className="text-xs text-red-400 list-none">
              ...y {errores.length - 4} campo(s) más por completar
            </li>
          )}
        </ul>
      </div>
    ),
    {
      duration: 5000,
      position: "top-right",
    }
  )
}