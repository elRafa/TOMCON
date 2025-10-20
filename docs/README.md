# TOM Convention 2025 - Project Documentation

Welcome to the comprehensive documentation for the TOM Convention 2025 website. This documentation provides everything needed for developers, designers, and stakeholders to understand, maintain, and extend the project.

## 📋 Table of Contents

- [Project Overview](./01-project-overview.md) - High-level project description and goals
- [Architecture & Design](./02-architecture-design.md) - System architecture, design patterns, and technical decisions
- [Data Models & APIs](./03-data-models-apis.md) - Data structures, guest management, and external integrations
- [Development Setup](./04-development-setup.md) - Local development environment and workflow
- [Build & Deployment](./05-build-deployment.md) - Build process, verification, and deployment procedures
- [Performance & Optimization](./06-performance-optimization.md) - Performance strategies and optimization techniques
- [User Interface & UX](./07-ui-ux-design.md) - Design system, components, and user experience patterns
- [Testing & Quality Assurance](./08-testing-qa.md) - Testing strategies and quality assurance processes
- [Troubleshooting](./09-troubleshooting.md) - Common issues and solutions
- [Contributing](./10-contributing.md) - Guidelines for contributing to the project

## 🚀 Quick Start

For immediate development setup:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to server
./deploy.sh
```

## 🎯 Project Summary

**TOM Convention 2025** is a modern, interactive website for the first-ever Christian alternative rock and hard music fan convention. The site features:

- **Interactive Guest Cards** - Flip animations with question submission system
- **Performance Optimized** - Lazy loading, WebP images, and efficient bundling
- **Accessibility Focused** - Keyboard navigation and screen reader support
- **Mobile Responsive** - Optimized for all device sizes
- **Real-time Features** - Live countdown timer and dynamic content

## 🏗️ Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Build Tool**: Vite 7.x
- **Styling**: Tailwind CSS 3.x + Custom CSS
- **Icons**: Lucide (tree-shaken)
- **Image Processing**: Sharp
- **Deployment**: SSH/rsync with automated verification

## 📊 Key Metrics

- **Performance**: 95+ Lighthouse scores
- **Bundle Size**: ~200KB total (optimized)
- **Image Optimization**: 60-80% size reduction with WebP
- **Accessibility**: WCAG 2.1 AA compliant
- **Browser Support**: Modern browsers (ES2020+)

## 🔧 Development Workflow

1. **Local Development**: `npm run dev` (localhost:8000)
2. **Build & Verify**: `npm run build && npm run verify`
3. **Deploy**: `./deploy.sh` (with automatic verification)
4. **Monitor**: Check live site and performance metrics

## 📁 Project Structure

```
tomcon-round2/
├── docs/                    # Comprehensive documentation
├── dist/                    # Built files (generated)
├── images/                  # Optimized WebP images
├── index.html              # Main page
├── script.js               # Core application logic
├── guests.js               # Guest data and management
├── style.css               # Custom styles and animations
├── input.css               # Tailwind CSS input
├── vite.config.js          # Build configuration
├── tailwind.config.js      # Tailwind configuration
├── package.json            # Dependencies and scripts
├── deploy.sh               # Deployment script
├── verify-build.js         # Build verification
└── optimize-images.js      # Image optimization
```

## 🎨 Design Philosophy

The website follows a **content-first, performance-focused** approach:

- **Minimal JavaScript** - Vanilla JS for maximum performance
- **Progressive Enhancement** - Works without JavaScript
- **Mobile-First** - Responsive design from the ground up
- **Accessibility** - Inclusive design for all users
- **Performance** - Optimized for speed and efficiency

## 🔍 Key Features

### Interactive Guest System
- Flip card animations with 3D transforms
- Question submission with rate limiting
- Local storage for offline functionality
- Real-time form validation

### Performance Optimizations
- Lazy loading with Intersection Observer
- WebP image format with fallbacks
- Code splitting and tree shaking
- Efficient CSS and JavaScript bundling

### Accessibility Features
- Full keyboard navigation (WASD/Arrow keys)
- Screen reader compatibility
- High contrast design
- Focus management

### Advanced UX
- Project overlay system (B-key feature)
- Smooth animations and transitions
- Responsive image handling
- Error handling and fallbacks

## 📈 Performance Targets

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms
- **Bundle Size**: < 250KB total

## 🛠️ Maintenance

### Regular Tasks
- Update guest information in `guests.js`
- Optimize new images with `npm run optimize-images`
- Monitor performance metrics
- Update dependencies quarterly

### Before Major Updates
- Test in multiple browsers
- Verify accessibility compliance
- Check mobile responsiveness
- Run build verification

## 📞 Support

For technical questions or issues:
1. Check the [Troubleshooting Guide](./09-troubleshooting.md)
2. Review existing documentation
3. Contact the development team

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: Development Team
