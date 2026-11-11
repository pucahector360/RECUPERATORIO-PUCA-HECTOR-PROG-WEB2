<<<<<<< HEAD
# PC Gamer Store (React + Vite)
1. `npm install`
2. Copiar `.env.example` a `.env` y completar las claves de EmailJS (emailjs.com).
3. `npm run dev` para probar. 
4. Subir a GitHub y ejecutar `npm run deploy` (publica en la rama gh-pages → Settings > Pages).
=======
# UPATecO · Sitio de contacto (React + EmailJS)

Página principal con formulario de contacto funcional (EmailJS) y mapa embebido
de la ubicación de la Universidad UPATecO.

## 1. Configurar EmailJS
1. Creá una cuenta en https://www.emailjs.com
2. **Email Services** → *Add New Service* (Gmail, por ejemplo). Copiá el **Service ID**.
3. **Email Templates** → *Create New Template*. Usá estas variables:
   - Asunto: `{{subject}}`
   - Contenido: `De: {{from_name}} ({{reply_to}})` y `{{message}}`
   - En *To email* poné tu correo. Copiá el **Template ID**.
4. **Account → General** → copiá tu **Public Key**.

## 2. Ejecutar en local
```bash
npm install
cp .env.example .env   # completá las 3 claves
npm run dev
```

## 3. Subir a GitHub y publicar
```bash
git init
git add .
git commit -m "TP final - recuperatorio"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/upateco-contacto.git
git push -u origin main
```
En el repositorio de GitHub:
1. **Settings → Secrets and variables → Actions → New repository secret**: creá
   `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID` y `VITE_EMAILJS_PUBLIC_KEY`.
2. **Settings → Pages → Source: GitHub Actions**.
3. Hacé un push (o *Actions → Run workflow*). El sitio queda en
   `https://TU_USUARIO.github.io/upateco-contacto/`.

## 4. Entrega
Pegá en un bloc de notas la URL del repositorio y la URL de la página publicada,
y subilo a la plataforma educativa.
>>>>>>> 9958fde5ca68f47da9973e36b7bbd5d9e7749ad0
