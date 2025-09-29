# frontend
FROM node:22-alpine AS frontend-build
WORKDIR /usr
COPY frontend/ .
RUN npm install && npm run build

# backend
FROM node:22-alpine
WORKDIR /usr
COPY backend/ ./backend/
RUN cd backend && npm install

COPY --from=frontend-build /usr/dist ./frontend/build

EXPOSE 3000

CMD ["npm", "start", "--prefix", "backend"]
