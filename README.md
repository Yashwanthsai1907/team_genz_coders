# 🎯 StudyPathAI

An AI-powered personalized learning roadmap generator that creates customized study plans using Google's Gemini AI. Track your progress, manage milestones, and achieve your learning goals with intelligent recommendations.

## ✨ Features

- 🤖 **AI-Powered Roadmaps**: Generate personalized learning paths using Google Gemini AI
- 📊 **Progress Tracking**: Monitor your learning journey with visual progress indicators
- 🎯 **Milestone Management**: Break down your goals into achievable milestones
- 📚 **Resource Recommendations**: Get curated learning resources (videos, articles, courses)
- 📈 **Statistics Dashboard**: Track your learning streak, completed projects, and study hours
- 🔐 **User Authentication**: Secure login and personalized experience
- 📱 **Responsive Design**: Beautiful UI built with React and Tailwind CSS
- 📄 **PDF Export**: Export your roadmaps as PDF documents

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Wouter** for routing
- **TanStack Query** for data fetching
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Framer Motion** for animations
- **Recharts** for data visualization

### Backend
- **Node.js** with Express
- **TypeScript**
- **Better-SQLite3** for database
- **Drizzle ORM** for database operations
- **Passport.js** for authentication
- **Google Generative AI** (Gemini API)

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Google Gemini API Key** ([Get it here](https://makersuite.google.com/app/apikey))

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Yashwanthsai1907/team_genz_coders.git
cd team_genz_coders
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Google Gemini API Key (Required)
GEMINI_API_KEY=your_gemini_api_key_here

# Session Secret (Required for production)
SESSION_SECRET=your_random_secret_key_here

# Database (Optional - defaults to ./data/app.db)
DATABASE_URL=./data/app.db

# Node Environment
NODE_ENV=development
```

**To get your Gemini API Key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key"
4. Copy your API key and paste it in the `.env` file

### 4. Initialize the Database

```bash
npm run db:push
```

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - Type check with TypeScript
- `npm run db:push` - Push database schema changes

## 🏗️ Project Structure

```
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and API clients
│   │   └── hooks/         # Custom React hooks
│   └── index.html
├── server/                # Backend application
│   ├── index.ts          # Express server setup
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Database operations
│   └── vite.ts           # Vite middleware
├── shared/               # Shared types and schemas
│   └── schema.ts
└── package.json
```

## 🎮 Usage

1. **Sign Up/Login**: Create an account or log in
2. **Create Roadmap**: 
   - Enter your learning topic and goal
   - Specify your skill level (Beginner, Intermediate, Advanced)
   - Set time commitment and duration
   - Choose your learning style preferences
3. **Track Progress**: 
   - Mark milestones as complete
   - View your learning statistics
   - Monitor your study streak
4. **Export**: Download your roadmap as a PDF

## 🔒 Authentication

The application uses Passport.js with local strategy for authentication. Passwords are hashed using bcrypt for security.

## 🗄️ Database

The project uses Better-SQLite3 with Drizzle ORM for type-safe database operations. The database file is stored in `./data/app.db` by default.

## 🌐 Deployment

### Build for Production

```bash
npm run build
```

This will:
- Build the frontend with Vite
- Bundle the backend with esbuild
- Output everything to the `dist/` directory

### Start Production Server

```bash
npm start
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

Developed by **Team GenZ Coders**

## 🙏 Acknowledgments

- Google Gemini AI for powering the roadmap generation
- Radix UI for accessible component primitives
- Tailwind CSS for the styling system
- All open-source contributors

## 📧 Support

For support or questions, please open an issue on GitHub or contact [yashwanthsai969@gmail.com](mailto:yashwanthsai969@gmail.com)

---

Made with ❤️ by Team GenZ Coders
