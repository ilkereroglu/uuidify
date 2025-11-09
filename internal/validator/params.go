package validator

import (
	"net/http"
	"strconv"

	"github.com/ilkereroglu/uuidify/pkg/constants"
)

// UUIDParams holds validated UUID generation parameters
type UUIDParams struct {
	Version string
	Count   int
	Format  string
}

// ParseUUIDParams parses and validates UUID generation parameters from the request
func ParseUUIDParams(r *http.Request) *UUIDParams {
	q := r.URL.Query()
	version := q.Get("version")
	if version == "" {
		version = constants.DefaultVersion
	} else {
		version = ValidateVersion(version)
	}

	count, _ := strconv.Atoi(q.Get("count"))
	count = ValidateCount(count, constants.MaxUUIDCount)

	format := q.Get("format")
	if format == "" {
		format = constants.DefaultFormat
	}
	format = ValidateFormat(format)

	return &UUIDParams{
		Version: version,
		Count:   count,
		Format:  format,
	}
}

// ValidateVersion validates and returns a valid UUID version
func ValidateVersion(version string) string {
	for _, v := range constants.ValidVersions {
		if v == version {
			return version
		}
	}
	return constants.DefaultVersion
}

// ValidateCount validates and clamps the count parameter
func ValidateCount(count int, maxCount int) int {
	if count <= 0 {
		return constants.DefaultCount
	}
	if count > maxCount {
		return maxCount
	}
	return count
}

// ValidateFormat validates and returns a valid response format
func ValidateFormat(format string) string {
	for _, f := range constants.ValidFormats {
		if f == format {
			return format
		}
	}
	return constants.DefaultFormat
}
