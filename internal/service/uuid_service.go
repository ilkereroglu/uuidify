package service

import (
	"strings"

	"github.com/ilkereroglu/uuidify/pkg/errors"

	"github.com/google/uuid"
	"github.com/oklog/ulid/v2"
)

// UUIDService handles UUID generation logic
type UUIDService struct {
	maxCount int
}

// NewUUIDService creates a new UUID service instance
func NewUUIDService(maxCount int) *UUIDService {
	return &UUIDService{maxCount: maxCount}
}

type GenerateRequest struct {
	Algorithm string `json:"algorithm"`
	Version   string `json:"version"`
	Count     int    `json:"count"`
}

// Generate generates one or more UIDs based on the request.
func (s *UUIDService) Generate(req GenerateRequest) ([]string, error) {
	switch strings.TrimSpace(strings.ToLower(req.Algorithm)) {
	case "uuid", "":
		return s.generateUUID(&req)
	case "ulid":
		return s.generateULID(&req)
	}

	return nil, errors.ErrInvalidAlgorithm
}

// generateUUID generates one or more UUIDs.
func (s *UUIDService) generateUUID(req *GenerateRequest) ([]string, error) {
	count := req.Count
	version := req.Version

	// Ensure count is at least 1
	if count <= 0 {
		count = 1
	}

	// Ensure count does not exceed maxCount
	if count > s.maxCount {
		count = s.maxCount
	}

	// Select the generator based on the version
	var generator func() (uuid.UUID, error)
	switch version {
	case "v4", "":
		generator = uuid.NewRandom
	case "v1":
		generator = uuid.NewUUID
	case "v7":
		generator = uuid.NewV7
	default:
		return nil, errors.ErrInvalidVersion
	}

	// Generate the UUIDs
	uuids := make([]string, count)
	for i := range count {
		if id, err := generator(); err != nil {
			return nil, err
		} else {
			uuids[i] = id.String()
		}
	}

	return uuids, nil
}

// generateULID generates one or more ULIDs based on the version and count
func (s *UUIDService) generateULID(req *GenerateRequest) ([]string, error) {
	count := req.Count

	// Ensure count is at least 1
	if count <= 0 {
		count = 1
	}

	// Ensure count does not exceed maxCount
	if count > s.maxCount {
		count = s.maxCount
	}

	// Generate the ULIDs
	ulids := make([]string, count)
	for i := range count {
		ulids[i] = ulid.Make().String()
	}

	return ulids, nil
}
