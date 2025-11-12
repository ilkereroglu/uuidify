package models

// UUIDResponse represents a single UUID response
type UUIDResponse struct {
	UUID string `json:"uuid"`
}

// ULIDResponse represents a single ULID response
type ULIDResponse struct {
	ULID string `json:"ulid"`
}

// UUIDsResponse represents a multiple UUIDs response
type UUIDsResponse struct {
	UUIDs []string `json:"uuids"`
}

// ULIDsResponse represents a multiple ULIDs response
type ULIDsResponse struct {
	ULIDs []string `json:"ulids"`
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Error string `json:"error"`
}
