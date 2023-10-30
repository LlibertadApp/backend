package api

import (
	"context"
	"io"
	"net/http"

	"github.com/gorilla/mux"
)

type MinIORepository interface {
	UploadFile(ctx context.Context, objectName, contentType string, file io.Reader) error
}

func NewRouter(minioRepo MinIORepository) *mux.Router {
	r := mux.NewRouter()

	r.HandleFunc("/upload", func(w http.ResponseWriter, r *http.Request) {
		UploadHandler(w,r,minioRepo)
	}).Methods("POST")

	return r
}
