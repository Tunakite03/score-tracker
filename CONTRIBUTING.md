# Contributing to Score Tracker

Thank you for considering contributing to Score Tracker! We welcome contributions from everyone.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- pnpm (recommended) or npm/yarn
- Git
- A code editor (VS Code recommended)

### Development Setup

1. **Fork the repository**
   
   Click the "Fork" button at the top right of the repository page.

2. **Clone your fork**

   ```bash
   git clone https://github.com/yourusername/score-tracker.git
   cd score-tracker
   ```

3. **Add upstream remote**

   ```bash
   git remote add upstream https://github.com/original-owner/score-tracker.git
   ```

4. **Install dependencies**

   ```bash
   pnpm install
   ```

5. **Start development server**

   ```bash
   pnpm dev
   ```

   The app will be available at `http://localhost:5173`

## How to Contribute

### 1. Find or Create an Issue

- Check existing [issues](https://github.com/yourusername/score-tracker/issues)
- Comment on an issue to let others know you're working on it
- For new features or bugs, create a new issue first to discuss

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions or updates
- `chore/` - Build process or tooling changes

### 3. Make Your Changes

- Write clean, maintainable code
- Follow existing code patterns
- Add comments for complex logic
- Update documentation if needed

### 4. Test Your Changes

```bash
# Run linter
pnpm lint

# Build the project
pnpm build

# Test locally
pnpm dev
```

Test on multiple browsers:
- Chrome
- Firefox
- Safari (if available)
- Edge

### 5. Commit Your Changes

Follow our [commit guidelines](#commit-guidelines) and make meaningful commits:

```bash
git add .
git commit -m "feat: add player statistics dashboard"
```

### 6. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 7. Create a Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Fill out the PR template completely
4. Link related issues
5. Wait for review

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type unless absolutely necessary
- Use meaningful variable and function names

### React Components

- Use functional components with hooks
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use proper prop types

Example:
```typescript
interface ScoreboardProps {
  sessionId: number;
  onPlayerClick?: (playerId: number) => void;
}

export function Scoreboard({ sessionId, onPlayerClick }: ScoreboardProps) {
  // Component logic
}
```

### File Organization

- One component per file
- Group related files in folders
- Use index files for cleaner imports
- Keep service logic separate from UI

### Styling

- Use Tailwind CSS utility classes
- Follow existing styling patterns
- Use shadcn/ui components when possible
- Ensure responsive design

### Database Operations

- Use Dexie.js for IndexedDB operations
- Keep database logic in service files
- Use transactions for multi-step operations
- Handle errors appropriately

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only changes
- `style:` - Code style changes (formatting, missing semi colons, etc)
- `refactor:` - Code change that neither fixes a bug nor adds a feature
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Changes to build process or auxiliary tools
- `ci:` - CI/CD changes

### Examples

```bash
feat(scoreboard): add player statistics view
fix(rounds): prevent duplicate round submission
docs(readme): update installation instructions
refactor(services): simplify player service logic
```

## Pull Request Process

### Before Submitting

- [ ] Code follows the project's style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated if needed
- [ ] No console errors or warnings
- [ ] Linting passes (`pnpm lint`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Tested on multiple browsers
- [ ] PR template filled out completely

### Review Process

1. **Automated Checks**: CI/CD pipeline runs automatically
2. **Code Review**: Maintainers review your code
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, your PR will be merged
5. **Cleanup**: Delete your branch after merge

### Review Response Time

We aim to review PRs within 2-3 business days. If you haven't heard back after a week, feel free to ping the PR.

## Reporting Bugs

Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.yml) to report bugs.

Include:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Browser and OS information
- Console errors if any

## Suggesting Features

Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.yml) to suggest features.

Include:
- Problem statement
- Proposed solution
- Alternative approaches considered
- Use cases and benefits
- Mockups or examples if available

## Questions?

- Check existing [issues](https://github.com/yourusername/score-tracker/issues)
- Read the [README](README.md)
- Review the [documentation](docs/)
- Ask in discussions

## Recognition

Contributors will be recognized in:
- README contributors section (coming soon)
- Release notes for significant contributions
- GitHub contributors page

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Score Tracker! 🎉
