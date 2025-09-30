# Self-Hosted Authentication Solutions for RxDB

## Overview

Since RxDB doesn't include built-in authentication, you need to integrate it with a separate auth system. Here are reliable self-hosted alternatives to Netlify Identity that work well with RxDB and don't require external calls or services.

## Top Recommendations

### 1. **Keycloak** - Enterprise-Grade Self-Hosted OIDC Provider
**Best for: Production applications with complex auth requirements**

**Why it works well with RxDB:**
- Standards-based (OpenID Connect, OAuth2, SAML)
- Rich permission and role management
- JWT token issuance
- User federation capabilities
- RESTful APIs for user management
- Docker-native deployment

**Integration Pattern:**
```javascript
// Frontend: Get JWT from Keycloak
const token = await keycloak.token;

// RxDB: Include in requests
const db = await createRxDatabase({
  name: 'guest-portal',
  storage: getRxStorageIndexedDB()
});

// Use token for authenticated API calls
const response = await fetch('/api/guests', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

**Deployment:**
```yaml
# docker-compose.yml
version: '3.8'
services:
  keycloak:
    image: quay.io/keycloak/keycloak:latest
    environment:
      - KEYCLOAK_ADMIN=admin
      - KEYCLOAK_ADMIN_PASSWORD=admin
      - KC_DB=postgres
      - KC_DB_URL=jdbc:postgresql://postgres:5432/keycloak
    ports:
      - "8080:8080"
```

### 2. **Authelia** - Lightweight Self-Hosted Authentication
**Best for: Simple, secure authentication needs**

**Why it works well with RxDB:**
- Focuses on security-first authentication
- Supports multiple 2FA methods (TOTP, WebAuthn, etc.)
- Lightweight and fast
- Easy integration with reverse proxies
- REST API for user management

**Integration Pattern:**
```javascript
// Frontend: Handle Authelia redirects
const authUrl = 'https://auth.yourdomain.com/api/verify';
const response = await fetch(authUrl, {
  credentials: 'include'
});

// RxDB: Use session cookies or JWT
const db = await createRxDatabase({
  name: 'guest-portal',
  storage: getRxStorageIndexedDB()
});
```

**Deployment:**
```yaml
version: '3.8'
services:
  authelia:
    image: authelia/authelia:latest
    volumes:
      - ./config:/config
    ports:
      - "9091:9091"
```

### 3. **Authentik** - Modern Identity Provider
**Best for: Developer-friendly with rich features**

**Why it works well with RxDB:**
- Modern web UI for admin management
- Extensive integration options
- Social login support
- Device management
- Audit logging
- REST and GraphQL APIs

**Integration Pattern:**
```javascript
// Use Authentik's OAuth2/OpenID flows
const clientId = 'your-client-id';
const redirectUri = 'https://yourapp.com/callback';

// RxDB integration with JWT tokens
const db = await createRxDatabase({
  name: 'guest-portal',
  storage: getRxStorageIndexedDB()
});

// Store user context
await db.userSessions.insert({
  userId: user.id,
  token: accessToken,
  roles: user.roles
});
```

## Integration Strategies

### JWT-Based Authentication (Most Common)

```javascript
class AuthManager {
  constructor() {
    this.token = null;
    this.user = null;
    this.db = null;
  }

  async initialize() {
    // Check for stored auth
    const stored = localStorage.getItem('auth');
    if (stored) {
      const { token, user } = JSON.parse(stored);
      this.token = token;
      this.user = user;
    }

    // Initialize RxDB
    this.db = await createRxDatabase({
      name: `guest-portal-${this.user?.id || 'anonymous'}`,
      storage: getRxStorageIndexedDB()
    });
  }

  async login(credentials) {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    const { token, user } = await response.json();
    this.token = token;
    this.user = user;

    // Store auth state
    localStorage.setItem('auth', JSON.stringify({ token, user }));

    // Reinitialize DB with user context
    await this.initialize();
  }

  async logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('auth');

    if (this.db) {
      await this.db.destroy();
      this.db = null;
    }
  }

  getAuthHeaders() {
    return this.token ? { 'Authorization': `Bearer ${this.token}` } : {};
  }
}
```

### Role-Based Access Control

```javascript
// Define permissions
const PERMISSIONS = {
  GUEST: {
    canEditOwnProfile: true,
    canViewOwnQuestions: true,
    canCreateQuestions: true,
    canViewAllQuestions: false,
    canApproveContent: false
  },
  MODERATOR: {
    canEditOwnProfile: true,
    canViewOwnQuestions: true,
    canCreateQuestions: true,
    canViewAllQuestions: true,
    canApproveContent: false
  },
  ADMIN: {
    canEditOwnProfile: true,
    canViewOwnQuestions: true,
    canCreateQuestions: true,
    canViewAllQuestions: true,
    canApproveContent: true
  }
};

// RxDB middleware for access control
db.collections.questions.preInsert((doc) => {
  const currentUser = authManager.user;

  if (!currentUser) {
    throw new Error('Authentication required');
  }

  // Set creator
  doc.createdBy = currentUser.id;
  doc.createdAt = new Date().toISOString();

  return doc;
}, false);

