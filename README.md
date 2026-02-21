# Zanix-LMS-Backend

A comprehensive Learning Management System (LMS) backend built with Node.js, Express, TypeScript, and MongoDB.

## Features

- 🔐 **Authentication & Authorization** - JWT-based auth with role-based access control (Student, Instructor, Admin, Super Admin)
- 👥 **User Management** - Complete user lifecycle management with profile updates and file uploads
- 📚 **Course Management** - Create, update, publish, and manage courses with thumbnails and intro videos
- 🎥 **Course Modules** - Organize courses into structured modules for better learning flow
- 📹 **Video Content Management** - Upload and manage video content for course modules
- 💳 **Mock Payment System** - Simplified payment processing for development and testing
- 📧 **Email System** - Automated email notifications, OTP verification, and invoice delivery
- 📄 **Invoice Generation** - PDF invoice generation and storage with Cloudinary
- 📊 **Analytics & Stats** - Comprehensive dashboard with user, course, enrollment, and revenue statistics
- 🔍 **OTP Verification** - Email-based OTP system for account verification and password reset
- 📈 **Progress Tracking** - Student course progress tracking and completion monitoring
- ☁️ **Cloud Storage** - Cloudinary integration for file uploads (images, videos, documents)
- 🔄 **Job Queues** - Redis-based job queues for email processing and background tasks
- 🛡️ **Security** - Rate limiting, input validation, error handling, and secure authentication

## Payment System

The system implements a **Mock Payment System** designed for development and testing:

### ✅ Key Features

- **No External Dependencies**: No need for payment gateway setup during development
- **Instant Processing**: Immediate payment simulation with success/failure options
- **Complete Flow**: Full payment lifecycle including callbacks and status updates
- **Invoice Generation**: Automatic PDF invoice creation and email delivery
- **Transaction Tracking**: Complete payment history and status monitoring
- **Recovery System**: Handles abandoned cart scenarios with smart reuse logic

### 🔄 Payment Flow

1. **Initiation**: Student initiates payment for a course
2. **Mock Gateway**: Redirects to mock payment page (configurable success/failure)
3. **Completion**: Payment status updated, enrollment created
4. **Invoice**: PDF invoice generated and emailed to student
5. **Confirmation**: Email notification sent to student

### 🧪 Testing

Use the provided mock payment interface for testing:

- [`docs/mock-payment-example.html`](docs/mock-payment-example.html)

### 📚 Integration Guide

For frontend integration details:

- [`docs/mock-payment-guide.md`](docs/mock-payment-guide.md)

### 🔧 Production Deployment

For production, the system is designed to easily integrate with real payment gateways like:

- SSL Commerce
- Stripe
- PayPal
- Other payment processors

The mock system uses the same API endpoints, making transition seamless.

## Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (v4.4 or higher)
- **Redis** (v6 or higher) - for job queues and caching
- **Cloudinary account** (for file storage)
- **SMTP email service** (Gmail, SendGrid, etc.)

### Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis
- **Authentication**: JWT, Passport.js
- **File Storage**: Cloudinary
- **Email**: Nodemailer
- **Job Queues**: BullMQ
- **Validation**: Zod
- **PDF Generation**: PDFKit
- **Security**: bcryptjs, CORS, Rate Limiting
- **Development**: ESLint, TypeScript, ts-node-dev

### Installation

1. **Clone the repository**:

```bash
git clone https://github.com/Nahid-Mahmud/Znanix-LMS-Backend.git
cd Zanix-LMS-Backend
```

2. **Install dependencies**:

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

3. **Set up environment variables**:

```bash
cp .env.example .env
# Edit .env with your configuration (see Environment Variables section)
```

4. **Start MongoDB and Redis**:

```bash
# MongoDB (if using local installation)
mongod

# Redis (if using local installation)
redis-server
```

5. **Start the development server**:

```bash
# Using pnpm
pnpm run dev

# Or using npm
npm run dev
```

The server will start on `http://localhost:5000` (or your configured PORT).

### Initial Setup

After starting the server, a super admin user will be automatically created with the credentials specified in your `.env` file (`SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD`).

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# Database
MONGO_URI=mongodb://localhost:27017/zanix-lms

