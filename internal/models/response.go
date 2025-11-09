package models

// UUIDResponse represents a single UUID response
type UUIDResponse struct {
	UUID string `json:"uuid"`
}

// UUIDsResponse represents a multiple UUIDs response
type UUIDsResponse struct {
	UUIDs []string `json:"uuids"`
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Error string `json:"error"`
}
