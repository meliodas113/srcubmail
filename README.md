# Srcubmail 🚀

A professional Chrome extension for extracting and managing email addresses from web pages. Built with TypeScript, modern web technologies, and best practices for maintainable code.

## ✨ Features

- **Smart Email Extraction**: Advanced regex patterns to find emails across various formats
- **Duplicate Removal**: Automatically filters out duplicate email addresses
- **Clipboard Integration**: One-click copying of all emails or individual emails
- **Modern UI/UX**: Clean, responsive design with smooth animations and state feedback
- **Permission Management**: Intelligent permission handling with user-friendly prompts
- **Error Handling**: Comprehensive error handling with user feedback
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Cross-Platform**: Works on all major operating systems

## 🏗️ Architecture

The extension follows a modular, component-based architecture:

```
src/
├── components/          # UI components
│   ├── EmailList.ts    # Email list management
│   └── ScrapeButton.ts # Scrape button functionality
├── services/           # Business logic services
│   └── chromeService.ts # Chrome API interactions
├── utils/              # Utility functions
│   ├── emailUtils.ts   # Email processing utilities
│   └── clipboardUtils.ts # Clipboard operations
├── types.ts            # TypeScript type definitions
└── popup.ts            # Main application entry point
```

### Key Design Principles

- **Separation of Concerns**: Clear separation between UI, business logic, and utilities
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Error Boundaries**: Comprehensive error handling at every layer
- **Performance**: Efficient DOM manipulation and memory management
- **Maintainability**: Clean, documented code following industry standards

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager
- Chrome browser (for testing)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/srcubmail.git
   cd srcubmail
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build the extension**

   ```bash
   npm run build
   ```

4. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist/` folder

### Development

```bash
# Start development mode with watch
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Formatting
npm run format

# Clean build directory
npm run clean
```

## 📖 Usage

### Basic Email Scraping

1. **Navigate** to any webpage containing email addresses
2. **Click** the Srcubmail extension icon in your browser toolbar
3. **Click** the "Scrape Emails" button
4. **View** the extracted emails in the popup
5. **Copy** all emails or individual emails to your clipboard

### Advanced Features

- **Individual Email Copy**: Click the copy icon next to any email
- **Bulk Copy**: Use the "Copy All" button to copy all emails at once
- **Smart Filtering**: Automatically removes duplicates and validates email formats
- **Real-time Feedback**: Visual feedback for all operations

## 🛠️ Development

### Project Structure

```
srcubmail/
├── src/                    # TypeScript source code
├── dist/                   # Built extension (generated)
├── fonts/                  # Custom fonts
├── icons/                  # Extension icons
├── manifest.json           # Chrome extension manifest
├── popup.html             # Extension popup HTML
├── styles.css             # Styling
├── rules.json             # Network request rules
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── .eslintrc.js           # ESLint configuration
├── .prettierrc            # Prettier configuration
└── README.md              # This file
```

### Code Quality

- **ESLint**: Strict linting rules for code quality
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict type checking enabled
- **JSDoc**: Comprehensive documentation

### Testing

```bash
# Run type checking
npm run type-check

# Lint code
npm run lint

# Format code
npm run format
```

## 🔧 Configuration

### TypeScript Configuration

The project uses strict TypeScript settings:

- `strict: true` - Enables all strict type checking options
- `noImplicitAny: true` - Requires explicit type annotations
- `noUnusedLocals: true` - Catches unused variables
- `exactOptionalPropertyTypes: true` - Strict optional property handling

### ESLint Rules

- TypeScript-specific rules enabled
- Strict error handling
- Consistent code style enforcement
- Chrome extension API awareness

## 📦 Building

### Production Build

```bash
npm run build
```

This command:

1. Compiles TypeScript to JavaScript
2. Generates source maps and type declarations
3. Copies all assets to the `dist/` directory
4. Creates a production-ready extension

### Development Build

```bash
npm run dev
```

This command:

1. Watches for file changes
2. Automatically recompiles TypeScript
3. Enables hot reloading for development

## 🚀 Deployment

### Chrome Web Store

1. **Build** the extension: `npm run build`
2. **Zip** the `dist/` folder
3. **Upload** to the Chrome Web Store Developer Dashboard
4. **Submit** for review

### Manual Installation

1. **Build** the extension: `npm run build`
2. **Load** the `dist/` folder in Chrome's developer mode
3. **Pin** the extension to your toolbar for easy access

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Guidelines

- Follow the existing code style
- Add comprehensive JSDoc comments
- Include error handling for all new features
- Write self-documenting code
- Test thoroughly before submitting

## 🔮 Roadmap

- [ ] **Email Validation**: Enhanced email format validation
- [ ] **Export Options**: CSV, JSON export formats
- [ ] **Filtering**: Advanced email filtering by domain
- [ ] **History**: Save scraping history across sessions
- [ ] **Analytics**: Usage statistics and insights
- [ ] **Mobile Support**: Responsive design for mobile devices
- [ ] **Dark Mode**: User preference-based theming
- [ ] **Keyboard Shortcuts**: Power user keyboard navigation

---

**Made with ❤️ for productivity and efficiency**

_Built with TypeScript, modern web standards, and best practices_
