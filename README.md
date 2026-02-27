# Lumina Estética - Sistema Integral para Clínicas Estéticas

> **"Un empleado trabajando 24/7 gratis en tu negocio."**

Sistema web completo para clínicas estéticas con tres módulos integrados:
- 🌐 **Landing page pública** con chatbot inteligente
- 📅 **Sistema de reserva online** 
- 📊 **Panel Admin CRM** con agenda y gestión de clientes

---

## ✨ Características

- Chatbot IA con OpenAI (GPT-4o-mini)
- Reserva de turnos 24/7 desde la web
- Panel de administración sin login
- Gestión de clientes y historial
- Diseño premium "spa europeo"
- Totalmente funcional y listo para usar

---

## 🚀 Instalación Rápida

### 1. Clonar el proyecto

```bash
git clone https://github.com/TU_USUARIO/lumina-estetica.git
cd lumina-estetica
```

### 2. Instalar dependencias

```bash
# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend (nueva terminal)
cd ../frontend
npm install
```

### 3. Configurar variables de entorno

Copia los archivos de ejemplo y configura tus credenciales:

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env.local
```

Edita los archivos `.env` con tus datos:

#### `backend/.env`
```env
# OBLIGATORIO - Obtén tu API key en: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-tu-api-key-aqui

# Opcional (valores por defecto)
PORT=3001
OPENAI_MODEL=gpt-4o-mini
```

#### `frontend/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## ▶️ Ejecutar el Proyecto

### Terminal 1 - Backend
```bash
cd backend
npm start
```
El backend estará en: `http://localhost:3001`

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
La aplicación estará en: `http://localhost:3000`

---

## 📱 Uso del Sistema

### Landing Page (`/`)
- Visitar la página principal
- Chatear con el asistente virtual "Luna"
- Reservar un turno

### Reserva de Turnos (`/reservar`)
1. Seleccionar servicio
2. Elegir fecha y horario
3. Completar datos del cliente

### Panel Admin (`/admin`)
- **Agenda**: Ver y gestionar turnos
- **CRM**: Ver clientes y notas

> ⚠️ **Nota**: El panel admin no tiene autenticación (demo). En producción, agregar protección.

---

## ☁️ Deploy Gratuito

### Frontend - Vercel (Recomendado)

1. Crear cuenta en [vercel.com](https://vercel.com)
2. Importar el proyecto desde GitHub
3. Configurar:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Environment Variables: `NEXT_PUBLIC_API_URL`
4. Deploy automático

### Backend - Railway o Render

#### Opción A: Railway
1. Cre cuenta en [railway.app](https://railway.app)
2. New Project → "Deploy from GitHub repo"
3. Configurar variables de entorno en Railway
4. El backend получит URL como `https://tu-backend.railway.app`

#### Opción B: Render
1. Crear cuenta en [render.com](https://render.com)
2. New Web Service → conectar GitHub
3. Build Command: `npm install && npm start`
4. Configurar variables de entorno

#### Configurar Frontend con Backend en Producción

Cuando deployes el backend, actualiza el frontend:
```env
NEXT_PUBLIC_API_URL=https://tu-backend-production.com
```

---

## 🗄️ Base de Datos (Opcional)

El proyecto usa archivos JSON por defecto (datos se guardan localmente). Para persistencia real:

### Opción 1: Mantener JSON (Recomendado para demo)
Los datos se guardan en:
- `backend/data/clientes.json`
- `backend/data/turnos.json`

### Opción 2: Migrar a Supabase (Producción)

1. Crear cuenta en [supabase.com](https://supabase.com)
2. New Project → configurar nombre y contraseña
3. Waiting initialization... luego "Settings" → "API"
4. Copiar URL y anon key

5. Crear tablas en SQL Editor:

```sql
-- Tabla clientes
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telefono TEXT,
  notasInternas TEXT DEFAULT '',
  origen TEXT DEFAULT 'web',
  valorTotalManual NUMERIC DEFAULT 0,
  creadoEn TIMESTAMP DEFAULT NOW()
);

-- Tabla turnos
CREATE TABLE turnos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clienteId UUID REFERENCES clientes(id),
  clienteNombre TEXT NOT NULL,
  clienteEmail TEXT NOT NULL,
  clienteTelefono TEXT,
  servicio TEXT NOT NULL,
  servicioId TEXT NOT NULL,
  fecha DATE NOT NULL,
  hora TEXT NOT NULL,
  estado TEXT DEFAULT 'pendiente',
  notas TEXT DEFAULT '',
  creadoEn TIMESTAMP DEFAULT NOW()
);
```

6. Actualizar backend para usar Supabase (requiere desarrollo adicional)

---

## 🛠️ Configuración

### Cambiar Servicios

Edita `backend/routes/constantes.js`:

```javascript
const SERVICIOS = [
  {
    id: "facial",
    nombre: "Tratamiento Facial",
    descripcion: "Tu descripción",
    precio: 15000,
    duracion: 60,
    icono: "Sparkles"
  },
  // Agregar más servicios...
]
```

### Personalizar Chatbot

Edita `backend/prompts/systemPrompt.js` para cambiar el comportamiento del asistente.

### Colores del Diseño

Edita `frontend/app/globals.css` para cambiar colores:

```css
:root {
  --rose: #C9967A;        /* Color principal */
  --gold: #B8973A;        /* Color secundario */
  --cream: #FAF6F1;       /* Fondo */
}
```

---

## 📋 Estructura del Proyecto

```
lumina-estetica/
├── frontend/              # Next.js 14
│   ├── app/
│   │   ├── page.tsx      # Landing page
│   │   ├── reservar/     # Sistema de reservas
│   │   └── admin/        # Panel admin
│   ├── components/       # Componentes React
│   └── lib/              # Utilidades y API
│
├── backend/              # Node.js + Express
│   ├── routes/           # API endpoints
│   ├── services/         # Lógica de negocio
│   └── data/             # Archivos JSON
│
└── README.md
```

---

## ⚠️ Notas Importantes

- **Sin autenticación**: El panel `/admin` es público. Agregar auth para producción.
- **Datos en JSON**: Se pierden al reiniciar el servidor (ideal para demos).
- **API de OpenAI**: Requiere API key de pago por uso (~$1-5/mes para uso normal).
- **Rate limiting**: Incluido por defecto para proteger el backend.

---

## ❓ Problemas Comunes

### "Failed to fetch" en el chat
- Verificar que `OPENAI_API_KEY` esté configurada en `.env`
- Reiniciar el backend: `Ctrl+C` y `npm start`

### Error de CORS
- El backend está configurado para permitir todos los origenes (`*`)
- Si tenés problemas, verificá que el frontend apunte a la URL correcta

### No aparecen turnos en la agenda
- Los datos se guardan en archivos JSON
- Si ejecutás en localhost, los datos Persisten
- En deploy, considerá usar Supabase

---

## 📄 Licencia

MIT - Puedes usar este proyecto para lo que quieras.

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crear branch: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abrir Pull Request

---

¿Dudas o sugerencias? ¡Abre un issue en GitHub!
