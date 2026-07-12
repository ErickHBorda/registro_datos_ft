// Ejemplo visual de tarjeta bancaria para guiar al usuario
export default function TarjetaBancaria({ banco, cuenta, cci }) {
  return (
    <div className="relative w-full max-w-xs mx-auto select-none">

      {/* Tarjeta */}
      <div className="relative h-44 rounded-2xl bg-gradient-to-br
                      from-primary-700 to-primary-900 p-5 shadow-xl
                      overflow-hidden">

        {/* Círculos decorativos */}
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full
                        bg-white/5" />
        <div className="absolute -bottom-8 -left-4 w-40 h-40 rounded-full
                        bg-white/5" />

        {/* Chip */}
        <div className="w-10 h-7 rounded-md bg-gradient-to-br
                        from-yellow-300 to-yellow-500 mb-4 shadow-sm" />

        {/* Número de cuenta */}
        <div className="mb-3">
          <p className="text-white/50 text-xs mb-0.5">N° de Cuenta</p>
          <p className="text-white font-mono text-sm font-semibold tracking-widest">
            {cuenta
              ? cuenta.replace(/(.{4})/g, "$1 ").trim()
              : "•••• •••• •••• ••••"
            }
          </p>
        </div>

        {/* Banco */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-white/50 text-xs mb-0.5">Banco</p>
            <p className="text-white text-sm font-bold uppercase tracking-wide">
              {banco || "BANCO"}
            </p>
          </div>
          {/* Círculos de Mastercard estilizados */}
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-red-500/70" />
            <div className="w-8 h-8 rounded-full bg-yellow-400/70" />
          </div>
        </div>
      </div>

      {/* CCI debajo de la tarjeta */}
      <div className="mt-3 px-3 py-2.5 bg-slate-100 rounded-xl border
                      border-slate-200">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className="text-xs font-semibold text-slate-500 uppercase
                          tracking-wide mb-0.5">
              CCI — Código de Cuenta Interbancario
            </p>
            <p className="font-mono text-xs text-slate-700 break-all">
              {cci || "Número de 20 dígitos — en el reverso de tu tarjeta"}
            </p>
          </div>
          {/* Flecha indicadora */}
          <div className="shrink-0 mt-1">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1v10M8 11l-3-3M8 11l3-3" stroke="#64748b"
                    strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Leyenda */}
      <div className="mt-2 space-y-1">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-primary-500" />
          <p className="text-xs text-slate-500">
            N° de cuenta: visible en el frente de tu tarjeta
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-slate-400" />
          <p className="text-xs text-slate-500">
            CCI: 20 dígitos, en el app/web de tu banco
          </p>
        </div>
      </div>
    </div>
  )
}