// Query filtering based on permissions
const getQuestionsForUser = async (user) => {
  const permissions = PERMISSIONS[user.role];

  if (permissions.canViewAllQuestions) {
    return db.questions.find().exec();
  } else {
    return db.questions.find()
      .where('createdBy').eq(user.id)
      .exec();
  }
};
```

### Data Synchronization with Auth

```javascript
// RxDB replication with authentication
const syncWithServer = async (db, authManager) => {
  const replicationState = db.guests.syncGraphQL({
    url: 'https://your-api.com/graphql',
    headers: authManager.getAuthHeaders(),
    push: {
      queryBuilder: (doc) => ({
        query: `
          mutation CreateGuest($input: CreateGuestInput!) {
            createGuest(input: $input) { id }
          }
        `,
        variables: { input: doc }
      })
    },
    pull: {
      queryBuilder: () => ({
        query: `
          query GetGuests($userId: ID!) {
            guests(userId: $userId) {
              id name email status
            }
          }
        `,
        variables: { userId: authManager.user.id }
      })
    }
  });

  return replicationState;
};
```

## Comparison Table

| Solution | Complexity | Features | Performance | Learning Curve |
|----------|------------|----------|-------------|----------------|
| **Keycloak** | High | Enterprise-grade, Rich features | High | Steep |
| **Authelia** | Medium | Security-focused, Simple | High | Medium |
| **Authentik** | Medium | Modern UI, Developer-friendly | High | Medium |
| **Custom JWT** | Low | Flexible, Minimal | High | Low |

## Recommended for Your Use Case

### **Authentik** - Best Overall Choice
- Modern, developer-friendly interface
- Rich feature set without complexity
- Good documentation and community support
- Easy Docker deployment
- REST and GraphQL APIs
- Social login support if needed later

### **Implementation Steps:**

1. **Deploy Authentik:**
```bash
# Using Docker Compose
git clone https://github.com/goauthentik/authentik
cd authentik
docker-compose up -d
```

2. **Configure Application:**
   - Create realm/client for your guest portal
   - Set up user roles (Guest, Moderator, Admin)
   - Configure redirect URIs

3. **Frontend Integration:**
```javascript
// Use Authentik's JavaScript SDK
import { AuthentikClient } from '@authentik/client';

const auth = new AuthentikClient({
  baseURL: 'https://auth.yourdomain.com',
  clientId: 'your-client-id'
});

// RxDB integration
const db = await createRxDatabase({
  name: 'guest-portal',
  storage: getRxStorageIndexedDB()
});
```

4. **Backend API Integration:**
```javascript
// Verify JWT tokens from Authentik
const verifyToken = async (token) => {
  const response = await fetch('https://auth.yourdomain.com/api/v3/oauth2/introspect', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${clientSecret}`
    },
    body: new URLSearchParams({
      token: token,
      client_id: clientId
    })
  });

  return await response.json();
};
```

## Security Considerations

### Token Storage
```javascript
// Secure token storage (use HttpOnly cookies for production)
const tokenStorage = {
  set: (token) => {
    // In production, use HttpOnly cookies
    localStorage.setItem('auth_token', token);
  },
  get: () => {
    return localStorage.getItem('auth_token');
  },
  clear: () => {
    localStorage.removeItem('auth_token');
  }
};
```

### HTTPS Required
- All authentication flows must use HTTPS
- Configure your reverse proxy (nginx, traefik) for SSL termination

### Session Management
```javascript
// Automatic token refresh
class TokenManager {
  constructor() {
    this.refreshTimer = null;
  }

  startRefreshTimer(token) {
    // Decode JWT to get expiry
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiresIn = payload.exp * 1000 - Date.now() - 60000; // 1 min before expiry

    this.refreshTimer = setTimeout(async () => {
      await this.refreshToken();
    }, expiresIn);
  }

  async refreshToken() {
    try {
      const response = await fetch('/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        const { token } = await response.json();
        tokenStorage.set(token);
        this.startRefreshTimer(token);
      } else {
        // Redirect to login
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      window.location.href = '/login';
    }
  }
}
```

## Integration with Your Existing Pretix

Since you already have Pretix running on elest.io, you can:

1. **Use Pretix as User Source:** Configure your auth provider to sync users from Pretix
2. **Single Sign-On:** Set up SSO between Pretix and your guest portal
3. **Shared User Database:** Use Pretix's user management as the source of truth

## Conclusion

**Authentik** is the best self-hosted authentication solution for your RxDB guest portal because:

✅ **No external service dependencies** - Completely self-hosted  
✅ **Rich feature set** - User management, roles, permissions, social login  
✅ **Modern architecture** - REST and GraphQL APIs, good documentation  
✅ **Easy deployment** - Docker-native, simple configuration  
✅ **Perfect RxDB integration** - JWT-based authentication works seamlessly  
✅ **Scalable** - Can grow with your application's needs  

This gives you enterprise-grade authentication without the complexity of Keycloak, while being more feature-rich and secure than a simple custom JWT implementation.
