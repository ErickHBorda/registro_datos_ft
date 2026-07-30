// Guía visual de datos bancarios — sin simular tarjeta de crédito
import { Building2, Info } from "lucide-react"

export default function TarjetaBancaria({ banco, cuenta, cci }) {
  return (
    <div className="space-y-3 w-full max-w-sm mx-auto">

      {/* Aviso importante */}
      <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-50
                      border border-amber-200 rounded-lg">
        <Info size={13} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 leading-relaxed">
          El <strong>N° de cuenta</strong> es diferente al número de su
          tarjeta de débito/crédito. Encuéntrelo en la app o web de su banco.
        </p>
      </div>

      {/* Dato 1: N° de Cuenta */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="bg-primary-600 px-4 py-2 flex items-center gap-2">
          <Building2 size={13} className="text-white" />
          <p className="text-white text-xs font-semibold uppercase tracking-wide">
            N° de Cuenta
          </p>
        </div>
        <div className="px-4 py-3 bg-white">
          <p className="font-mono text-sm font-bold text-slate-800 tracking-wider mb-1">
            {cuenta || "Ej: 19120012345678"}
          </p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Serie de dígitos que identifica su cuenta en el banco.
            Lo encuentra en la <strong>app móvil</strong>, la{" "}
            <strong>web del banco</strong> o en su{" "}
            <strong>estado de cuenta</strong>.
            <br />
            <span className="text-red-500 font-medium">
              ≠ No es el número de su tarjeta física.
            </span>
          </p>
        </div>
      </div>

      {/* Dato 2: CCI */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="bg-slate-600 px-4 py-2 flex items-center gap-2">
          <Building2 size={13} className="text-white" />
          <p className="text-white text-xs font-semibold uppercase tracking-wide">
            CCI — Código de Cuenta Interbancario
          </p>
        </div>
        <div className="px-4 py-3 bg-white">
          <p className="font-mono text-sm font-bold text-slate-800 tracking-wider mb-1">
            {cci || "Ej: 00219100012345678001"}
          </p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Número de <strong>20 dígitos</strong> que permite
            transferencias entre bancos distintos.
            También está en la <strong>app o web de su banco</strong>,
            en la sección "Mis cuentas" o "Datos de cuenta".
          </p>
        </div>
      </div>

      {/* Dato 3: Banco */}
      {banco && (
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50
                        border border-slate-200 rounded-lg">
          <span className="text-xs text-slate-500">Banco seleccionado:</span>
          <span className="text-xs font-bold text-slate-700 uppercase">
            {banco}
          </span>
        </div>
      )}

      {/* Leyenda */}
      <div className="space-y-1 pt-1">
        <div className="flex items-start gap-2">
          <div className="w-2 h-2 rounded-full bg-primary-500 mt-1 shrink-0" />
          <p className="text-xs text-slate-500">
            <strong>N° de cuenta:</strong> varía según el banco,
            entre 10 y 20 dígitos
          </p>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-2 h-2 rounded-full bg-slate-400 mt-1 shrink-0" />
          <p className="text-xs text-slate-500">
            <strong>CCI:</strong> siempre 20 dígitos,
            empieza con el código del banco
          </p>
        </div>
      </div>
    </div>
  )
}