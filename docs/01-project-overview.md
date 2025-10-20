# Project Overview

## 🎯 Project Mission

TOM Convention 2025 is the **first-ever fan convention** exclusively dedicated to Christian alternative rock and hard music from the 80s, 90s, and 2000s. The website serves as the primary digital presence for this historic event, providing information, ticket sales, and interactive features for fans and artists.

## 🎪 Event Details

- **Dates**: October 24-25, 2025
- **Location**: Crowne Plaza Costa Mesa, CA
- **Duration**: 2 full days (11am - 11pm with dinner breaks)
- **Format**: Panel discussions, live performances, Q&A sessions, autographs, and merchandise

## 🎨 Brand Identity

### Visual Design
- **Primary Colors**: 
  - Background: `#482124` (Deep burgundy)
  - Text: `#E3D6B8` (Warm cream)
  - Accent: `#2C804F` (Forest green)
- **Secondary Colors**:
  - Card Background: `#E3D6B8` (Warm cream)
  - Muted Text: `#74453C` (Muted brown)
  - Success: `#22c55e` (Green)
  - Error: `#dc2626` (Red)
- **Typography**: 
  - Headers: Pacifico (script), Hahmlet (serif)
  - Body: Instrument Sans (modern sans-serif)
- **Aesthetic**: Vintage music poster meets modern web design

### Brand Values
- **Authenticity** - Real stories from real artists
- **Community** - Bringing fans and artists together
- **Nostalgia** - Honoring the music that shaped a generation
- **Inclusivity** - Welcoming all fans regardless of background

## 🎯 Website Objectives

### Primary Goals
1. **Event Information** - Clear, comprehensive event details
2. **Ticket Sales** - Seamless integration with Pretix ticketing system
3. **Artist Showcase** - Interactive profiles of all participating artists
4. **Community Building** - Question submission system for fan engagement
5. **Performance** - Fast, accessible experience across all devices

### Success Metrics
- **User Engagement**: Time spent on site, question submissions
- **Conversion**: Ticket sales through integrated widget
- **Performance**: 95+ Lighthouse scores across all metrics
- **Accessibility**: WCAG 2.1 AA compliance
- **Mobile Usage**: 60%+ mobile traffic optimization

## 👥 Target Audience

### Primary Audience
- **Christian Alternative Rock Fans** (ages 35-55)
- **Music Enthusiasts** interested in 80s-00s alternative scene
- **Collectors** of Christian alternative music
- **Artists and Industry Professionals**

### User Personas

#### "Nostalgic Fan" (Primary)
- Age: 40-50
- Grew up with Tooth & Nail Records, Blonde Vinyl
- Wants to reconnect with favorite artists
- Values authentic stories and behind-the-scenes content
- **Needs**: Easy navigation, artist information, ticket purchasing

#### "Music Historian" (Secondary)
- Age: 30-45
- Interested in music industry history
- Collects rare albums and memorabilia
- Values detailed artist backgrounds and label information
- **Needs**: Comprehensive artist profiles, historical context

#### "New Discoverer" (Tertiary)
- Age: 25-35
- Discovering Christian alternative rock through streaming
- Interested in live music and community
- Values modern, accessible presentation
- **Needs**: Clear event information, easy ticket access

## 🎵 Content Strategy

### Core Content Areas

#### 1. Event Information
- **Schedule**: Detailed panel and performance times
- **Venue**: Location, parking, hotel information
- **Tickets**: VIP passes, pricing, group discounts
- **FAQ**: Common questions and answers

#### 2. Artist Profiles
- **53 Featured Artists** across multiple roles:
  - Panelists (main discussion participants)
  - Performers (live music acts)
  - Moderators (panel facilitators)
  - Staff (event organizers)
- **Interactive Cards**: Flip animations with question submission
- **Project Information**: Bands, labels, and career highlights

#### 3. Interactive Features
- **Question Submission**: Fans can ask questions for panel discussions
- **Rate Limiting**: 2 questions per person per artist (prevents spam)
- **Local Storage**: Offline functionality and draft saving
- **Real-time Validation**: Character limits and form validation

#### 4. Historical Context
- **Record Labels**: Tooth & Nail, Blonde Vinyl, Velvet Blue, etc.
- **Music History**: Christian alternative rock movement
- **Orange County Connection**: Why Costa Mesa was chosen

## 🏗️ Technical Requirements

### Performance Standards
- **Core Web Vitals**: All metrics in "Good" range
- **Load Time**: < 3 seconds on 3G connection
- **Bundle Size**: < 250KB total JavaScript
- **Image Optimization**: WebP format with 60-80% compression

### Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Progressive Enhancement**: Works without JavaScript

### Accessibility Requirements
- **WCAG 2.1 AA**: Full compliance
- **Keyboard Navigation**: Complete site navigation via keyboard
- **Screen Readers**: Compatible with NVDA, JAWS, VoiceOver
- **Color Contrast**: 4.5:1 minimum ratio

## 📱 Device Strategy

### Mobile-First Approach
- **Primary**: Mobile devices (60%+ traffic expected)
- **Responsive Design**: Fluid layouts for all screen sizes
- **Touch Optimization**: Large tap targets, swipe gestures
- **Performance**: Optimized for slower mobile connections

### Desktop Enhancement
- **Hover Effects**: Enhanced interactions on larger screens
- **Keyboard Shortcuts**: Power user features
- **Multi-column Layouts**: Better use of screen real estate

## 🔄 Content Management

### Guest Data Management
- **Source**: `guests.js` file with structured data
- **Visibility Control**: Show/hide guests with `visibility` flag
- **Role Management**: Multiple roles per guest (panelist, performer, etc.)
- **Image Management**: Automatic WebP optimization

### Update Workflow
1. **Data Updates**: Modify `guests.js` for guest information
2. **Image Updates**: Add new images to `images/` directory
3. **Build Process**: Run `npm run build` to process changes
4. **Verification**: Automatic build verification before deployment
5. **Deployment**: Automated deployment with rollback capability

## 🎪 Event Integration

### Ticketing System
- **Provider**: Pretix (European ticketing platform)
- **Integration**: Embedded widget with custom styling
- **Features**: Group pricing, voucher codes, inventory management
- **Payment**: Secure payment processing

### Social Media Integration
- **Platforms**: Facebook, Instagram, Twitter/X, YouTube, Kick
- **Content**: Event updates, artist spotlights, behind-the-scenes
- **Sharing**: Open Graph meta tags for rich social sharing

## 📊 Analytics & Monitoring

### Key Metrics
- **Traffic**: Page views, unique visitors, session duration
- **Engagement**: Question submissions, ticket widget interactions
- **Performance**: Core Web Vitals, load times, error rates
- **Conversion**: Ticket sales, email signups

### Monitoring Tools
- **Performance**: Lighthouse CI, WebPageTest
- **Analytics**: Google Analytics 4
- **Error Tracking**: Browser console monitoring
- **Uptime**: Server monitoring and alerting

## 🚀 Future Considerations

### Scalability
- **Content Management**: Potential migration to headless CMS
- **Internationalization**: Multi-language support for global fans
- **Progressive Web App**: Offline functionality and app-like experience

### Feature Enhancements
- **Live Streaming**: Integration with streaming platforms
- **Virtual Components**: Hybrid in-person/virtual event options
- **Community Features**: Fan forums, photo galleries, memories

---

**Next**: [Architecture & Design](./02-architecture-design.md)
