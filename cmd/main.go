package main

import (
	"backend/internal/application"
	"backend/internal/config"
	"log"
	"net/http"
)

func main() {

	cfg := config.InitConfig()
	app, err := application.NewApp(cfg)
	if err != nil {
		log.Fatalf("Error al inicializar la aplicación: %v", err)
	}

	http.Handle("/", app.Router)
	log.Printf("Server started on :%s\n", cfg.HTTPPort)
	http.ListenAndServe(":"+cfg.HTTPPort, nil)
}
