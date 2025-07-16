# ICP Chat Application

A decentralized chat application built on the Internet Computer Protocol (ICP) with OTP-based authentication and real-time messaging capabilities.

## 🚀 Features

### Authentication
- **OTP-based Registration**: Secure email-based registration with OTP verification
- **User Management**: Login/logout functionality with persistent sessions
- **Development Mode**: OTP displayed in console and alert for easy testing

### Chat Features
- **Direct Messaging**: One-on-one conversations between users
- **Group Chat**: Create and manage group conversations
- **Real-time Updates**: Live message updates and user status
- **Message Management**: Mark messages as read, delete messages
- **User Presence**: Online/offline status tracking

### Technical Features
- **Decentralized Backend**: Built on Internet Computer canisters
- **React Frontend**: Modern React.js with hooks and context
- **Motoko Smart Contracts**: Secure and efficient backend logic
- **Responsive Design**: Mobile-friendly interface with inline styles

## 🛠️ Technology Stack

### Backend
- **Motoko**: Smart contract language for Internet Computer
- **Internet Computer**: Decentralized computing platform
- **DFX**: Development framework for IC applications

### Frontend
- **React.js**: JavaScript library for building user interfaces
- **React Router**: Client-side routing
- **Context API**: State management for authentication
- **Inline Styles**: Self-contained styling without external dependencies

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v16 or higher)
- **DFX** (Internet Computer SDK)
- **Git** for version control

### Install DFX
```bash
sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"
```

### Verify Installation
```bash
dfx --version
node --version
npm --version
```

## 📁 Project Structure

```
icp-chat-app/
├── src/
│   ├── backend/
│   │   └── main.mo              # Main backend entry point
│   └── frontend/
│       ├── public/
│       │   └── index.html       # HTML template
│       ├── src/
│       │   ├── App.jsx          # Main React component with routing
│       │   ├── components/
│       │   │   ├── Auth/
│       │   │   │   ├── Login.jsx           # Login component
│       │   │   │   ├── Register.jsx        # Registration component
│       │   │   │   └── OTPVerification.jsx # OTP verification component
│       │   │   └── Chat/
│       │   │       └── ChatContainer.jsx   # Chat interface component
│       │   ├── services/
│       │   │   └── api.js       # API service layer
│       │   ├── hooks/
│       │   │   └── useAuth.js   # Authentication hook
│       │   ├── utils/
│       │   │   └── helpers.js   # Utility functions
│       │   ├── styles/
│       │   │   └── globals.css  # Global styles
│       │   └── index.js         # Entry point for React app
│       ├── package.json         # NPM configuration
│       └── .env                 # Environment variables
├── dfx.json                     # DFX configuration
├── canister_ids.json            # Deployed canister IDs
└── README.md                    # This file
```

## 🚀 Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd icp-chat-app
```

### 2. Install Frontend Dependencies
```bash
cd src/frontend
npm install
cd ../..
```

### 3. Start Local IC Network
```bash
# Start DFX in the background
dfx start --background

# Or start with clean state
dfx start --clean --background
```

### 4. Deploy Backend Canister
```bash
dfx deploy backend
```

### 5. Set Environment Variables
```bash
# Create environment file for frontend
echo "REACT_APP_CANISTER_ID=$(dfx canister id backend)" > src/frontend/.env

# Verify the environment variable
cat src/frontend/.env
```

### 6. Build and Deploy Frontend
```bash
# Build React application
cd src/frontend
npm run build
cd ../..

# Deploy frontend canister
dfx deploy frontend
```

### 7. Access the Application
```bash
# Get frontend URL
echo "Frontend URL: http://$(dfx canister id frontend).localhost:4943"

# Or check all deployed canisters
dfx canister status --all
```

## 📱 Usage

### Registration Process
1. **Navigate to Register**: Open the application and click "Sign Up"
2. **Enter Details**: Provide email address and full name
3. **Generate OTP**: Click "Continue" to generate OTP
4. **Check Console**: OTP will be displayed in browser console and alert popup
5. **Verify OTP**: Enter the 6-digit OTP to complete registration
6. **Auto Login**: Successfully registered users are automatically logged in

### Login Process
1. **Enter Email**: Provide registered email address on login page
2. **Sign In**: Click "Sign In" button
3. **Auto Redirect**: Successful login redirects to chat interface

### Chat Features
1. **View Users**: See all registered users in the chat interface
2. **Direct Messages**: Start conversations with other users
3. **Group Creation**: Create group chats with multiple users
4. **Real-time Updates**: Messages appear in real-time
5. **Message Management**: Read receipts and message deletion

## 🔧 Development Commands

```bash
# Start development environment
dfx start --clean

# Deploy with logs
dfx deploy --verbose

# Check canister status
dfx canister status --all

# View canister logs
dfx canister logs backend

