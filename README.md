<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Spring_Boot-3.4.5-6DB33F?style=flat-square&logo=springboot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Redis-7-DC382D?style=flat-square&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License" />
</p>

<h1 align="center">🎓 CampusConnect</h1>

<p align="center">
  <strong>A verified, college-based social networking platform built with microservices architecture.</strong><br/>
  Students connect, share, and communicate within trusted campus communities.
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#-deployment">Deployment</a>
</p>

---

## 📸 Preview

<table>
<tr>
<td align="center"><strong>🌙 Landing Page</strong></td>
<td align="center"><strong>💬 Real-time Chat</strong></td>
</tr>
<tr>
<td>Dark-themed hero with animated gradient text, floating particles, and a scrolling marquee. Built with Framer Motion.</td>
<td>WebSocket-powered messaging with typing indicators, read receipts, and contact list.</td>
</tr>
</table>

> **Run locally:** `cd frontend/campusconnect && npm install && npm run dev` → open http://localhost:5173

---

## ✨ Features

### Core Platform
- **JWT Authentication** — Secure signup/login with email OTP verification
- **College-Specific Feed** — Posts visible only to your verified campus community
- **Real-Time Messaging** — WebSocket-powered chat with typing indicators and read receipts
- **Connection System** — Send/accept/reject friend requests with live notifications
- **Profile Management** — Bio, skills, interests, profile photo upload
- **Events** — Create and RSVP to campus events

### Dashboard
| Section | Description |
|---------|-------------|
| Home Feed | Create posts with media, like, comment, infinite scroll |
| My College | Directory of verified students at your college |
| Explore | Discover posts and colleges across the platform |
| Trending | Top hashtags and hot discussions |
| Messages | Real-time chat with typing indicators |
| Events | Campus events with RSVP system |
| Profile | Edit bio, skills, upload photo, view stats |
| Settings | Account, notifications, privacy, appearance |

### Production Features
- 🔒 Path traversal protection on file uploads
- 🛡️ Security headers (X-Frame-Options, CSP, XSS-Protection)
- ⚡ Gzip compression + static asset caching
- 🔄 Health checks on all services
- 📊 Actuator endpoints for monitoring
- 🎨 Dark theme with smooth animations
- ♿ WCAG-compliant focus states and contrast ratios
- 📱 Fully responsive (375px → 1440px)

---

## 🏗️ Architecture

```
                                    ┌─────────────────────────┐
                                    │    Service Discovery    │
                                    │    Eureka (8761)        │
                                    └────────────┬────────────┘
                                                 │ register/discover
┌──────────────┐    ┌──────────────┐    ┌────────┴────────┐
│   Browser    │───▶│    Nginx     │───▶│   API Gateway   │
│              │    │  (Port 80)   │    │   (Port 8095)   │
│              │    │  + Security  │    │   + CORS        │
│              │    │  + Gzip      │    │   + Routing     │
└──────────────┘    │  + Rate Limit│    └───────┬─────────┘
                    └──────────────┘            │
                              ┌─────────────────┼─────────────────┐
                              ▼                                   ▼
                    ┌─────────────────┐              ┌─────────────────┐
                    │  User Service   │              │  Post Service   │
                    │   (Port 8081)   │              │   (Port 8082)   │
                    ├─────────────────┤              ├─────────────────┤
                    │ • Auth (JWT)    │              │ • Posts CRUD    │
                    │ • Users         │              │ • Comments      │
                    │ • Messaging     │              │ • Likes         │
                    │ • Connections   │              │ • File Upload   │
                    │ • Events        │              │ • College Feed  │
                    │ • Notifications │              └────────┬────────┘
                    │ • WebSocket     │                       │
                    └────────┬────────┘                       │
                             │                               │
                    ┌────────┴───────────────────────────────┴──┐
                    │              PostgreSQL 16                  │
                    │           (campus-connect DB)               │
                    └────────────────────┬───────────────────────┘
                                         │
                    ┌────────────────────┴───────────────────────┐
                    │                Redis 7                      │
                    │         (Caching + Sessions)                │
                    └────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React, Vite, Tailwind CSS, Framer Motion, Zustand | 19, 8, 4, 12, 5 |
| **Backend** | Java, Spring Boot, Spring Security, Spring Cloud | 17, 3.4.5, 6.x, 2024.0.1 |
| **Database** | PostgreSQL | 16 |
| **Cache** | Redis | 7 |
| **Messaging** | WebSocket (STOMP + SockJS) | — |
| **Discovery** | Netflix Eureka | — |
| **Gateway** | Spring Cloud Gateway | — |
| **Auth** | JWT (jjwt) | 0.11.5 |
| **Icons** | Lucide React | 1.12 |
| **DevOps** | Docker, Docker Compose, GitHub Actions | — |

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version |
|------|---------|
| Java | 17+ |
| Node.js | 20+ |
| PostgreSQL | 14+ |
| Maven | 3.8+ |
| Docker (optional) | 24+ |

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/maa101-hub/campus-connect.git
cd campus-connect

# Create environment file
cp .env.example .env
# Edit .env with your values (DB password, mail config, JWT secret)

# Start all services
docker compose up --build

# Access the app:
# Frontend:        http://localhost:3000
# API Gateway:     http://localhost:8095
# Eureka Dashboard: http://localhost:8761
```

