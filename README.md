# SEHAT - GenAI Healthcare Platform 🏥

A comprehensive healthcare solution powered by Generative AI, designed to revolutionize medical service accessibility and pharmaceutical shopping experiences.

## 🌟 Overview

SEHAT is an innovative healthcare platform that combines AI-powered medical facility location services with intelligent pharmaceutical shopping assistance. The platform aims to bridge the gap between patients and healthcare services while making medicine procurement more accessible and informed.

## ✨ Features

### 🗺️ MediLocate AI
- **Intelligent Hospital Finder**: Locate nearby hospitals, clinics, and healthcare facilities based on your location
- **Specialty-Based Search**: Find medical facilities by specialization (cardiology, orthopedics, pediatrics, etc.)
- **Real-time Navigation**: Get directions to the nearest healthcare facility
- **Facility Information**: View detailed information about hospitals including services, ratings, and contact details
- **Emergency Services**: Quick access to emergency care facilities in your vicinity

### 💊 MediShop AI
- **AI-Powered Medicine Search**: Find medicines using natural language queries
- **Smart Recommendations**: Get alternative medicine suggestions and generic options
- **Price Comparison**: Compare medicine prices across different pharmacies
- **Prescription Management**: Upload and manage your prescriptions digitally
- **Drug Information**: Access comprehensive information about medications, dosages, and side effects
- **Availability Checker**: Real-time medicine availability at nearby pharmacies

### 🤖 GenAI Integration
- **Conversational AI Assistant**: Chat with an AI assistant for medical queries
- **Symptom Analysis**: Get preliminary insights based on symptoms (not a replacement for professional diagnosis)
- **Personalized Health Tips**: Receive tailored health and wellness advice
- **Medicine Information**: Ask questions about medicines, interactions, and usage

## 📁 Project Structure

```
SEHAT--Genai-hackathon/
├── components/                 # Reusable React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Navigation.tsx
│   └── ...
├── medilocate-ai/             # Hospital & facility locator module
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── utils/
│   │   └── pages/
│   ├── public/
│   └── package.json
├── medishop-ai/               # Medicine shopping & information module
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── utils/
│   │   └── pages/
│   ├── public/
│   └── package.json
├── App.tsx                    # Main application component
├── index.tsx                  # Application entry point
├── index.html                 # HTML template
├── constants.ts               # Application constants
├── types.ts                   # TypeScript type definitions
├── metadata.json              # Project metadata
├── package.json               # Root package dependencies
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite build configuration
└── README.md                  # This file
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS / CSS Modules
- **State Management**: React Context API / Redux (if applicable)
- **Routing**: React Router
- **API Integration**: Axios / Fetch API
- **Maps Integration**: Google Maps API / Mapbox
- **AI/ML**: Integration with GenAI models (Gemini, GPT, Claude, etc.)
- **Type Safety**: TypeScript 5+

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher) or yarn (v1.22.0 or higher)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ANISHTWAGLE/SEHAT--Genai-hackathon.git
   cd SEHAT--Genai-hackathon
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install MediLocate AI dependencies**
   ```bash
   cd medilocate-ai
   npm install
   cd ..
   ```

4. **Install MediShop AI dependencies**
   ```bash
   cd medishop-ai
   npm install
   cd ..
   ```

### Environment Configuration

Create `.env` files in the root directory and in each sub-project with the following variables:

**Root `.env`:**
```env
VITE_API_BASE_URL=your_api_base_url
VITE_GENAI_API_KEY=your_genai_api_key
```

**medilocate-ai/.env:**
```env
VITE_MAPS_API_KEY=your_google_maps_api_key
VITE_LOCATION_API_URL=your_location_service_url
VITE_MEDILOCATE_API_KEY=your_medilocate_api_key
```

**medishop-ai/.env:**
```env
VITE_PHARMACY_API_KEY=your_pharmacy_api_key
VITE_MEDICINE_DB_API=your_medicine_database_api
VITE_MEDISHOP_API_KEY=your_medishop_api_key
```

### Running the Application

#### Development Mode

**Run the main application:**
```bash
npm run dev
```

**Run MediLocate AI module separately:**
```bash
cd medilocate-ai
npm run dev
```

**Run MediShop AI module separately:**
```bash
cd medishop-ai
npm run dev
```

The application will be available at:
- Main App: `http://localhost:5173`
- MediLocate AI: `http://localhost:5174` (if run separately)
- MediShop AI: `http://localhost:5175` (if run separately)

#### Production Build

**Build all modules:**
```bash
npm run build
```

**Build individual modules:**
```bash
# MediLocate AI
cd medilocate-ai
npm run build

# MediShop AI
cd medishop-ai
npm run build
```

**Preview production build:**
```bash
npm run preview
```

## 📱 Usage Guide

### Finding Medical Facilities
1. Navigate to the **MediLocate AI** section
2. Allow location access or enter your location manually
3. Use filters to search by specialty, distance, or rating
4. Click on a facility to view details and get directions

### Shopping for Medicines
1. Navigate to the **MediShop AI** section
2. Search for medicines by name or upload a prescription
3. View available options, prices, and alternatives
4. Add items to cart and proceed to checkout
5. Choose delivery or pickup options

### Using AI Assistant
1. Click on the chat icon in the bottom right corner
2. Type your health-related query
3. Get instant AI-powered responses
4. Ask follow-up questions for more details


