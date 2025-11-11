package service

import (
	"testing"

	"github.com/google/uuid"
	"github.com/oklog/ulid/v2"
)

func TestUUIDService_Generate(t *testing.T) {
	service := NewUUIDService(1000)

	tests := []struct {
		name    string
		req     GenerateRequest
		wantErr bool
	}{
		// UUID tests
		{"v4 single", GenerateRequest{Version: "v4", Count: 1}, false},
		{"v1 multiple", GenerateRequest{Version: "v1", Count: 5}, false},
		{"v7 multiple", GenerateRequest{Version: "v7", Count: 10}, false},
		{"default version single", GenerateRequest{Count: 1}, false},
		{"invalid version", GenerateRequest{Version: "v2", Count: 1}, true},
		{"zero count defaults to 1", GenerateRequest{Version: "v4", Count: 0}, false},
		{"exceeds max clamps to max", GenerateRequest{Version: "v4", Count: 2000}, false},
		{"invalid algorithm", GenerateRequest{Algorithm: "invalid", Count: 1}, true},
		{"empty algorithm defaults to uuid", GenerateRequest{Algorithm: "", Count: 1}, false},
		// ULID tests
		{"ulid single", GenerateRequest{Algorithm: "ulid", Count: 1}, false},
		{"ulid multiple", GenerateRequest{Algorithm: "ulid", Count: 5}, false},
		{"invalid ulid count", GenerateRequest{Algorithm: "ulid", Count: -1}, false},
		{"exceeds ulid max clamps to max", GenerateRequest{Algorithm: "ulid", Count: 2000}, false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := service.Generate(tt.req)
			if (err != nil) != tt.wantErr {
				t.Errorf("Generate() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if err != nil {
				return
			}

			expectedCount := tt.req.Count
			if expectedCount <= 0 {
				expectedCount = 1
			}
			if expectedCount > 1000 {
				expectedCount = 1000
			}

			if len(got) != expectedCount {
				t.Errorf("Generate() returned %d UUIDs, want %d", len(got), expectedCount)
			}

			if tt.req.Algorithm == "" || tt.req.Algorithm == "uuid" {
				for i, uuidStr := range got {
					if _, err := uuid.Parse(uuidStr); err != nil {
						t.Errorf("Generate() UUID[%d] = %q is not valid: %v", i, uuidStr, err)
					}
				}
			}

			if tt.req.Algorithm == "ulid" {
				for i, ulidStr := range got {
					if _, err := ulid.ParseStrict(ulidStr); err != nil {
						t.Errorf("Generate() ULID[%d] = %q is not valid: %v", i, ulidStr, err)
					}
				}
			}
		})
	}
}
