# MoodMirror

> A minimalist lifestyle app that detects user mood and recommends outfit, music, workout, food, and affirmation.

## Features

- **3D Smart Mirror**: Interactive 3D scene with reactive lighting and outfit carousel using Three.js.
- **Mood Detection**: Analyze mood via text input or simulated face scan.
- **Personalized Recommendations**: Get tailored suggestions for:
  - Outfit (visualized in 3D)
  - Spotify Playlist (embedded)
  - Workout & Food
  - Affirmation & Productivity Style
- **Minimalist Design**: Single-color tone aesthetic with "Zen" vibes.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Wouter, TailwindCSS
- **3D**: Three.js, @react-three/fiber, @react-three/drei
- **Backend**: Node.js, Express, Drizzle ORM (PostgreSQL)
- **State**: TanStack Query

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Ensure you have a database provisioned. The app uses `DATABASE_URL`.
   Optional: `SPOTIFY_CLIENT_ID` (mocked in prototype).

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Run Tests**:
   ```bash
   npx vitest
   ```

## Judge 60s Flow (Demo)

1. **Load App**: You see the "MoodMirror" 3D scene.
2. **Interact**: Rotate the mirror or click the "Tell me how you feel" pill.
3. **Input**:
   - Choose **"Self Report"** -> Type "I feel energized and ready to go!" -> Submit.
   - OR Choose **"Face Scan"** -> Allow camera (simulated) -> Wait for scan.
4. **Result**:
   - The mirror lighting changes color (e.g., Orange/Yellow for Energized).
   - The "Recommendations" card slides up.
   - Click "Outfit" to see the 3D carousel spin to the recommended style.
   - Click "Play" on the Spotify embed.
5. **Close**: Dismiss the card to return to the Zen mirror state.

## Shortcuts

- `Ctrl+Shift+D`: Toggle debug mode (if implemented).
