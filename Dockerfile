# Usa una imagen base de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias de producción
RUN npm ci --only=production

# Copia todo el contenido del proyecto en el contenedor
COPY . .

# Construir el proyecto de Next.js
RUN npm run build

# Exponer el puerto en el que corre la app de Next.js
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start"]