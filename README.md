# Score Tracker

[![CI/CD](https://img.shields.io/github/actions/workflow/status/yourusername/score-tracker/ci.yml?branch=main&label=CI%2FCD&logo=github)](https://github.com/yourusername/score-tracker/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite)](https://vite.dev/)

A production-quality React web application for tracking game scores across multiple rounds. Built with React, TypeScript, and IndexedDB for offline-first functionality.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage Guide](#usage-guide)
- [Data Model](#data-model)
- [Project Structure](#project-structure)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Features

- ✅ **Offline-First**: All data stored locally in IndexedDB
- ✅ **Session Management**: Create and delete game sessions
- ✅ **Default Setup**: 4 players automatically created for each new session
- ✅ **Multi-Player Support**: Add or delete unlimited players per session
- ✅ **Round-based Scoring**: Enter score deltas for each round
- ✅ **Live Scoreboard**: Real-time score updates with automatic ranking
- ✅ **Complete History**: View all past rounds with detailed breakdowns
- ✅ **Undo Functionality**: Reverse the last round if needed
- ✅ **Keyboard Navigation**: Enter key moves between inputs
- ✅ **Responsive Design**: Clean, modern UI that works on all devices

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI component library
- **Dexie.js** - IndexedDB wrapper for data persistence
- **dexie-react-hooks** - React hooks for live queries
- **React Router** - Client-side routing

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

The app will be available at `http://localhost:5173`

## Usage Guide

### Creating a Session

1. On the home page, enter a session name (e.g., "Game Night - Jan 2026")
2. Click "Create" to start a new session
3. You'll be redirected to the session dashboard
4. **4 default players** (Player 1-4) are automatically created

### Deleting a Session

1. On the home page, click the trash icon next to any session
2. Confirm the deletion dialog
3. The session and all related data (players, rounds, scores) will be permanently deleted
4. This action cannot be undone!

### Managing Players

**Adding Players:**

1. In the "Manage Players" section, enter a player name
2. Click "Add" to add them to the session
3. Players are automatically activated and their scores initialized to 0

**Deleting Players:**

1. Click the trash icon next to any player in the player list
2. The player and all their score data will be permanently deleted
3. Be careful - this action cannot be undone!

### Recording Rounds

1. In the "New Round" section, you'll see all active players
2. Enter the score delta (+/-) for each player
   - Use positive numbers for points gained
   - Use negative numbers for points lost
   - Default is 0 if left empty
3. Press **Enter** to move to the next player's input
4. Press **Enter** on the last input or click "Save Round" to record
5. The scoreboard updates automatically

### Viewing Scores

The **Scoreboard** displays:

- Current ranking (sorted by total score, descending)
- Player names
- Total scores

Rankings update in real-time as you add rounds.

### History

The **History** panel shows:

- All rounds in reverse chronological order
- Round number and timestamp
- Click any round to view detailed breakdown
- See each player's delta for that round

### Undo Last Round

Click **"Undo Last"** to reverse the most recent round:

- Deletes the round from history
- Reverses all score changes
- Cannot be undone (atomic transaction)

## Data Model

The app uses IndexedDB with the following schema:

### Tables

**sessions**

- `id` - Auto-increment primary key
- `name` - Session name
- `createdAt` - Creation timestamp

**players**

- `id` - Auto-increment primary key
- `sessionId` - Foreign key to sessions
- `name` - Player name
- `active` - Boolean (for future inactive player support)
- `createdAt` - Creation timestamp

**rounds**

- `id` - Auto-increment primary key
- `sessionId` - Foreign key to sessions
- `roundNo` - Sequential round number
- `note` - Optional note (future feature)
- `createdAt` - Creation timestamp

**entries**

- `id` - Composite key: `{roundId}_{playerId}`
- `sessionId` - Foreign key to sessions
- `roundId` - Foreign key to rounds
- `playerId` - Foreign key to players
- `delta` - Score change (positive or negative integer)

**totals**

- `id` - Composite key: `{sessionId}_{playerId}`
- `sessionId` - Foreign key to sessions
- `playerId` - Foreign key to players
- `total` - Current total score
- `updatedAt` - Last update timestamp

## Business Logic

### Creating a Round (Atomic Transaction)

1. Validates that deltas exist for all active players
2. Increments round number
3. Creates new round record
4. Inserts entries for each player
5. Updates totals by adding deltas
6. Commits all changes atomically

### Undoing a Round (Atomic Transaction)

1. Finds the latest round for the session
2. Retrieves all entries for that round
3. Reverses each delta from player totals
4. Deletes all entries
5. Deletes the round record
6. Commits all changes atomically

## Project Structure

```
src/
├── db/
│   ├── schema.ts                 # Dexie database schema
│   └── services/
│       ├── sessionService.ts     # Session CRUD operations
│       ├── playerService.ts      # Player management
│       ├── roundService.ts       # Round creation
│       ├── undoService.ts        # Undo functionality
│       └── totalService.ts       # Score totals queries
├── components/
│   ├── layout/
│   │   └── Layout.tsx            # Page layout wrapper
│   ├── session/
│   │   ├── AddPlayer.tsx         # Legacy add player form
│   │   └── PlayerManagement.tsx  # Manage players (add/delete)
│   ├── scoreboard/
│   │   └── Scoreboard.tsx        # Live scoreboard table
│   ├── round/
│   │   └── NewRoundForm.tsx      # Round entry form
│   ├── history/
│   │   └── HistoryList.tsx       # Round history + detail modal
│   └── ui/                       # shadcn components
├── pages/
│   ├── SessionListPage.tsx       # Home page with session list
│   └── SessionDashboardPage.tsx  # Main session interface
├── lib/
│   └── utils.ts                  # Utility functions
├── App.tsx                       # Root component with routing
└── main.tsx                      # Entry point
```

## Key Features Implementation

### Live Queries

Uses `dexie-react-hooks` for automatic re-rendering:

```typescript
const totals = useLiveQuery(() => db.totals.where('sessionId').equals(sessionId).toArray(), [sessionId]);
```

### Keyboard Navigation

Enter key automatically moves focus to next input:

```typescript
const handleKeyDown = (e: KeyboardEvent, index: number) => {
   if (e.key === 'Enter') {
      e.preventDefault();
      if (index < players.length - 1) {
         // Focus next input
      } else {
         // Save round
      }
   }
};
```

### Toast Notifications

Uses `sonner` for user feedback:

```typescript
toast.success('Round saved successfully');
toast.error('Failed to save round');
```

## Performance

- **Optimistic UI**: Database operations are fast (IndexedDB is local)
- **Live Updates**: Only affected components re-render
- **Efficient Queries**: Indexed lookups for all queries
- **Atomic Transactions**: Ensures data consistency

## Browser Compatibility

Supports all modern browsers with IndexedDB:

- Chrome 24+
- Firefox 16+
- Safari 10+
- Edge 79+

## Development

### Code Quality

This project uses:

- **ESLint** - For code linting and consistency
- **TypeScript** - For type safety
- **Husky** - For pre-commit hooks
- **Pre-commit checks** - Automatic linting before commits

### Available Scripts

```bash
# Development
pnpm dev          # Start dev server with hot reload
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
```

### Pre-commit Hooks

Pre-commit hooks automatically run ESLint before each commit to ensure code quality. The hooks are set up using Husky and will prevent commits if linting errors are found.

To bypass pre-commit hooks (not recommended):

```bash
git commit --no-verify
```

## Contributing

Contributions are welcome! Please follow these guidelines:

### Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/score-tracker.git
   cd score-tracker
   ```
3. **Install dependencies**
   ```bash
   pnpm install
   ```
4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Development Workflow

1. Make your changes
2. Ensure code passes linting: `pnpm lint`
3. Test your changes locally: `pnpm dev`
4. Build to verify: `pnpm build`
5. Commit with descriptive messages
6. Push to your fork
7. Open a Pull Request

### Code Style

- Follow existing code patterns
- Use TypeScript for type safety
- Keep components focused and reusable
- Write meaningful commit messages
- Add comments for complex logic

### Commit Convention

We follow conventional commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Test additions or changes
- `chore:` - Build process or auxiliary tool changes

Example: `feat: add player statistics dashboard`

## Future Enhancements

Potential features to add:

- Export/import session data (JSON/CSV)
- Player activation/deactivation
- Round notes
- Statistics and charts
- Dark mode toggle
- Multi-device sync (backend required)
- Session templates
- PWA support with offline caching

## License

MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2026 Score Tracker Contributors

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Dexie.js](https://dexie.org/) - IndexedDB wrapper
- [Vite](https://vite.dev/) - Fast build tool
- [React](https://react.dev/) - UI library

---

Built with ❤️ using React + TypeScript
