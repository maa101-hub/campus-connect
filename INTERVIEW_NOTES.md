# CampusConnect — Interview Preparation Notes

> **Project:** CampusConnect — Verified, college-based social networking platform
> **Author:** Sourabh Ramteke | MCA @ NIT Trichy
> **Role:** Solo Full-Stack Developer (Java + React)
> **Last Updated:** May 22, 2026

---

## TABLE OF CONTENTS

1. [Step 1: The Problem](#step-1-the-problem)
2. [Step 2: The Constraints](#step-2-the-constraints)
3. [Step 3: The Architecture (High Level)](#step-3-the-architecture)
4. [Step 4: The Hard Part](#step-4-the-hard-part)
5. [Step 5: The Impact & Learnings](#step-5-the-impact--learnings)
6. [Quick Q&A Reference](#quick-qa-reference)
7. [Tech Stack Summary](#tech-stack-summary)

---


## STEP 1: THE PROBLEM

### One-Liner:
> "College students don't have a trusted, verified social platform exclusive to their campus community."

### Problem Breakdown:

| Problem | Why It Exists |
|---------|---------------|
| Existing platforms are too open | LinkedIn = professional, Instagram = global, no college filter |
| No verified identity | Anyone joins Telegram/Discord "college groups" — spam, outsiders |
| Scattered communication | Events in WhatsApp (lost), notes in Drive (forgotten), no directory |

### What CampusConnect Solves:

- **College-specific feed** — posts visible only to YOUR verified campus
- **Real-time messaging** — 1-on-1 chat with typing indicators, read receipts
- **Connection system** — structured friend requests within campus
- **Campus events** — create & RSVP, visible to your college only
- **College directory** — find any verified student at your college

### Pitch (say this):
> "Think of it as LinkedIn + Instagram + WhatsApp — but scoped to your campus, with verified identity."

### Why It Matters:
> "In Indian colleges with 3000+ students, most people don't know who in their batch is doing interesting things. CampusConnect solves discovery, communication, and community — in one trusted platform."

---


## STEP 2: THE CONSTRAINTS

### Framing (say this):
> "Every architecture decision was driven by real constraints — not 'I wanted to learn microservices.'"

### Constraint Table:

| # | Constraint | Decision Made |
|---|-----------|---------------|
| 1 | Real-time messaging on a single DB | WebSocket STOMP + SockJS; messages persist in PostgreSQL, delivered via in-memory broker |
| 2 | No college verification API exists | Email OTP verification; IdCard entity for future admin verification |
| 3 | Solo developer, many features | Split into microservices: user-service, post-service, api-gateway, discovery-server |
| 4 | No external auth provider (Keycloak/Auth0) | Custom JWT (jjwt); both services validate independently via shared secret |
| 5 | Must deploy anywhere (dev/CI/cloud) | Full Docker Compose with health checks, depends_on, named volumes, env-driven config |
| 6 | Low-end devices (budget phones, slow 4G) | Vite 8 + Tailwind (no heavy UI libs) + Nginx Gzip + 1-year static cache + rate limiting |

### Detail for Each (if asked):

**Constraint 1 — Real-Time:**
- Can't afford Kafka for college-scale app
- WebSocket with STOMP protocol + SockJS fallback
- Redis for session/caching layer
- Messages persist in PostgreSQL for history

**Constraint 2 — Verification:**
- Most Indian colleges have no student API
- OTP flow: signup → receive OTP on email → verify → access granted
- Ensures email ownership at minimum

**Constraint 3 — Solo Dev + Many Features:**
- Auth, posts, messaging, events, connections, notifications, file upload, full React dashboard
- Monolith would become unmaintainable
- Split by domain boundary

**Constraint 4 — Auth Without External Provider:**
- Keycloak/Auth0 = operational complexity
- Custom JWT: stateless, scalable, no inter-service call for auth
- Each service has its own JwtAuthFilter

**Constraint 5 — Deployment Portability:**
- Health checks: pg_isready, redis-cli ping, /actuator/health
- depends_on with condition: service_healthy
- Named volumes: postgres_data, redis_data, user_uploads
- .env.example template for any developer

**Constraint 6 — Performance:**
- No Material UI / Ant Design (heavy)
- Framer Motion only for meaningful animations
- Nginx: Gzip + 1-year cache on static assets
- Rate limiting: 30 req/s per IP

---


## STEP 3: THE ARCHITECTURE

### Opening (say this):
> "It's a microservices architecture with 4 backend services, a React SPA frontend, and infrastructure services — all orchestrated via Docker Compose."

### Architecture Diagram (draw on whiteboard):

```
┌──────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                               │
│  Browser (React 19 SPA) ──── WebSocket (STOMP/SockJS)           │
└─────────────────┬────────────────────────┬───────────────────────┘
                  │ HTTP                    │ WS
                  ▼                        ▼
┌──────────────────────────────────────────────────────────────────┐
│                      NGINX (Port 80)                             │
│  • Reverse proxy    • Rate limit (30 req/s)  • Security headers │
│  • Gzip             • Static cache (1yr)     • SPA fallback     │
└─────────────────┬────────────────────────┬───────────────────────┘
                  │ /api/*                 │ /ws/*
                  ▼                        ▼
┌──────────────────────────────────────────────────────────────────┐
│            API GATEWAY — Spring Cloud Gateway (8095)              │
│  • /api/auth,users,messages,connections,events → user-service    │
│  • /api/posts/** → post-service                                  │
│  • /ws/** → user-service (WebSocket)                             │
│  • CORS config     • Load balancing (lb://service-name)          │
└────────┬────────────────────────────────────────────┬────────────┘
         │                                            │
         │    ┌───────────────────────────────┐       │
         │    │  DISCOVERY SERVER (Eureka)    │       │
         │    │  Port 8761 • Service registry │       │
         │    └───────────────────────────────┘       │
         │         ▲ register      ▲ register         │
         ▼         │               │                  ▼
┌──────────────────────┐    ┌─────────────────────────────┐
│  USER SERVICE (8081) │    │    POST SERVICE (8082)      │
├──────────────────────┤    ├─────────────────────────────┤
│ • Auth (JWT+OTP)     │    │ • Posts CRUD                │
│ • User profiles      │    │ • Comments & Likes          │
│ • Real-time chat     │    │ • File upload (secured)     │
│ • Connections        │    │ • College-specific feed     │
│ • Events + RSVP      │    │ • Own JwtAuthFilter         │
│ • Notifications      │    └──────────────┬──────────────┘
│ • WebSocket/STOMP    │                   │
└──────────┬───────────┘                   │
           │                               │
           ▼                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                 │
│  ┌────────────────────────┐    ┌─────────────────────────┐      │
│  │  PostgreSQL 16 (5432)  │    │    Redis 7 (6379)       │      │
│  │  campus-connect DB     │    │  • Session caching      │      │
│  │  All tables (JPA/DDL)  │    │  • WebSocket sessions   │      │
│  └────────────────────────┘    └─────────────────────────┘      │
└──────────────────────────────────────────────────────────────────┘
```



### Layer-by-Layer Explanation:

**1. Client Layer:**
> React 19 SPA built with Vite. REST APIs for data, WebSocket for real-time.

**2. Nginx:**
> Serves static React build, proxies /api/* to Gateway, proxies /ws/* for WebSocket. Handles Gzip, security headers, rate limiting, 1-year cache.

**3. API Gateway (Spring Cloud Gateway):**
> Single entry point. Routes by URL path. Uses Eureka for service discovery. Load balances with lb:// prefix.

**4. Discovery Server (Eureka):**
> Each microservice registers at startup. Gateway discovers dynamically. If user-service scales to 3 instances, Gateway auto-load-balances.

**5. User Service (8081) — Largest service:**
> Auth (signup/login/JWT), profiles, OTP verification, real-time messaging (WebSocket), connections, events+RSVP, notifications.

**6. Post Service (8082):**
> Content domain: posts CRUD, likes, comments, file uploads with path traversal protection. Validates JWT independently.

**7. Data Layer:**
> Single PostgreSQL 16 (shared, different tables). Redis 7 for caching/sessions. Tradeoff: simplicity at current scale.

### Key Architecture Decisions:

| Decision | Why |
|----------|-----|
| Shared DB, separate services | Simplicity now; can split later |
| JWT validated per service | No inter-service auth calls = low latency |
| WebSocket only in user-service | Post-service doesn't need real-time |
| Eureka for discovery | Dynamic registration, auto-scaling support |
| Nginx in front of Gateway | Offloads compression/caching from Java |

### Request Flow Example (great for whiteboard):

> "When a user creates a post:"
> 1. React sends POST /api/posts with JWT in Authorization header
> 2. Nginx proxies to API Gateway (8095)
> 3. Gateway matches /api/posts/** → forwards to lb://post-service
> 4. Eureka resolves post-service → localhost:8082
> 5. Post-service JwtAuthFilter extracts & validates JWT
> 6. PostController → PostServiceImpl → PostRepository.save()
> 7. Response flows back: post-service → gateway → nginx → browser

---


## STEP 4: THE HARD PART

### Opening (say this):
> "I'll walk you through the 4 hardest technical problems I solved."

---

### Hard Part 1: Real-Time Messaging (WebSocket + REST Hybrid)

**Challenge:** Chat needs instant delivery AND message history. Need both real-time + persistence.

**Solution — Dual-path architecture:**

```
REST path (persistence):
  POST /api/messages/send → save to DB → push via WebSocket to recipient

WebSocket path (fire-and-forget):
  /app/typing → TypingController → forward to /topic/typing/{recipientId}
  (no DB write — purely real-time)

Read receipts:
  POST /api/messages/read/{senderId} → update DB → broadcast via WebSocket
```

**Key decisions:**
- Messages sent via REST (persisted), then pushed via WebSocket (instant delivery)
- Typing indicators: purely WebSocket (no persistence needed)
- SockJS fallback for older browsers
- JWT passed as query param for WebSocket auth: `request.getParameter("token")`

**Why this design:**
> "If only WebSocket — lose messages when recipient offline. If only REST polling — not real-time. Hybrid gives both reliability AND instant delivery."

---

### Hard Part 2: JWT Auth Across Independent Microservices

**Challenge:** Two services need auth without calling each other on every request.

**Solution:**
- Both services share same `JWT_SECRET` env variable
- Each has its own `JwtAuthFilter` (identical logic)
- Token contains user's email — enough to identify WHO
- No network call between services for auth

**Code pattern (both services):**
```java
// JwtAuthFilter.java
String token = request.getHeader("Authorization").substring(7);
if (jwtUtil.validateToken(token)) {
    String email = jwtUtil.extractEmail(token);
    SecurityContextHolder.getContext().setAuthentication(auth);
}
```

**Tradeoff to mention:**
> "If user is deleted in user-service, post-service won't know until JWT expires. Acceptable for campus scale. For banking, I'd add token blacklisting in Redis."

---

### Hard Part 3: Connection System (State Machine)

**Challenge:** Friend request states: PENDING → ACCEPTED/REJECTED. Rejected can be re-requested. Bidirectional. Race conditions possible.

**Solution:**
```
States: NONE → PENDING → ACCEPTED
                      → REJECTED → PENDING (re-request)

Key logic:
- findConnectionBetween(userId1, userId2) checks BOTH directions
- @Transactional prevents race conditions
- On accept: update counts on BOTH users' profiles
- On reject: can be re-requested (reset to PENDING, flip requester/receiver)
```

**Why it's hard:**
> "Bidirectional: A requests B, must check both A→B and B→A. Accepting triggers count update on BOTH users inside @Transactional. Re-requesting after rejection flips direction."

---

### Hard Part 4: Secure File Upload (Path Traversal Protection)

**Challenge:** Malicious filename like `../../etc/passwd` could overwrite system files.

**Solution — 6 layers of defense:**

| Layer | Protection |
|-------|-----------|
| 1 | Strip original filename → use UUID |
| 2 | Extension whitelist: .jpg, .png, .gif, .webp, .mp4, .webm |
| 3 | Content-type header validation |
| 4 | File size limit (10MB max) |
| 5 | Path normalization + verify within upload directory |
| 6 | On retrieval: block any path with "..", "/", or "\\" |

**How to explain:**
> "Even if one layer fails, the others catch it. Defense in depth — not relying on a single check."

---

### Summary Table:

| Challenge | Core Difficulty | Solution |
|-----------|----------------|----------|
| Real-time messaging | Dual-path (persist + push) | REST saves to DB, WebSocket pushes instantly |
| Cross-service auth | Independent validation | Shared JWT secret, each service has own filter |
| Connection system | Bidirectional state machine | @Transactional + direction-agnostic query |
| File upload security | Path traversal attacks | 6-layer defense: UUID, whitelist, normalize |

---


## STEP 5: THE IMPACT & LEARNINGS

### IMPACT — What Was Achieved

**Scale of work (solo developer):**

| Metric | Count |
|--------|-------|
| Backend microservices | 4 |
| REST API endpoints | 25+ |
| WebSocket topics | 3 (messages, typing, read-receipts) |
| Frontend React components | 25+ |
| Database entities | 10 (User, Post, Comment, Like, Message, Connection, Event, EventRsvp, Notification, Otp) |
| Docker services | 7 (postgres, redis, discovery, gateway, user-svc, post-svc, frontend) |
| CI/CD jobs | 6 (frontend, 4 services, docker validation) |

**Production-ready features (not a toy project):**
- Health checks on every service
- CI/CD validates on every push
- Security headers (XSS, X-Frame-Options, CSP)
- Rate limiting (30 req/s)
- Path traversal protection
- Docker Compose one-command deployment
- WCAG-compliant accessibility
- Fully responsive (375px → 1440px)

**Demonstrates end-to-end ownership:**
> "I didn't just write CRUD. I made architecture decisions, implemented security, built real-time features, set up DevOps, and designed a responsive accessible frontend."

---

### LEARNINGS — What I'd Do Differently

**Learning 1: "Microservices aren't always the right first choice"**
> Would start with modular monolith, extract services when needed. User-service became too large (auth + messaging + connections + events + notifications = 3-4 bounded contexts).

*Shows:* You understand service boundaries and self-critique.

**Learning 2: "Shared DB creates hidden coupling"**
> Heavy migration on user table → post-service queries slow down. At scale: database-per-service + async events for cross-service data.

*Shows:* You know the correct distributed pattern and your tradeoff.

**Learning 3: "WebSocket at scale needs external broker"**
> SimpleBroker is in-memory. 2 instances of user-service = user on instance-1 won't get messages from instance-2. Solution: RabbitMQ or Redis Pub/Sub as external broker.

*Shows:* You understand horizontal scaling challenges.

**Learning 4: "Docker Compose taught infrastructure thinking"**
> Before: just `mvn spring-boot:run`. After: startup order, health checks, volume persistence, network isolation, env-driven config. Mindset transfers to Kubernetes.

*Shows:* You think beyond code → infrastructure.

**Learning 5: "Security is a design concern, not afterthought"**
> Retrofitted path traversal protection. Now: validate at controller, sanitize at service, verify at filesystem. Three layers, never one.

*Shows:* You learn from mistakes, security-first thinking.

**Learning 6: "Frontend state management matters at scale"**
> Zustand: lightweight, 2 stores. But messaging state + notification count + connection status grew. Next: Zustand slices or React Query for server state.

*Shows:* You evaluate tools practically.

---

### Closing Statement (memorize this):
> "CampusConnect taught me to think like a system designer. Every architectural choice has a tradeoff — shared DB gives simplicity but coupling, microservices give isolation but complexity, WebSocket gives real-time but scaling challenges. The best engineers pick the right tradeoff for their constraints — and know exactly what breaks when those constraints change."

---


## QUICK Q&A REFERENCE

| Interviewer Question | Your Answer |
|---------------------|-------------|
| "How would you scale this?" | Split DB per service, RabbitMQ for WebSocket broker, Kubernetes for orchestration |
| "What would you add next?" | Group chat, push notifications (Firebase), admin panel for ID verification |
| "Why not Auth0/Keycloak?" | Operational overhead; custom JWT simpler for campus scale. Switch at 10K+ users |
| "Why Spring Boot over Node.js?" | Type safety, mature ecosystem (JPA, Security, Cloud), Java is my strongest language |
| "Why React over Next.js?" | SPA with no SEO needs. No SSR required for dashboard app behind auth |
| "How do offline messages work?" | Messages persist via REST first; WebSocket only pushes. On reconnect, fetch history via GET /conversation/{userId} |
| "Why not use Kafka?" | Overkill for campus-scale. Simple broker works for <1000 concurrent users. Would add Kafka at scale |
| "How do you test this?" | CI runs `mvn verify` with PostgreSQL service container + frontend lint+build. Docker compose validation |
| "What if JWT secret is compromised?" | Rotate secret via env variable, all existing tokens invalidate, users re-login. At scale: asymmetric keys (RS256) |
| "Why Eureka over Consul/Kubernetes DNS?" | Spring Cloud native integration. If on K8s, would use K8s service discovery instead |
| "How do you handle concurrent connection requests?" | @Transactional + findConnectionBetween checks both directions before insert |
| "What's the SPA deployment strategy?" | Multi-stage Docker: build with Node → serve with Nginx. Assets cached 1 year (hash-based filenames) |

---


## TECH STACK SUMMARY

### Backend:

| Technology | Version | Purpose |
|-----------|---------|---------|
| Java | 17 | Primary language |
| Spring Boot | 3.4.5 | Framework |
| Spring Security | 6.x | Authentication & authorization |
| Spring Cloud Gateway | 2024.0.1 | API Gateway with routing |
| Netflix Eureka | 2024.0.1 | Service discovery |
| Spring Data JPA | 3.4.x | Database ORM |
| Spring WebSocket | 3.4.x | Real-time messaging (STOMP) |
| Spring Mail | 3.4.x | OTP email sending |
| Spring Actuator | 3.4.x | Health checks & monitoring |
| jjwt | 0.11.5 | JWT token generation & validation |
| Lombok | latest | Boilerplate reduction |
| PostgreSQL | 16 | Primary database |
| Redis | 7 | Caching & sessions |

### Frontend:

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19 | UI library |
| Vite | 8 | Build tool & dev server |
| Tailwind CSS | 4 | Utility-first styling |
| Framer Motion | 12 | Animations |
| Zustand | 5 | State management |
| React Router DOM | 7 | Client-side routing |
| Axios | 1.16 | HTTP client |
| @stomp/stompjs | 7.3 | WebSocket STOMP client |
| SockJS | 1.6 | WebSocket fallback |
| Lucide React | 1.12 | Icons |
| clsx + tailwind-merge | latest | Conditional class composition |

### DevOps:

| Technology | Purpose |
|-----------|---------|
| Docker | Containerization |
| Docker Compose | Multi-service orchestration |
| Nginx | Reverse proxy, static serving, security |
| GitHub Actions | CI/CD pipeline |
| Maven | Java build tool |
| npm | Frontend package manager |

### Database Entities (10 total):

| Entity | Service | Description |
|--------|---------|-------------|
| User | user-service | Profile, credentials, college, role |
| Otp | user-service | Email verification codes (5-min expiry) |
| IdCard | user-service | College ID for future admin verification |
| Message | user-service | Chat messages between users |
| Connection | user-service | Friend requests (PENDING/ACCEPTED/REJECTED) |
| Event | user-service | Campus events |
| EventRsvp | user-service | Event attendance tracking |
| Notification | user-service | System notifications |
| Post | post-service | User posts with media |
| Comment | post-service | Post comments |
| PostLike | post-service | Post likes |

### API Endpoints (25+):

**Auth:** POST /signup, /login, /verify-otp, /forgot-password, /reset-password
**Users:** GET /me, PUT /profile, POST /profile-photo, GET /college
**Posts:** POST /, GET /feed, GET /feed/college, POST /{id}/like, POST /{id}/comments, DELETE /{id}, POST /upload
**Messages:** POST /send, GET /conversation/{userId}, GET /contacts, POST /read/{senderId}
**Connections:** POST /request, POST /{id}/accept, POST /{id}/reject, GET /pending, GET /friends, GET /status
**Events:** POST /, GET /, POST /{id}/rsvp, DELETE /{id}/rsvp, GET /{id}/attendees
**Notifications:** GET /, GET /unread-count, POST /mark-all-read

### WebSocket Topics:

| Topic | Direction | Purpose |
|-------|-----------|---------|
| /topic/messages/{userId} | Server → Client | New message delivery |
| /topic/typing/{userId} | Server → Client | Typing indicator |
| /topic/read-receipt/{userId} | Server → Client | Read receipt |
| /app/typing | Client → Server | Send typing status |

---


## 2-MINUTE ELEVATOR PITCH (memorize this)

> **Problem:** College students lack a verified, campus-exclusive social platform.
>
> **Constraints:** Solo dev, no college API for verification, real-time on single DB, must deploy anywhere.
>
> **Architecture:** 4 microservices (Spring Boot 3.4.5) + React 19 SPA + PostgreSQL 16 + Redis 7 + Docker Compose, connected via Spring Cloud Gateway with Eureka discovery.
>
> **Hard Part:** Real-time messaging hybrid (REST persists + WebSocket pushes), cross-service JWT auth without coupling, connection state machine with @Transactional, and 6-layer file upload security.
>
> **Impact:** Built a production-grade platform end-to-end as a solo developer — 25+ APIs, real-time chat, CI/CD, Docker deployment, security hardening. Learned that architecture is about tradeoffs — and knowing what breaks when you scale.

---

## NOTES FOR UPDATING

When you add a new feature to CampusConnect, update these sections:
- Add new endpoints to **API Endpoints** section
- Add new entities to **Database Entities** table
- If new service added → update **Architecture Diagram**
- If new tech added → update **Tech Stack Summary**
- If new challenge solved → add to **Hard Part** section
- If new constraint discovered → add to **Constraints** section
- Update the **2-Minute Pitch** if scope significantly changes

---

*End of Interview Notes*
