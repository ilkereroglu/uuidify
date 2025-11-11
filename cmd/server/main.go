package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/ilkereroglu/uuidify/internal/config"
	"github.com/ilkereroglu/uuidify/internal/handler"
	"github.com/ilkereroglu/uuidify/internal/middleware"
	"github.com/ilkereroglu/uuidify/internal/service"
)

func main() {
	cfg := config.Load()

	uuidService := service.NewUUIDService(cfg.MaxUUIDCount)
	uuidHandler := handler.NewUUIDHandler(uuidService)
	healthHandler := handler.NewHealthHandler(cfg.BuildVersion, cfg.GitCommit)
	metricsHandler := handler.NewMetricsHandler()

	mux := http.NewServeMux()
	mux.HandleFunc("/", uuidHandler.Handle)
	mux.HandleFunc("/health", healthHandler.Handle)
	mux.HandleFunc("/metrics", metricsHandler.Handle)

	handlerChain := middleware.CORS(
		middleware.Logging(
			middleware.Recovery(mux),
		),
	)

	server := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           handlerChain,
		ReadHeaderTimeout: time.Duration(cfg.ReadTimeout) * time.Second,
		WriteTimeout:      time.Duration(cfg.WriteTimeout) * time.Second,
		IdleTimeout:       time.Duration(cfg.IdleTimeout) * time.Second,
	}

	go func() {
		log.Printf("🚀 uuidify API running on %s", server.Addr)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("server error: %v", err)
		}
	}()

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
