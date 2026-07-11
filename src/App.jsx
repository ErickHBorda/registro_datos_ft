// src/App.jsx — prueba de conexión al backend
import { useEffect, useState } from "react"
import { checkBackend } from "./services/api"

export default function App() {
  const [estado, setEstado] = useState("Verificando conexión...")
  const [ok, setOk]         = useState(null)

  useEffect(() => {
    checkBackend()
      .then(() => { setEstado("Backend conectado ✅"); setOk(true)  })
      .catch(() => { setEstado("Backend no disponible ❌"); setOk(false) })
  }, [])

  return (
    <div className="min-h-screen bg-unamba-light flex items-center justify-center">
      <div className="form-card max-w-sm w-full text-center space-y-4">
        <div className={`w-12 h-12 rounded-full mx-auto
          ${ok === true  ? "bg-green-500" :
            ok === false ? "bg-red-400"   : "bg-slate-300 animate-pulse"}`}
        />
        <h1 className="text-xl font-bold text-unamba-blue">
          Ficha Digital UNAMBA 2025
        </h1>
        <p className={`text-sm font-medium
          ${ok === true  ? "text-green-600" :
            ok === false ? "text-red-500"   : "text-slate-500"}`}>
          {estado}
        </p>
        <p className="text-xs text-slate-400">
          API: {import.meta.env.VITE_API_URL}
        </p>
      </div>
    </div>
  )
}