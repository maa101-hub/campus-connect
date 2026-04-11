# 🎓 Campus Connect

## 🚀 Overview

Campus Connect is a **college-based private social networking platform** designed to connect students within the same campus.
The platform ensures **authenticity and security** by verifying users through **College ID Card Upload + OTP Verification**.

This project is built using a **Microservices Architecture** with Spring Boot and modern web technologies.

---

## 🎯 Problem Statement

Existing social platforms allow anyone to join, leading to fake profiles and irrelevant connections.
Campus Connect solves this by creating **verified, college-specific communities**.

---

## 💡 Key Features

* 👤 User Authentication (Signup/Login)
* 🏫 College Selection System
* 🆔 College ID Card Verification
* 📩 Email OTP Verification
* 🔐 Secure Access (Only Verified Users)
* 📰 Feed System (Posts & Likes) *(Upcoming)*
* 🤝 Connection System *(Upcoming)*

---

## 🏗️ Architecture

The system follows a **Microservices Architecture**, where each service is independently developed and scalable.

### 🔹 Backend Services:

* **User Service** → Authentication, User Management, Verification
* **Discovery Server** → Service Registry (Eureka)
* **API Gateway** → Routing & Security (Planned)
* **Notification Service** → OTP & Email (Planned)

---

## 🛠️ Tech Stack

### 🔹 Backend

* Java 21
* Spring Boot
* Spring Security
* Spring Cloud
* Hibernate / JPA

### 🔹 Microservices

* Eureka Server
* Spring Cloud Gateway

### 🔹 Database

* PostgreSQL

### 🔹 Frontend

* React + Vite

### 🔹 DevOps (Future)

* Docker
* Kubernetes

---

## 📂 Project Structure

```
campus-connect/
 ├── backend/
 │    ├── user-service/
 │    ├── discovery-server/
 │    └── api-gateway/
 │
 ├── frontend/
 │
 ├── docs/
 │
 └── README.md
```

---

## 🔄 User Flow

1. User selects their college
2. Signs up with basic details
3. Uploads **College ID Card**
4. Verifies email via OTP
5. Account status → **Pending Verification**
6. Admin reviews ID card
7. Access granted after approval

---

## 🔐 Verification Logic

* Only users with valid college ID cards are approved
* Unverified users cannot:

  * Access feed
  * Connect with others
  * Post content

---

## 📅 Development Approach

* Built with **daily GitHub commits**
* Follows **feature-based Git workflow**
* Designed for scalability and real-world system design

---

## 🔥 Unique Selling Point (USP)

* Strong **student verification system**
* **College-specific private networks**
* Real-world **microservices architecture implementation**

---

## 🚀 Future Enhancements

* 📡 Real-time Chat System
* 📊 Recommendation System
* ☁️ Cloud Deployment (AWS)
* 🐳 Docker & Kubernetes
* 📈 Analytics Dashboard

---

## 👨‍💻 Author

**Sourabh Ramteke**

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!

---

🚀 *Building something impactful, one commit at a time.*
