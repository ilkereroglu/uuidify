package service

import (
	"testing"

	"github.com/google/uuid"
)

func TestUUIDService_Generate(t *testing.T) {
	service := NewUUIDService(1000)

	tests := []struct {
		name    string
		version string
		count   int
		wantErr bool
	}{
		{"v4 single", "v4", 1, false},
		{"v1 multiple", "v1", 5, false},
		{"v7 multiple", "v7", 10, false},
		{"invalid version defaults to v4", "v2", 1, false},
		{"zero count defaults to 1", "v4", 0, false},
		{"exceeds max clamps to max", "v4", 2000, false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := service.Generate(tt.version, tt.count)
			if (err != nil) != tt.wantErr {
				t.Errorf("Generate() error = %v, wantErr %v", err, tt.wantErr)
				return
			}

			expectedCount := tt.count
			if expectedCount <= 0 {
				expectedCount = 1
			}
			if expectedCount > 1000 {
				expectedCount = 1000
			}

			if len(got) != expectedCount {
				t.Errorf("Generate() returned %d UUIDs, want %d", len(got), expectedCount)
			}

			for i, uuidStr := range got {
				if _, err := uuid.Parse(uuidStr); err != nil {
					t.Errorf("Generate() UUID[%d] = %q is not valid: %v", i, uuidStr, err)
				}
			}
		})
	}
}

func TestUUIDService_generateSingle(t *testing.T) {
	service := NewUUIDService(1000)

	tests := []struct {
		name    string
		version string
		wantErr bool
	}{
		{"v1", "v1", false},
		{"v4", "v4", false},
		{"v7", "v7", false},
		{"invalid defaults to v4", "v2", false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := service.generateSingle(tt.version)
			if (err != nil) != tt.wantErr {
				t.Errorf("generateSingle() error = %v, wantErr %v", err, tt.wantErr)
				return
			}

			if _, err := uuid.Parse(got); err != nil {
				t.Errorf("generateSingle() returned invalid UUID %q: %v", got, err)
			}
		})
	}
}
