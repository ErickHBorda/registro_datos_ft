// src/App.jsx — prueba temporal de componentes UI
import { Input, Select, Checkbox, SectionTitle, FieldGrid } from "./components/ui/FormField"
import { User } from "lucide-react"

export default function App() {
  return (
    <div className="min-h-screen bg-unamba-light p-8">
      <div className="max-w-2xl mx-auto form-card">
        <SectionTitle
          icono={User}
          titulo="Prueba de Componentes UI"
          subtitulo="Verificando que los inputs renderizan correctamente"
        />
        <FieldGrid cols={2}>
          <Input
            label="Apellido Paterno"
            required
            placeholder="Ej: Quispe"
          />
          <Input
            label="DNI"
            required
            placeholder="12345678"
            error="El DNI debe tener 8 dígitos"
          />
          <Select
            label="Sexo"
            required
            opciones={[
              { value: "Masculino", label: "Masculino" },
              { value: "Femenino",  label: "Femenino"  },
            ]}
          />
          <Input
            label="Fecha de Nacimiento"
            type="date"
          />
        </FieldGrid>
        <div className="mt-4">
          <Checkbox label="Donador de órganos" />
        </div>
      </div>
    </div>
  )
}