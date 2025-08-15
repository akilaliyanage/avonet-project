# Avonet Expense Tracker

A full-stack personal expense tracking web application built with NextJS, NestJS, MongoDB, and Auth0.

## Features

- **User Authentication**: Secure login/registration using Auth0
- **Expense Management**: Add, edit, and delete expenses with categories
- **Budget Tracking**: Set monthly expense limits with alerts at 90% usage
- **Expense Analytics**: Visual charts showing spending patterns and trends
- **Responsive Design**: Mobile-friendly interface using Material-UI
- **Real-time Updates**: Live dashboard with current month statistics

## Tech Stack

### Frontend
- **NextJS 15** with App Router
- **React 19** with TypeScript
- **Material-UI 7** for components and theming
- **Recharts** for data visualization
- **Auth0 React SDK** for authentication

### Backend
- **NestJS** with TypeScript
- **MongoDB** with Mongoose ODM
- **JWT Authentication** with Auth0 integration
- **Class Validator** for data validation
- **Passport.js** for authentication strategies

## Prerequisites

- Node.js 18+ and Yarn
- MongoDB instance (local or cloud)
- Auth0 account and application

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd avonet-expense-tracker
yarn install
```

### 2. Backend Configuration

Navigate to the backend directory:
```bash
cd apps/backend
```

Copy the environment example and configure:
```bash
cp env.example .env
```

Update `.env` with your configuration:
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/expense-tracker

# Auth0 Configuration
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_AUDIENCE=your-api-identifier
AUTH0_ISSUER_URL=https://your-domain.auth0.com/

# Server Configuration
PORT=3001
NODE_ENV=development
```

### 3. Frontend Configuration

Navigate to the frontend directory:
```bash
cd ../frontend
```

Copy the environment example and configure:
```bash
cp env.local.example .env.local
```

Update `.env.local` with your Auth0 configuration:
```env
# Auth0 Configuration
NEXT_PUBLIC_AUTH0_DOMAIN=your-domain.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your-client-id
NEXT_PUBLIC_AUTH0_AUDIENCE=your-api-identifier

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 4. Auth0 Setup

1. Create an Auth0 account at [auth0.com](https://auth0.com)
2. Create a new application (Single Page Application)
3. Configure the following:
   - **Allowed Callback URLs**: `http://localhost:3000`
   - **Allowed Logout URLs**: `http://localhost:3000`
   - **Allowed Web Origins**: `http://localhost:3000`
4. Create an API with identifier (e.g., `https://expense-tracker-api`)
5. Enable RS256 signing algorithm
6. Copy the domain, client ID, and audience to your environment files

### 5. MongoDB Setup

Start MongoDB locally or use MongoDB Atlas:
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker
```

### 6. Run the Application

From the root directory:

```bash
# Start the backend
nx serve backend

# In another terminal, start the frontend
nx serve frontend
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api

## API Endpoints

### Authentication
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/profile/update` - Update user profile

### Expenses
- `GET /api/expenses` - Get all expenses (with filters)
- `POST /api/expenses` - Create new expense
- `GET /api/expenses/:id` - Get specific expense
- `PATCH /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Analytics
- `GET /api/expenses/stats/monthly` - Monthly statistics
- `GET /api/expenses/stats/alert` - Budget alert status
- `GET /api/expenses/stats/patterns` - Expense patterns over time

## Usage

1. **Login**: Use the "Get Started" button to authenticate with Auth0
2. **Add Expenses**: Click "Add New Expense" to record spending
3. **View Dashboard**: See monthly overview, budget usage, and alerts
4. **Analyze Patterns**: View charts showing spending distribution and trends
5. **Filter Expenses**: Use the filter options to find specific expenses
6. **Manage Expenses**: Edit or delete expenses as needed

## Deployment

### Production (Railway)

- **Frontend**: `https://frontend-production-2f0a.up.railway.app`
- **Backend API**: `https://avonet-project-production.up.railway.app/api`

#### Environment variables on Railway

- **Frontend service**
  - `NEXT_PUBLIC_API_URL=https://avonet-project-production.up.railway.app/api`

- **Backend service**
  - `PORT` is provided by Railway automatically
  - `FRONTEND_URL=https://frontend-production-2f0a.up.railway.app`
  - `MONGODB_URI=<your Mongo connection string>`
  - (plus your existing Auth0 vars: `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`, `AUTH0_AUDIENCE`, `AUTH0_ISSUER_URL`)

> Remember to add the production frontend URL to Auth0 Allowed Callback URLs, Logout URLs, and Web Origins.

### Frontend (Vercel - Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd apps/frontend
vercel
```

### Backend (Railway, Render, or Heroku)
1. Push your code to GitHub
2. Connect your repository to your preferred platform
3. Set environment variables
4. Deploy

## Development

### Available Commands

```bash
# Build applications
nx build frontend
nx build backend

# Run tests
nx test frontend
nx test backend

# Run e2e tests
nx e2e frontend-e2e
nx e2e backend-e2e

# Lint code
nx lint frontend
nx lint backend
```

### Architecture

- **Style**: Domain-oriented, vertically sliced by feature (DDD-influenced)
- **Domains**:
  - `auth/`: `auth.controller.ts`, `auth.service.ts`, `jwt.strategy.ts`, `jwt-auth.guard.ts`, `user.schema.ts`, `dto/`
  - `expense/`: `expense.controller.ts`, `expense.service.ts`, `expense.schema.ts`, `expense.dto.ts`
- **Why vertical slices?** Each domain owns its controllers, services, schemas, and DTOs. This improves cohesion, reduces cross-module coupling, and makes changes safer and more local.
- **NestJS Modules**: `AuthModule`, `ExpenseModule` registered in `AppModule`.
- **Cross-cutting concerns**: Validation via global `ValidationPipe`, logging via NestJS `Logger`.

### Backend patterns
- **Controller–Service**: Controllers handle I/O and delegate to Services for business logic.
- **Strategy (Auth)**: JWT handled via Passport `JwtStrategy`.
- **Guard**: `JwtAuthGuard` protects routes and normalizes auth errors.
- **DTO + Validation**: DTO classes per domain with `class-validator` and `class-transformer`.
- **Repository/DAO via Mongoose Models**: Schemas mapped to models injected with `@InjectModel`.
- **Module**: Feature modules encapsulate domain concerns.

## Project Structure

```
avonet-expense-tracker/
├── apps/
│   ├── frontend/                 # NextJS frontend
│   └── backend/                  # NestJS backend
│       └── src/app/
│           ├── auth/             # Domain slice: auth
│           │   ├── auth.controller.ts
│           │   ├── auth.module.ts
│           │   ├── auth.service.ts
│           │   ├── jwt.strategy.ts
│           │   ├── jwt-auth.guard.ts
│           │   ├── user.schema.ts
│           │   └── dto/
│           ├── expense/          # Domain slice: expense
│           │   ├── expense.controller.ts
│           │   ├── expense.module.ts
│           │   ├── expense.service.ts
│           │   ├── expense.schema.ts
│           │   └── expense.dto.ts
│           ├── app.controller.ts
│           └── app.module.ts
└── package.json
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please create an issue in the GitHub repository.
