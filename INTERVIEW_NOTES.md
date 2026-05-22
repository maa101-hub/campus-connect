# CampusConnect — Interview Notes (Simple Version)

> **What:** Social media platform for college students only
> **Built by:** Sourabh Ramteke (Solo Developer)
> **Tech:** Java Spring Boot + React + PostgreSQL + Docker
> **Updated:** May 22, 2026

---

## PART 1: EXPLAIN YOUR PROJECT (30 seconds)

**Say this:**
> "I built CampusConnect — a social media app only for verified college students. Students sign up with email OTP, and once verified, they can see posts from their own college, chat in real-time, send friend requests, create events, and explore who else is on their campus. I built the entire thing alone — backend with Spring Boot microservices, frontend with React, deployed with Docker."

---

## PART 2: WHY DID YOU BUILD THIS?

**Q: What problem does it solve?**
> Students have no trusted platform for their own college. WhatsApp groups get messy, anyone can join Telegram groups pretending to be a student, and LinkedIn is too formal. CampusConnect gives a verified, college-only space.

**Q: What makes it different from existing apps?**
> Only verified students can join. You see posts only from YOUR college. It has real-time chat, a college directory, and campus events — all in one place.

**Q: Who is the target user?**
> College students (mainly Indian colleges with 2000-5000 students) who want to discover people in their campus, share content, and communicate.

---

## PART 3: WHAT TECHNOLOGIES DID YOU USE AND WHY?

### Backend:

| Tech | Why I Used It |
|------|---------------|
| Java 17 | My strongest language, good for enterprise apps |
| Spring Boot 3.4.5 | Makes building REST APIs fast, has security/JPA/mail built-in |
| Spring Security | Handles authentication, protects endpoints |
| Spring Cloud Gateway | Single entry point for all API requests, does routing |
| Netflix Eureka | Services register themselves, gateway finds them automatically |
| Spring WebSocket (STOMP) | Gives real-time chat without polling |
| JWT (jjwt library) | Stateless auth — no session storage needed on server |
| PostgreSQL 16 | Reliable relational database, free, handles complex queries |
| Redis 7 | Fast caching for sessions, reduces DB load |
| Lombok | Reduces boilerplate code (getters/setters/constructors) |
| Spring Mail | Sends OTP emails for verification |
| Spring Actuator | Health check endpoints for monitoring |

### Frontend:

| Tech | Why I Used It |
|------|---------------|
| React 19 | Component-based, huge ecosystem, I know it well |
| Vite 8 | Super fast build tool, instant hot reload during dev |
| Tailwind CSS 4 | Write CSS directly in HTML, no separate CSS files |
| Zustand | Simple state management (lighter than Redux) |
| Framer Motion | Smooth animations with less code |
| Axios | HTTP client for API calls, supports interceptors |
| React Router 7 | Client-side page navigation |
| @stomp/stompjs + SockJS | WebSocket client for real-time chat |
| Lucide React | Clean SVG icons |

### DevOps:

| Tech | Why I Used It |
|------|---------------|
| Docker | Package each service into a container — runs anywhere |
| Docker Compose | Start all 7 services with one command |
| Nginx | Serve frontend, proxy API calls, add security headers |
| GitHub Actions | Auto-build and test on every push |
| Maven | Build tool for Java projects |

---

## PART 4: ARCHITECTURE QUESTIONS

**Q: Explain your architecture?**
> It's microservices. I have 4 backend services:
> 1. **Discovery Server** (Eureka) — services register here
> 2. **API Gateway** — single entry point, routes requests to correct service
> 3. **User Service** — handles login, signup, chat, friends, events, notifications
> 4. **Post Service** — handles posts, comments, likes, file upload
>
> Frontend is a React SPA served by Nginx. All services talk to one PostgreSQL database and Redis for caching. Everything runs in Docker containers.

**Q: Why microservices? Why not monolith?**
> I had too many features for one service — auth, chat, posts, events, notifications. If everything was in one file, any change could break something else. Splitting by domain made it manageable as a solo dev. Also, I can deploy/restart one service without touching others.

**Q: How do services communicate?**
> They don't talk to each other directly. The frontend calls the API Gateway, which routes to the correct service. Both services share the same JWT secret, so each one validates tokens independently — no need to call user-service from post-service.

