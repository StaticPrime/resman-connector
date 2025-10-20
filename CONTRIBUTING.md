# Contributing to ResMan Connector

Thank you for your interest in contributing to ResMan Connector! This document provides guidelines for contributing to the project.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/StaticPrime/resman-connector.git
   cd resman-connector
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Building the Project

```bash
npm run build
```

### Running in Watch Mode

```bash
npm run watch
```

### Code Quality

Before submitting your changes, make sure your code passes linting and formatting:

```bash
# Run linter
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Code Style Guidelines

- Follow the existing code style
- Use TypeScript for all new code
- Add JSDoc comments for public APIs
- Keep functions small and focused
- Use meaningful variable and function names

### Commit Messages

Follow these conventions for commit messages:

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests after the first line

Examples:

- `Add support for property search endpoint`
- `Fix error handling in WorkOrder Endpoints`
- `Update documentation for account management`

## Adding New Features

### Adding New Endpoints

1. Create or update the appropriate endpoint module in `src/modules/`
2. Update `src/ResManClient.ts` to expose the new endpoint module
3. Export new types/classes in `src/index.ts`
4. Add documentation in `README.md`
5. Update `examples/basic-usage.ts` with usage examples

### Adding New Models

1. Add the model interface to `src/models/index.ts`
2. Export it from `src/index.ts`
3. Document it in the README

## Testing

When we add tests in the future:

```bash
npm test
```

Make sure all tests pass before submitting a pull request.

## Pull Request Process

1. **Update documentation** - Ensure the README and other docs reflect your changes
2. **Update CHANGELOG** - Add your changes to the Unreleased section
3. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Your descriptive commit message"
   ```
4. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Create a Pull Request** on GitHub
6. **Wait for review** - Maintainers will review your PR and may request changes

### Pull Request Guidelines

- Provide a clear description of the problem and solution
- Include any relevant issue numbers
- Ensure your code follows the project's style guidelines
- Make sure all checks pass (linting, formatting, build)
- Keep PRs focused - one feature or fix per PR

## Reporting Bugs

When reporting bugs, please include:

- A clear and descriptive title
- Detailed steps to reproduce the issue
- Expected behavior vs. actual behavior
- Code samples if applicable
- Environment details (Node version, OS, etc.)

## Suggesting Enhancements

We welcome feature suggestions! Please:

- Use a clear and descriptive title
- Provide a detailed description of the suggested enhancement
- Explain why this enhancement would be useful
- Include code examples if applicable

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all.

### Our Standards

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## Questions?

Feel free to open an issue for any questions about contributing!

## License

By contributing to ResMan Connector, you agree that your contributions will be licensed under the MIT License.
