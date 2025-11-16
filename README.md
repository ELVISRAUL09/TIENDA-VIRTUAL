# TIENDA-VIRTUAL
Proyecto (tienda virtual)

ShopMaster - Tienda Online con Carrito y Pasarela de Pago
📝 Descripción del Proyecto
ShopMaster es una tienda online responsiva desarrollada con HTML5, CSS3, JavaScript (ES6+), Bootstrap 5 y Font Awesome. La aplicación consume la API pública FakeStoreAPI para mostrar productos en tarjetas interactivas, permite agregar productos a un carrito de compras, simula una pasarela de pago y genera un ticket de compra en formato PDF (usando jsPDF).
Características principales:

Visualización de productos en tarjetas con imagen, título, descripción y precio.
Modal para ver detalles ampliados de cada producto.
Carrito de compras con persistencia en LocalStorage.
Pasarela de pago simulada con validación básica.
Generación de ticket de compra en PDF (formato tipo recibo térmico).
Diseño responsivo para móviles, tablets y desktop.
Animaciones suaves y mensajes de confirmación.

🛠 Tecnologías Utilizadas

Tecnología,Versión,Descripción
HTML5,-,Estructura semántica de la página.
CSS3,-,Estilos personalizados y diseño responsivo.
JavaScript,ES6+,Lógica de la aplicación, consumo de API y manipulación del DOM.
Bootstrap 5,5.3.0,Framework CSS para diseño responsivo y componentes UI.
Font Awesome,6.4.0,Iconos vectoriales para botones y elementos visuales.
jsPDF,2.5.1,Generación de tickets de compra en PDF.
FakeStoreAPI,-,API pública para obtener productos de ejemplo.

💻 Instrucciones de Instalación y Despliegue
1. Requisitos previos

Navegador web moderno (Chrome, Firefox, Edge, Safari).
Editor de código (recomendado: Visual Studio Code).
Extensión Live Server (opcional, para desarrollo local).


2. Instalación local

Clona o descarga el repositorio (o crea una carpeta y copia los archivos manualmente).
Estructura de archivos:
tu-proyecto/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── script.js
│   └── jspdf.min.js
└── img/
    └── (opcional, para imágenes locales)
Descarga jsPDF:

Descarga jspdf.min.js y guárdalo en la carpeta js/.


Abre el proyecto:

Abre index.html en tu navegador (usa Live Server para mejor experiencia).




3. Despliegue en GitHub Pages
Paso a paso (sin comandos):

Crea una cuenta en GitHub (si no tienes):

Ve a github.com y regístrate.


Crea un nuevo repositorio:

Haz clic en "New" (Nuevo repositorio).
Ponle un nombre (ej: shopmaster-tienda).
Selecciona "Public" o "Private".
Haz clic en "Create repository".


Sube los archivos:

En la página del repositorio, arrastra y suelta los archivos de tu proyecto en la sección "Drag and drop files".
Haz clic en "Commit changes".


Activa GitHub Pages:

Ve a la pestaña "Settings" (Configuración).
En el menú lateral, selecciona "Pages".
En "Source", elige la rama "main" o "master".
Haz clic en "Save".
Espera unos minutos y refresca la página. Aparecerá la URL de tu sitio (ej: https://tu-usuario.github.io/shopmaster-tienda/).




4. Despliegue en Vercel
Paso a paso:

Crea una cuenta en Vercel:

Ve a vercel.com y regístrate con GitHub.


Importa tu proyecto:

Haz clic en "New Project".
Selecciona el repositorio de GitHub donde subiste el proyecto.
Haz clic en "Import".


Configura el despliegue:

Vercel detectará automáticamente que es un proyecto estático.
Haz clic en "Deploy".


Accede a tu sitio:

Una vez finalizado, haz clic en "Visit" para ver tu tienda en línea.




📜 Créditos y Licencias
Autor

Nombre: [ELVIS RAUL]
GitHub: [ELVISRAUL09]

Agradecimientos

FakeStoreAPI por proporcionar datos de ejemplo.
Bootstrap y Font Awesome por los componentes y iconos.
jsPDF por la generación de PDFs.

Licencia
Este proyecto está bajo la Licencia MIT:

Puedes usar, modificar y distribuir el código libremente.
Incluye una copia de la licencia en tu repositorio.


📌 Notas adicionales

Personalización: Puedes cambiar colores, fuentes y textos editando los archivos styles.css y script.js.
Mejoras futuras: Integración con pasarelas de pago reales (Stripe, PayPal), autenticación de usuarios, y más.
