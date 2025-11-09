package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/google/uuid"
	"github.com/ilkereroglu/uuidify/internal/config"
	"github.com/ilkereroglu/uuidify/internal/handler"
	"github.com/ilkereroglu/uuidify/internal/service"
)

func TestUUIDHandler(t *testing.T) {
	cfg := config.Load()
	uuidService := service.NewUUIDService(cfg.MaxUUIDCount)
	uuidHandler := handler.NewUUIDHandler(uuidService)

	tests := []struct {
		name           string
		url            string
		method         string
		expectedStatus int
		checkResponse  func(*testing.T, *httptest.ResponseRecorder)
	}{
		{
			name:           "GET single UUID JSON",
			url:            "/",
			method:         http.MethodGet,
			expectedStatus: http.StatusOK,
			checkResponse: func(t *testing.T, rr *httptest.ResponseRecorder) {
				var response map[string]string
				if err := json.NewDecoder(rr.Body).Decode(&response); err != nil {
					t.Fatalf("failed to decode response: %v", err)
				}
				if uuidStr, ok := response["uuid"]; !ok {
					t.Fatal("response missing 'uuid' field")
				} else {
					if _, err := uuid.Parse(uuidStr); err != nil {
						t.Fatalf("invalid UUID: %v", err)
					}
				}
			},
		},
		{
			name:           "GET multiple UUIDs JSON",
			url:            "/?count=3",
			method:         http.MethodGet,
			expectedStatus: http.StatusOK,
			checkResponse: func(t *testing.T, rr *httptest.ResponseRecorder) {
				var response map[string][]string
				if err := json.NewDecoder(rr.Body).Decode(&response); err != nil {
					t.Fatalf("failed to decode response: %v", err)
				}
				if uuids, ok := response["uuids"]; !ok {
					t.Fatal("response missing 'uuids' field")
				} else if len(uuids) != 3 {
					t.Fatalf("expected 3 UUIDs, got %d", len(uuids))
				} else {
					for i, uuidStr := range uuids {
						if _, err := uuid.Parse(uuidStr); err != nil {
							t.Fatalf("UUID[%d] is invalid: %v", i, err)
						}
					}
				}
			},
		},
		{
			name:           "GET UUIDs text format",
			url:            "/?count=3&format=text",
			method:         http.MethodGet,
			expectedStatus: http.StatusOK,
			checkResponse: func(t *testing.T, rr *httptest.ResponseRecorder) {
				if ct := rr.Header().Get("Content-Type"); ct != "text/plain; charset=utf-8" {
					t.Fatalf("expected Content-Type text/plain; charset=utf-8, got %q", ct)
				}
				body := strings.TrimSpace(rr.Body.String())
				parts := strings.Split(body, "\n")
				if len(parts) != 3 {
					t.Fatalf("expected 3 UUIDs, got %d: %q", len(parts), body)
				}
				for i, p := range parts {
					if _, err := uuid.Parse(p); err != nil {
						t.Fatalf("part %d is not a valid UUID: %v", i, err)
					}
				}
			},
		},
		{
			name:           "GET UUID v1",
			url:            "/?version=v1",
			method:         http.MethodGet,
			expectedStatus: http.StatusOK,
			checkResponse: func(t *testing.T, rr *httptest.ResponseRecorder) {
				var response map[string]string
				if err := json.NewDecoder(rr.Body).Decode(&response); err != nil {
					t.Fatalf("failed to decode response: %v", err)
				}
				if uuidStr, ok := response["uuid"]; !ok {
					t.Fatal("response missing 'uuid' field")
				} else {
					if _, err := uuid.Parse(uuidStr); err != nil {
						t.Fatalf("invalid UUID: %v", err)
					}
				}
			},
		},
		{
			name:           "GET UUID v7",
			url:            "/?version=v7",
			method:         http.MethodGet,
			expectedStatus: http.StatusOK,
			checkResponse: func(t *testing.T, rr *httptest.ResponseRecorder) {
				var response map[string]string
				if err := json.NewDecoder(rr.Body).Decode(&response); err != nil {
					t.Fatalf("failed to decode response: %v", err)
				}
				if uuidStr, ok := response["uuid"]; !ok {
					t.Fatal("response missing 'uuid' field")
				} else {
					if _, err := uuid.Parse(uuidStr); err != nil {
						t.Fatalf("invalid UUID: %v", err)
					}
				}
			},
		},
		{
			name:           "POST method not allowed",
			url:            "/",
			method:         http.MethodPost,
			expectedStatus: http.StatusMethodNotAllowed,
			checkResponse:  func(t *testing.T, rr *httptest.ResponseRecorder) {},
		},
		{
			name:           "count clamped above max",
			url:            "/?count=1500",
			method:         http.MethodGet,
			expectedStatus: http.StatusOK,
			checkResponse: func(t *testing.T, rr *httptest.ResponseRecorder) {
				var response map[string][]string
				if err := json.NewDecoder(rr.Body).Decode(&response); err != nil {
					t.Fatalf("failed to decode response: %v", err)
				}
				if uuids, ok := response["uuids"]; !ok {
					t.Fatal("response missing 'uuids' field")
				} else if len(uuids) != 1000 {
					t.Fatalf("expected 1000 UUIDs (clamped), got %d", len(uuids))
				}
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest(tt.method, tt.url, nil)
			rr := httptest.NewRecorder()

			uuidHandler.Handle(rr, req)

			if rr.Code != tt.expectedStatus {
				t.Fatalf("expected status %d, got %d", tt.expectedStatus, rr.Code)
			}

			tt.checkResponse(t, rr)
		})
	}
}
