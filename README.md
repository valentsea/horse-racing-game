# 🐎 Horse Racing Game

A modern, interactive horse racing simulation built with Vue 3, TypeScript, and Pinia.

## 🚀 Features

- **Dynamic Horse Generation**: Create horses with unique names, colors, and condition scores
- **Race Scheduling**: Automatic generation of multi-round races with different distances
- **Real-time Simulation**: Watch races unfold with smooth animations and realistic physics
- **Performance Statistics**: Comprehensive analytics and horse performance tracking
- **Responsive Design**: Beautiful UI that works on all devices
- **Type Safety**: Full TypeScript support with strict type checking

## 🏗️ Architecture

### Core Components

- **Game Store** (`src/stores/gameStore.ts`): Central state management using Pinia
- **Horse Generator** (`src/utils/horseGenerator.ts`): Horse creation and race simulation logic
- **Horse Lookup Service** (`src/utils/horseLookup.ts`): Optimized O(1) horse data retrieval
- **Error Handling** (`src/utils/errors.ts`): Custom error classes and validation utilities
- **Performance Utils** (`src/utils/performance.ts`): Optimization utilities for Vue components

### Key Features

#### 🎯 State Management

- Reactive state with Pinia composition API
- Computed properties for derived state
- Action-based state mutations with error handling

#### 🏃‍♂️ Race Simulation

- Realistic physics-based race outcomes
- Configurable race distances and horse counts
- Smooth animations with requestAnimationFrame

#### 📊 Performance Optimizations

- Memoized computed properties
- Efficient horse lookup with Map data structures
- Throttled animations and debounced user interactions
- Virtual scrolling for large lists

#### 🛡️ Error Handling

- Custom error classes with context
- Input validation with detailed error messages
- Graceful error recovery and user feedback

## 🛠️ Development

### Prerequisites

- Node.js 20.19.0+ or 22.12.0+
- npm or yarn package manager

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test:unit

# Lint code
npm run lint

# Format code
npm run format
```

### Project Structure

```
src/
├── components/          # Vue components
│   ├── ui/             # Reusable UI components
│   ├── GameControls.vue
│   ├── GameStatistics.vue
│   ├── HorseRacingGame.vue
│   └── ...
├── stores/             # Pinia stores
│   └── gameStore.ts
├── utils/              # Utility functions
│   ├── errors.ts       # Error handling
│   ├── horseGenerator.ts
│   ├── horseLookup.ts
│   └── performance.ts
├── types/              # TypeScript type definitions
│   └── horse.ts
├── config/             # Configuration files
│   └── gameConfig.ts
└── tests/              # Test files
    ├── gameStore.test.ts
    └── horseGenerator.test.ts
```

## 🎮 Game Flow

1. **Generate Horses**: Create 20 horses with unique properties
2. **Schedule Races**: Generate 6 races with different distances (1200m - 2200m)
3. **Run Races**: Execute races individually or all at once
4. **View Results**: Analyze race outcomes and horse performance
5. **Statistics**: Review comprehensive performance metrics

## 🔧 Configuration

### Game Constants

```typescript
// src/config/gameConfig.ts
export const GAME_CONFIG = {
  minHorsesForRace: 10,
  maxHorsesPerRace: 10,
  defaultHorsesGenerated: 20,
  raceDistances: [1200, 1400, 1600, 1800, 2000, 2200],
  minRaceDuration: 2000,
  raceDelay: 5000,
}
```

### Race Simulation

The race simulation uses realistic physics:

- **Base Time**: `(distance / 1000) * (120 - condition)`
- **Random Factor**: 0.8 to 1.2 for unpredictability
- **Position Assignment**: Based on final race times
- **Speed Calculation**: Distance divided by time

## 🧪 Testing

The project includes comprehensive tests:

```bash
# Run all tests
npm run test:unit

# Run tests in watch mode
npm run test:unit -- --watch

# Generate coverage report
npm run test:unit -- --coverage
```

### Test Coverage

- **Game Store**: State management and actions
- **Horse Generator**: Horse creation and race simulation
- **Utilities**: Error handling and validation

## 📈 Performance

### Optimizations Implemented

1. **Memoized Computed Properties**: Prevent unnecessary recalculations
2. **Efficient Data Structures**: Map-based lookups for O(1) performance
3. **Throttled Animations**: Smooth 60fps animations
4. **Lazy Loading**: Components load only when needed
5. **Virtual Scrolling**: Handle large datasets efficiently

### Performance Metrics

- **Initial Load**: < 2s
- **Race Simulation**: 60fps animations
- **Memory Usage**: Optimized with proper cleanup
- **Bundle Size**: Tree-shaken and minified

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: CSS transitions and Vue transitions
- **Accessibility**: ARIA labels and keyboard navigation
- **Dark Mode Ready**: CSS custom properties for theming
- **Loading States**: Visual feedback for async operations

## 🔒 Error Handling

### Custom Error Classes

```typescript
// Game-specific errors with context
throw new RaceError('Race not found', raceId)
throw new HorseError('Invalid horse condition', horseId)
throw new ValidationError('Invalid input', 'horseCount')
```

### Validation

- Input sanitization and validation
- Type-safe parameter checking
- Graceful error recovery
- User-friendly error messages

## 🚀 Deployment

### Production Build

```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

### Environment Variables

```env
VITE_APP_TITLE=Horse Racing Game
VITE_APP_VERSION=1.0.0
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Style

- Use TypeScript strict mode
- Follow Vue 3 Composition API patterns
- Write comprehensive JSDoc comments
- Maintain test coverage above 80%

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Pinia for excellent state management
- Tailwind CSS for utility-first styling
- TypeScript for type safety

---

**Built with ❤️ using Vue 3, TypeScript, and modern web technologies**
