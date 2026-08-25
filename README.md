# Pie NEMEYAMAHORO- Academic Portfolio Platform

> Enterprise full-stack academic portfolio, research, educational resource, professional consulting, publishing, and knowledge-management platform.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Authentication and Authorization](#authentication-and-authorization)
- [API Documentation](#api-documentation)
- [Frontend Structure](#frontend-structure)
- [Features](#features)
- [Document Storage](#document-storage)
- [Translation Architecture](#translation-architecture)
- [Testing](#testing)
- [Deployment](#deployment)
- [Security](#security)
- [Backup Strategy](#backup-strategy)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

The **Pie NEMEYAMAHORO Academic Portfolio Platform** is a comprehensive, enterprise-grade full-stack application designed to serve as a unified hub for academic portfolios, research management, educational resource publishing, professional consulting services, and knowledge management.

The platform supports multiple user roles with granular permissions, multi-language content (English, French, Latin), a complete public-facing website, and an extensive admin dashboard for content management across 30+ data models.

### Key Capabilities

- **Academic Portfolio**: Showcase education, skills, experience, and career milestones
- **Research Management**: Track research projects, interests, and outcomes
- **Publication Hub**: Manage publications with multiple citation formats (APA, MLA, Chicago, BibTeX)
- **Educational Resources**: Share learning materials, guides, and documents
- **Professional Consulting**: Offer services, accept service requests, and manage appointments
- **Knowledge Management**: Articles, FAQs, testimonials, and a newsletter system
- **Event Management**: Create, promote, and track academic events and registrations
- **Multi-language Support**: UI translations and content translations with status tracking
- **Full Admin Dashboard**: 18+ CRUD management pages with analytics

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | UI library and component framework |
| React Router 7 | Client-side routing |
| Tailwind CSS 3 | Utility-first CSS framework |
| Axios | HTTP client for API communication |
| React Hook Form | Form state management and validation |
| React Helmet Async | SEO and document head management |
| React Toastify | Toast notification system |
| Lucide React | Icon library |
| React Icons | Extended icon library |
| Date-fns | Date formatting and manipulation |
| PostCSS / Autoprefixer | CSS processing |

### Backend

| Technology | Purpose |
|---|---|
| Node.js 20 | Runtime environment |
| Express 5 | Web framework |
| MongoDB 7 | NoSQL database |
| Mongoose 9 | MongoDB ODM |
| JSON Web Tokens | Authentication (access + refresh tokens) |
| bcryptjs | Password hashing |
| Multer | File upload handling |
| express-validator | Input validation |
| express-rate-limit | Rate limiting |
| Helmet | Security headers |
| Morgan | HTTP request logging |
| Compression | Response compression |
| mongo-sanitize | NoSQL injection protection |
| xss-clean | XSS attack prevention |
| hpp | HTTP parameter pollution protection |
| cookie-parser | Cookie parsing |
| sanitize-html | HTML sanitization |
| slugify | URL slug generation |
| uuid | Unique identifier generation |
| crypto-js | Encryption utilities |

### Testing

| Technology | Purpose |
|---|---|
| Jest | Test runner (backend) |
| Supertest | HTTP assertion library |
| React Testing Library | Frontend component testing |

### DevOps

| Technology | Purpose |
|---|---|
| Docker | Containerization |
| Docker Compose | Multi-container orchestration |
| Nginx | Reverse proxy and static file serving |
| Nodemon | Backend development hot-reload |

---

## Architecture

### Project Structure

`
celine-platform/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── index.js
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   └── rateLimiter.js
│   │   ├── models/
│   │   │   ├── AcademicTitle.js
│   │   │   ├── AnalyticsEvent.js
│   │   │   ├── Appointment.js
│   │   │   ├── Article.js
│   │   │   ├── AuditLog.js
│   │   │   ├── CareerOpportunity.js
│   │   │   ├── Comment.js
│   │   │   ├── ContactMessage.js
│   │   │   ├── Education.js
│   │   │   ├── Event.js
│   │   │   ├── EventRegistration.js
│   │   │   ├── Experience.js
│   │   │   ├── Expertise.js
│   │   │   ├── FAQ.js
│   │   │   ├── Media.js
│   │   │   ├── Newsletter.js
│   │   │   ├── Profile.js
│   │   │   ├── Project.js
│   │   │   ├── Publication.js
│   │   │   ├── ResearchInterest.js
│   │   │   ├── ResearchProject.js
│   │   │   ├── Resource.js
│   │   │   ├── ResourceVersion.js
│   │   │   ├── Service.js
│   │   │   ├── ServiceRequest.js
│   │   │   ├── Setting.js
│   │   │   ├── Skill.js
│   │   │   ├── Testimonial.js
│   │   │   ├── Translation.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── academicTitles.js
│   │   │   ├── analytics.js
│   │   │   ├── appointments.js
│   │   │   ├── articles.js
│   │   │   ├── auditLogs.js
│   │   │   ├── auth.js
│   │   │   ├── careerOpportunities.js
│   │   │   ├── comments.js
│   │   │   ├── contact.js
│   │   │   ├── education.js
│   │   │   ├── events.js
│   │   │   ├── experience.js
│   │   │   ├── expertise.js
│   │   │   ├── faqs.js
│   │   │   ├── index.js
│   │   │   ├── media.js
│   │   │   ├── newsletter.js
│   │   │   ├── profile.js
│   │   │   ├── projects.js
│   │   │   ├── publications.js
│   │   │   ├── researchInterests.js
│   │   │   ├── researchProjects.js
│   │   │   ├── resources.js
│   │   │   ├── search.js
│   │   │   ├── serviceRequests.js
│   │   │   ├── services.js
│   │   │   ├── settings.js
│   │   │   ├── skills.js
│   │   │   ├── testimonials.js
│   │   │   ├── translations.js
│   │   │   └── users.js
│   │   ├── seeds/
│   │   │   └── seed.js
│   │   ├── utils/
│   │   │   └── logger.js
│   │   └── server.js
│   ├── uploads/
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.js
│   │   │   └── endpoints.js
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Breadcrumbs.js
│   │   │   │   ├── ConfirmDialog.js
│   │   │   │   ├── DataTable.js
│   │   │   │   ├── ErrorMessage.js
│   │   │   │   ├── FileUpload.js
│   │   │   │   ├── LoadingSpinner.js
│   │   │   │   ├── Modal.js
│   │   │   │   ├── Pagination.js
│   │   │   │   ├── RichTextEditor.js
│   │   │   │   ├── SearchModal.js
│   │   │   │   ├── SEO.js
│   │   │   │   └── StatusBadge.js
│   │   │   └── layout/
│   │   │       ├── AdminLayout.js
│   │   │       ├── Footer.js
│   │   │       └── Header.js
│   │   ├── contexts/
│   │   │   ├── AuthContext.js
│   │   │   ├── LanguageContext.js
│   │   │   └── SettingsContext.js
│   │   ├── hooks/
│   │   │   └── useApi.js
│   │   ├── locales/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AcademicTitlesList.js
│   │   │   │   ├── ArticlesList.js
│   │   │   │   ├── AuditLogsList.js
│   │   │   │   ├── CareerOpportunitiesList.js
│   │   │   │   ├── CommentsList.js
│   │   │   │   ├── ContactList.js
│   │   │   │   ├── Dashboard.js
│   │   │   │   ├── EducationList.js
│   │   │   │   ├── EventsList.js
│   │   │   │   ├── ExperienceList.js
│   │   │   │   ├── ExpertiseList.js
│   │   │   │   ├── FaqsList.js
│   │   │   │   ├── MediaList.js
│   │   │   │   ├── NewsletterList.js
│   │   │   │   ├── Profile.js
│   │   │   │   ├── ProjectsList.js
│   │   │   │   ├── PublicationsList.js
│   │   │   │   ├── ResearchProjectsList.js
│   │   │   │   ├── ResourcesList.js
│   │   │   │   ├── ServiceRequestsList.js
│   │   │   │   ├── ServicesList.js
│   │   │   │   ├── SettingsPage.js
│   │   │   │   ├── SkillsList.js
│   │   │   │   ├── TestimonialsList.js
│   │   │   │   ├── TranslationsList.js
│   │   │   │   └── UsersList.js
│   │   │   └── public/
│   │   │       ├── About.js
│   │   │       ├── ArticleDetail.js
│   │   │       ├── Articles.js
│   │   │       ├── Career.js
│   │   │       ├── Contact.js
│   │   │       ├── Education.js
│   │   │       ├── EventDetail.js
│   │   │       ├── Events.js
│   │   │       ├── Expertise.js
│   │   │       ├── Home.js
│   │   │       ├── ProjectDetail.js
│   │   │       ├── Projects.js
│   │   │       ├── PublicationDetail.js
│   │   │       ├── Publications.js
│   │   │       ├── Research.js
│   │   │       ├── ResourceDetail.js
│   │   │       ├── Resources.js
│   │   │       ├── SearchPage.js
│   │   │       ├── ServiceDetail.js
│   │   │       ├── Services.js
│   │   │       └── Unauthorized.js
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   ├── formatters.js
│   │   │   └── validators.js
│   │   ├── App.js
│   │   └── index.js
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
├── .gitignore
├── .dockerignore
└── README.md
`

### System Architecture

`
+-----------------+     +----------------------+     +-------------+
|                 |     |                      |     |             |
|  React SPA      |---->|  Nginx (port 80)     |---->|  Express    |
|  (Browser)      |     |  - Static files      |     |  (port 5000)|
|                 |     |  - /api proxy        |     |             |
+-----------------+     +----------------------+     +------+------+
                                                            |
                                                            |
                                                     +------+------+
                                                     |             |
                                                     |  MongoDB    |
                                                     |  (port 27017)|
                                                     |             |
                                                     +-------------+
`

The architecture follows a three-tier model:

1. **Presentation Layer**: React SPA served via Nginx, handles UI rendering and client-side routing
2. **Application Layer**: Express.js REST API, handles business logic, authentication, and file processing
3. **Data Layer**: MongoDB document store with Mongoose ODM for schema validation and queries

Nginx acts as a reverse proxy, serving static assets directly and forwarding /api requests to the backend service. In Docker, services communicate via the Docker network using container names as hostnames.

---

## Prerequisites

- **Node.js** 18+ (recommended: 20 LTS)
- **MongoDB** 6+ (local installation or Docker)
- **npm** 9+ or **yarn** 1.22+
- **Docker** and **Docker Compose** (for containerized deployment)
- **Git** (for version control)

---

## Installation

### Manual Setup

#### 1. Clone the Repository

`ash
git clone https://github.com/yourusername/celine-platform.git
cd celine-platform
`

#### 2. Backend Setup

`ash
cd backend
npm install
`

Create a .env file from the example:

`ash
cp .env.example .env
`

Edit .env with your configuration (see [Environment Variables](#environment-variables)).

#### 3. Seed the Database

`ash
npm run seed
`

This creates the initial admin user and sample data.

#### 4. Start the Backend

`ash
npm run dev
`

The backend starts on http://localhost:5000.

#### 5. Frontend Setup

`ash
cd ../frontend
npm install
`

#### 6. Start the Frontend

`ash
npm start
`

The frontend starts on http://localhost:3000.

#### 7. Access the Application

- **Public Site**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
- **API Health**: http://localhost:5000/health

### Docker Setup

#### 1. Clone the Repository

`ash
git clone https://github.com/yourusername/celine-platform.git
cd celine-platform
`

#### 2. Start All Services

`ash
docker-compose up -d
`

This starts:
- MongoDB on port 27017
- Backend on port 5000
- Frontend (Nginx) on port 3000

#### 3. Seed the Database

`ash
docker exec -it celine-backend npm run seed
`

#### 4. Access the Application

- **Public Site**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
- **API Health**: http://localhost:5000/health

#### 5. View Logs

`ash
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend
`

#### 6. Stop Services

`ash
docker-compose down
`

#### 7. Remove Volumes (Reset Database)

`ash
docker-compose down -v
`

#### Docker Services

| Service | Port | Description |
|---|---|---|
| mongodb | 27017 | MongoDB 7 database with health checks |
| backend | 5000 | Express.js API server (dev mode with Nodemon) |
| frontend | 3000 | Nginx serving React SPA |

#### Docker Volumes

| Volume | Purpose |
|---|---|
| mongodb_data | Persistent MongoDB data storage |
| uploads_data | Persistent file upload storage |

---

## Environment Variables

### Backend .env

| Variable | Description | Default | Required |
|---|---|---|---|
| PORT | Server port | 5000 | Yes |
| NODE_ENV | Environment mode | development | Yes |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/celine-platform | Yes |
| JWT_SECRET | Secret for signing JWT access tokens | - | Yes |
| JWT_REFRESH_SECRET | Secret for signing JWT refresh tokens | - | Yes |
| JWT_EXPIRE | Access token expiration time | 15m | Yes |
| JWT_REFRESH_EXPIRE | Refresh token expiration time | 7d | Yes |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:3000 | Yes |
| UPLOAD_DIR | Directory for file uploads | ./uploads | Yes |
| MAX_FILE_SIZE | Maximum upload size in bytes | 10485760 (10MB) | Yes |

**Important**: Generate strong, unique values for JWT_SECRET and JWT_REFRESH_SECRET in production. Never commit .env files to version control.

### Frontend .env

| Variable | Description | Default |
|---|---|---|
| REACT_APP_API_URL | Backend API base URL | http://localhost:5000/api |

---

## Database

### MongoDB with Mongoose ODM

The platform uses MongoDB as the primary data store with Mongoose as the ODM layer. The schema design follows a document-oriented approach optimized for the academic domain.

### Data Models (30 Models)

| Model | Description |
|---|---|
| User | System users with roles and permissions |
| Profile | Academic profile information |
| AcademicTitle | Degrees and academic titles |
| Education | Educational history and qualifications |
| Skill | Technical and soft skills |
| Experience | Professional experience records |
| Expertise | Areas of expertise and specialization |
| ResearchInterest | Research interest areas |
| ResearchProject | Research project tracking |
| Publication | Academic publications with citation metadata |
| Project | Portfolio projects |
| Resource | Educational resources and materials |
| ResourceVersion | Version control for resources |
| Service | Professional consulting services |
| ServiceRequest | Client service requests |
| Appointment | Scheduled appointments |
| Article | Blog posts and articles |
| Comment | User comments with moderation |
| Event | Academic events |
| EventRegistration | Event registrations |
| FAQ | Frequently asked questions |
| Testimonial | Client and peer testimonials |
| Newsletter | Newsletter subscribers |
| ContactMessage | Contact form submissions |
| Media | Media file management |
| Setting | Application settings |
| Translation | Content and UI translations |
| AuditLog | System audit trail |
| AnalyticsEvent | Analytics event tracking |
| CareerOpportunity | Career opportunities and job postings |

### Indexes

Performance is optimized with indexes on:

- **User**: email (unique), 
ole, isActive
- **Profile**: slug (unique)
- **Publication**: slug (unique), 	ype, publishedAt, uthors
- **ResearchProject**: slug (unique), status
- **Project**: slug (unique), status
- **Article**: slug (unique), status, publishedAt
- **Event**: slug (unique), date, status
- **Service**: slug (unique), isActive
- **Resource**: slug (unique), category
- **Comment**: entityType, entityId, status
- **Translation**: entityType, entityId, language, status
- **AuditLog**: userId, ction, createdAt

### Seed Script

`ash
npm run seed
`

Creates:
- Super admin user (email: dmin@celine-platform.com, password: Admin123!)
- Sample profile, education, skills, publications
- Sample research projects and events
- Default application settings

---

## Authentication and Authorization

### JWT Token System

The platform implements a dual-token authentication system:

- **Access Token**: Short-lived (15 minutes), used for API requests
- **Refresh Token**: Long-lived (7 days), used to obtain new access tokens

### Token Flow

`
1. User logs in with email/password
2. Server validates credentials
3. Server returns access token + refresh token (set as httpOnly cookie)
4. Client sends access token in Authorization header: Bearer <token>
5. When access token expires, client uses refresh token to get a new pair
6. Refresh token rotation on each use
`

### User Roles

| Role | Description |
|---|---|
| super_admin | Full system access, user management |
| content_manager | CRUD for all content types |
| editor | Edit and publish content |
| moderator | Moderate comments and user submissions |
| 
esearch_manager | Manage research projects and publications |
| service_manager | Manage services and service requests |

### Permissions

Each role has granular permissions per resource:

`javascript
// Example permission structure
{
  role: 'content_manager',
  permissions: {
    articles: { create: true, read: true, update: true, delete: true },
    publications: { create: true, read: true, update: true, delete: true },
    users: { create: false, read: true, update: false, delete: false }
  }
}
`

### Security Features

- Passwords hashed with bcrypt (12 salt rounds)
- Account lockout after 5 failed login attempts (30-minute lockout)
- Refresh token rotation on each use
- Tokens stored in httpOnly cookies (not accessible via JavaScript)
- CORS configured for specific origins
- Rate limiting on authentication endpoints

---

## API Documentation

All endpoints are prefixed with /api.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | /auth/register | Register new user |
| POST | /auth/login | User login |
| POST | /auth/logout | User logout |
| POST | /auth/refresh-token | Refresh access token |
| POST | /auth/forgot-password | Request password reset |
| POST | /auth/reset-password/:token | Reset password with token |
| GET | /auth/me | Get current user profile |

### Profile

| Method | Endpoint | Description |
|---|---|---|
| GET | /profile | Get profile (authenticated) |
| GET | /profile/public | Get public profile |
| PUT | /profile | Update profile |

### Education

| Method | Endpoint | Description |
|---|---|---|
| GET | /education | List all education records |
| GET | /education/:id | Get education by ID |
| POST | /education | Create education record |
| PUT | /education/:id | Update education record |
| DELETE | /education/:id | Delete education record |

### Skills

| Method | Endpoint | Description |
|---|---|---|
| GET | /skills | List all skills |
| GET | /skills/:id | Get skill by ID |
| POST | /skills | Create skill |
| PUT | /skills/:id | Update skill |
| DELETE | /skills/:id | Delete skill |

### Experience

| Method | Endpoint | Description |
|---|---|---|
| GET | /experience | List all experience records |
| GET | /experience/:id | Get experience by ID |
| POST | /experience | Create experience record |
| PUT | /experience/:id | Update experience record |
| DELETE | /experience/:id | Delete experience record |

### Expertise

| Method | Endpoint | Description |
|---|---|---|
| GET | /expertise | List all expertise areas |
| GET | /expertise/:id | Get expertise by ID |
| POST | /expertise | Create expertise |
| PUT | /expertise/:id | Update expertise |
| DELETE | /expertise/:id | Delete expertise |

### Publications

| Method | Endpoint | Description |
|---|---|---|
| GET | /publications | List publications (paginated, filterable) |
| GET | /publications/:slug | Get publication by slug |
| POST | /publications | Create publication |
| PUT | /publications/:id | Update publication |
| DELETE | /publications/:id | Delete publication |
| GET | /publications/:id/citations | Get citation formats (APA, MLA, Chicago, BibTeX) |

### Research Projects

| Method | Endpoint | Description |
|---|---|---|
| GET | /research-projects | List research projects |
| GET | /research-projects/:slug | Get project by slug |
| POST | /research-projects | Create research project |
| PUT | /research-projects/:id | Update research project |
| DELETE | /research-projects/:id | Delete research project |

### Research Interests

| Method | Endpoint | Description |
|---|---|---|
| GET | /research-interests | List research interests |
| GET | /research-interests/:id | Get interest by ID |
| POST | /research-interests | Create interest |
| PUT | /research-interests/:id | Update interest |
| DELETE | /research-interests/:id | Delete interest |

### Projects

| Method | Endpoint | Description |
|---|---|---|
| GET | /projects | List projects |
| GET | /projects/:slug | Get project by slug |
| POST | /projects | Create project |
| PUT | /projects/:id | Update project |
| DELETE | /projects/:id | Delete project |

### Academic Titles

| Method | Endpoint | Description |
|---|---|---|
| GET | /academic-titles | List all academic titles |
| GET | /academic-titles/:id | Get title by ID |
| POST | /academic-titles | Create academic title |
| PUT | /academic-titles/:id | Update academic title |
| DELETE | /academic-titles/:id | Delete academic title |

### Resources

| Method | Endpoint | Description |
|---|---|---|
| GET | /resources | List educational resources |
| GET | /resources/:slug | Get resource by slug |
| POST | /resources | Create resource |
| PUT | /resources/:id | Update resource |
| DELETE | /resources/:id | Delete resource |
| GET | /resources/:id/versions | Get resource version history |

### Services

| Method | Endpoint | Description |
|---|---|---|
| GET | /services | List consulting services |
| GET | /services/:slug | Get service by slug |
| POST | /services | Create service |
| PUT | /services/:id | Update service |
| DELETE | /services/:id | Delete service |

### Service Requests

| Method | Endpoint | Description |
|---|---|---|
| GET | /service-requests | List service requests (admin) |
| GET | /service-requests/:id | Get request by ID |
| POST | /service-requests | Submit service request |
| PUT | /service-requests/:id | Update request status |
| DELETE | /service-requests/:id | Delete request |

### Appointments

| Method | Endpoint | Description |
|---|---|---|
| GET | /appointments | List appointments |
| GET | /appointments/:id | Get appointment by ID |
| POST | /appointments | Create appointment |
| PUT | /appointments/:id | Update appointment |
| DELETE | /appointments/:id | Cancel appointment |

### Events

| Method | Endpoint | Description |
|---|---|---|
| GET | /events | List events |
| GET | /events/:slug | Get event by slug |
| POST | /events | Create event |
| PUT | /events/:id | Update event |
| DELETE | /events/:id | Delete event |
| POST | /events/:id/register | Register for event |
| DELETE | /events/:id/register | Cancel registration |

### Articles

| Method | Endpoint | Description |
|---|---|---|
| GET | /articles | List articles |
| GET | /articles/:slug | Get article by slug |
| POST | /articles | Create article |
| PUT | /articles/:id | Update article |
| DELETE | /articles/:id | Delete article |

### Comments

| Method | Endpoint | Description |
|---|---|---|
| GET | /comments | List comments (filtered by entity) |
| POST | /comments | Submit comment |
| PUT | /comments/:id | Update comment |
| DELETE | /comments/:id | Delete comment |
| PUT | /comments/:id/moderate | Approve/reject comment |

### Newsletter

| Method | Endpoint | Description |
|---|---|---|
| GET | /newsletter | List subscribers (admin) |
| POST | /newsletter/subscribe | Subscribe to newsletter |
| DELETE | /newsletter/:id | Unsubscribe |
| POST | /newsletter/send | Send newsletter blast |

### Contact

| Method | Endpoint | Description |
|---|---|---|
| GET | /contact | List contact messages (admin) |
| POST | /contact | Submit contact form |
| PUT | /contact/:id | Mark as read/replied |
| DELETE | /contact/:id | Delete message |

### FAQ

| Method | Endpoint | Description |
|---|---|---|
| GET | /faqs | List FAQs |
| GET | /faqs/:id | Get FAQ by ID |
| POST | /faqs | Create FAQ |
| PUT | /faqs/:id | Update FAQ |
| DELETE | /faqs/:id | Delete FAQ |

### Testimonials

| Method | Endpoint | Description |
|---|---|---|
| GET | /testimonials | List testimonials |
| GET | /testimonials/:id | Get testimonial by ID |
| POST | /testimonials | Create testimonial |
| PUT | /testimonials/:id | Update testimonial |
| DELETE | /testimonials/:id | Delete testimonial |

### Analytics

| Method | Endpoint | Description |
|---|---|---|
| GET | /analytics/dashboard | Get dashboard analytics |
| GET | /analytics/visits | Get visit statistics |
| POST | /analytics/event | Track analytics event |

### Media

| Method | Endpoint | Description |
|---|---|---|
| GET | /media | List uploaded media |
| POST | /media/upload | Upload media file |
| PUT | /media/:id | Update media metadata |
| DELETE | /media/:id | Delete media file |

### Search

| Method | Endpoint | Description |
|---|---|---|
| GET | /search | Global search across all content |
| GET | /search/suggestions | Search suggestions/autocomplete |

### Settings

| Method | Endpoint | Description |
|---|---|---|
| GET | /settings | Get all settings |
| GET | /settings/:key | Get setting by key |
| PUT | /settings/:key | Update setting |
| PUT | /settings | Bulk update settings |

### Translations

| Method | Endpoint | Description |
|---|---|---|
| GET | /translations | List translations |
| GET | /translations/:id | Get translation by ID |
| POST | /translations | Create translation |
| PUT | /translations/:id | Update translation |
| DELETE | /translations/:id | Delete translation |
| GET | /translations/entity/:entityType/:entityId | Get translations for entity |

### Users (Admin)

| Method | Endpoint | Description |
|---|---|---|
| GET | /users | List all users |
| GET | /users/:id | Get user by ID |
| POST | /users | Create user |
| PUT | /users/:id | Update user |
| DELETE | /users/:id | Delete user |
| PUT | /users/:id/role | Change user role |
| PUT | /users/:id/status | Activate/deactivate user |

### Audit Logs (Admin)

| Method | Endpoint | Description |
|---|---|---|
| GET | /audit-logs | List audit logs (paginated) |
| GET | /audit-logs/:id | Get log entry by ID |

### Career Opportunities

| Method | Endpoint | Description |
|---|---|---|
| GET | /career-opportunities | List career opportunities |
| GET | /career-opportunities/:id | Get opportunity by ID |
| POST | /career-opportunities | Create opportunity |
| PUT | /career-opportunities/:id | Update opportunity |
| DELETE | /career-opportunities/:id | Delete opportunity |

### Health Check

| Method | Endpoint | Description |
|---|---|---|
| GET | /health | Server health check (unauthenticated) |

---

## Frontend Structure

### Public Pages

| Page | Route | Description |
|---|---|---|
| Home | / | Landing page with hero, stats, recent publications, projects |
| About | /about | Detailed bio and academic background |
| Education | /education | Educational history and qualifications |
| Expertise | /expertise | Areas of specialization and skills |
| Career | /career | Professional experience and career opportunities |
| Research | /research | Research projects and interests |
| Publications | /publications | Publication list with filters and citation formats |
| Publication Detail | /publications/:slug | Full publication view with citation export |
| Projects | /projects | Portfolio projects |
| Project Detail | /projects/:slug | Full project view |
| Resources | /resources | Educational resources and materials |
| Resource Detail | /resources/:slug | Full resource view |
| Services | /services | Professional consulting services |
| Service Detail | /services/:slug | Service details with request form |
| Events | /events | Upcoming and past events |
| Event Detail | /events/:slug | Event details with registration |
| Articles | /articles | Blog posts and articles |
| Article Detail | /articles/:slug | Full article view |
| Contact | /contact | Contact form |
| Search | /search | Global search page |

### Admin Pages

| Page | Route | Description |
|---|---|---|
| Dashboard | /admin/dashboard | Analytics overview and quick actions |
| Profile | /admin/profile | Edit profile information |
| Academic Titles | /admin/academic-titles | Manage degrees and titles |
| Education | /admin/education | Manage education records |
| Skills | /admin/skills | Manage skills |
| Experience | /admin/experience | Manage work experience |
| Expertise | /admin/expertise | Manage expertise areas |
| Research Projects | /admin/research-projects | Manage research projects |
| Publications | /admin/publications | Manage publications |
| Projects | /admin/projects | Manage portfolio projects |
| Resources | /admin/resources | Manage educational resources |
| Services | /admin/services | Manage consulting services |
| Service Requests | /admin/service-requests | Track and manage service requests |
| Events | /admin/events | Manage events |
| Articles | /admin/articles | Manage blog articles |
| Comments | /admin/comments | Moderate comments |
| FAQs | /admin/faqs | Manage frequently asked questions |
| Testimonials | /admin/testimonials | Manage testimonials |
| Newsletter | /admin/newsletter | Manage newsletter subscribers |
| Contact | /admin/contact | View contact messages |
| Media | /admin/media | Manage uploaded files |
| Translations | /admin/translations | Manage content translations |
| Users | /admin/users | Manage system users |
| Settings | /admin/settings | Application settings |
| Audit Logs | /admin/audit-logs | View system audit trail |

### Auth Pages

| Page | Route | Description |
|---|---|---|
| Login | /admin/login | Admin login form |
| Forgot Password | /admin/forgot-password | Password reset request |
| Unauthorized | /unauthorized | Access denied page |

### Contexts

| Context | Purpose |
|---|---|
| AuthContext | Authentication state, login/logout, user role, token management |
| LanguageContext | Current language (EN/FR/LA), language switching, translation loading |
| SettingsContext | Application settings from backend, theme configuration |

### Reusable Components

| Component | Purpose |
|---|---|
| Breadcrumbs | Navigation breadcrumb trail |
| ConfirmDialog | Confirmation modal for destructive actions |
| DataTable | Sortable, filterable data table with pagination |
| ErrorMessage | Error display component |
| FileUpload | Drag-and-drop file upload with preview |
| LoadingSpinner | Loading state indicator |
| Modal | Reusable modal dialog |
| Pagination | Page navigation controls |
| RichTextEditor | Rich text input for content |
| SearchModal | Global search overlay |
| SEO | Document head management for SEO |
| StatusBadge | Status indicator badge |
| Header | Public site navigation header |
| Footer | Public site footer |
| AdminLayout | Admin dashboard layout with sidebar |

---

## Features

### Public Features

#### Responsive Design
- Mobile-first approach with Tailwind CSS
- Optimized for desktop, tablet, and mobile viewports
- Fluid typography and spacing

#### Language Switching
- Three supported languages: English (EN), French (FR), Latin (LA)
- Language preference persisted in localStorage
- UI translations loaded from locale files
- Content translations loaded from database

#### Global Search
- SearchModal accessible from any page via keyboard shortcut (Ctrl+K)
- Full-text search across publications, projects, articles, resources, and events
- Real-time search suggestions/autocomplete
- Filtered results by content type

#### Publications with Citation Formats
- Multiple citation formats: APA, MLA, Chicago, BibTeX
- One-click citation copy/download
- Publication type filtering (journal article, conference paper, book chapter, etc.)
- DOI and URL links

#### Research Projects
- Detailed project pages with status tracking
- Team members and funding information
- Related publications linking

#### Service Request System
- Browse available consulting services
- Submit service requests with custom requirements
- Request status tracking (pending, in-progress, completed)

#### Newsletter Subscription
- Email subscription form
- Subscriber management in admin

#### Comment System with Moderation
- Comments on publications, articles, projects, and resources
- Moderation queue for admin approval
- Spam protection

#### SEO Optimization
- React Helmet Async for per-page meta tags
- Dynamic Open Graph and Twitter Card tags
- Semantic HTML structure
- Sitemap-ready URL structure

### Admin Features

#### Dashboard with Analytics
- Publication and project statistics
- Recent activity feed
- Quick action buttons
- Visitor analytics

#### Full CRUD for All Content Types
- Create, read, update, delete operations for all 30+ models
- Batch operations where applicable
- Rich text editing for content fields
- File upload with drag-and-drop

#### Role-Based Access Control
- Six user roles with granular permissions
- Visual indicators for restricted actions
- Automatic route protection

#### Media Management
- File upload with type validation
- Image preview and metadata
- Version management for resources

#### Comment Moderation
- Approve/reject comment queue
- Bulk moderation actions
- User comment history

#### Service Request Tracking
- Request lifecycle management
- Status updates and notes
- Client communication history

#### Translation Management
- Separate UI translations from content translations
- Translation status tracking (missing, draft, review, published, outdated)
- Side-by-side translation editing

#### Audit Logging
- All CRUD operations logged with user attribution
- Filterable audit trail
- Timestamp and action details

#### Settings Management
- Site-wide configuration
- Feature flags
- SEO defaults
- Email templates
---

## Document Storage

### Local File System Abstraction

The platform stores uploaded files in a local uploads/ directory with the following structure:

`
uploads/
  publications/       # Publication attachments and figures
  resources/          # Educational resource files
  media/              # General media uploads
  avatars/            # User profile pictures
  temp/               # Temporary upload staging
`

### File Handling

- Validation: MIME type checking against allowed file types
- Safe Filenames: UUID-based filenames to prevent conflicts and path traversal
- Size Limits: Configurable maximum file size (default: 10MB)
- Version Management: Resource model supports versioned file uploads
- Static Serving: Express static middleware serves files at /uploads/ endpoint

### Cloud Storage Ready

The storage abstraction is designed for easy migration to cloud providers:
- AWS S3
- Google Cloud Storage
- Cloudinary
- Azure Blob Storage

Update the UPLOAD_DIR configuration and storage middleware to switch providers.

---

## Translation Architecture

### Dual Translation System

The platform separates UI translations from content translations:

#### UI Translations
- Stored in frontend/src/locales/ as JSON files
- Loaded based on user language preference
- Cover all interface labels, messages, and static text

#### Content Translations
- Stored in MongoDB Translation collection
- Linked to specific entities via entityType and entityId
- Support for translatable fields within any model

### Translation Model

Key fields in the Translation model:
- entityType: Model being translated (e.g., publication, article)
- entityId: Reference to source document
- language: Target language code (en, fr, la)
- field: Specific field name (e.g., title, abstract)
- value: Translated value
- status: missing, draft, review, published, or outdated
- translator: User who translated
- reviewedBy: User who reviewed
- translatedAt: Timestamp of translation
- reviewedAt: Timestamp of review

### Translation Workflow

1. Content created in primary language (EN)
2. System creates missing translation entries for FR and LA
3. Translators update entries to draft status
4. Reviewers approve and set to published
5. When source content changes, related translations set to outdated

### API Support

- GET /api/translations/entity/:type/:id - Get all translations for an entity
- Bulk translation import/export for external translation services
- Translation memory for consistency across documents

---

## Testing

### Backend Testing

The backend uses Jest and Supertest for integration testing.

`ash
# Run all tests
npm test

# Run tests in watch mode
npx jest --watch

# Run with coverage
npx jest --coverage
`

Tests cover:
- API endpoint responses and status codes
- Authentication and authorization flows
- Data validation and error handling
- Database operations and model behavior

### Frontend Testing

The frontend uses React Testing Library for component testing.

`ash
# Run all tests
npm test

# Run with coverage
npx react-scripts test --coverage
`

Tests cover:
- Component rendering and state management
- User interaction flows
- Form validation
- API integration mocking

### Test File Location

- Backend: backend/src/**/*.test.js or backend/src/__tests__/
- Frontend: frontend/src/**/*.test.js (co-located with components)

---

## Deployment

### VPS / Docker Deployment

#### Production Docker Compose

Create docker-compose.prod.yml with the following services:

- mongodb: MongoDB 7 with persistent volume and health checks
- backend: Express.js API in production mode
- frontend: Nginx serving optimized React build
- nginx: Reverse proxy with SSL termination

Deploy with:

`ash
docker-compose -f docker-compose.prod.yml up -d --build
`

### Cloud Platform Deployment

#### Render

1. Connect GitHub repository
2. Create Web Service for backend
   - Build command: cd backend && npm install
   - Start command: cd backend && npm start
   - Environment: Node, Port 5000
3. Create Static Site for frontend
   - Build command: cd frontend && npm install && npm run build
   - Publish directory: frontend/build
4. Use MongoDB Atlas for database
5. Set all environment variables in Render dashboard

#### Railway

1. Connect GitHub repository
2. Add MongoDB plugin
3. Set environment variables
4. Deploy both services

#### AWS (EC2 + ECS)

1. Provision EC2 instance or ECS cluster
2. Install Docker and Docker Compose
3. Clone repository and set environment variables
4. Run with production Docker Compose
5. Configure AWS load balancer for SSL termination

### SSL / HTTPS

For production, always use HTTPS:

- Let's Encrypt: Free SSL certificates via Certbot
- Cloudflare: CDN with SSL termination
- AWS Certificate Manager: Managed SSL for AWS services
- Nginx: Configure SSL in nginx.conf with ssl_certificate and ssl_certificate_key directives

---

## Security

### Authentication Security

- JWT access tokens with short expiration (15 minutes)
- Refresh token rotation prevents token reuse attacks
- Tokens stored in httpOnly cookies (not accessible via JavaScript)
- Password hashing with bcrypt (12 salt rounds)
- Account lockout after 5 failed login attempts (30-minute lockout)

### API Security

- **Rate Limiting**: 100 requests per 15-minute window per IP
- **Auth Rate Limiting**: 5 requests per 15-minute window for login/register
- **CORS**: Configured for specific origins only
- **Helmet**: Sets various HTTP security headers
- **Input Validation**: express-validator on all endpoints
- **Mongo Sanitize**: Prevents NoSQL injection attacks
- **XSS Clean**: Sanitizes user input against XSS
- **HPP**: Prevents HTTP parameter pollution

### File Upload Security

- MIME type validation against allowed types
- File size limits enforced
- UUID-based filenames prevent path traversal
- Files stored outside web root
- Separate upload directory not served by frontend

### Data Security

- No sensitive data exposed in API responses
- Passwords never returned in user responses
- Environment variables for all secrets
- .env files excluded from version control
- MongoDB connection string with authentication

### Production Recommendations

- Use HTTPS everywhere (TLS 1.3)
- Rotate JWT secrets regularly
- Use MongoDB Atlas with VPC peering
- Enable MongoDB audit logging
- Set up intrusion detection (Fail2Ban)
- Regular security dependency audits (npm audit)
- Implement Content Security Policy headers
- Use a Web Application Firewall (WAF)

---

## Backup Strategy

### MongoDB Backup

#### Automated Backup Script

```bash
#!/bin/bash
BACKUP_DIR=./backups
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Dump database
mongodump --uri=mongodb://localhost:27017/celine-platform --out=$BACKUP_DIR/$TIMESTAMP

# Compress
tar -czf $BACKUP_DIR/$TIMESTAMP.tar.gz $BACKUP_DIR/$TIMESTAMP
rm -rf $BACKUP_DIR/$TIMESTAMP

# Keep only last 30 backups
ls -t $BACKUP_DIR/*.tar.gz | tail -n +31 | xargs rm -f 2>/dev/null
```

#### Docker Backup

```bash
docker exec celine-backend mongodump --uri=mongodb://mongodb:27017/celine-platform --out=/tmp/backup
docker cp celine-backend:/tmp/backup ./backups/$(date +%Y%m%d_%H%M%S)
```

### File Backup

```bash
# Backup uploads directory
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz ./backend/uploads/
```

### Environment Variables

- Store .env files in a secure password manager
- Use environment variable injection in production (not files)
- Rotate JWT secrets periodically

### Recommended Schedule

| Backup Type | Frequency | Retention |
|---|---|---|
| MongoDB dump | Daily | 30 days |
| Full database | Weekly | 12 weeks |
| Upload files | Daily | 30 days |
| Full system | Monthly | 12 months |
| Offsite copy | Weekly | 4 weeks |

### Restore Process

```bash
# Restore MongoDB
mongorestore --uri=mongodb://localhost:27017/celine-platform ./backups/20240101/

# Restore uploads
tar -xzf uploads-backup-20240101.tar.gz -C ./
```

---

## Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Run tests: `npm test` (in both backend and frontend)
5. Run lint: `npm run lint` (backend)
6. Commit with a descriptive message
7. Push to your fork: `git push origin feature/your-feature`
8. Open a Pull Request

### Code Style

#### Backend (ESLint)
- Use ES module syntax (import/export)
- Async/await over callbacks
- Meaningful variable and function names
- JSDoc comments for complex functions

#### Frontend
- Functional components with hooks
- Tailwind CSS for styling (no inline styles)
- Component files use PascalCase
- Utility files use camelCase
- Named exports for components

### Branch Naming

- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation changes
- `refactor/*` - Code refactoring
- `test/*` - Adding or updating tests

### Commit Messages

Use conventional commit format:

```
type(scope): description

Examples:
feat(publications): add citation export functionality
fix(auth): resolve token refresh race condition
docs(readme): update deployment instructions
refactor(models): simplify publication schema
test(auth): add login endpoint tests
```

### Pull Request Guidelines

- PRs should target the `main` branch
- Include a clear description of changes
- Reference related issues
- Ensure all tests pass
- Request at least one review
- Squash merge for clean history

### Issue Reporting

When reporting bugs, include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details (OS, Node version, browser)
- Screenshots if applicable

---

## License

ISC License

Copyright (c) 2024 Celine Marie CYUZUZO IRAKOZE

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
