import { Check, ChevronRight } from "lucide-react"
import { PASOS_FICHA } from "../../utils/constants"

export default function BarraProgreso({ pasoActual, onIrAlPaso }) {
  const totalPasos = PASOS_FICHA.length
  const porcentaje = Math.round(((pasoActual - 1) / (totalPasos - 1)) * 100)
  const pasoInfo   = PASOS_FICHA[pasoActual - 1]
  const pasoSig    = PASOS_FICHA[pasoActual] || null

  return (
    <div className="fixed top-0 left-0 right-0 z-30 bg-white shadow-md">

      {/* ══ FRANJA SUPERIOR ════════════════════════════════ */}
      <div className="bg-gradient-to-r from-unamba-blue via-primary-700
                      to-primary-600">
        <div className="max-w-3xl mx-auto px-4 py-2.5
                        flex items-center justify-between gap-4">

          {/* Paso actual con ícono animado */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Badge de paso */}
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-xl bg-white/15 border
                              border-white/25 flex items-center justify-center">
                <span className="text-white font-black text-sm">
                  {pasoActual}
                </span>
              </div>
              {/* Pulso animado en paso activo */}
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3
                               rounded-full bg-green-400 border-2
                               border-unamba-blue animate-pulse" />
            </div>

            <div className="min-w-0">
              <p className="text-white font-bold text-sm truncate leading-tight">
                {pasoInfo.label}
              </p>
              {pasoSig && (
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-blue-300 text-xs">Siguiente:</span>
                  <ChevronRight size={10} className="text-blue-400" />
                  <span className="text-blue-200 text-xs truncate">
                    {pasoSig.label}
                  </span>
                </div>
              )}
              {!pasoSig && (
                <p className="text-green-300 text-xs font-medium mt-0.5">
                  ✓ Último paso — revise y envíe
                </p>
              )}
            </div>
          </div>

          {/* Porcentaje grande */}
          <div className="shrink-0 text-right">
            <div className="flex items-end gap-0.5 justify-end">
              <span className="text-white font-black text-2xl leading-none">
                {porcentaje}
              </span>
              <span className="text-blue-300 text-sm font-bold mb-0.5">%</span>
            </div>
            <p className="text-blue-300 text-xs">
              {pasoActual} de {totalPasos} pasos
            </p>
          </div>
        </div>
      </div>

      {/* ══ BARRA DE PROGRESO GRUESA ════════════════════════ */}
      <div className="h-2 bg-slate-100 relative overflow-hidden">
        {/* Fondo animado tipo shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent
                        via-white/30 to-transparent animate-pulse" />
        {/* Barra de progreso */}
        <div
          className="h-full bg-gradient-to-r from-primary-500 via-primary-400
                     to-green-400 transition-all duration-700 ease-out
                     relative overflow-hidden"
          style={{ width: `${porcentaje}%` }}
        >
          {/* Brillo deslizante */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent
                          via-white/40 to-transparent -skew-x-12
                          animate-pulse" />
        </div>
      </div>

      {/* ══ STEPPER COMPACTO ════════════════════════════════ */}
      <div className="bg-white px-4 py-2">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between relative">

            {/* Línea base */}
            <div className="absolute top-3.5 left-3.5 right-3.5 h-0.5
                            bg-slate-100 z-0" />

            {/* Línea de progreso animada */}
            <div
              className="absolute top-3.5 left-3.5 h-0.5
                         bg-gradient-to-r from-primary-500 to-green-400
                         z-0 transition-all duration-700 ease-out"
              style={{
                width: `calc(${((pasoActual - 1) / (totalPasos - 1)) * 100}%
                        - ${pasoActual === 1 ? "0px" : "7px"})`,
              }}
            />

            {PASOS_FICHA.map((paso) => {
              const completado = paso.id < pasoActual
              const activo     = paso.id === pasoActual
              const pendiente  = paso.id > pasoActual

              return (
                <div
                  key={paso.id}
                  className="flex flex-col items-center gap-1 z-10"
                  style={{ flex: 1, minWidth: 0 }}
                >
                  {/* Círculo del paso */}
                  <button
                    type="button"
                    onClick={() => completado && onIrAlPaso(paso.id)}
                    disabled={!completado}
                    title={completado
                      ? `Editar: ${paso.label}`
                      : activo
                      ? `Paso actual: ${paso.label}`
                      : paso.label
                    }
                    className={`
                      relative w-7 h-7 rounded-full flex items-center
                      justify-center text-xs font-bold
                      transition-all duration-300 border-2
                      ${completado
                        ? `bg-gradient-to-br from-green-400 to-green-600
                           border-green-500 text-white shadow-md
                           shadow-green-200 cursor-pointer
                           hover:scale-110 hover:shadow-green-300`
                        : activo
                        ? `bg-gradient-to-br from-primary-500 to-primary-700
                           border-primary-600 text-white shadow-lg
                           shadow-primary-200 scale-110`
                        : `bg-white border-slate-200 text-slate-300
                           cursor-default`
                      }
                    `}
                  >
                    {completado
                      ? <Check size={12} strokeWidth={3} />
                      : activo
                      ? <span className="relative">
                          {paso.id}
                          {/* Anillo pulsante en paso activo */}
                          <span className="absolute -inset-3 rounded-full
                                           border-2 border-primary-400/40
                                           animate-ping" />
                        </span>
                      : paso.id
                    }
                  </button>

                  {/* Etiqueta desktop */}
                  <span
                    className={`
                      hidden sm:block text-center leading-tight font-medium
                      transition-all duration-300
                      ${activo
                        ? "text-primary-700 font-semibold scale-105"
                        : completado
                        ? "text-green-600"
                        : "text-slate-300"
                      }
                    `}
                    style={{ fontSize: "0.58rem", maxWidth: "52px" }}
                  >
                    {paso.shortLabel}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ══ BARRA INFERIOR DE SEGMENTOS ══════════════════════
          Muestra visualmente cuántos pasos quedan como bloques */}
      <div className="flex h-1">
        {PASOS_FICHA.map((paso) => {
          const completado = paso.id < pasoActual
          const activo     = paso.id === pasoActual
          return (
            <div
              key={paso.id}
              className={`
                flex-1 transition-all duration-500
                ${completado
                  ? "bg-green-400"
                  : activo
                  ? "bg-primary-400 animate-pulse"
                  : "bg-slate-100"
                }
                ${paso.id < totalPasos ? "border-r border-white" : ""}
              `}
            />
          )
        })}
      </div>

    </div>
  )
}