# Budget Accounting Frontend

A modern React-based frontend application for managing invoices, payments, and user profiles in a budget accounting system.

## Features

- **User Authentication**: Secure login, logout, and session management
- **Invoice Management**: View, track, and manage customer invoices
- **Payment Processing**: Process payments with multiple payment methods (cash, bank)
- **User Profile**: View and edit user profile information
- **Responsive Design**: Mobile-friendly UI using Tailwind CSS
- **Toast Notifications**: Real-time success and error notifications
- **Protected Routes**: Secure routes with authentication checks

## Project Structure

```
src/
├── components/
│   ├── Breadcrumbs.jsx          # Breadcrumb navigation component
│   ├── Navbar.jsx               # Navigation bar component
│   └── ProtectedRoute.jsx        # Route protection wrapper
├── context/
│   └── AuthContext.jsx           # Authentication context and provider
├── pages/
│   ├── Dashboard.jsx             # Main dashboard page
│   ├── Login.jsx                 # Login page
│   ├── Profile.jsx               # User profile page with edit functionality
│   ├── Invoices.jsx              # Invoices list page
│   ├── InvoiceDetail.jsx         # Invoice detail and actions page
│   ├── InvoicePayment.jsx        # Payment processing page
│   ├── PaymentSuccess.jsx        # Payment success confirmation page
│   └── ForgotPassword.jsx        # Password reset page
├── utils/
│   └── api.js                    # API configuration and interceptors
├── App.jsx                       # Main app component with routing
├── main.jsx                      # Application entry point
├── App.css                       # App styles
└── index.css                     # Global styles
```

## Installation

### Prerequisites

- Node.js 16 or higher
- npm or yarn package manager

### Setup Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd "Budget accounting system/budeget accounting frontend"
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

## Development

### Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Run linting

```bash
npm run lint
```

## Technologies Used

### Core Framework

- **React 18**: Modern UI library with hooks
- **Vite**: Lightning-fast build tool and dev server

### Routing & State

- **React Router**: Client-side routing
- **Context API**: State management for authentication

### Form & Validation

- **React Hook Form**: Efficient form state management
- **Yup**: Schema validation for forms

### API & HTTP

- **Axios**: Promise-based HTTP client with interceptors

### UI & Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **React Toastify**: Toast notification library

### Development Tools

- **ESLint**: Code quality and consistency
- **PostCSS**: CSS processing with Tailwind

## Key Features

### Authentication System

- Login with name, loginId, email, and password
- Password validation with security requirements
- Session persistence using localStorage
- Token-based API authentication
- Automatic logout on token expiration

### Invoice Management

- Display list of customer invoices
- Show invoice status (Paid, Partial, Not Paid)
- Detailed invoice view with:
  - Line items with product details and pricing
  - Customer information
  - Invoice dates and references
  - Payment history
- Print invoice functionality
- Payment processing for outstanding invoices

### User Profile Management

- View complete profile information
- Edit mode with form validation
- Update name and email
- Real-time success/error toast notifications
- Automatic context and localStorage updates

### Payment System

- Multiple payment methods (Cash, Bank)
- Payment tracking and status updates
- Success confirmation page
- Invoice status updates post-payment

### API Integration

- Configurable base URL via environment variables
- Request interceptors for authentication token injection
- Response interceptors for error handling
- 401 status handling with automatic redirect to login
- Comprehensive error logging

## Usage Guide

### Logging In

1. Navigate to the login page
2. Enter credentials:
   - Name: Your full name
   - Login ID: Your unique login identifier
   - Email: Your email address
   - Password: Must contain uppercase, lowercase, and numbers (min 8 chars)
3. Click "Login"

### Accessing Dashboard

After successful login, you'll be directed to the dashboard showing:

- Account overview
- Recent invoices
- Payment summary

### Managing Invoices

1. Click "Invoices" in the navbar
2. View all invoices with status indicators:
   - Green: Paid
   - Yellow: Partial payment
   - Red: Not paid
3. Click on any invoice to see detailed information
4. Available actions:
   - **Print**: Print invoice for records
   - **Pay**: Make payment for outstanding invoices
   - **Cancel**: Disabled button for future use

### Updating Profile

1. Click your name in the top-right navbar
2. Navigate to "My Profile"
3. Click "Edit Profile" button
4. Modify your name and email
5. Click "Save Changes"
6. Success notification will appear on completion

## API Endpoints Used

- `POST /auth/login` - User authentication
- `PUT /users/profile` - Update user profile
- `GET /invoices` - Fetch user invoices
- `GET /invoices/:id` - Get invoice details
- `POST /payments` - Process payment

## Error Handling

The application includes comprehensive error handling:

- Form validation errors displayed inline
- API errors shown via toast notifications
- Network error messages with helpful context
- Automatic session recovery
- Graceful fallbacks for missing data

## Configuration Files

### tailwind.config.js

Customize theme colors, spacing, and responsive breakpoints

### eslint.config.js

Configure code quality rules and linting standards

### vite.config.js

Adjust build settings, dev server configuration, and plugins

## Troubleshooting

### API Connection Issues

- Verify backend API is running on configured URL
- Check `VITE_API_BASE_URL` in `.env` file
- Open browser DevTools → Network tab to inspect API calls
- Ensure CORS is properly configured on backend

### Authentication Problems

- Clear browser localStorage and login again
- Check browser console (F12) for detailed errors
- Verify token is properly stored in localStorage
- Ensure authToken hasn't expired

### Build Failures

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Development Server Issues

- Ensure port 5173 is not in use
- Restart the dev server: `npm run dev`
- Clear Vite cache if needed

## Best Practices

- Always use environment variables for sensitive configuration
- Keep sensitive data out of version control
- Use protected routes for authenticated pages
- Implement proper error boundaries for production
- Test authentication flow thoroughly
- Validate all user inputs on client and server

## Contributing

1. Create a feature branch: `git checkout -b feature/feature-name`
2. Commit changes: `git commit -m "Add feature description"`
3. Push to branch: `git push origin feature/feature-name`
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support & Contact

For issues, bug reports, or feature requests, please create an issue in the repository.

For questions and discussions, feel free to reach out to the development team.