### Option 2: Manual Setup

<details>
<summary><strong>Click to expand manual setup instructions</strong></summary>

#### 1. Database

```bash
createdb campus-connect
```

#### 2. Environment

```bash
cp .env.example .env
# Fill in your actual values
```

#### 3. Backend Services (start in order)

```bash
# Terminal 1 — Discovery Server
cd backend/discovery-server && ./mvnw spring-boot:run

# Terminal 2 — User Service
cd backend/user-service && ./mvnw spring-boot:run

# Terminal 3 — Post Service
cd backend/post-service && ./mvnw spring-boot:run

# Terminal 4 — API Gateway
cd backend/api-gateway && ./mvnw spring-boot:run
```

#### 4. Frontend

```bash
cd frontend/campusconnect
npm install
npm run dev
# Open http://localhost:5173
```

</details>

---

## 📂 Project Structure

```
campus-connect/
├── backend/
│   ├── api-gateway/          # Spring Cloud Gateway (8095)
│   ├── discovery-server/     # Eureka Server (8761)
│   ├── user-service/         # Auth, Users, Messaging, Events (8081)
│   └── post-service/         # Posts, Comments, Likes, Upload (8082)
├── frontend/
│   └── campusconnect/        # React 19 + Vite SPA
│       ├── src/
│       │   ├── api/          # Axios service layer
│       │   ├── components/   # UI components (ui/, layout/, dashboard/, sections/)
│       │   ├── pages/        # Route-level pages
│       │   └── store/        # Zustand state management
│       ├── nginx.conf        # Production nginx config
│       └── Dockerfile        # Multi-stage build
├── docker-compose.yml        # Full-stack orchestration
├── .github/workflows/ci.yml  # CI pipeline
└── .env.example              # Environment template
```

---

## 📡 API Reference

<details>
<summary><strong>Authentication</strong> — <code>/api/auth</code></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/signup` | Register new user |
| `POST` | `/login` | Login → JWT token |
| `POST` | `/verify-otp` | Verify email OTP |
| `POST` | `/forgot-password` | Request password reset |
| `POST` | `/reset-password` | Reset with OTP |

</details>

<details>
<summary><strong>Users</strong> — <code>/api/user</code></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/me` | Current user profile |
| `PUT` | `/profile` | Update profile |
| `POST` | `/profile-photo` | Upload photo |
| `GET` | `/college?collegeName=` | College directory |

</details>

<details>
<summary><strong>Posts</strong> — <code>/api/posts</code></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/` | Create post |
| `GET` | `/feed` | Global feed (paginated) |
| `GET` | `/feed/college` | College-specific feed |
| `POST` | `/{id}/like` | Toggle like |
| `POST` | `/{id}/comments` | Add comment |
| `GET` | `/{id}/comments` | Get comments |
| `DELETE` | `/{id}` | Delete post |
| `POST` | `/upload` | Upload media file |

</details>

<details>
<summary><strong>Messages</strong> — <code>/api/messages</code></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/send` | Send message |
| `GET` | `/conversation/{userId}` | Chat history |
| `GET` | `/contacts` | Message contacts |
| `POST` | `/read/{senderId}` | Mark as read |

