# 🎓 Campus Connect

A **college-based private social networking platform** built with microservices architecture. Students connect, share, and communicate within verified campus communities.

---

## ✨ Features

### Core
- **JWT Authentication** — Secure signup/login with email OTP verification
- **College-Specific Feed** — Posts visible only to your campus community
- **Real-Time Messaging** — WebSocket-powered chat with typing indicators
- **Connection System** — Send/accept/reject friend requests with notifications
- **Profile Management** — Bio, skills, interests, profile photo upload
- **Dark/Light Theme** — Persistent theme with smooth toggle animation

### Dashboard Sections
| Section | Description |
|---------|-------------|
| Home Feed | Create posts, like, comment, infinite scroll |
| My College | Directory of verified students at your college |
| Explore | Discover posts and colleges across the platform |
| Trending | Top hashtags and hot discussions |
| Messages | Real-time chat with typing indicators |
| Saved Posts | Bookmarked posts for later reading |
| Profile | Edit bio, skills, upload photo, view stats |
| Settings | Account, notifications, privacy, appearance |

### Backend
- Microservices architecture with service discovery (Eureka)
- API Gateway with load-balanced routing
- JWT validation on all protected endpoints
- Real-time notifications (like, comment, connection events)
- File upload for images (posts + profile photos)
- WebSocket messaging with STOMP/SockJS

---

## 🏗️ Architecture

```
┌──────────────┐     ┌─────────────────┐     ┌──────────────────┐
│   Frontend   │────▶│   API Gateway   │────▶│ Discovery Server │
│  React+Vite  │     │   (Port 8095)   │     │  Eureka (8761)   │
│  (Port 5173) │     └────────┬────────┘     └──────────────────┘
└──────────────┘              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
          ┌─────────────────┐  ┌─────────────────┐
          │  User Service   │  │  Post Service   │
          │   (Port 8081)   │  │   (Port 8082)   │
          │  Auth, Messaging│  │  Posts, Comments │
          │  Connections    │  │  Likes, Upload   │
          └────────┬────────┘  └────────┬────────┘
                   │                    │
                   ▼                    ▼
          ┌─────────────────────────────────────┐
          │          PostgreSQL Database         │
          │          (campus-connect)            │
          └─────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, Tailwind CSS 4, Zustand, Framer Motion |
| Backend | Java 17, Spring Boot 3.3.5, Spring Security, Spring Cloud 2023.0.3 |
| Database | PostgreSQL 16 |
| Caching | Redis 7 |
| Messaging | WebSocket (STOMP + SockJS) |
| Service Discovery | Netflix Eureka |
| Gateway | Spring Cloud Gateway |
| Auth | JWT (jjwt 0.11.5) |
| DevOps | Docker, Docker Compose, GitHub Actions CI |

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 14+
- Maven 3.8+

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/maa101-hub/campus-connect.git
cd campus-connect

# Create .env file from example
cp .env.example .env
# Edit .env with your values (DB password, mail config, JWT secret)

# Start all services
docker compose up --build

# Access:
# Frontend: http://localhost:3000
# API Gateway: http://localhost:8095
# Eureka Dashboard: http://localhost:8761
```

### Option 2: Manual Setup

#### 1. Database
```bash
# Create PostgreSQL database
createdb campus-connect
```

#### 2. Environment Variables
```bash
cp .env.example .env
# Edit .env with your actual values
```

#### 3. Backend Services (start in order)

```bash
# Terminal 1 - Discovery Server
cd backend/discovery-server
./mvnw spring-boot:run

# Terminal 2 - User Service
cd backend/user-service
./mvnw spring-boot:run

# Terminal 3 - Post Service
cd backend/post-service
./mvnw spring-boot:run

# Terminal 4 - API Gateway
cd backend/api-gateway
./mvnw spring-boot:run
```

#### 4. Frontend
```bash
cd frontend/campusconnect
npm install
npm run dev
# Open http://localhost:5173
```

---

## 📂 Project Structure

