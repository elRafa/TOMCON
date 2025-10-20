# Contributing

## 🤝 How to Contribute

Thank you for your interest in contributing to the TOM Convention 2025 website! This document provides guidelines for contributing to the project.

### Ways to Contribute

- **Bug Reports**: Report issues and bugs
- **Feature Requests**: Suggest new features or improvements
- **Code Contributions**: Submit code changes and improvements
- **Documentation**: Improve or add documentation
- **Testing**: Help test the website and report issues
- **Design**: Contribute to UI/UX improvements

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18+ (recommended: 20.x LTS)
- **npm**: Version 9+ (comes with Node.js)
- **Git**: For version control
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Development Setup

```bash
# 1. Fork the repository
# Go to https://github.com/elRafa/TOMCON and click "Fork"

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/TOMCON.git
cd tomcon-round2

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev

# 5. Open browser to http://localhost:8000
```

### Development Workflow

```bash
# 1. Create a new branch
git checkout -b feature/your-feature-name

# 2. Make your changes
# Edit files as needed

# 3. Test your changes
npm run build
npm run verify

# 4. Commit your changes
git add .
git commit -m "Add: Brief description of changes"

# 5. Push to your fork
git push origin feature/your-feature-name

# 6. Create a Pull Request
# Go to GitHub and create a PR from your branch
```

## 📝 Code Style Guidelines

### JavaScript

```javascript
// Use modern ES6+ features
const guestData = {
    name: "Guest Name",
    projects: "Band Name, Other Projects",
    visibility: 1
};

// Use descriptive variable names
const currentFlippedCard = null;
const isKeyboardNavigationEnabled = false;

// Use consistent indentation (2 spaces)
function renderGuestCard(guest) {
    const cardElement = document.createElement('div');
    cardElement.className = 'guest-card';
    return cardElement;
}

// Use JSDoc comments for functions
/**
 * Renders the back face of a guest card with question form
 * @param {string} guestName - The name of the guest
 * @param {boolean} useFullName - Whether to use full name or first name
 * @returns {string} HTML string for the card back
 */
function renderCardBack(guestName, useFullName = false) {
    // Implementation
}
```

### CSS

```css
/* Use consistent naming conventions */
.guest-card {
    /* Use CSS custom properties for colors */
    background-color: var(--color-background);
    color: var(--color-text);
    
    /* Use consistent spacing */
    padding: 1rem;
    margin-bottom: 1rem;
    
    /* Use consistent transitions */
    transition: transform 0.3s ease-in-out;
}

/* Use BEM methodology for complex components */
.card-container__flipper {
    /* Component element */
}

.card-container--flipped {
    /* Component modifier */
}

/* Use mobile-first responsive design */
@media (min-width: 640px) {
    .guest-card {
        width: calc(50% - 0.5rem);
    }
}
```

### HTML

```html
<!-- Use semantic HTML elements -->
<main id="main-content" role="main">
    <section aria-labelledby="event-details">
        <h2 id="event-details">Event Details</h2>
        <article>
            <h3>Event Information</h3>
            <p>Event description...</p>
        </article>
    </section>
</main>

<!-- Use proper accessibility attributes -->
<button 
    type="button" 
    aria-label="Close card"
    class="close-btn">
    &times;
</button>

<!-- Use proper form labels -->
<label for="question-input">Your Question</label>
<textarea 
    id="question-input"
    name="question"
    maxlength="140"
    required
    aria-describedby="question-help">
</textarea>
<div id="question-help">Maximum 140 characters</div>
```

## 🧪 Testing Guidelines

### Before Submitting

```bash
# 1. Run build verification
npm run build
npm run verify

# 2. Test in multiple browsers
# - Chrome 90+
# - Firefox 88+
# - Safari 14+
# - Edge 90+

# 3. Test on multiple devices
# - Desktop (1920x1080)
# - Tablet (768x1024)
# - Mobile (375x667)

# 4. Test accessibility
# - Keyboard navigation
# - Screen reader compatibility
# - Color contrast
# - Focus indicators

# 5. Test performance
# - Page load time < 3 seconds
# - Smooth animations
# - No console errors
```

### Testing Checklist

```bash
# Functional Testing
- [ ] All guest cards display correctly
- [ ] Card flip animations work smoothly
- [ ] Question submission system functions
- [ ] Rate limiting works correctly
- [ ] Form validation operates properly
- [ ] Local storage saves/loads data
- [ ] Question deletion works
- [ ] Success feedback displays

# Performance Testing
- [ ] Page load time < 3 seconds
- [ ] Images load progressively
- [ ] Lazy loading works correctly
- [ ] No layout shifts during loading
- [ ] Smooth animations at 60fps

# Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible
- [ ] Skip links work

# Cross-Browser Testing
- [ ] Chrome 90+ (desktop/mobile)
- [ ] Firefox 88+ (desktop/mobile)
- [ ] Safari 14+ (desktop/mobile)
- [ ] Edge 90+ (desktop)
```

## 📋 Pull Request Guidelines

### Before Creating a PR

1. **Fork the repository** and create a feature branch
2. **Make your changes** following the code style guidelines
3. **Test thoroughly** using the testing checklist
4. **Update documentation** if needed
5. **Commit with clear messages** following conventional commits

### PR Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Accessibility improvement