**Q: What is API Gateway and why do you need it?**
> It's the single entry point. Instead of frontend knowing 4 different URLs, it calls one URL. Gateway routes `/api/posts/**` to post-service and `/api/auth/**`, `/api/messages/**` etc. to user-service. It also handles CORS and load balancing.

**Q: What is Eureka? Why do you need service discovery?**
> Eureka is a registry. Each service tells Eureka "I'm alive at this address." Gateway asks Eureka "where is post-service?" and gets the address. If I scale to 3 instances of post-service, Gateway auto-distributes requests. No hardcoded URLs.

**Q: How does the request flow work?**
> User clicks "Create Post" → React sends POST /api/posts with JWT token → Nginx forwards to Gateway (port 8095) → Gateway checks route, finds post-service via Eureka → Post-service's JwtAuthFilter validates token → PostController saves to DB → Response goes back the same path.

**Q: Why shared database? Isn't that wrong for microservices?**
> Yes, ideally each service should have its own DB. But for a college-scale app (few thousand users), one PostgreSQL is simpler to manage, backup, and deploy. If I scale later, I'd split databases and use events for cross-service data sync.

---

## PART 5: AUTHENTICATION & SECURITY QUESTIONS

**Q: How does authentication work?**
> 1. User signs up with email, password, college name
> 2. Server sends 6-digit OTP to email
> 3. User enters OTP → email gets verified
> 4. On login → server creates JWT token (valid 24 hours)
> 5. Frontend stores JWT, sends it in every request as `Authorization: Bearer <token>`
> 6. Each service has JwtAuthFilter that validates the token

**Q: What is JWT? Why not sessions?**
> JWT is a signed token containing user's email. Server doesn't store anything — just verifies the signature. This means:
> - No session storage on server (stateless)
> - Works across multiple service instances
> - Frontend just includes it in headers
> Sessions would need sticky sessions or shared session store across services.

**Q: How do two services validate the same JWT?**
> Both user-service and post-service have the same `JWT_SECRET` environment variable. When post-service gets a request, it extracts the token, verifies the signature using the same secret, and gets the user's email. No need to call user-service.

**Q: What if a user is deleted but JWT is still valid?**
> The token works until it expires (24 hours). For a campus app, this is fine. For a banking app, I'd add a token blacklist in Redis — on logout/delete, add token to Redis blacklist, and check it in every request.

**Q: How does OTP verification work?**
> Generate random 6-digit number → save to DB with 5-minute expiry → send via email (Spring Mail) → user enters it → server checks: is it correct? is it expired? is it already used? → if valid, mark email as verified.

**Q: What security measures did you implement?**
> - Passwords hashed with BCrypt (never stored plain)
> - JWT tokens for stateless auth
> - Path traversal protection on file uploads
> - File type + size validation
> - CORS configured on gateway (only frontend origin allowed)
> - Security headers via Nginx (X-Frame-Options, XSS-Protection)
> - Rate limiting (30 requests/second per IP)
> - Input validation with @Valid annotations
> - SQL injection prevented by JPA (parameterized queries)

**Q: How do you handle forgot password?**
> User enters email → server sends OTP → user enters OTP + new password → server verifies OTP → updates password (BCrypt hashed) → done.

---

## PART 6: REAL-TIME CHAT QUESTIONS

**Q: How does real-time messaging work?**
> Two paths:
> - **Sending messages:** REST API (POST /api/messages/send) saves to DB, then pushes to recipient via WebSocket
> - **Typing indicators:** Purely WebSocket (no DB save, just forward to other user)
>
> This way messages are never lost (saved in DB) but also delivered instantly (WebSocket push).

**Q: What is WebSocket? Why not just polling?**
> WebSocket is a persistent connection between browser and server. Server can push messages anytime without client asking. Polling = client asks "any new messages?" every 2 seconds. That's wasteful — 99% of polls return nothing. WebSocket = instant delivery, less network traffic.

**Q: What is STOMP? What is SockJS?**
> STOMP is a messaging protocol on top of WebSocket — it adds concepts like "subscribe to topic" and "send to destination." SockJS is a fallback — if browser doesn't support WebSocket (old browsers), SockJS uses long-polling instead.

**Q: How do typing indicators work?**
> User A starts typing → frontend sends STOMP message to `/app/typing` with payload `{senderId: 1, recipientId: 2, typing: true}` → server's TypingController forwards it to `/topic/typing/2` → User B's browser is subscribed there → shows "typing..." bubble. No DB write — fire and forget.

