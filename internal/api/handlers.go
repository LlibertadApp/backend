package api

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, _ := json.Marshal(payload)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	if _, err := w.Write(response); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Print(w, err.Error())
	}
}

type ErrorResponse struct {
	Error string `json:"error"`
}

func respondWithError(w http.ResponseWriter, code int, message string) {
	json := ErrorResponse{Error: message}
	respondWithJSON(w, code, json)
}

func UploadHandler(w http.ResponseWriter, r *http.Request, minioRepo MinIORepository) {
	ctx := r.Context()
	file, handler, err := r.FormFile("file")
	if err != nil {
		log.Println(err)
		respondWithError(w, http.StatusBadGateway, ErrMissingFile)
		return
	}
	defer file.Close()

	objectName := handler.Filename
	contentType := handler.Header.Get("Content-Type")

	err = minioRepo.UploadFile(ctx, objectName, contentType, file)
	if err != nil {
		log.Println("Failed to upload file:", err)
		respondWithError(w, http.StatusBadGateway, ErrFileUploadError)
		return
	} else {
		log.Printf("File uploaded as %s in bucket\n", objectName)
	}

	respondWithJSON(w,http.StatusOK,  map[string]string{"status": "ok"})
}
