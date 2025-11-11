package errors

import "fmt"

var (
	// ErrInvalidVersion is returned when an invalid UUID version is requested
	ErrInvalidVersion = fmt.Errorf("invalid UUID version")
	// ErrInvalidCount is returned when an invalid count parameter is provided
	ErrInvalidCount = fmt.Errorf("invalid count parameter")
	// ErrGenerationFailed is returned when UUID generation fails
	ErrGenerationFailed = fmt.Errorf("failed to generate UUID")
	// ErrInvalidAlgorithm is returned when an invalid algorithm is requested
	ErrInvalidAlgorithm = fmt.Errorf("invalid algorithm")
)
