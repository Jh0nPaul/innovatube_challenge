# innovatube_challenge
[Angular & NodeJS] InnovaTube Challenge: YouTube search app with user authentication and a favorites list.


This repository contains the solution for the "InnovaTube" technical challenge. The project is a Full Stack web application designed to assess skills in development, third-party API integration, and best practices.

The application allows users to publicly register, log in, and use an interface to search for YouTube videos. It also features a personal "Favorites" section to save and manage a list of videos.

## Core Features

* **User Authentication:** Complete system for Sign Up (with Google ReCaptcha), Sign In, and Password Recovery.
* **Security:** Implemented [**Mention your method, e.g., password hashing with bcrypt and JSON Web Tokens (JWT) for sessions**].
* **Video Search:** Connection to the YouTube Data API to fetch and list videos in real-time.
* **Favorites Management:** Functionality for authenticated users to add or remove videos from their personal favorites list.
* **Responsive Design:** The UI is fully responsive and optimized for both desktop and mobile devices.

## Tech Stack

This project was built using:

* **Frontend:** [**e.g., Angular 17**]
* **Backend:** [**e.g., NodeJS with Express**]
* **Database:** [**e.g., -------  **]
* **External APIs:** Google ReCaptcha, YouTube Data API.
* **Deployment:** [**e.g., Vercel, Railway **]
* **(Optional) Containers:** [**e.g., Docker**]


# Configuración del Entorno de Desarrollo (GitHub Codespaces)

Este proyecto está configurado para ejecutarse en GitHub Codespaces, lo que garantiza un entorno de desarrollo estandarizado sin necesidad de instalar dependencias como Node.js, npm, o Angular CLI localmente.

1. Preparación y Clonación

El archivo de configuración esencial para este entorno es el .devcontainer/devcontainer.json, que garantiza la versión correcta de Node.js, la instalación automática de Angular CLI, y el reenvío de puertos.

-Para iniciar el Codespace:

Abre el repositorio en GitHub.

Haz clic en el botón verde < > Code.

Selecciona la pestaña Codespaces.

Haz clic en Create codespace on main.

2. Comandos de Inicialización y Ejecución
Una vez que el Codespace termine de construirse (generalmente toma 1-2 minutos), el terminal estará listo.

===================================================================
| COMANDO A EJECUTAR  | NOTAS / DESCRIPCIÓN                       |
===================================================================
| npm run setup-dev   | Instala las dependencias (npm install)    |
|                     | tanto en las carpetas frontend como       |
|                     | backend.                                  |
-------------------------------------------------------------------
| npm run start:backend | Inicia el servidor de Node.js (se       |
|                       | ejecutará en el puerto 3000).           |
-------------------------------------------------------------------
| npm run start:frontend | Inicia la aplicación Angular (se       |
|                        | ejecutará en el puerto 4200).          |
===================================================================


3. Acceso a la Aplicación
Cuando ejecutes los comandos de inicio, el Codespace detectará automáticamente los puertos abiertos (3000 y 4200) y te ofrecerá una notificación o un enlace en la pestaña "Ports" del VS Code integrado.

===================================================================
| SERVICIO        | PUERTO | USO                                    |
===================================================================
| Frontend (App)  | 4200   | Accede a la interfaz de usuario de     |
|                 |        | InnovaTube.                            |
-------------------------------------------------------------------
| Backend (API)   | 3000   | Punto de conexión para la API.         |
=================================================================== 


# ARCHIVO DE CONFIGURACIÓN CLAVE
Para la revisión, la configuración del entorno se encuentra en:

.devcontainer/devcontainer.json

===============================================================================
// Este archivo asegura que Node.js y Angular CLI se instalen automáticamente.
{
    "name": "InnovaTube Full-Stack (Node & Angular)",
    "image": "mcr.microsoft.com/devcontainers/typescript-node:20-bullseye",
    
    // Instalación automática de Angular CLI al crear el Codespace
    "postCreateCommand": "npm install -g @angular/cli",
    
    // Reenvío automático de puertos (Frontend y Backend)
    "forwardPorts": [4200, 3000], 
    
    "customizations": {
        "vscode": {
            "extensions": [
                "angular.ng-template",
                "esbenp.prettier-vscode",
                "ms-vscode.vscode-typescript-tslint-plugin"
            ]
        }
    }
}

===============================================================================

Nota: Recuerda que para que los comandos de la tabla funcionen, debes asegurarte de haber añadido los scripts start:backend, start:frontend y setup-dev a tu archivo principal package.json.


{
  "name": "innovatube-challenge",
  "version": "1.0.0",
  "description": "Reto técnico Full Stack para InnovaTube: Buscador de YouTube con gestión de favoritos y autenticación de usuarios.",
  "main": "index.js",
  "scripts": {
    
    // ------------------------------------------------------------------
    // 1. COMANDOS DE CONFIGURACIÓN (SETUP)
    // ------------------------------------------------------------------
    "setup-dev": "npm run install:backend && npm run install:frontend",
    "install:backend": "cd backend && npm install",
    "install:frontend": "cd frontend && npm install",

    // ------------------------------------------------------------------
    // 2. COMANDOS DE EJECUCIÓN (START)
    // ------------------------------------------------------------------
    "start:backend": "cd backend && npm start",
    "start:frontend": "cd frontend && npm start",
    
    // Opcional: Para ejecutar ambos a la vez (requiere 'concurrently' o similar)
    // "start:dev": "npm run start:backend & npm run start:frontend",

    // ------------------------------------------------------------------
    // 3. COMANDOS DE PRUEBA (TEST)
    // ------------------------------------------------------------------
    "test:backend": "cd backend && npm test",
    "test:frontend": "cd frontend && npm test"
  },
  "keywords": [
    "angular",
    "nodejs",
    "youtube-api",
    "fullstack",
    "codespaces"
  ],
  "author": "",
  "license": "ISC",
  "dependencies": {
    // Si usas herramientas como 'concurrently' ponlas aquí
  }
}

==================================================================================