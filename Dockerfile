# Build with:
# docker build -t react-taskflow .
# Run with:
# docker run --rm -p 5173:5173 react-taskflow

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
