# Establecer la imagen base
FROM golang:1.19.6-alpine

WORKDIR /app

COPY . .

#RUN go mod download
RUN go mod tidy

ARG PORT
ENV PORT=${PORT}

RUN go build -o /app/main ./cmd/main.go
EXPOSE ${PORT}

CMD ["/app/main"]