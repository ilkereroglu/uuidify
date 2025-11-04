package main

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/google/uuid"
)

func TestUUIDHandlerTextFormatMultiple(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/?count=3&format=text", nil)
	rr := httptest.NewRecorder()

	uuidHandler(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected status %d, got %d", http.StatusOK, rr.Code)
	}

	if ct := rr.Header().Get("Content-Type"); ct != "text/plain" {
		t.Fatalf("expected Content-Type text/plain, got %q", ct)
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
}
