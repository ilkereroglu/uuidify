# uuidify

A simple public UUID Generator API — built with Go, minimal, fast, and developer-friendly.

---

## 🚀 Quick Example
```bash
curl https://api.uuidify.io
# → {"uuid":"550e8400-e29b-41d4-a716-446655440000"}
```

---

## 🔧 Parameters

| Parameter | Type | Default | Description |
|------------|------|----------|--------------|
| `version` | string | `v4` | UUID version (`v1`, `v4`, or `v7`) |
| `count` | int | `1` | Number of UUIDs to generate (1–1000) |
| `format` | string | `json` | Response format: `json` or `text` |

### Examples
```bash
curl "https://api.uuidify.io?version=v1"
curl "https://api.uuidify.io?version=v7&count=5"
curl "https://api.uuidify.io?format=text"
```

---

## 🧩 Local Development
```bash
go run ./cmd/server
```
Visit → [http://localhost:8080](http://localhost:8080)

---

## 🐳 Docker Usage
```bash
docker build -t uuidify:latest .
docker run -p 8080:8080 uuidify:latest
```

---

## 🧠 Roadmap
- [ ] Cloudflare Workers deployment (`api.uuidify.io`)
- [ ] Cloudflare Pages documentation site (`www.uuidify.io`)
- [ ] OpenAPI spec + Postman collection
- [ ] SDKs for Node.js / Go / Python
- [ ] Public uptime & metrics dashboard

---

## 🤝 Contributing
Pull requests are welcome!  
For major changes, please open an issue first to discuss what you’d like to improve or add.  
Follow conventional commit messages and write clean, readable code.

---

## 📝 License
MIT © 2025 İlker Eroğlu
