#  FitnessAI - Personalized Fitness & Nutrition Planner

![FitnessAI](https://img.shields.io/badge/FitnessAI-Personalized%20Wellness-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.0.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-purple)

A revolutionary AI-powered fitness and nutrition planning application that generates personalized 7-day workout routines and diet plans based on individual user profiles, goals, and preferences.

## ✨ Features

### 🏋️‍♂️ Smart Fitness Planning
- **AI-Generated Workouts**: Personalized exercise routines based on fitness level and goals
- **7-Day Comprehensive Plans**: Full week scheduling with progressive overload
- **Exercise Demonstrations**: AI-generated images for proper form guidance
- **Text-to-Speech**: Audio guidance for workouts and nutrition plans

### 🥗 Intelligent Nutrition
- **Custom Diet Plans**: Tailored meal recommendations based on dietary preferences
- **Calorie & Macro Tracking**: Automatic calculation of total calories and protein
- **Dietary Accommodations**: Support for various dietary preferences and restrictions

### 🎯 Personalization
- **Multi-factor Assessment**: Age, weight, height, fitness level, goals, and more
- **Medical Considerations**: Account for medical history and stress levels
- **Location-based Workouts**: Home vs gym equipment recommendations

### 💾 Data Management
- **Plan Saving**: Store multiple fitness plans locally
- **Progress Tracking**: Monitor your fitness journey over time
- **Export Capabilities**: Share plans with trainers or friends

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icons

### AI & Integration
- **OpenAI GPT-4** - Intelligent plan generation
- **Text-to-Speech** - Audio guidance system
- **AI Image Generation** - Exercise demonstration images

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun
- OpenAI API key

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/fitnessai.git
   cd fitnessai
2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
3. **Environment Setup**
   Create a .env.local file in the root directory:
   ```bash
   .env
   OPENAI_API_KEY=your_openai_api_key_here
 
4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev

5. **Open your browser
Navigate to http://localhost:3000***
   ```bash
   # Build the application
   npm run build

   # Start production server
   npm start

   # Or build and start with PM2
   npm run build
   pm2 start npm --name "fitnessai" -- start

6. **📁 Project Structure**
   ```bash
   fitnessai/
   ├── app/                    
   │   ├── api/              
   │   ├── globals.css       
   │   ├── layout.tsx       
   │   └── page.tsx          
   ├── components/          
   │   ├── ui/              
   │   └── forms/           
   ├── types/                
   │   └── fitness.ts        
   ├── public/              
   └── lib/                   


<h2>🤝 Contributing</h2>
We welcome contributions! Please see our Contributing Guide for details.

Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

<div align="center">
Built with ❤️ for the fitness community

https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white

</div> ```