# Authentication & Security
BCRYPT_SALT_ROUNDS=12
ACCESS_TOKEN_JWT_SECRET=your-access-token-secret
ACCESS_TOKEN_JWT_EXPIRATION=15m
REFRESH_TOKEN_JWT_SECRET=your-refresh-token-secret
REFRESH_TOKEN_JWT_EXPIRATION=7d
EXPRESS_SESSION_SECRET=your-session-secret
VERIFY_ACCOUNT_SECRET=your-verify-account-secret

# Super Admin (for initial setup)
SUPER_ADMIN_EMAIL=admin@zanixlms.com
SUPER_ADMIN_PASSWORD=your-super-admin-password

# Redis (for job queues and caching)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_USERNAME=
REDIS_PASSWORD=

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@zanixlms.com

# Cloudinary (for file storage)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# SSL Commerce (for production payment gateway - optional for mock system)
SSL_STORE_ID=your-store-id
SSL_STORE_PASSWORD=your-store-password
SSL_PAYMENT_API=https://sandbox.sslcommerz.com/gwprocess/v4/api.php
SSL_VALIDATION_API=https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php
SSL_SUCCESS_BACKEND_URL=http://localhost:5000/api/v1/payments/success
SSL_FAIL_BACKEND_URL=http://localhost:5000/api/v1/payments/fail
SSL_CANCEL_BACKEND_URL=http://localhost:5000/api/v1/payments/cancel
SSL_SUCCESS_FRONTEND_URL=http://localhost:3000/payment/success
SSL_FAIL_FRONTEND_URL=http://localhost:3000/payment/fail
SSL_CANCEL_FRONTEND_URL=http://localhost:3000/payment/cancel
SSL_IPN_URL=http://localhost:5000/api/v1/payments/validate-payment
```

## API Documentation

### Authentication

| Method | Endpoint                       | Description          | Access        |
| ------ | ------------------------------ | -------------------- | ------------- |
| POST   | `/api/v1/auth/login`           | User login           | Public        |
| POST   | `/api/v1/auth/refresh-token`   | Refresh access token | Public        |
| POST   | `/api/v1/auth/logout`          | User logout          | Authenticated |
| PATCH  | `/api/v1/auth/reset-password`  | Reset password       | Authenticated |
| PATCH  | `/api/v1/auth/change-password` | Change password      | Authenticated |
| POST   | `/api/v1/auth/forgot-password` | Forgot password      | Public        |
| GET    | `/api/v1/auth/verify-account`  | Verify account       | Public        |

### User Management

| Method | Endpoint                | Description         | Access            |
| ------ | ----------------------- | ------------------- | ----------------- |
| POST   | `/api/v1/user/register` | Register new user   | Public            |
| PATCH  | `/api/v1/user/:userId`  | Update user profile | Authenticated     |
| GET    | `/api/v1/user/get-all`  | Get all users       | Admin/Super Admin |
| GET    | `/api/v1/user/me`       | Get current user    | Authenticated     |
| GET    | `/api/v1/user/:userId`  | Get user by ID      | Admin/Super Admin |

### OTP Verification

| Method | Endpoint                  | Description     | Access |
| ------ | ------------------------- | --------------- | ------ |
| POST   | `/api/v1/otp/resend`      | Resend OTP      | Public |
| POST   | `/api/v1/otp/verify-user` | Verify user OTP | Public |

### Courses

| Method | Endpoint                           | Description          | Access                       |
| ------ | ---------------------------------- | -------------------- | ---------------------------- |
| POST   | `/api/v1/courses/create`           | Create new course    | Instructor/Admin/Super Admin |
| PUT    | `/api/v1/courses/:id`              | Update course        | Instructor/Admin/Super Admin |
| GET    | `/api/v1/courses/me`               | Get my courses       | Instructor/Admin/Super Admin |
| GET    | `/api/v1/courses/all`              | Get all courses      | Public                       |
| GET    | `/api/v1/courses/my-courses-stats` | Get my courses stats | Instructor                   |
| GET    | `/api/v1/courses/featured`         | Get featured courses | Public                       |
| GET    | `/api/v1/courses/:slug`            | Get course by slug   | Public                       |
| DELETE | `/api/v1/courses/:id`              | Delete course        | Admin/Super Admin/Instructor |

### Course Modules

| Method | Endpoint                                     | Description           | Access                                 |
| ------ | -------------------------------------------- | --------------------- | -------------------------------------- |
| POST   | `/api/v1/course-modules/create`              | Create course module  | Instructor/Admin/Super Admin           |
| GET    | `/api/v1/course-modules/`                    | Get all modules       | Admin/Super Admin/Moderator            |
| GET    | `/api/v1/course-modules/my-modules`          | Get my modules        | Instructor                             |
| GET    | `/api/v1/course-modules/by-course/:courseId` | Get modules by course | Instructor/Admin/Super Admin/Moderator |
| GET    | `/api/v1/course-modules/:id`                 | Get module by ID      | Admin/Super Admin/Moderator/Instructor |
| PUT    | `/api/v1/course-modules/:id`                 | Update module         | Instructor/Admin/Super Admin           |
| DELETE | `/api/v1/course-modules/:id`                 | Delete module         | Instructor/Admin/Super Admin           |

### Module Videos

| Method | Endpoint                                 | Description          | Access                       |
| ------ | ---------------------------------------- | -------------------- | ---------------------------- |
| POST   | `/api/v1/module-videos/`                 | Create module video  | Admin/Super Admin/Instructor |
| GET    | `/api/v1/module-videos/`                 | Get all videos       | Authenticated                |
| GET    | `/api/v1/module-videos/module/:moduleId` | Get videos by module | Authenticated                |
| GET    | `/api/v1/module-videos/:videoId`         | Get video by ID      | Authenticated                |
| PATCH  | `/api/v1/module-videos/:videoId`         | Update video         | Admin/Super Admin/Instructor |
| DELETE | `/api/v1/module-videos/:videoId`         | Delete video         | Admin/Super Admin/Instructor |

### Payments (Mock System)

| Method | Endpoint                                      | Description              | Access            |
| ------ | --------------------------------------------- | ------------------------ | ----------------- |
| POST   | `/api/v1/payments/init-payment/:courseId`     | Initialize payment       | Student           |
| POST   | `/api/v1/payments/success`                    | Payment success callback | Public            |
| POST   | `/api/v1/payments/fail`                       | Payment failure callback | Public            |
| POST   | `/api/v1/payments/cancel`                     | Payment cancel callback  | Public            |
| POST   | `/api/v1/payments/validate-payment`           | Validate payment         | Public            |
| GET    | `/api/v1/payments/history`                    | Get payment history      | Authenticated     |
| GET    | `/api/v1/payments/transaction/:transactionId` | Get transaction details  | Authenticated     |
| GET    | `/api/v1/payments/all`                        | Get all payments         | Admin/Super Admin |
| GET    | `/api/v1/payments/invoice/:paymentId`         | Download invoice         | Authenticated     |

### User Courses (Enrollments)

| Method | Endpoint                                                 | Description             | Access            |
| ------ | -------------------------------------------------------- | ----------------------- | ----------------- |
| POST   | `/api/v1/user-courses/purchase/:courseId`                | Purchase course         | Student           |
| GET    | `/api/v1/user-courses/full-course-learner/:courseId`     | Get full course content | Authenticated     |
| GET    | `/api/v1/user-courses/my-courses-stats`                  | Get my courses stats    | Student           |
| GET    | `/api/v1/user-courses/my-courses`                        | Get enrolled courses    | Authenticated     |
| GET    | `/api/v1/user-courses/enrollment/:enrollmentId`          | Get enrollment details  | Authenticated     |
| PATCH  | `/api/v1/user-courses/enrollment/:enrollmentId/progress` | Update progress         | Student           |
| GET    | `/api/v1/user-courses/all`                               | Get all enrollments     | Admin/Super Admin |
| POST   | `/api/v1/user-courses/`                                  | Create user course      | Student           |

### Statistics & Analytics

| Method | Endpoint                    | Description           | Access            |
| ------ | --------------------------- | --------------------- | ----------------- |
| GET    | `/api/v1/stats/dashboard`   | Dashboard statistics  | Admin/Super Admin |
| GET    | `/api/v1/stats/overview`    | Overall statistics    | Admin/Super Admin |
| GET    | `/api/v1/stats/users`       | User statistics       | Admin/Super Admin |
| GET    | `/api/v1/stats/courses`     | Course statistics     | Admin/Super Admin |
| GET    | `/api/v1/stats/enrollments` | Enrollment statistics | Admin/Super Admin |
| GET    | `/api/v1/stats/revenue`     | Revenue statistics    | Admin/Super Admin |
| GET    | `/api/v1/stats/instructors` | Instructor statistics | Admin/Super Admin |

## Data Models

The system uses MongoDB with Mongoose ODM. Here are the main entities:

### User

- **Roles**: Student, Instructor, Admin, Super Admin, Moderator
- **Fields**: name, email, password, role, profile image, verification status
- **Features**: Authentication, profile management, role-based access

### Course

- **Fields**: title, description, price, thumbnail, intro video, instructor, modules
- **Features**: CRUD operations, file uploads, publishing workflow

### Course Module

- **Fields**: title, description, course reference, order, videos
- **Features**: Organize course content, module management

### Module Video

- **Fields**: title, description, video file, module reference, duration
- **Features**: Video upload to Cloudinary, streaming support

### Payment

- **Fields**: transaction ID, amount, status, user, course, payment method
- **Features**: Mock payment processing, transaction tracking

### User Courses (Enrollments)

- **Fields**: user, course, enrollment date, progress, completion status
- **Features**: Enrollment management, progress tracking

## Architecture Overview

- **Modular Architecture**: Each feature is organized in separate modules
- **MVC Pattern**: Models, Views (routes), Controllers separation
- **Middleware Stack**: Authentication, validation, error handling, rate limiting
- **Job Queues**: Background processing for emails and heavy tasks
- **File Management**: Cloudinary integration for media storage
- **Security**: JWT authentication, input validation, CORS, rate limiting

## Development

### Running Tests

```bash
npm test
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (TypeScript compilation + template copying)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality
- `npm run lint:fix` - Auto-fix ESLint issues

