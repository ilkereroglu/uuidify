package service

import (
	"github.com/google/uuid"
	"github.com/ilkereroglu/uuidify/pkg/errors"
)

// UUIDService handles UUID generation logic
type UUIDService struct {
	maxCount int
}

// NewUUIDService creates a new UUID service instance
func NewUUIDService(maxCount int) *UUIDService {
	return &UUIDService{maxCount: maxCount}
}

// Generate generates one or more UUIDs based on the version and count
func (s *UUIDService) Generate(version string, count int) ([]string, error) {
	if count <= 0 {
		count = 1
	}
	if count > s.maxCount {
		count = s.maxCount
	}

	uuids := make([]string, count)
	for i := 0; i < count; i++ {
		uuidStr, err := s.generateSingle(version)
		if err != nil {
			return nil, err
		}
		uuids[i] = uuidStr
	}
	return uuids, nil
}

// generateSingle generates a single UUID based on the version
func (s *UUIDService) generateSingle(version string) (string, error) {
	switch version {
	case "v1":
		u, err := uuid.NewUUID()
		if err != nil {
			return "", errors.ErrGenerationFailed
		}
		return u.String(), nil
	case "v7":
		u, err := uuid.NewV7()
		if err != nil {
			return "", errors.ErrGenerationFailed
		}
		return u.String(), nil
	default:
		return uuid.New().String(), nil
	}
}
