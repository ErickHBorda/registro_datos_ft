import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
})

// ── Interceptor: manejo global de errores ──────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "Error de conexión con el servidor"
    return Promise.reject(new Error(
      Array.isArray(msg)
        ? msg.map((e) => e.msg).join(", ")
        : msg
    ))
  }
)

// ── Personal ───────────────────────────────────────────────
export const personalService = {

  crear: async (ficha) => {
    const { data } = await api.post("/api/personal/", ficha)
    return data
  },

  obtenerPorId: async (id) => {
    const { data } = await api.get(`/api/personal/${id}`)
    return data
  },

  obtenerPorDni: async (dni) => {
    const { data } = await api.get(`/api/personal/dni/${dni}`)
    return data
  },

  listar: async () => {
    const { data } = await api.get("/api/personal/")
    return data
  },

  actualizar: async (id, ficha) => {
    const { data } = await api.put(`/api/personal/${id}`, ficha)
    return data
  },
}

// ── Fotos ──────────────────────────────────────────────────
export const fotosService = {

  subir: async (personalId, archivo) => {
    const formData = new FormData()
    formData.append("archivo", archivo)
    const { data } = await api.post(
      `/api/fotos/${personalId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    )
    return data
  },

  eliminar: async (personalId) => {
    const { data } = await api.delete(`/api/fotos/${personalId}`)
    return data
  },
}

// ── Health check ───────────────────────────────────────────
export const checkBackend = async () => {
  const { data } = await api.get("/health")
  return data
}

export default api