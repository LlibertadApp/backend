package application

import (
	"backend/internal/api"
	"backend/internal/config"
	"backend/internal/store"

	"github.com/gorilla/mux"
)

type App struct {
	Router *mux.Router
}

func NewApp(cfg config.Config) (*App, error) {
	minioRepo, err := store.NewMinIORepository(
		cfg.Context,
		cfg.MinIOEndpoint,
		cfg.MinIOAccessKey,
		cfg.MinIOSecretKey,
		cfg.MinIOBucketName,
		cfg.MinIOLocation,
		cfg.MinIOUseSSL,
	)
	if err != nil {
		return nil, err
	}

	router := api.NewRouter(minioRepo)

	return &App{
		Router: router,
	}, nil
}