**Q: How do read receipts work?**
> User B opens conversation with User A → frontend calls `POST /api/messages/read/A` → server marks all messages from A as read in DB → broadcasts read-receipt via WebSocket to A → A's UI shows blue double-tick.

**Q: What happens if the recipient is offline?**
> Message is still saved in DB via REST call. When recipient comes online and opens the chat, frontend calls `GET /api/messages/conversation/{userId}` and fetches all history. They won't miss anything.

**Q: How do you authenticate WebSocket connections?**
> JWT is passed as a query parameter when connecting: `/ws?token=<jwt>`. The JwtAuthFilter also checks `request.getParameter("token")` — so same filter works for both REST and WebSocket.

---

## PART 7: DATABASE QUESTIONS

**Q: What is your database schema?**
> 11 tables:
> - **User** — name, email, password, college, bio, skills, profile photo, role
> - **Otp** — email, otp code, expiry time, used flag
> - **IdCard** — for future admin verification of student ID
> - **Message** — sender, receiver, content, timestamp, read flag
> - **Connection** — requester, receiver, status (PENDING/ACCEPTED/REJECTED)
> - **Event** — title, description, date, location, creator
> - **EventRsvp** — user + event mapping
> - **Notification** — user, type, message, read flag
> - **Post** — author, content, media URL, college, timestamps
> - **Comment** — post, author, content
> - **PostLike** — post + user mapping

**Q: Why PostgreSQL?**
> Relational data (users have posts, posts have comments, users have connections) fits perfectly in a relational DB. PostgreSQL is free, reliable, handles JSON if needed, and has great Spring Data JPA support.

**Q: How does JPA/Hibernate work in your project?**
> I write Java entity classes with annotations like `@Entity`, `@Id`, `@OneToMany`. Hibernate auto-generates SQL and creates tables. I write repository interfaces extending JpaRepository — Spring generates the implementation. I don't write SQL manually.

**Q: How do you handle pagination?**
> Post feed uses Spring's `Pageable` — frontend sends `?page=0&size=10`, Spring Data automatically paginates the query. Returns page info (total pages, current page, has next).

---

## PART 8: FRONTEND QUESTIONS

**Q: How is your frontend organized?**
> ```
> src/
> ├── api/          → Axios services (one per domain)
> ├── components/
> │   ├── ui/       → Buttons, Toast, EmojiPicker
> │   ├── layout/   → Navbar, Footer
> │   ├── dashboard/→ Feed, Messages, Events, Profile sections
> │   └── sections/ → Landing page sections
> ├── pages/        → Dashboard, NotFound
> └── store/        → Zustand stores (auth, theme)
> ```

**Q: How does state management work?**
> Zustand with 2 stores:
> - `authStore` — user info, token, isAuthenticated, login/logout functions
> - `themeStore` — dark/light mode toggle
>
> Zustand is simpler than Redux — no actions, no reducers, just a function that returns state + methods.

**Q: How do you handle protected routes?**
> In App.jsx: `isAuthenticated ? <Dashboard /> : <Navigate to="/" />`. The auth store checks localStorage for a saved token on app load. If token exists and is valid → user goes to dashboard. Otherwise → landing page.

**Q: How do you make API calls?**
> Axios instance in `api/axios.js` with base URL and interceptor that adds JWT token to every request header. Service files (authService, postService, etc.) use this instance. If token expires (401 response), interceptor redirects to login.

**Q: How is the app responsive?**
> Tailwind CSS responsive classes: `sm:`, `md:`, `lg:` prefixes. Mobile-first design. Dashboard has a `MobileBottomNav` for small screens and `LeftSidebar` for desktop. Tested at 375px (mobile), 768px (tablet), 1024px+ (desktop).

---

## PART 9: DOCKER & DEPLOYMENT QUESTIONS

**Q: How do you deploy this?**
> `docker compose up --build` — that's it. Docker Compose starts 7 containers:
> 1. PostgreSQL (database)
> 2. Redis (cache)
> 3. Discovery Server (Eureka)
> 4. API Gateway
> 5. User Service
> 6. Post Service
> 7. Frontend (Nginx)

**Q: How does Docker Compose ordering work?**
> `depends_on` with `condition: service_healthy`. PostgreSQL starts first → waits until `pg_isready` returns true → then Redis → then Discovery Server → then User/Post services → then Frontend. Each service has a health check endpoint.

