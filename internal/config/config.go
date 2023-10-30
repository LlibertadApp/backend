package config

import (
	"context"
	"fmt"
	"os"
	"regexp"

	"github.com/joho/godotenv"
)

type Config struct {
	Context         context.Context
	MinIOEndpoint   string
	MinIOAccessKey  string
	MinIOSecretKey  string
	MinIOUseSSL     bool
	MinIOBucketName string
	MinIOLocation   string
	HTTPPort        string
}

const projectDirName = "backend" // change to relevant project name

func loadEnv() {
	projectName := regexp.MustCompile(`^(.*` + projectDirName + `)`)
	currentWorkDirectory, _ := os.Getwd()
	rootPath := projectName.Find([]byte(currentWorkDirectory))

	err := godotenv.Load(string(rootPath) + `/.env`)

	if err != nil {
		fmt.Println("No .env found for development context")
		return
	}
}

func InitConfig() Config {

	loadEnv()

	cfg := Config{
		Context:         context.Background(),
		MinIOEndpoint:   os.Getenv("MINIO_ENDPOINT"),
		MinIOAccessKey:  os.Getenv("MINIO_ACCESS_KEY"),
		MinIOSecretKey:  os.Getenv("MINIO_SECRET_KEY"),
		MinIOUseSSL:     os.Getenv("MINIO_USE_SSL") == "true",
		MinIOBucketName: os.Getenv("MINIO_BUCKET_NAME"),
		MinIOLocation:   os.Getenv("MINIO_LOCATION"),
		HTTPPort:        os.Getenv("HTTP_PORT"),
	}

	return cfg
}
