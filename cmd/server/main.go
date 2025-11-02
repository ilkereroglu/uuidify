package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/google/uuid"
)

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		q := r.URL.Query()
		version := q.Get("version")
		if version == "" {
			version = "v4"
		}
		count, _ := strconv.Atoi(q.Get("count"))
		if count <= 0 {
			count = 1
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
			fmt.Fprint(w, uuids[0])
			return
		}
		w.Header().Set("Content-Type", "application/json")
		if count == 1 {
			json.NewEncoder(w).Encode(map[string]string{"uuid": uuids[0]})
			return
		}
		json.NewEncoder(w).Encode(map[string][]string{"uuids": uuids})
	})

	mux.HandleFunc("/health", func(w http.ResponseWriter, _ *http.Request) {
		w.Write([]byte("ok"))
	})

	srv := &http.Server{
		Addr:              ":8080",
		Handler:           mux,
		ReadHeaderTimeout: 3 * time.Second,
	}
	log.Println("UUIDify API running on :8080")
	log.Fatal(srv.ListenAndServe())
}
