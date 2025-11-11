package handler

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"
)

const serviceName = "uuidify"

var processStartedAt = time.Now()

// HealthHandler handles health check requests
type HealthHandler struct {
	buildVersion string
	gitCommit    string
}

// NewHealthHandler creates a new health handler instance
func NewHealthHandler(buildVersion, gitCommit string) *HealthHandler {
	if buildVersion == "" {
		buildVersion = "dev"
	}
	if gitCommit == "" {
		gitCommit = "local"
	}

	return &HealthHandler{
		buildVersion: buildVersion,
		gitCommit:    gitCommit,
	}
}

// Handle handles health check requests
func (h *HealthHandler) Handle(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	if wantsJSON(r) {
		h.respondJSON(w)
		return
	}

	w.Header().Set("Content-Type", "text/plain")
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte("ok"))
}

func (h *HealthHandler) respondJSON(w http.ResponseWriter) {
	payload := struct {
		Status        string  `json:"status"`
		Timestamp     string  `json:"timestamp"`
		Service       string  `json:"service"`
		Version       string  `json:"version"`
		Commit        string  `json:"commit"`
		UptimeSeconds float64 `json:"uptime_seconds"`
	}{
		Status:        "ok",
		Timestamp:     time.Now().UTC().Format(time.RFC3339),
		Service:       serviceName,
		Version:       h.buildVersion,
		Commit:        h.gitCommit,
		UptimeSeconds: time.Since(processStartedAt).Seconds(),
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(payload)
}

func wantsJSON(r *http.Request) bool {
	return strings.EqualFold(r.URL.Query().Get("format"), "json")
}
