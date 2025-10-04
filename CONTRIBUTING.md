# Contributing to Invoice Generator by Noqdom

Thank you for your interest in contributing to Invoice Generator! We welcome contributions from the community.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/invoice-generator.git`
3. Add upstream remote: `git remote add upstream https://github.com/noqdom/invoice-generator.git`

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## How to Contribute

### Workflow

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our [coding standards](#coding-standards)

3. Test your changes thoroughly

4. Commit your changes with a clear commit message:
   ```bash
   git commit -m "feat: add new feature description"
   ```

5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Open a Pull Request

### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, missing semicolons, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Ensure strict type checking passes
- Avoid using `any` type unless absolutely necessary

### React & Next.js

- Use functional components with hooks
- Follow React best practices
- Use Next.js App Router conventions
- Implement proper error boundaries

### Styling

- Use Tailwind CSS v4 for styling
- Follow existing component patterns
- Maintain responsive design principles
- Support both light and dark themes

### Code Quality

- Keep functions small and focused
- Write self-documenting code with clear naming
- Add comments for complex logic
- Ensure no console errors or warnings

## Pull Request Process

1. **Update Documentation**: If you're adding a feature, update the README.md
2. **Test Thoroughly**: Ensure all existing functionality still works
3. **Build Successfully**: Verify `npm run build` completes without errors
4. **Follow Template**: Use the pull request template provided
5. **Link Issues**: Reference any related issues in your PR description
6. **Request Review**: Wait for maintainer review and address feedback

### PR Checklist

- [ ] Code follows the project's coding standards
- [ ] Tests pass locally
- [ ] Build completes successfully
- [ ] Documentation is updated (if needed)
- [ ] Commit messages follow convention
- [ ] No console errors or warnings
- [ ] Responsive design is maintained
- [ ] Dark mode compatibility is preserved

## Reporting Bugs

Before creating a bug report:

1. Check the [issue tracker](https://github.com/noqdom/invoice-generator/issues) for existing reports
2. Ensure you're using the latest version
3. Verify the bug is reproducible

### Bug Report Template

Use our [bug report template](.github/ISSUE_TEMPLATE/bug_report.md) and include:

- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (browser, OS, etc.)

## Suggesting Features

We welcome feature suggestions! Please:

1. Check [existing feature requests](https://github.com/noqdom/invoice-generator/labels/enhancement)
2. Use our [feature request template](.github/ISSUE_TEMPLATE/feature_request.md)
3. Provide clear use cases and benefits
4. Be open to discussion and feedback

## Development Guidelines

### Project Structure

```
/app              # Next.js app directory
/components       # React components
  /ui            # shadcn/ui components
  /invoice       # Invoice-specific components
/lib             # Utility functions and helpers
  /pdf           # PDF generation logic
/types           # TypeScript type definitions
/public          # Static assets
/docs            # Documentation
```

### Adding New Features

1. **Plan First**: Discuss major changes in an issue first
2. **Small PRs**: Keep pull requests focused and reasonably sized
3. **Test Coverage**: Add tests for new functionality
4. **Accessibility**: Ensure features are accessible
5. **Performance**: Consider performance implications

## Questions?

If you have questions:

- Check existing [discussions](https://github.com/noqdom/invoice-generator/discussions)
- Open a new discussion
- Review the [documentation](README.md)

## Recognition

Contributors will be recognized in our README and release notes. Thank you for making Invoice Generator better!