```
campus-connect/
├── backend/
│   ├── api-gateway/          # Spring Cloud Gateway (port 8095)
│   ├── discovery-server/     # Eureka Server (port 8761)
│   ├── user-service/         # Auth, Users, Messaging, Connections (port 8081)
│   └── post-service/         # Posts, Comments, Likes (port 8082)
├── frontend/
│   └── campusconnect/        # React + Vite SPA
├── docker-compose.yml        # Full-stack Docker setup
├── .env.example              # Environment variables template
└── README.md
```

---

## 🔐 Security

- All secrets are stored in environment variables (never committed)
- JWT authentication on both user-service and post-service
- CORS configured for frontend origin only
- Passwords hashed with BCrypt
- File upload size limits enforced (5MB profile, 10MB posts)
- File type validation (only JPEG, PNG, GIF, WebP, MP4, WebM allowed)
- Path traversal protection on file upload/download endpoints
- Security headers via Nginx (X-Frame-Options, X-Content-Type-Options, XSS-Protection)
- Rate limiting on API proxy (30 req/s per IP)
- Actuator endpoints restricted to health, info, metrics only
- Request size limits on API Gateway (10MB max)

---

## 📡 API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Register new user |
| POST | `/login` | Login, returns JWT |
| POST | `/verify-otp` | Verify email OTP |
| POST | `/forgot-password` | Request password reset |
| POST | `/reset-password` | Reset with OTP |

### User (`/api/user`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/me` | Get current user profile |
| PUT | `/profile` | Update profile info |
| POST | `/profile-photo` | Upload profile photo |
| GET | `/college?collegeName=` | List college students |

### Posts (`/api/posts`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create post |
| GET | `/feed` | Global feed (paginated) |
| GET | `/feed/college` | College-specific feed |
| POST | `/{id}/like` | Toggle like |
| POST | `/{id}/comments` | Add comment |
| GET | `/{id}/comments` | Get comments |

### Messages (`/api/messages`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/send` | Send message |
| GET | `/conversation/{userId}` | Get chat history |
| GET | `/contacts` | Get message contacts |

### Connections (`/api/connections`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/request` | Send connection request |
| POST | `/{id}/accept` | Accept request |
| POST | `/{id}/reject` | Reject request |
| GET | `/pending` | Pending requests |
| GET | `/friends` | Connected users |
| GET | `/status` | Check connection status |

### Notifications (`/api/notifications`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/?userId=` | Get all notifications |
| GET | `/unread-count?userId=` | Unread count |
| POST | `/mark-all-read?userId=` | Mark all read |

---

## 🔄 WebSocket Events

| Topic | Direction | Description |
|-------|-----------|-------------|
| `/topic/messages/{userId}` | Server → Client | New message received |
| `/topic/typing/{userId}` | Server → Client | Typing indicator |
| `/app/typing` | Client → Server | Send typing status |

---

## 🐳 Docker Services

| Service | Port | Description |
|---------|------|-------------|
| postgres | 5432 | PostgreSQL 16 database |
| redis | 6379 | Redis 7 (caching + sessions) |
| discovery-server | 8761 | Eureka service registry |
| api-gateway | 8095 | API Gateway + CORS |
| user-service | 8081 | Users, Auth, Messaging |
| post-service | 8082 | Posts, Comments, Likes |
| frontend | 3000 | React app (Nginx + security headers) |

---

## 🗺️ Roadmap

- [x] User Authentication (JWT + OTP)
- [x] Post Feed with Like/Comment
- [x] Real-time Messaging (WebSocket)
- [x] Connection/Friend System
- [x] Notification System
- [x] Profile Photo Upload
- [x] Typing Indicators
- [x] Docker Deployment
- [x] Search (Posts + People)
- [x] Settings Page
- [ ] Group Chat
- [ ] Events & Campus Groups
- [ ] Cloud Deployment (AWS/GCP)
- [ ] Push Notifications (Firebase)
- [ ] Admin Panel for ID Verification

---

## 👨‍💻 Author

**Sourabh Ramteke**

---

## ⭐ Support

If you like this project, give it a star on GitHub!

---

*Building something impactful, one commit at a time.*
