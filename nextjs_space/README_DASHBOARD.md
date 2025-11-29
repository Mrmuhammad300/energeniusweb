# EnerGenius Customer Dashboard

This is a Firebase-powered customer dashboard for monitoring solar generator performance, calculating savings, and managing services.

## Features

### 🎯 Core Features
- **Real-time Generator Monitoring**: Track system health, battery charge, daily usage, and runtime
- **Savings Calculator**: Estimate potential monthly savings based on local electricity rates
- **User Access Management**: Secure authentication and data sharing capabilities
- **Document Management**: Placeholder for RAG (Retrieval-Augmented Generation) system
- **Billing Integration Placeholders**: Stripe, Plaid, DocuSign integrations

### 📊 Dashboard Tabs
1. **Dashboard**: Live generator status overview with key metrics
2. **Savings Tool**: Energy savings estimator with customizable inputs
3. **Share Access**: User authentication and access sharing
4. **Documents & RAG**: Document upload and retrieval system (placeholder)
5. **Billing & Integrations**: Payment gateway and service integrations (placeholder)

## Setup Instructions

### 1. Firebase Configuration

The dashboard requires Firebase for authentication and real-time data sync.

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project" or select existing project
3. Follow the setup wizard

#### Enable Authentication
1. In Firebase Console, go to **Build > Authentication**
2. Click "Get started"
3. Enable **Anonymous** sign-in method
4. Click "Save"

#### Enable Firestore Database
1. In Firebase Console, go to **Build > Firestore Database**
2. Click "Create database"
3. Choose "Start in test mode" (or production mode with custom rules)
4. Select your preferred location
5. Click "Enable"

#### Get Firebase Config
1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click the Web icon (</>) to add a web app
4. Register your app with a nickname (e.g., "EnerGenius Dashboard")
5. Copy the `firebaseConfig` object values

### 2. Environment Variables

Create or update `.env` file in the project root with your Firebase config:

```bash
# Database
DATABASE_URL="your-database-url"

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="your-measurement-id"
```

### 3. Firestore Security Rules

Set up security rules in Firebase Console (Firestore Database > Rules):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own data
    match /artifacts/energenius-app-default/users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 4. Install Dependencies

```bash
cd nextjs_space
yarn install
```

### 5. Run Development Server

```bash
yarn dev
```

Visit `http://localhost:3000/dashboard` to access the dashboard.

## Architecture

### Data Structure

Firestore document path:
```
artifacts/
  └─ energenius-app-default/
      └─ users/
          └─ {userId}/
              └─ appData/
                  └─ generatorMetrics/
                      ├─ generator: {
                      │   health: number,
                      │   currentCharge: number,
                      │   dailyUsageKWH: number,
                      │   temperature: number,
                      │   runtimeHours: number
                      │ }
                      └─ savings: {
                          currentRate: number,
                          dailySolarProduction: number,
                          potentialCreditPerMonth: number
                        }
```

### Authentication Flow

1. User visits `/dashboard`
2. Firebase initializes on client-side
3. Anonymous authentication is triggered automatically
4. User ID is generated and stored
5. Firestore document is created with default data
6. Real-time listener subscribes to user's document
7. UI updates automatically when data changes

### Components

- **LoadingState**: Displays while Firebase initializes
- **MetricsCard**: Reusable card for displaying generator metrics
- **SavingsCalculator**: Interactive tool for calculating potential savings
- **IntegrationCard**: Placeholder cards for future integrations
- **DashboardPage**: Main application component

## Features in Development

### 🔜 Upcoming Features
- [ ] **IoT Integration**: Connect to actual solar generators via API/MQTT
- [ ] **RAG Document System**: Upload and query manuals, warranties
- [ ] **Payment Integration**: Stripe for subscriptions and payments
- [ ] **Financial Linking**: Plaid for account verification
- [ ] **E-Signature**: DocuSign for contracts
- [ ] **Multi-user Access**: Share dashboard with family/employees
- [ ] **Historical Data**: Charts and trends over time
- [ ] **Alerts & Notifications**: Email/SMS alerts for critical events
- [ ] **Mobile App**: React Native companion app

## Troubleshooting

### Firebase Not Configured Warning
If you see the warning "Firebase is not configured", ensure:
1. All environment variables are set in `.env`
2. Variables start with `NEXT_PUBLIC_` prefix
3. Values are correct (no quotes in actual values)
4. Development server was restarted after adding variables

### Authentication Errors
- Verify Anonymous sign-in is enabled in Firebase Console
- Check browser console for detailed error messages
- Ensure Firebase config values are correct

### Data Not Syncing
- Check Firestore security rules
- Verify user is authenticated (check User ID in sidebar)
- Open browser DevTools > Network tab to see Firestore requests

## Brand Integration

The dashboard uses EnerGenius brand colors:
- **Primary Green**: `#006C4A`
- **Accent Gold**: `#F5B932`
- **Wordmark Green**: `#2B7F26`
- **Accent Teal**: `#1CA6A3`

All components follow the brand guidelines established in `/public/branding.json`.

## Security Considerations

1. **Environment Variables**: Never commit `.env` file to version control
2. **Firestore Rules**: Always use authentication-based rules in production
3. **API Keys**: Firebase API keys are safe to expose (protected by domain restrictions)
4. **User Data**: All data is scoped to authenticated user IDs

## Support

For questions or issues:
- Email: support@renewableresourcegroup.net
- Visit: [EnerGenius Website](https://energenius.com)
- Documentation: This README

---

**EnerGenius - Power That Thinks Ahead**  
*by Renewable Resource Group LLC*
