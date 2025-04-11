## 📝 Project Brief: Speed Dice

### 📌 Overview
Speed Dice is a mobile companion app designed to enhance and accelerate the classic Monopoly board game. By introducing a customizable 3-dice roller and optional bonus rules, Speed Dice modernizes gameplay, making it faster, more exciting, and easier to manage during game night.

The app is intended to be used alongside the physical Monopoly board, not as a digital version of the game.

### 🎯 Objectives
- Speed up physical Monopoly gameplay using a digital dice roller with optional 3-dice support.
- Provide fun, house-rule-based twists triggered by specific roll patterns (doubles, triples, sequences).
- Offer a clean, mobile-friendly UI that’s easy to use mid-game.
- Allow full customization of gameplay options and house rules.

### 👥 Target Users
- Casual Monopoly players
- Families and friends during game night
- People who want to spice up their board game experience

### 🧩 Core Features
#### 1. Dice Roller
- Toggle between 2-dice and 3-dice mode.
- Display individual dice values and total.
- Detect and react to:
  - Doubles → extra roll
  - Triples → collect money from each player
  - Sequences → trigger bonus

#### 2. House Rule Toggles
- Enable or disable:
  - Double Trouble (roll again on doubles)
  - Triple Threat (get paid on triples)
  - Sequence Bonus (trigger mystery event)
- Toggle Speed Mode (auto-selects 3 dice and bonus rules)

#### 3. Player Management
- Set number of players.
- Display current player and allow cycling with "Next Player" button.

#### 4. UI & Experience
- Large roll button with animated dice and satisfying feedback (sound/vibration)
- Visual feedback for special events (e.g., “🔥 Triple Threat!” popup)
- Responsive and easy to use on mobile
- Simple Settings screen for house rules and player setup

### ⚙️ Tech Stack
- Frontend: React
- Mobile App Layer: Capacitor
- State Management: Jotai
- Styling: Tailwind CSS
- Animations: Framer Motion
- Project Build Tool: Vite (for fast development and bundling)
- Backend: None (MVP is fully offline)

### 📱 Target Platforms
- Android (Google Play Store)
  - Build with Capacitor
  - Generate signed APK/AAB
  - Include store-ready assets (icon, splash, screenshots, description)