# Test backend functions
dfx canister call backend health
dfx canister call backend getAllUsers

# Frontend development
cd src/frontend
npm start              # Development server
npm run build          # Production build
npm test               # Run tests
```

## 🔍 API Reference

### Backend Methods

#### Authentication
- `generateOTP(email: Email)` - Generate OTP for email verification
- `registerUser(email: Email, name: Text, otp: OTPCode)` - Register new user
- `loginUser(email: Email)` - Login existing user
- `logoutUser(userId: UserId)` - Logout user

#### User Management
- `getUser(userId: UserId)` - Get user by ID
- `getAllUsers()` - Get all registered users
- `getOnlineUsers()` - Get currently online users
- `updateUserProfile(userId: UserId, name: ?Text, avatar: ?Text)` - Update user profile

#### Messaging
- `sendDirectMessage(senderId: UserId, receiverId: UserId, content: Text, messageType: MessageType)` - Send direct message
- `sendGroupMessage(senderId: UserId, groupId: GroupId, content: Text, messageType: MessageType)` - Send group message
- `getDirectMessages(userId1: UserId, userId2: UserId)` - Get direct messages between users
- `getGroupMessages(groupId: GroupId)` - Get group messages
- `markMessageAsRead(messageId: MessageId, userId: UserId)` - Mark message as read
- `deleteMessage(messageId: MessageId, userId: UserId)` - Delete message

#### Group Management
- `createGroup(name: Text, description: ?Text, createdBy: UserId, members: [UserId])` - Create new group
- `addMemberToGroup(groupId: GroupId, newMemberId: UserId, addedBy: UserId)` - Add member to group
- `getUserGroups(userId: UserId)` - Get user's groups
- `getGroup(groupId: GroupId)` - Get group details

#### Utility
- `health()` - Health check endpoint
- `cleanupExpiredOTPs()` - Clean up expired OTP codes

## 🐛 Troubleshooting

### Common Issues

#### 1. Certificate Verification Error
```bash
# Error: Response verification failed
# Solution: This is normal in local development
# The app handles this automatically
```

#### 2. Canister Not Found (404)
```bash
# Check if canisters are deployed
dfx canister status --all

# Redeploy if needed
dfx deploy
```

#### 3. Build Failures
```bash
# Clean and rebuild
dfx stop
rm -rf .dfx
dfx start --clean
dfx deploy
```

#### 4. OTP Not Showing
- **Check browser console** for OTP output
- **Look for alert popup** with OTP
- **Verify backend logs**: `dfx canister logs backend`

#### 5. Environment Variables
```bash
# Verify environment variables
cat src/frontend/.env

# Should show:
# REACT_APP_CANISTER_ID=your-canister-id
```

### Complete Reset
```bash
# Complete reset
dfx stop
rm -rf .dfx
rm -rf src/frontend/build
rm -rf src/frontend/node_modules

# Fresh start
dfx start --clean
cd src/frontend && npm install && npm run build && cd ../..
dfx deploy
```

## 🔒 Security Features

### Authentication Security
- **OTP Verification**: Email-based OTP for secure registration
- **Session Management**: Secure user session handling with localStorage
- **Input Validation**: Client and server-side validation for all inputs

### Data Protection
- **Decentralized Storage**: Data stored on Internet Computer
- **No Central Database**: Eliminates single point of failure
- **Immutable Smart Contracts**: Secure and auditable backend logic

## 🎨 Design Features

### Responsive Design
- **Mobile-friendly**: Works on all screen sizes
- **Inline Styles**: Self-contained styling without external dependencies
- **Modern UI**: Clean and intuitive user interface
- **Loading States**: Proper loading indicators and error handling

### Authentication Flow
- **Gradient Backgrounds**: Modern purple gradient design
- **Form Validation**: Real-time input validation
- **Error Handling**: Clear error messages and success notifications
- **Development Mode**: OTP visible in console for easy testing

## 🚀 Deployment

### Local Development
```bash
dfx start --clean
dfx deploy
```

### IC Mainnet (Production)
```bash
dfx deploy --network ic
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Development Guidelines
- Follow Motoko best practices for backend
- Use React hooks and functional components
- Maintain responsive design with inline styles
- Add proper error handling
- Write clear commit messages

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Internet Computer Foundation** for the ICP platform
- **DFINITY Team** for DFX and development tools
- **React Team** for the React.js framework
- **Motoko Community** for language support and examples

## 📞 Support

For support and questions:
- **GitHub Issues**: Open an issue for bug reports or feature requests
- **Documentation**: [Internet Computer Docs](https://internetcomputer.org/docs)
- **Community**: [IC Developer Forum](https://forum.dfinity.org/)

---

**Built with ❤️ on the Internet Computer**

> **Note**: This application is in development mode. OTP codes are displayed in browser console and alert popups for easy testing. In production, OTP would be sent via email service.