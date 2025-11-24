FROM nginx:alpine

# Copiar TODOS los archivos estáticos
COPY . /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]