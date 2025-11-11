package config

import (
	"os"
	"strconv"
)

// Config holds application configuration
type Config struct {
	Port         string
	MaxUUIDCount int
	ReadTimeout  int
	WriteTimeout int
	IdleTimeout  int
	BuildVersion string
	GitCommit    string
}

// Load loads configuration from environment variables with defaults
func Load() *Config {
	return &Config{
		Port:         getEnv("PORT", "8080"),
		MaxUUIDCount: getEnvAsInt("MAX_UUID_COUNT", 1000),
		ReadTimeout:  getEnvAsInt("READ_TIMEOUT", 3),
		WriteTimeout: getEnvAsInt("WRITE_TIMEOUT", 3),
		IdleTimeout:  getEnvAsInt("IDLE_TIMEOUT", 60),
		BuildVersion: getEnv("BUILD_VERSION", "dev"),
		GitCommit:    getEnv("GIT_COMMIT", "local"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}
