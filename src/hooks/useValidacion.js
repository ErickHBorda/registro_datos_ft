// Hook para manejar validación en tiempo real con estado tocado/válido
import { useState, useCallback } from "react"

export function useValidacion(reglas = {}) {
  // Campos que el usuario ya tocó (blur o cambio)
  const [tocados, setTocados]  = useState({})
  // Errores actuales por campo
  const [errores, setErrores]  = useState({})

  // ── Marcar campo como tocado ───────────────────────────
  const marcarTocado = useCallback((campo) => {
    setTocados((prev) => ({ ...prev, [campo]: true }))
  }, [])

  // ── Validar un campo individual ────────────────────────
  const validarCampo = useCallback((campo, valor) => {
    const regla = reglas[campo]
    if (!regla) return ""

    // Requerido
    if (regla.requerido) {
      const vacio = valor === "" || valor === null ||
                    valor === undefined ||
                    (typeof valor === "string" && !valor.trim())
      if (vacio) return regla.mensajeRequerido || `${campo} es obligatorio`
    }

    // Patrón regex
    if (regla.patron && valor) {
      if (!regla.patron.test(valor)) {
        return regla.mensajePatron || "Formato inválido"
      }
    }

    // Longitud mínima
    if (regla.minLength && valor && valor.length < regla.minLength) {
      return `Mínimo ${regla.minLength} caracteres`
    }

    // Longitud exacta
    if (regla.length && valor && valor.length !== regla.length) {
      return `Debe tener exactamente ${regla.length} caracteres`
    }

    // Validación personalizada
    if (regla.validar && valor) {
      const resultado = regla.validar(valor)
      if (resultado !== true) return resultado
    }

    return ""
  }, [reglas])

  // ── Validar y marcar un campo ──────────────────────────
  const validar = useCallback((campo, valor) => {
    const error = validarCampo(campo, valor)
    setErrores((prev) => ({ ...prev, [campo]: error }))
    setTocados((prev) => ({ ...prev, [campo]: true }))
    return error === ""
  }, [validarCampo])

  // ── Validar todos los campos ───────────────────────────
  const validarTodo = useCallback((datos) => {
    const nuevosErrores = {}
    const nuevosTocados = {}
    let esValido = true

    Object.keys(reglas).forEach((campo) => {
      const error = validarCampo(campo, datos[campo])
      nuevosErrores[campo] = error
      nuevosTocados[campo] = true
      if (error) esValido = false
    })

    setErrores(nuevosErrores)
    setTocados(nuevosTocados)
    return esValido
  }, [reglas, validarCampo])

  // ── Helpers por campo ──────────────────────────────────
  const props = useCallback((campo, valor) => ({
    error:   errores[campo]  || "",
    tocado:  tocados[campo]  || false,
    valido:  !errores[campo] && (tocados[campo] ? valor !== "" && valor !== null : false),
    onBlur:  () => {
      marcarTocado(campo)
      const error = validarCampo(campo, valor)
      setErrores((prev) => ({ ...prev, [campo]: error }))
    },
    onChange: (e) => {
      const nuevoValor = e.target.type === "checkbox"
        ? e.target.checked
        : e.target.value
      // Validar en tiempo real si ya fue tocado
      if (tocados[campo]) {
        const error = validarCampo(campo, nuevoValor)
        setErrores((prev) => ({ ...prev, [campo]: error }))
      }
      return nuevoValor
    },
  }), [errores, tocados, marcarTocado, validarCampo])

  return {
    errores,
    tocados,
    validar,
    validarTodo,
    marcarTocado,
    props,
  }
}