</details>

<details>
<summary><strong>Connections</strong> — <code>/api/connections</code></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/request` | Send connection request |
| `POST` | `/{id}/accept` | Accept |
| `POST` | `/{id}/reject` | Reject |
| `GET` | `/pending` | Pending requests |
| `GET` | `/friends` | Connected user IDs |
| `GET` | `/status` | Check status between users |

</details>

<details>
<summary><strong>Events</strong> — <code>/api/events</code></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/` | Create event |
| `GET` | `/` | List events |
| `POST` | `/{id}/rsvp` | RSVP to event |
| `DELETE` | `/{id}/rsvp` | Cancel RSVP |
| `GET` | `/{id}/attendees` | Get attendees |

</details>

<details>
<summary><strong>Notifications</strong> — <code>/api/notifications</code></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/?userId=` | All notifications |
| `GET` | `/unread-count?userId=` | Unread count |
| `POST` | `/mark-all-read?userId=` | Mark all read |

</details>

---

## 🔄 WebSocket Events

| Topic | Direction | Description |
|-------|-----------|-------------|
| `/topic/messages/{userId}` | Server → Client | New message |
| `/topic/typing/{userId}` | Server → Client | Typing indicator |
| `/topic/read-receipt/{userId}` | Server → Client | Read receipt |
| `/app/typing` | Client → Server | Send typing status |

---

## 🐳 Deployment

### Docker Services

| Service | Port | Health Check |
|---------|------|-------------|
| `postgres` | 5432 | `pg_isready` |
| `redis` | 6379 | `redis-cli ping` |
| `discovery-server` | 8761 | `/actuator/health` |
| `api-gateway` | 8095 | `/actuator/health` |
| `user-service` | 8081 | `/actuator/health` |
| `post-service` | 8082 | `/actuator/health` |
| `frontend` | 3000 | HTTP 200 on `/` |

### CI/CD Pipeline

The GitHub Actions workflow runs on every push/PR:
1. **Frontend** — `npm ci` → `npm run lint` → `npm run build`
2. **Backend** — `mvn verify` with PostgreSQL service container
3. **Docker** — Validates compose config + builds all images

---

## 🔐 Security

| Feature | Implementation |
|---------|---------------|
| Authentication | JWT with BCrypt password hashing |
| Email Verification | OTP via SMTP (Gmail) |
| File Upload | Type validation, size limits, path traversal protection |
| CORS | Configured per-origin on API Gateway |
| Headers | X-Frame-Options, X-Content-Type-Options, XSS-Protection |
| Rate Limiting | 30 req/s per IP via Nginx |
| Actuator | Restricted to health/info/metrics endpoints |
| Secrets | Environment variables only (never committed) |

---

## 🗺️ Roadmap

- [x] User Authentication (JWT + OTP)
- [x] Post Feed with Like/Comment
- [x] Real-time Messaging (WebSocket)
- [x] Connection/Friend System
- [x] Notification System
- [x] Events with RSVP
- [x] Profile Photo Upload
- [x] Docker Deployment
- [x] CI/CD Pipeline
- [x] Security Hardening
- [ ] Group Chat
- [ ] Push Notifications (Firebase)
- [ ] Cloud Deployment (AWS/GCP)
- [ ] Admin Panel for ID Verification
- [ ] Mobile App (React Native)

---

## 👨‍💻 Author

**Sourabh Ramteke** — Full-Stack Java Developer | MCA @ NIT Trichy

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=flat-square&logo=linkedin)](https://linkedin.com/in/sourabh-ramteke-704152289)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=flat-square&logo=github)](https://github.com/maa101-hub)

---

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

<p align="center">
  <sub>Built with purpose. One commit at a time.</sub><br/>
  <sub>If you found this useful, consider giving it a ⭐</sub>
</p>
