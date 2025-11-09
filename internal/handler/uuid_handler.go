package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/ilkereroglu/uuidify/internal/models"
	"github.com/ilkereroglu/uuidify/internal/service"
	"github.com/ilkereroglu/uuidify/internal/validator"
)

// UUIDHandler handles UUID generation requests
type UUIDHandler struct {
	service *service.UUIDService
}

// NewUUIDHandler creates a new UUID handler instance
func NewUUIDHandler(svc *service.UUIDService) *UUIDHandler {
	return &UUIDHandler{service: svc}
}

// Handle handles UUID generation requests
func (h *UUIDHandler) Handle(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	params := validator.ParseUUIDParams(r)
	uuids, err := h.service.Generate(params.Version, params.Count)
	if err != nil {
		errorResponse := models.ErrorResponse{Error: err.Error()}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(errorResponse)
		return
	}

	h.sendResponse(w, uuids, params.Format)
}

// sendResponse sends the response in the requested format
func (h *UUIDHandler) sendResponse(w http.ResponseWriter, uuids []string, format string) {
	if format == "text" {
		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		fmt.Fprint(w, strings.Join(uuids, "\n"))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if len(uuids) == 1 {
		response := models.UUIDResponse{UUID: uuids[0]}
		json.NewEncoder(w).Encode(response)
	} else {
		response := models.UUIDsResponse{UUIDs: uuids}
		json.NewEncoder(w).Encode(response)
	}
}
