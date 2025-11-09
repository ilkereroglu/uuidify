#!/bin/bash

# UUIDify Test Script
# This script runs local tests

set -e

echo "🧪 UUIDify Test Script"
echo "======================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test function
test_endpoint() {
    local url=$1
    local expected_status=$2
    local description=$3
    
    echo -n "Testing: $description... "
    
    if command -v curl > /dev/null; then
        status=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")
        if [ "$status" = "$expected_status" ]; then
            echo -e "${GREEN}✓${NC} (Status: $status)"
            return 0
        else
            echo -e "${RED}✗${NC} (Expected: $expected_status, Got: $status)"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠${NC} curl not found, skipping"
        return 0
    fi
}

# Go tests
echo "1. Running Go tests..."
echo "----------------------"
if make test > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Go tests passed${NC}"
else
    echo -e "${RED}✗ Go tests failed${NC}"
    exit 1
fi
echo ""

# Backend server test (if running)
echo "2. Testing backend server (if running)..."
echo "-----------------------------------------"

BASE_URL="http://localhost:8080"

# Check if server is running
if curl -s -f "$BASE_URL/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Server is running${NC}"
    echo ""
    
    # Endpoint tests
    test_endpoint "$BASE_URL/" "200" "Root endpoint"
    test_endpoint "$BASE_URL/health" "200" "Health check"
    test_endpoint "$BASE_URL/?version=v1" "200" "UUID v1"
    test_endpoint "$BASE_URL/?version=v7&count=3" "200" "UUID v7 multiple"
    test_endpoint "$BASE_URL/?format=text" "200" "Text format"
    
    echo ""
    echo "Sample responses:"
    echo "----------------"
    echo "Single UUID:"
    curl -s "$BASE_URL/" | head -c 100
    echo ""
    echo ""
    echo "Multiple UUIDs:"
    curl -s "$BASE_URL/?count=3" | head -c 150
    echo ""
else
    echo -e "${YELLOW}⚠ Server is not running${NC}"
    echo "Start server with: make dev"
    echo ""
fi

# Worker test (if running)
echo "3. Testing Cloudflare Worker (if running locally)..."
echo "----------------------------------------------------"

WORKER_URL="http://localhost:8787"

if curl -s -f "$WORKER_URL/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Worker is running${NC}"
    echo ""
    
    test_endpoint "$WORKER_URL/" "200" "Worker UUID generate (root)"
    test_endpoint "$WORKER_URL/?count=2" "200" "Worker generate multiple"
    test_endpoint "$WORKER_URL/health" "200" "Worker health check"
    test_endpoint "$WORKER_URL/uuid" "200" "Worker UUID with R2"
else
    echo -e "${YELLOW}⚠ Worker is not running${NC}"
    echo "Start worker with: make worker-dev"
    echo ""
fi

echo ""
echo "======================"
echo -e "${GREEN}Test script completed!${NC}"
