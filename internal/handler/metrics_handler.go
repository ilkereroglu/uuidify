package handler

import (
	"io"
	"net/http"
)

// MetricsHandler exposes a minimal Prometheus-style metrics endpoint.
type MetricsHandler struct{}

// NewMetricsHandler creates a new metrics handler instance.
func NewMetricsHandler() *MetricsHandler {
	return &MetricsHandler{}
}

// Handle responds with a placeholder counter for observability scaffolding.
func (h *MetricsHandler) Handle(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "text/plain; version=0.0.4")
	w.WriteHeader(http.StatusOK)
	_, _ = io.WriteString(w, "# HELP uuidify_requests_total Placeholder metric\n# TYPE uuidify_requests_total counter\nuuidify_requests_total 0\n")
}
