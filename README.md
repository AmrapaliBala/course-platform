# Course Platform

A small production-oriented course platform built as a take-home

technical assessment for ****Tattvera Technologies****.

The application demonstrates authentication, course browsing,

enrollment, protected student learning, lesson completion, and progress

tracking using a Next.js frontend and Node.js/Express backend.

## Features

### Authentication

-   Email OTP login using Node.js and Nodemailer

-   OTPs are securely hashed before being stored

-   OTP expiration and verification-attempt limits

-   OTP request rate limiting

-   Authentication using an HTTP-only `auth_token` cookie containing a

    JWT

-   Protected `/dashboard` route using Next.js middleware

-   Unauthenticated users are redirected to `/login`

### Course Catalogue

-   Public `/courses` page

-   Courses are fetched from the Node.js backend

-   Each course displays:

    -   Title

    -   Short description

    -   Price

-   The catalogue is implemented as a server-rendered Next.js page

### Course Details

-   `/courses/[id]` displays:

    -   Course title

    -   Description

    -   Price

    -   Chapters

    -   Lessons

-   Users can enroll in a course

-   Enrolled users can continue learning

-   Unauthenticated users are directed to log in before enrollment

### Student Dashboard

-   Protected `/dashboard` page

-   Displays enrolled courses

-   Shows lesson completion progress such as `2 of 4 lessons complete`

-   Provides a ****Continue Learning**** action that opens the next

    incomplete lesson

-   Displays a completed state when all lessons are finished

### Lesson Viewer

-   Route: `/courses/[id]/lessons/[lessonId]`

-   Displays lesson title and content

-   Only enrolled users can access lessons

-   Includes a ****Mark as Complete**** action

-   Completion state is stored in the Enrollment document

-   Progress is calculated from completed lessons versus total course

    lessons

## Tech Stack

### Frontend

-   Next.js

-   React

-   JavaScript

-   Tailwind CSS

-   shadcn/ui

### Backend

-   Node.js

-   Express.js

-   MongoDB

-   Mongoose

-   JWT

-   Jose

-   Nodemailer

-   Cookie Parser

-   CORS

### Database

MongoDB is used as the application database. All database access and

business logic are handled by the Node.js backend.

## Project Architecture

``` text

course-platform/

│

├── backend/

│   ├── config/

│   │   └── db.js

│   ├── controllers/

│   │   ├── authController.js

│   │   ├── courseController.js

│   │   ├── enrollmentController.js

│   │   └── lessonController.js

│   ├── middleware/

│   │   └── authMiddleware.js

│   ├── models/

│   │   ├── User.js

│   │   ├── Course.js

│   │   ├── Chapter.js

│   │   ├── Lesson.js

│   │   └── Enrollment.js

│   ├── routes/

│   │   ├── authRoutes.js

│   │   ├── courseRoutes.js

│   │   ├── enrollmentRoutes.js

│   │   └── lessonRoutes.js

│   ├── utils/

│   │   ├── email.js

│   │   └── token.js

│   ├── .env

│   ├── package.json

│   ├── seed.js

│   └── server.js

│

└── frontend/

    ├── app/

    │   ├── courses/

    │   │   ├── page.jsx

    │   │   └── [id]/

    │   │       ├── page.jsx

    │   │       └── lessons/

    │   │           └── [lessonId]/

    │   │               └── page.jsx

    │   ├── dashboard/

    │   │   └── page.jsx

    │   ├── login/

    │   │   └── page.jsx

    │   ├── layout.js

    │   └── page.js

    ├── components/

    │   ├── ui/

    │   ├── EnrollButton.jsx

    │   └── Navbar.jsx

    ├── context/

    │   └── AuthContext.jsx

    ├── lib/

    │   ├── api.js

    │   ├── server-api.js

    │   └── utils.js

    ├── middleware.js

    ├── .env.local

    └── package.json

```

## Data Model

The application uses the following MongoDB models:

### User

Stores user authentication information, including email and OTP-related

fields.

### Course

Represents a course available on the platform.

### Chapter

Belongs to a course and groups related lessons.

### Lesson

Belongs to a chapter and contains the lesson title, content, and

ordering information.

### Enrollment

Connects a user to a course and stores the lessons completed by that

user.

### Relationships

``` text

User

 │

 └── Enrollment ─── Course

                       │

                       └── Chapter

                              │

                              └── Lesson

```

The frontend does not connect directly to MongoDB. Database operations

are performed by the Node.js backend.

## API Endpoints

### Authentication

``` text

POST /api/auth/request-otp

POST /api/auth/verify-otp

GET  /api/auth/me

```

### Courses

``` text

GET /api/courses

GET /api/courses/:id

```

### Enrollments

``` text

POST /api/enrollments

GET  /api/enrollments/my-courses

```

### Lessons

``` text

GET  /api/lessons/:lessonId

POST /api/lessons/:lessonId/complete

```

Protected endpoints require the authenticated HTTP-only JWT cookie.

## Prerequisites

Before running the project locally, make sure you have:

-   Node.js 18+ installed

-   npm installed

-   A MongoDB database, such as MongoDB Atlas

-   An SMTP provider for sending OTP emails

## Environment Variables

### Backend

Create:

``` text

backend/.env

```

Add:

