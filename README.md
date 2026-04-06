# 🛡️ Backend Gateway (Firebase Cloud Functions)

![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Google Cloud](https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

Middleware seguro y _serverless_ diseñado para manejar lógica sensible e integraciones de APIs de terceros. Esta arquitectura actúa como un puente (Gateway) que protege las claves privadas y la lógica de negocio, manteniéndolas fuera del alcance del cliente (navegador).

---

## 🏗️ Resumen de Arquitectura

Este proyecto resuelve el problema de seguridad en **frontends estáticos (Astro/GitHub Pages)**. Al delegar operaciones sensibles como la verificación de reCAPTCHA a este Gateway, eliminamos el riesgo de exponer _Provider Secrets_.

- **Frontend:** Astro (SSG) alojado en GitHub Pages.
- **Backend:** Firebase Cloud Functions (Runtime: Node.js 20+).
- **Seguridad:** Comunicación HTTPS cifrada con políticas de CORS restrictivas.

---

## 🛠️ Core API Endpoints

### 1. `validateRecaptcha`

Analiza el comportamiento del usuario mediante **Google reCAPTCHA v3** y asigna una puntuación de legitimidad.

- **Método:** `POST`
- **Seguridad:** - **CORS Protection:** Acceso restringido exclusivamente a dominios autorizados.
  - **Secret Manager:** La clave privada de reCAPTCHA se inyecta en tiempo de ejecución mediante _Firebase Secrets_.
- **Payload:** `{ "token": "string" }`
- **Response:** `{ "success": boolean, "score": number }`

---

## 🔒 Seguridad y Entorno

Este repositorio sigue los estándares de la industria (OWASP). **Ninguna credencial sensible (API Keys, Tokens) se almacena en el código base.**

### Gestión de Secretos

Utilizamos **Google Cloud Secret Manager** a través de la CLI de Firebase. Para configurar el entorno:

```bash
firebase functions:secrets:set RECAPTCHA_SECRET_KEY
```

### Política de CORS

El Cross-Origin Resource Sharing está estrictamente configurado. Solo los dominios en la lista blanca (whitelist) pueden consumir estos recursos, previniendo ataques de Cross-Site Request Forgery (CSRF).

## 🚀 Instalación y Despliegue

### Requisitos Previos

- Node.js v18+
- Firebase CLI (npm install -g firebase-tools)
- Plan Firebase Blaze (Necesario para peticiones salientes a APIs externas).

### Pasos de Despliegue

##### Clonar e instalar:

```Bash
cd functions && npm install
```

#### Login y Selección de Proyecto:

```Bash
firebase login
firebase use --add [PROJECT_ID]
```

#### Desplegar a Producción:

```Bash
firebase deploy --only functions
```

## 📂 Estructura del Proyecto

```
/functions
├── src/
│   ├── index.ts        # Entry point, triggers y configuración de CORS
│   ├── services/       # Lógica de integración (Mail, Recaptcha)
│   └── utils/          # Helpers modulares (Principio DRY)
├── .eslintrc.js        # Reglas de calidad de código
├── package.json        # Dependencias del backend
└── tsconfig.json       # Configuración de TypeScript (ES2022)
```

## 📈 Monitoreo y Mantenimiento

- **Logging**: Trazabilidad completa de ejecuciones mediante Google Cloud Logs Explorer.

- **Escalabilidad**: Configurado con maxInstances: 10 para balancear rendimiento y eficiencia de costes.

- **Cold Starts**: Optimizado mediante la carga modular de dependencias.

## 📩 Contacto

Desarrollado por **Andrés Méndez**.

Enfocado en la creación de arquitecturas seguras y escalables.
