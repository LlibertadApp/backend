package store

import (
	"context"
	"io"
	"log"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type MinIORepository struct {
	BucketName string
	minioClient *minio.Client
}

func NewMinIORepository(ctx context.Context, endpoint, accessKeyID, secretAccessKey, bucketName, location string, useSSL bool) (*MinIORepository, error) {
	minioClient, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
		Secure: useSSL,
	})
	if err != nil {
		return nil, err
	}

	err = minioClient.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{Region: location})
	if err != nil {
		exists, errBucketExists := minioClient.BucketExists(ctx, bucketName)
		if errBucketExists == nil && exists {
			log.Printf("Bucket %s already exists\n", bucketName)
		} else {
			return nil, err
		}
	}

	return &MinIORepository{minioClient: minioClient, BucketName: bucketName}, nil
}

func (r *MinIORepository) UploadFile(ctx context.Context, objectName, contentType string, file io.Reader) error {

	_, err := r.minioClient.PutObject(ctx, r.BucketName, objectName, file, -1, minio.PutObjectOptions{
		ContentType: "application/csv",
	})
	return err
}
