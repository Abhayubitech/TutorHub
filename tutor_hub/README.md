# TutorHub Frontend

A modern Angular 19 web application for the TutorHub tutoring platform, built with standalone components and Angular signals.

## 🚀 Tech Stack

- **Angular 19** - Modern web framework
- **TypeScript** - Type-safe language
- **Angular Signals** - Reactive state management
- **Standalone Components** - Modern Angular architecture
- **Responsive Design** - Mobile-friendly UI

## 📦 Prerequisites

- Node.js (v16+)
- npm (v8+)
- Angular CLI (v19+)

## 🎯 Getting Started

### Installation

1. Navigate to the frontend directory:
```bash
cd tutor_hub
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:4200`

## 📁 Project Structure

```
tutor_hub/
├── src/
│ ├── index.html
│ ├── main.ts                 # Entry point
│ ├── styles.css              # Global styles
│ └── app/
│ ├── app.component.*         # Root component
│ ├── app.config.ts           # App configuration
│ ├── app.routes.ts           # Route definitions
│ ├── services/
│ │ ├── api.service.ts        # HTTP API service
│ │ ├── auth.service.ts       # Authentication service
│ │ ├── teacher.service.ts    # Teacher service
│ │ └── student.service.ts    # Student service
│ └── pages/
│ ├── login/
│ ├── signup/
│ ├── home/
│ ├── teacher/
│ │ └── teacher-dashboard/
│ ├── student/
│ │ └── student-dashboard/
│ └── admin/
│ └── admin-dashboard/
├── angular.json              # Angular CLI configuration
├── package.json
├── tsconfig.json
└── README.md
```

## 🎨 Features

### User Roles

#### Student
- ✅ Browse all available courses
- ✅ View teacher profiles
- ✅ Search courses by subject
- ✅ Send enrollment requests
- ✅ Track enrollment status
- ✅ View enrolled courses

#### Teacher
- ✅ Create and manage courses
- ✅ Update teacher profile
- ✅ View enrollment requests
- ✅ Approve/reject students
- ✅ See enrolled students per course
- ✅ Manage course schedules

#### Admin
- ✅ Manage all users (view, delete)
- ✅ Monitor platform activity
- ✅ Oversee all courses

### Authentication
- ✅ Login/Signup with role selection
- ✅ JWT token-based authentication
- ✅ Protected routes
- ✅ Auto-logout on token expiration

## 🔧 Services

### API Service
Handles all HTTP requests to the backend API.

### Auth Service
Manages authentication state using Angular signals.

### Student Service
Manages student data with signals.

### Teacher Service
Manages teacher data with signals.

## 📱 Pages

### Public Pages
- **Login** - User authentication
- **Signup** - New account registration
- **Home** - Landing page with feature overview

### Protected Pages
- **Student Dashboard** - Browse courses, manage enrollments
- **Teacher Dashboard** - Manage courses and students
- **Admin Dashboard** - Platform management

## 🎯 Angular Signals Usage

All services use Angular 19 signals for reactive state management.

## 🔄 Routing

```
/login          - Login page
/signup         - Signup page
/home           - Home page
/student        - Student dashboard
/teacher        - Teacher dashboard
/admin          - Admin dashboard
```

## 🔐 Authentication Flow

1. User logs in with email and password
2. Backend validates credentials and returns JWT token
3. Token is stored in localStorage
4. Token is included in every request header
5. Protected routes check authentication before access

## 💻 Development Commands

```bash
# Start dev server
npm start

# Build for production
npm build

# Run tests
npm test
```

## 🚀 Building for Production

```bash
npm run build
```

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📝 License

ISC

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
