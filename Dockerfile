# Usa una imagen base de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Instala pnpm globalmente
RUN npm install -g pnpm

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN pnpm install

# Copia todo el contenido del proyecto en el contenedor
COPY . .

# Construir el proyecto de Next.js
RUN pnpm run build

# Exponer el puerto en el que corre la app de Next.js (cambia si es otro puerto)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["pnpm", "run", "start"]