**Q: What does your Dockerfile look like for frontend?**
> Multi-stage build:
> - Stage 1: Node image, `npm install`, `npm run build` → produces static files
> - Stage 2: Nginx image, copies static files + nginx.conf → serves them
> - Result: Tiny production image (no Node.js in final image)

**Q: What does Nginx do in your project?**
> 5 things:
> 1. Serves React static files
> 2. Proxies /api/* to API Gateway
> 3. Proxies /ws/* for WebSocket
> 4. Adds security headers
> 5. Gzip compression + caches static assets for 1 year

**Q: Explain your CI/CD pipeline?**
> GitHub Actions runs on every push/PR:
> 1. Frontend job: install → lint → build
> 2. Discovery Server: Maven build + test
> 3. User Service: Maven build + test (with PostgreSQL service container)
> 4. Post Service: Maven build + test (with PostgreSQL service container)
> 5. API Gateway: Maven build + test
> 6. Docker job: validate compose config + build all images

---

## PART 10: DESIGN PATTERN & CODING QUESTIONS

**Q: What design patterns did you use?**
> - **MVC** — Controller → Service → Repository in every Spring service
> - **DTO pattern** — Separate request/response objects (SignUpRequest, LoginResponse, PostResponse)
> - **Repository pattern** — JpaRepository for database access
> - **Filter chain** — JwtAuthFilter in Spring Security filter chain
> - **Service layer** — Business logic in Service classes, not controllers
> - **Singleton** — Spring beans are singleton by default
> - **Observer** — WebSocket pub/sub (subscribe to topic, get notified)
> - **Builder** — Lombok @Builder on entities

**Q: How do you handle errors?**
> Global exception handler (`@ControllerAdvice` + `@ExceptionHandler`). Custom exceptions: `BadRequestException`, `ResourceNotFoundException`, `UnauthorizedException`, `DuplicateResourceException`. Each returns proper HTTP status + message in `ApiResponse` wrapper.

**Q: What is your API response format?**
> ```json
> {
>   "success": true,
>   "statusCode": 200,
>   "message": "Post created successfully",
>   "data": { ... }
> }
> ```
> Every endpoint returns this wrapper. Frontend always checks `response.data.success`.

**Q: How do you validate input?**
> Jakarta Validation annotations on DTOs: `@NotBlank`, `@Email`, `@Size(min=6)`. Controller uses `@Valid` on request body. If validation fails → Spring returns 400 with field-level error messages automatically.

**Q: How does file upload work?**
> 1. Frontend sends file as multipart/form-data
> 2. Server checks: is it empty? is it too big (>10MB)? is the type allowed (jpg/png/gif/mp4)?
> 3. Generate UUID filename (ignore original name to prevent path traversal)
> 4. Save to uploads/ directory
> 5. Return URL path like `/api/posts/upload/files/uuid.jpg`
> 6. On download: check filename has no `..` or `/` (prevent path traversal)

**Q: What is path traversal and how did you prevent it?**
> Attack: someone uploads file named `../../etc/passwd` to overwrite system files. My defense:
> 1. I ignore the original filename — generate random UUID
> 2. I normalize the path and check it's still inside uploads/ folder
> 3. On download, I reject any filename with `..`, `/`, or `\`

---

## PART 11: CONNECTION/FRIEND SYSTEM

**Q: How does the friend request system work?**
> - User A sends request to User B → saved as PENDING
> - User B can ACCEPT or REJECT
> - If ACCEPTED → both are friends, both get connection count updated
> - If REJECTED → User A can send again later (status resets to PENDING)
> - I check both directions (A→B and B→A) before creating new request

**Q: How do you prevent duplicate requests?**
> `findConnectionBetween(userId1, userId2)` query checks both directions. If any connection exists (PENDING/ACCEPTED/REJECTED), I don't create a new row — I update the existing one.

**Q: How does notification work here?**
> When A sends request → create notification for B ("A sent you a connection request"). When B accepts → create notification for A ("B accepted your request"). Frontend polls unread count and shows badge.

---

## PART 12: SCALABILITY QUESTIONS

**Q: How would you scale this for 100K users?**
> 1. Split database — each service gets its own PostgreSQL
> 2. Replace simple broker with RabbitMQ for WebSocket (supports multiple instances)
> 3. Move to Kubernetes instead of Docker Compose
> 4. Add read replicas for database
> 5. Use CDN for static file uploads
> 6. Add pagination everywhere (already done for posts)

**Q: What breaks first if you get too many users?**
> WebSocket. My simple broker is in-memory. If I run 2 instances of user-service, user connected to instance-1 won't get messages sent via instance-2. Fix: external broker like RabbitMQ or Redis Pub/Sub.

**Q: How would you add group chat?**
> New entity `ChatGroup` with members. New WebSocket topic `/topic/group/{groupId}`. When someone sends a message, broadcast to all subscribed members. Store messages with groupId instead of receiverId.

**Q: How would you add push notifications?**
> Firebase Cloud Messaging. Store device token on login. When a notification is created, also send FCM push. User receives it even when app is closed.

---

## PART 13: TESTING QUESTIONS

**Q: How do you test your application?**
> - CI runs `mvn verify` which executes unit tests
> - PostgreSQL service container spins up in CI for integration tests
> - Frontend: `npm run lint` checks code quality, `npm run build` verifies no build errors
> - Docker compose validation ensures all services can be built together
> - Manual testing of WebSocket flows

**Q: How would you improve testing?**
> - Add integration tests with @SpringBootTest for each controller
> - Add Testcontainers for local testing with real PostgreSQL
> - Add Cypress/Playwright for frontend E2E tests
> - Add load testing with JMeter for WebSocket connections

---

## PART 14: WHAT I LEARNED (SAY THIS AT THE END)

**Q: What did you learn from this project?**
> 1. **Microservices are complex** — I'd start with a modular monolith next time and extract services only when needed
> 2. **Shared DB is a tradeoff** — simpler now but couples services at scale
> 3. **WebSocket needs external broker at scale** — in-memory doesn't work with multiple instances
> 4. **Security must be designed in, not added later** — I had to retrofit path traversal protection
> 5. **Docker changed how I think** — now I think about health checks, startup order, and environment config from day one
> 6. **Architecture is about tradeoffs** — there's no perfect design, only the right one for your constraints

**Q: What would you do differently?**
> - Start with modular monolith, split later
> - Add proper logging (ELK stack or similar)
> - Use database-per-service from the start
> - Add API documentation (Swagger/OpenAPI)
> - Write more automated tests

**Q: What's your biggest achievement here?**
> Building a complete production-ready platform alone — 4 microservices, 25+ APIs, real-time chat, CI/CD pipeline, Docker deployment, and security hardening. It shows I can own a product end-to-end.

---

## PART 15: QUICK-FIRE ANSWERS

| Question | Short Answer |
|----------|-------------|
| Spring Boot version? | 3.4.5 |
| Java version? | 17 |
| React version? | 19 |
| Database? | PostgreSQL 16 |
| Cache? | Redis 7 |
| Build tool (Java)? | Maven |
| Build tool (frontend)? | Vite 8 |
| State management? | Zustand |
| CSS framework? | Tailwind CSS 4 |
| Auth mechanism? | JWT (jjwt 0.11.5) |
| Service discovery? | Netflix Eureka |
| API Gateway? | Spring Cloud Gateway |
| Container? | Docker + Docker Compose |
| CI/CD? | GitHub Actions |
| WebSocket protocol? | STOMP over SockJS |
| How many services? | 4 (gateway, discovery, user, post) |
| How many Docker containers? | 7 (+ postgres, redis, frontend) |
| How many API endpoints? | 25+ |
| How many DB tables? | 11 |
| How many React components? | 25+ |

---

## PART 16: 30-SECOND PITCH (MEMORIZE THIS)

> "I built CampusConnect, a verified college-only social media platform using Spring Boot microservices and React. It has JWT authentication with email OTP, real-time WebSocket chat with typing indicators, a friend request system, campus events, and a college-specific feed. I deployed it with Docker Compose — 7 containers with health checks and CI/CD pipeline. The hardest parts were making chat work real-time without losing messages, and securing file uploads against path traversal attacks. I built everything solo — backend, frontend, DevOps."

---

## HOW TO UPDATE THESE NOTES

When you add a new feature, tell me:
> "I added [feature name]. Update my interview notes."

I'll add:
- New questions and answers
- Updated tech stack if needed
- New architecture details
- Updated pitch

---

*Keep it simple. Know your project. Be honest about tradeoffs.*
