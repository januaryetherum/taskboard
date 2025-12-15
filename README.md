# TaskBoard RaaS Marketplace

A decentralized Robot-as-a-Service protocol built on Solana. TaskBoard connects businesses with autonomous robots through trustless smart contracts.

## Features

- **Robot Cost Calculator** - Estimate total cost of ownership with real market data
- **SVG Icon System** - Unified icon design throughout the site
- **Light/Dark Theme** - Full theme support with smooth transitions
- **Cursor Animation** - Subtle cursor follow effect
- **Video Backgrounds** - Dynamic video backgrounds on hero sections
- **Responsive Design** - Works on all devices

## Pages

- **Home** - Hero with video background, features, contract copy
- **How It Works** - 6-step process flow, architecture overview
- **Playground** - Robot price calculator with real market data
- **Robots** - Robot categories with specifications
- **Docs** - Protocol documentation with sidebar navigation
- **About** - Mission, 4x4 tech stack grid, roadmap

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- React 18+
- Vite
- Framer Motion
- React Router DOM
- react-spring

## Project Structure

```
taskboard/
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── Icons.jsx           # SVG icon system
│   │   ├── CursorFollower.jsx  # Cursor animation
│   │   ├── ContractCopy.jsx    # Token contract copy
│   │   └── ...
│   ├── context/        # React context (theme)
│   ├── hooks/          # Custom hooks
│   ├── pages/          # Route pages
│   ├── App.jsx         # Root component
│   └── main.jsx        # Entry point
├── dist/               # Production build
├── package.json
└── vite.config.js
```

## Robot Pricing Data

The calculator uses real market data from 2024-2025:
- Industrial Drones: $15,000 - $75,000
- Delivery Robots: $25,000 - $60,000
- Industrial AMRs: $40,000 - $150,000
- Humanoid Robots: $150,000 - $500,000

Sources: Standard Bots, Qviro, industry reports



Built with React, Vite, Framer Motion
TaskBoard RaaS Marketplace © 2025