### Building for Production

```bash
npm run build
npm run start
```

The build process:

1. Runs ESLint for code quality checks
2. Compiles TypeScript to JavaScript
3. Copies email templates to the dist directory

## Payment Integration Guide

For frontend developers, we provide comprehensive integration examples:

1. **Documentation**: [`docs/mock-payment-guide.md`](docs/mock-payment-guide.md)
2. **HTML Example**: [`docs/mock-payment-example.html`](docs/mock-payment-example.html)

The mock payment system includes:

- Payment initiation API
- Mock payment gateway simulation
- Payment completion handling
- Invoice generation and email delivery
- Payment history tracking

## Documentation

The `docs/` folder contains comprehensive documentation for various features:

- [`docs/mock-payment-guide.md`](docs/mock-payment-guide.md) - Complete payment integration guide
- [`docs/mock-payment-example.html`](docs/mock-payment-example.html) - Interactive testing interface
- [`docs/fileUploadGuide.md`](docs/fileUploadGuide.md) - File upload implementation details
- [`docs/email-queue-guide.md`](docs/email-queue-guide.md) - Email system and queue processing
- [`docs/invoice-generation-guide.md`](docs/invoice-generation-guide.md) - PDF invoice generation
- [`docs/rabbitmq-queue-guide.md`](docs/rabbitmq-queue-guide.md) - Queue system documentation
- [`docs/user-courses-api.md`](docs/user-courses-api.md) - Enrollment and progress tracking
- [`docs/module-videos-api.md`](docs/module-videos-api.md) - Video content management
- [`docs/stats-api-documentation.md`](docs/stats-api-documentation.md) - Analytics API documentation
- [`docs/implementation-summary.md`](docs/implementation-summary.md) - System implementation details
- [`docs/system-analysis-report.md`](docs/system-analysis-report.md) - Comprehensive system analysis

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint configuration for code quality
- Write comprehensive tests for new features
- Update documentation for API changes
- Use meaningful commit messages

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions and support:

- 📖 Check the documentation in the `docs/` folder
- 🐛 Review existing issues and create new ones if needed
- 💬 Check the discussion section for community support
- 📧 Contact the maintainers for direct assistance

---

**Note**: This project uses a mock payment system for development and testing. For production deployment, integrate with a real payment gateway like SSL Commerce, Stripe, or PayPal.
# news-data-developer-look
