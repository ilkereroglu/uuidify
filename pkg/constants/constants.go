package constants

const (
	// DefaultVersion is the default UUID version
	DefaultVersion = "v4"
	// DefaultCount is the default number of UUIDs to generate
	DefaultCount = 1
	// DefaultFormat is the default response format
	DefaultFormat = "json"
	// MaxUUIDCount is the maximum number of UUIDs that can be generated in a single request
	MaxUUIDCount = 1000
	// DefaultPort is the default server port
	DefaultPort = "8080"
)

// ValidVersions contains all supported UUID versions
var ValidVersions = []string{"v1", "v4", "v7"}

// ValidFormats contains all supported response formats
var ValidFormats = []string{"json", "text"}
