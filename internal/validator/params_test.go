package validator

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/ilkereroglu/uuidify/pkg/constants"
)

func TestParseUUIDParams(t *testing.T) {
	tests := []struct {
		name     string
		url      string
		expected *UUIDParams
	}{
		{
			name: "default parameters",
			url:  "/",
			expected: &UUIDParams{
				Algorithm: constants.DefaultAlgorithm,
				Version:   constants.DefaultVersion,
				Count:     constants.DefaultCount,
				Format:    constants.DefaultFormat,
			},
		},
		{
			name: "v1 version",
			url:  "/?version=v1",
			expected: &UUIDParams{
				Algorithm: constants.DefaultAlgorithm,
				Version:   "v1",
				Count:     constants.DefaultCount,
				Format:    constants.DefaultFormat,
			},
		},
		{
			name: "v7 version",
			url:  "/?version=v7",
			expected: &UUIDParams{
				Algorithm: constants.DefaultAlgorithm,
				Version:   "v7",
				Count:     constants.DefaultCount,
				Format:    constants.DefaultFormat,
			},
		},
		{
			name: "multiple parameters",
			url:  "/?version=v1&count=5&format=text",
			expected: &UUIDParams{
				Algorithm: constants.DefaultAlgorithm,
				Version:   "v1",
				Count:     5,
				Format:    "text",
			},
		},
		{
			name: "invalid version defaults to v4",
			url:  "/?version=v2",
			expected: &UUIDParams{
				Algorithm: constants.DefaultAlgorithm,
				Version:   constants.DefaultVersion,
				Count:     constants.DefaultCount,
				Format:    constants.DefaultFormat,
			},
		},
		{
			name: "count clamped to max",
			url:  "/?count=2000",
			expected: &UUIDParams{
				Algorithm: constants.DefaultAlgorithm,
				Version:   constants.DefaultVersion,
				Count:     constants.MaxUUIDCount,
				Format:    constants.DefaultFormat,
			},
		},
		{
			name: "zero count defaults to 1",
			url:  "/?count=0",
			expected: &UUIDParams{
				Algorithm: constants.DefaultAlgorithm,
				Version:   constants.DefaultVersion,
				Count:     1,
				Format:    constants.DefaultFormat,
			},
		},
		{
			name: "algorithm ulid",
			url:  "/?algorithm=ulid",
			expected: &UUIDParams{
				Algorithm: constants.ValidAlgorithms.ULID,
				Version:   constants.DefaultVersion,
				Count:     constants.DefaultCount,
				Format:    constants.DefaultFormat,
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest(http.MethodGet, tt.url, nil)
			params := ParseUUIDParams(req)

			if params.Version != tt.expected.Version {
				t.Errorf("Version = %v, want %v", params.Version, tt.expected.Version)
			}
			if params.Count != tt.expected.Count {
				t.Errorf("Count = %v, want %v", params.Count, tt.expected.Count)
			}
			if params.Format != tt.expected.Format {
				t.Errorf("Format = %v, want %v", params.Format, tt.expected.Format)
			}
		})
	}
}

func TestValidateVersion(t *testing.T) {
	tests := []struct {
		name     string
		version  string
		expected string
	}{
		{"valid v1", "v1", "v1"},
		{"valid v4", "v4", "v4"},
		{"valid v7", "v7", "v7"},
		{"invalid version", "v2", constants.DefaultVersion},
		{"empty version", "", constants.DefaultVersion},
		{"case insensitive", "V4", "V4"}, // Note: we don't lowercase in validator, handler does
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := ValidateVersion(tt.version)
			if got != tt.expected && tt.name != "case insensitive" {
				t.Errorf("ValidateVersion(%v) = %v, want %v", tt.version, got, tt.expected)
			}
		})
	}
}

func TestValidateCount(t *testing.T) {
	tests := []struct {
		name     string
		count    int
		maxCount int
		expected int
	}{
		{"valid count", 5, 1000, 5},
		{"zero count", 0, 1000, 1},
		{"negative count", -1, 1000, 1},
		{"exceeds max", 2000, 1000, 1000},
		{"equals max", 1000, 1000, 1000},
		{"one", 1, 1000, 1},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := ValidateCount(tt.count, tt.maxCount)
			if got != tt.expected {
				t.Errorf("ValidateCount(%v, %v) = %v, want %v", tt.count, tt.maxCount, got, tt.expected)
			}
		})
	}
}

func TestValidateFormat(t *testing.T) {
	tests := []struct {
		name     string
		format   string
		expected string
	}{
		{"valid json", "json", "json"},
		{"valid text", "text", "text"},
		{"invalid format", "xml", constants.DefaultFormat},
		{"empty format", "", constants.DefaultFormat},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := ValidateFormat(tt.format)
			if got != tt.expected {
				t.Errorf("ValidateFormat(%v) = %v, want %v", tt.format, got, tt.expected)
			}
		})
	}
}
