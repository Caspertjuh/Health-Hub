# Day Planning Application

A comprehensive day planning application for a day activity center serving users with intellectual disabilities, including Down syndrome.

## Project Team

- Jesse Hummel (Lead)
- Remco Pruim
- Tjitte Timmerman
- Casper Oudman

## Project Timeline

Target completion date: June 23, 2025

## Features

- Admin panel for caregiver management of resident profiles and disabilities
- Comprehensive disability profile configuration
- Activity filtering based on resident capabilities
- UI that adapts to resident profiles
- Individual resident data storage
- "Return to Main Menu" buttons throughout
- Backend saving of user adjustments and settings
- Automatic daily schedule generation (no manual regeneration)
- Daily unique schedules tailored to user disabilities
- Template-based activities in admin panel (no duplicates)
- Full SQL database implementation

## Technical Specifications

- React frontend with Tailwind CSS v4
- Node.js backend
- SQL database backend
- Windows environment (CMD server)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```
git clone <repository-url>
cd day-planning-application
```

2. Install dependencies
```
npm install
```

3. Create a `.env` file in the root directory with the following content:
```
PORT=5000
NODE_ENV=development
DB_PATH=./data/day-planning-app.db
DB_DEMO_DATA=true
JWT_SECRET=YourSecretKeyForDevelopmentOnly_ChangeMeInProduction
JWT_EXPIRY=8h
```

4. Initialize the database
```
npm run init-db
```

5. Start the development server
```
npm run dev
```

### Running in Production

1. Build the frontend
```
npm run build
```

2. Start the production server
```
npm start
```

## Database Schema

The application uses a SQLite database with the following tables:
- users
- user_disabilities
- user_preferences
- activity_templates
- template_required_support
- activities
- activity_required_support
- group_activity_participants
- group_activity_settings
- activity_history
- admin_users
- app_settings

## API Endpoints

### Authentication
- POST /api/auth/login - Login admin user
- GET /api/auth/me - Get current user info
- POST /api/auth/change-password - Change admin password
- POST /api/auth/setup - Create admin user (initial setup)

### Users
- GET /api/users - Get all users
- GET /api/users/:id - Get user by ID
- POST /api/users - Create user
- PUT /api/users/:id - Update user
- DELETE /api/users/:id - Delete user

### Activities
- GET /api/activities/user/:userId/date/:date - Get activities for user and date
- GET /api/activities/templates - Get all activity templates
- GET /api/activities/templates/:id - Get template by ID
- POST /api/activities/templates - Create activity template
- PUT /api/activities/templates/:id - Update activity template
- POST /api/activities/from-template/:templateId - Create activity from template
- PATCH /api/activities/:id/complete - Update activity completion status
- POST /api/activities/:id/join - Join group activity
- POST /api/activities/:id/leave - Leave group activity
- POST /api/activities/generate/:userId - Generate activities for user

### Health Check
- GET /api/health - Check API health

## Admin Credentials

The default admin credentials are:
- Username: admin
- Password: admin123

## License

This project is licensed under the MIT License.