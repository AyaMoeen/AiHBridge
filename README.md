# AiHBridge – AI Tools Discovery & Review Platform


## Overview
AiHBridge is a community-driven platform that helps users find the right AI tools, learn from trusted reviews, and share real-world experiences. The platform solves three common problems:

- **Discovery is hard**: AI tools are fragmented across the web with poor categorization.
- **Reviews are scattered**: Feedback is spread over blogs, videos, and social posts with little structure.
- **Trust is unclear**: It’s hard to know which reviews are authentic or useful.
  
  ### Our goal is to build a reliable, community-first hub for discovering AI tools, exploring curated lists, and evaluating tools through transparent discussions and interactions.
---

## Table of Contents
- [Overview](#overview)   
- [System Features](#features)
- [Database ER Diagram](#database-er-diagram)  
- [System Architecture](#system-architecture)  
- [Code Analysis](#code-analysis)  
- [Developers Roles](#developers-roles)  
- [UI Prototypes](#ui-prototypes)  
- [Team Collaboration](#team-collaboration)  
- [Project Resources](#project-resources)
- [Acknowledgements](#acknowledgements)

---

## Features

- **User accounts and profiles**: Register, login, forget password, update management.
- **AI tool posts**: Create, edit, delete posts with name, description, personal review, link, categories.
- **Saved Lists**: Save/bookmark tools into personal collections.
- **Trending and highlights**: Surface popular and highlighted tools/posts.
- **Interactions**: Like, comment, rate, follow users, and receive notifications.
- **Search and filtering**: Keyword search and category-based discovery.
- **Summaries**: AI-assisted post summaries to speed up reading.

---
## Database ER Diagram
<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1hmfq0OhnvbQHXz3-RomhiKPMAEyk_rBL" alt="Project Cover" width="700"/>
</p>

---

## System Architecture

### Client–Server Architecture
- **Frontend (React SPA)**: Responsible for UI/UX, routing, and sending API requests.  
- **Backend (Django REST Framework)**: Exposes RESTful APIs, handles business logic, authentication, and database interactions.  
- **Database (SQLite)**: Stores persistent data (users, posts, interactions, follows, bookmarks).  

### Backend Architecture 
- **Views** → Receive API requests, delegate logic to services.  
- **Serializers** → Validate and transform request/response data.  
- **Services** → Contain business logic, keeping views thin and testable.  
- **Models** → Represent database schema and enforce constraints.  

```

┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  ┌─────────────────┐          HTTP/REST API          ┌─────────────────┐ │
│  │   React Client  │ ◄─────────────────────────────► │   Django API    │ │
│  │  (Frontend)     │          (JSON Data)            │ (Monolithic MVC)│ │
│  └─────────────────┘                                 └─────────────────┘ │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### **Request flow diagram**

```
┌──────────────────────────────────────────────────────────┐
│                 REQUEST FLOW DIAGRAM                     │
└──────────────────────────────────────────────────────────┘

┌─────────────────┐    HTTP Request     ┌─────────────────┐
│      React      │ ──────────────────► │  Django Views   │ 
└─────────────────┘                     └─────────────────┘
         │                                       │
         │                                       ▼
         │                              ┌─────────────────┐
         │                              │  Serializers    │
         │                              └─────────────────┘
         │                                       │
         │                                       ▼
         │                              ┌─────────────────┐
         │                              │   Services      │
         │                              └─────────────────┘
         │                                       │
         │                                       ▼
         │                              ┌─────────────────┐
         │                              │    Models       │
         │                              └─────────────────┘
         │                                       │
         │                                       ▼
         │                              ┌─────────────────┐
         │                              │   Database      │
         │                              └─────────────────┘
         │                                       │
         │                                       ▼
         │                              ┌─────────────────┐
         │                              │   Response      │
         │                              └─────────────────┘
         │                                       │
         │              HTTP Response            │
         │ ◄─────────────────────────────────────┘
         │
         ▼
┌─────────────────┐
│   React         │
│ • State Update  │
│ • UI Rendering  │
│ • Error Handling│
│ • Loading States│
└─────────────────┘
```

---

## Code Analysis

### Design Principles

#### SOLID Principles

* **Single Responsibility Principle (SRP)**
  * Each app has one clear purpose.
  * Services handle business logic separately.
  * Mixins provide focused shared functionality.
* **Open/Closed Principle (OCP)**
  * Custom permission 
  * Observer pattern enables new event-driven features without modifying core logic.
  * Services allow extending functionality without breaking views.
* **Liskov Substitution Principle (LSP)**
  * Custom User model (extending `AbstractUser`) integrates seamlessly with Django’s auth.
* **Interface Segregation Principle (ISP)**
  * Separate serializers return only required fields.
* **Dependency Inversion Principle (DIP)**
  * High-level modules (views) depend on abstractions, not implementations.
  * External APIs (e.g., HuggingFace, AWS SSM) are abstracted in `services.py`.

---

#### DRY Principle

* Reusable **mixins** centralize repeated logic.
* Shared **services layer** keeps views thin.
* Common **serializers and utility functions** prevent duplication.
* Reusable **permission classes** enforce consistent rules.

---

#### KISS Principle

* Code is **simple, readable, and avoids over-engineering**.
* Authentication flows are broken into **small, clear steps**.
* Views are thin, delegating heavy logic to **services**.

---

### Design Patterns

* **Observer Pattern**
  * Implemented via `observer` app (Dispatcher, Event).
  * Used for decoupled notifications (e.g., follow/unfollow events).
  * Thread-safe with `RLock`.
* **Service Layer Pattern**
  * Business logic isolated in `services.py`.
  * Views orchestrate requests/responses without containing heavy logic.
* **Factory Method Pattern**
  * `UserManager.create_user` and `create_superuser` act as controlled factories.

---

### System Strengths

* **Integration & Clean Architecture**

  * RESTful API endpoints with proper HTTP status codes.
  * Graceful error handling across serializers & services.
  * Secure token-based authentication system.
  * Modular structure: *Models → Services → Serializers → Views → Routes*.
  * Easy onboarding with clear app separation.

---

### Security

* Token-based authentication (DRF Token Auth).
* Password hashing with Django’s secure hashers.
* Permission-based access control (`IsAuthenticated`, `IsOwnerOrReadOnly`).
* Secrets stored securely (AWS Parameter Store, not hardcoded).
* Database constraints (`unique_together`) prevent duplicates (likes, follows).

---
## Testing & Code Quality & Deployment 
###	Testing
*	Backend tested with pytest (unit + integration tests).
*	Automated validation of business logic
###	Code Quality
*	Ruff → Python linter & static analysis.
*	ESLint → Enforces consistency in React frontend.
###	Deployment on AWS
*	Deployment code on AWS Ec2 storage.
---

## Developers Roles
| **Name**       | **Role**                                |
| -------------- | --------------------------------------- |
| Raghad Taqatqa | Scrum master - Back-End                 |
| Aya Moeen      | Backend Developer / QA Tester           |
| Osama Ghneem   | Frontend Developer                      |
| Ahmad Tomeh    | Frontend Developer                      |


---

## UI Prototypes

The **UI prototypes** is a clickable prototype, not a real website. It's designed to show you how the final app will work.
View UI Prototypes [Here](https://www.figma.com/make/ZiP81YdzHXpNZwl8WhFX66/AiHBridge---Home---Feed--Copy-?fullscreen=1)

  <img src="https://drive.google.com/uc?export=view&id=1wtWGqMvZJcxjlyEM5995C08xRnpdz2ZL" alt="Project Cover" width="700" hieght="500"/>


---

## Team Collaboration

We use modern tools for team collaboration and API testing:

* **Trello Board** → For sprint planning, task management, and tracking progress.
  👉 [Trello Board Link](https://trello.com/invite/b/68a89c1d6cf17fc39528808b/ATTId469e9cc65b7010473a44a9399cf1ca1FA756EE2/aihbridge-gsg)


* **Postman Workspace** → For testing, sharing, and documenting REST APIs.
  👉 [Postman Workspace Link](https://app.getpostman.com/join-team?invite_code=31a8a552d94bd34b4f5021b4154dc3a53b58397db2273f800be9568d478f6ed2&target_code=31136fb814ed5e2f8de6d1883c45088f)

---
## Project Resources

* You can access the Proposal Document [Here](https://www.notion.so/AI-Tools-Discovery-Review-Platform-25b1d966a54b808d901af2e9f8a2af66?source=copy_link)
* You can access the Quick Demo [here](https://drive.google.com/file/d/1iXRstrGfx5X80MsRJorBtnEPXZagrPYm/view?usp=drive_link)
* You can access the live version of AiHBridge [here](http://44.199.99.84/)
---
## Acknowledgements

I would like to express my gratitude to **Gaza Sky Geeks** for the opportunity to participate in the **Market Ready Developer Training program** internship. Their support was invaluable throughout this project's development.

Special thanks to my mentors **Amin Eid, Saad Haroub, Osaid Makhalfih**, **Mays Qasem** and  **Mohammed Jaradat** for their guidance and contributions.

