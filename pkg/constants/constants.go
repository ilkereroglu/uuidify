package constants

const (
	// DefaultAlgorithm is the default UUID algorithm
	DefaultAlgorithm = "uuid"
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

// ValidAlgorithms is a struct containing all supported UUID algorithms
var ValidAlgorithms = struct {
	UUID string
	ULID string
}{
	UUID: "uuid",
	ULID: "ulid",
}

// ValidAlgorithmsList contains all supported UUID algorithms
var ValidAlgorithmsList = []string{ValidAlgorithms.UUID, ValidAlgorithms.ULID}

// ValidVersions contains all supported UUID versions
var ValidVersions = []string{"v1", "v4", "v7"}

// ValidFormats contains all supported response formats
var ValidFormats = []string{"json", "text"}