## Testing
- [ ] I have tested these changes locally
- [ ] I have tested in multiple browsers
- [ ] I have tested on multiple devices
- [ ] I have tested accessibility features
- [ ] I have verified performance impact

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

### Commit Message Format

Use conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:
```
feat(cards): add keyboard navigation to guest cards
fix(forms): resolve question submission validation error
docs(readme): update installation instructions
perf(images): optimize WebP compression settings
```

## 🐛 Bug Reports

### Before Reporting

1. **Search existing issues** to avoid duplicates
2. **Test in multiple browsers** to confirm the issue
3. **Check the troubleshooting guide** for common solutions
4. **Gather relevant information** (browser, OS, steps to reproduce)

### Bug Report Template

```markdown
## Bug Description
A clear and concise description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
A clear and concise description of what you expected to happen.

## Actual Behavior
A clear and concise description of what actually happened.

## Screenshots
If applicable, add screenshots to help explain your problem.

## Environment
- OS: [e.g. Windows 10, macOS 12, Ubuntu 20.04]
- Browser: [e.g. Chrome 95, Firefox 94, Safari 15]
- Device: [e.g. Desktop, Mobile, Tablet]
- Screen Resolution: [e.g. 1920x1080, 375x667]

## Additional Context
Add any other context about the problem here.

## Console Errors
If applicable, include any console error messages.
```

## 💡 Feature Requests

### Before Requesting

1. **Search existing issues** to avoid duplicates
2. **Consider the project scope** and goals
3. **Think about implementation complexity**
4. **Consider user impact** and value

### Feature Request Template

```markdown
## Feature Description
A clear and concise description of the feature you'd like to see.

## Problem Statement
What problem does this feature solve? Why is it needed?

## Proposed Solution
A clear and concise description of what you want to happen.

## Alternative Solutions
A clear and concise description of any alternative solutions or features you've considered.

## Additional Context
Add any other context or screenshots about the feature request here.

## Implementation Considerations
Any thoughts on how this feature might be implemented (optional).
```

## 🎨 Design Contributions

### Design Guidelines

- **Follow the existing design system** (colors, typography, spacing)
- **Maintain brand consistency** with TOM Convention identity
- **Ensure accessibility** (WCAG 2.1 AA compliance)
- **Consider mobile-first** responsive design
- **Optimize for performance** (fast loading, smooth animations)

### Design Assets

- **Colors**: Use the established color palette
- **Typography**: Use the defined font families and scales
- **Spacing**: Follow the consistent spacing system
- **Components**: Maintain consistency with existing components

### Design Review Process

1. **Create design mockups** using Figma, Sketch, or similar
2. **Share designs** for feedback and review
3. **Iterate based on feedback** from the team
4. **Implement designs** following the coding guidelines
5. **Test implementation** across devices and browsers

## 📚 Documentation Contributions

### Documentation Types

- **Code Documentation**: JSDoc comments, inline comments
- **User Documentation**: README updates, user guides
- **Technical Documentation**: Architecture docs, API docs
- **Troubleshooting**: Common issues and solutions

### Documentation Standards

- **Use clear, concise language**
- **Include code examples** where helpful
- **Keep documentation up-to-date** with code changes
- **Use consistent formatting** and structure
- **Include screenshots** for complex procedures

## 🔒 Security Considerations

### Security Guidelines

- **Never commit sensitive information** (API keys, passwords, etc.)
- **Validate all user input** to prevent XSS attacks
- **Use HTTPS** for all external requests
- **Follow secure coding practices**
- **Report security vulnerabilities** responsibly

### Reporting Security Issues

If you discover a security vulnerability, please:

1. **Do not create a public issue**
2. **Email the security team** directly
3. **Provide detailed information** about the vulnerability
4. **Allow time for the team** to address the issue
5. **Follow responsible disclosure** practices

## 🏷️ Release Process

### Version Numbering

We use semantic versioning (SemVer):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

```bash
# Pre-release
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Version number updated
- [ ] Changelog updated
- [ ] Build verification passes

# Release
- [ ] Create release tag
- [ ] Deploy to production
- [ ] Verify deployment
- [ ] Monitor for issues

# Post-release
- [ ] Update documentation
- [ ] Announce release
- [ ] Monitor metrics
- [ ] Gather feedback
```

## 📞 Getting Help

### Communication Channels

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For general questions and discussions
- **Email**: For security issues and private matters

### Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please:

- **Be respectful** and inclusive
- **Be constructive** in feedback and discussions
- **Be patient** with newcomers and questions
- **Be collaborative** and help others learn
- **Be professional** in all interactions

### Recognition

Contributors will be recognized in:
- **README.md** contributor list
- **Release notes** for significant contributions
- **Project documentation** for major features
- **Social media** for notable contributions

## 🎯 Contribution Ideas

### Good First Issues

- **Documentation improvements**
- **Accessibility enhancements**
- **Performance optimizations**
- **Bug fixes**
- **Code refactoring**

### Advanced Contributions

- **New features**
- **Architecture improvements**
- **Build system enhancements**
- **Testing framework improvements**
- **Performance monitoring**

### Non-Code Contributions

- **User testing**
- **Design feedback**
- **Documentation writing**
- **Community support**
- **Translation/localization**

---

Thank you for contributing to the TOM Convention 2025 website! Your contributions help make this project better for everyone.

**Questions?** Feel free to open an issue or start a discussion on GitHub.