``` env

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_long_random_jwt_secret

FRONTEND_URL=http://localhost:3000

SMTP_HOST=smtp-relay.brevo.com

SMTP_PORT=587

SMTP_USER=your_smtp_login

SMTP_PASS=your_smtp_key

SMTP_FROM=your_verified_sender_email

PORT=5000

```

### Frontend

Create:

``` text

frontend/.env.local

```

Add:

``` env

NEXT_PUBLIC_API_URL=http://localhost:5000
JWT_SECRET=your_jwt_secret

```

> ****Security:**** Never commit real credentials, SMTP keys, database

> passwords, or JWT secrets to GitHub.

## Installation & Setup

### 1. Clone the Repository

``` bash

git clone https://github.com/AmrapaliBala/course-platform.git

cd course-platform

```

### 2. Install Backend Dependencies

``` bash

cd backend

npm install

```

### 3. Configure Backend Environment Variables

Create `backend/.env` and add the variables listed in the [Environment

Variables](#environment-variables) section.

### 4. Seed the Database

From the `backend` directory:

``` bash

node seed.js

```

This creates sample course data with chapters and lessons.

### 5. Start the Backend

``` bash

npm run dev

```

The backend runs by default at:

``` text

http://localhost:5000

```

### 6. Install Frontend Dependencies

Open a second terminal:

``` bash

cd course-platform/frontend

npm install

```

### 7. Configure Frontend Environment Variables

Create `frontend/.env.local`:

``` env

NEXT_PUBLIC_API_URL=http://localhost:5000
JWT_SECRET=your_jwt_secret

```

### 8. Start the Frontend

``` bash

npm run dev

```

The frontend runs at:

``` text

http://localhost:3000

```

## Running the Application

Once both servers are running:

1.  Open `http://localhost:3000`

2.  Go to ****Courses****

3.  Open a course

4.  Log in using email OTP if authentication is required

5.  Enroll in the course

6.  Open the ****Student Dashboard****

7.  Click ****Continue Learning****

8.  Open a lesson

9.  Click ****Mark as Complete****

10. Return to the dashboard and verify the progress indicator

### Example Progress

``` text

1 of 4 lessons complete

25% complete

```

After completing all lessons:

``` text

4 of 4 lessons complete

100% complete

```

## Authentication Flow

The authentication flow is:

``` text

Enter email

    ↓

Request OTP

    ↓

Backend generates OTP

    ↓

OTP is hashed and stored with an expiry

    ↓

OTP is sent through SMTP

    ↓

User enters OTP

    ↓

Backend verifies OTP

    ↓

JWT is created

    ↓

JWT is stored in an HTTP-only cookie

    ↓

Protected routes become accessible

```

The dashboard is protected at the Next.js middleware layer. The backend

also protects authenticated API endpoints using JWT authentication

middleware.

## Security Considerations

The implementation includes several basic security measures:

-   HTTP-only authentication cookie

-   JWT-based session authentication

-   OTP hashing instead of storing the raw OTP

-   OTP expiration

-   Maximum OTP verification attempts

-   Rate limiting for repeated OTP requests

-   Authentication checks on enrollment and lesson endpoints

-   Enrollment checks before serving lesson content

-   Database access restricted to the backend

-   Environment variables used for secrets and credentials

-   CORS configured to allow requests from the frontend origin

## Server vs. Client Responsibilities

The project separates server-side and client-side responsibilities:

-   The public course catalogue is implemented as a server-rendered

    Next.js page

-   Course details are fetched server-side where appropriate

-   Interactive actions such as enrollment and marking lessons complete

    use client components

-   Authentication state and browser interactions are handled on the

    client

-   Business logic and database operations remain in the Node.js backend

## Bonus Tasks

### Bonus A --- Stripe Checkout

Stripe Checkout was not implemented in the current version.

A production implementation would:

1.  Create a Stripe Checkout Session from the backend

2.  Redirect the user to Stripe Checkout

3.  Receive `checkout.session.completed` through a backend webhook

4.  Verify the Stripe webhook signature

5.  Create the enrollment only after successful payment

This keeps payment verification and enrollment creation on the backend.

### Bonus B --- Security Layer

Arcjet was not added to the current version.

The application already includes basic authentication protections such

as OTP expiration, verification-attempt limits, and OTP request rate

limiting.

For a production deployment, Arcjet could additionally be integrated

into the Node.js authentication and enrollment endpoints for:

-   Rate limiting

-   Bot protection

-   Abuse prevention

-   Additional request-level security

## Known Limitations

-   Stripe payments are not implemented

-   Arcjet is not integrated

-   The application focuses on the core assessment requirements rather

    than a full production payment/admin system

-   The sample database is populated through the provided seed script

-   The SMTP provider must be configured before email OTP login can send

    real emails

## Production Notes

For a production deployment, I would additionally consider:

-   Stronger request validation with a schema-validation library

-   Centralized API error handling

-   Structured logging and monitoring

-   More comprehensive automated tests

-   CSRF considerations depending on the final authentication

    architecture

-   Secure production cookie configuration

-   HTTPS-only deployment

-   Database indexes and query optimization for larger course catalogs

-   Stripe webhook verification if payments are enabled

-   Bot and abuse protection using Arcjet or an equivalent service

## Author

****Amrapali Bala****

Built as a full-stack technical assessment demonstrating React/Next.js,

Node.js, Express, MongoDB, authentication, REST APIs, and

course-progress management.