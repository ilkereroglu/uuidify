package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"strings"
	"syscall"
	"time"

	"github.com/google/uuid"
)

const maxUUIDCount = 1000

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/", uuidHandler)
	mux.HandleFunc("/health", func(w http.ResponseWriter, _ *http.Request) {
		w.Write([]byte("ok"))
	})

	server := &http.Server{
		Addr:              ":8080",
		Handler:           mux,
		ReadHeaderTimeout: 3 * time.Second,
	}

	go func() {
		log.Printf("🚀 uuidify API running on %s", server.Addr)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("server error: %v", err)
		}
	}()

	// Graceful shutdown
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)
	<-stop

	log.Println("🧹 Shutting down gracefully...")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("shutdown error: %v", err)
	}
	log.Println("✅ Server stopped cleanly.")
}

func uuidHandler(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	version := q.Get("version")
	if version == "" {
		version = "v4"
	}
	count, err := strconv.Atoi(q.Get("count"))
	if err != nil {
		count = 0
	}
	if count <= 0 {
		count = 1
	}
	if count > maxUUIDCount {
		count = maxUUIDCount
	}
	format := q.Get("format")

	uuids := make([]string, count)
	for i := 0; i < count; i++ {
		switch version {
		case "v1":
			u, _ := uuid.NewUUID()
			uuids[i] = u.String()
		case "v7":
			u, _ := uuid.NewV7()
			uuids[i] = u.String()
		default:
			uuids[i] = uuid.New().String()
		}
	}

	if format == "text" {
		w.Header().Set("Content-Type", "text/plain")
		fmt.Fprint(w, strings.Join(uuids, "\n"))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if count == 1 {
		json.NewEncoder(w).Encode(map[string]string{"uuid": uuids[0]})
	} else {
		json.NewEncoder(w).Encode(map[string][]string{"uuids": uuids})
	}
}
