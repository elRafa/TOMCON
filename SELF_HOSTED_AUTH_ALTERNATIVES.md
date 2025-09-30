# Self-Hosted Authentication Alternatives for RxDB

## Overview
While RxDB is excellent for client-side data storage, authentication typically requires server-side components for security. Here are viable alternatives that work with RxDB without external services:

## Option 1: Supabase Auth (Recommended Alternative)
**Why this works despite being "external":**
- **Self-hosted PostgreSQL backend** - You control the database
- **Open-source components** - GoTrue for auth, PostgreSQL for data
- **RxDB integration** - Use JWTs for secure client-side data access
- **No external service dependency** - Host on your own infrastructure

**Integration Pattern:**
```javascript
// Client-side authentication
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('your-url', 'your-anon-key')

// RxDB with user context
const db = await createRxDatabase({
  name: 'guest-portal',
  storage: getRxStorageIndexedDB()
});

// Store user data with user ID from Supabase
const userData = await db.collections.userData.insert({
  id: 'data-id',
  userId: supabase.auth.user()?.id,
  content: 'private user content'
});
```

## Option 2: Custom Authentication with RxDB
**Build your own auth system using RxDB:**

```javascript
// Simple authentication system using RxDB
class AuthManager {
  constructor() {
    this.db = null;
    this.currentUser = null;
  }

  async init() {
    this.db = await createRxDatabase({
      name: 'auth-system',
      storage: getRxStorageIndexedDB()
    });

    // Create user collection
    await this.db.addCollections({
      users: {
        schema: {
          version: 0,
          primaryKey: 'email',
          type: 'object',
          properties: {
            email: { type: 'string' },
            passwordHash: { type: 'string' },
            salt: { type: 'string' },
            role: { type: 'string' },
            createdAt: { type: 'string' }
          }
        }
      }
    });
  }

  async register(email, password) {
    const salt = this.generateSalt();
    const passwordHash = await this.hashPassword(password, salt);

    return await this.db.users.insert({
      email,
      passwordHash,
      salt,
      role: 'guest',
      createdAt: new Date().toISOString()
    });
  }

  async login(email, password) {
    const user = await this.db.users.findOne(email).exec();
    if (!user) return false;

    const passwordHash = await this.hashPassword(password, user.salt);
    if (passwordHash === user.passwordHash) {
      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  async hashPassword(password, salt) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  generateSalt() {
    return Math.random().toString(36).substring(2, 15);
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  isAuthenticated() {
    return this.currentUser !== null;
  }
}
```

## Option 3: Keycloak with RxDB
**Self-hosted OIDC provider:**
- **Full OIDC/OAuth2 support**
- **PostgreSQL backend** (you host it)
- **REST APIs for integration**
- **RxDB integration via JWT tokens**

**Setup Requirements:**
- PostgreSQL database (self-hosted)
- Docker container for Keycloak
- Nginx reverse proxy

## Option 4: Simple JWT-Based Auth
**Lightweight authentication without external services:**

```javascript
// JWT-based authentication with RxDB
class JWTAuth {
  constructor() {
    this.secret = 'your-secret-key'; // Store securely
    this.db = null;
  }

  async init() {
    this.db = await createRxDatabase({
      name: 'jwt-auth',
      storage: getRxStorageIndexedDB()
    });
  }

  async createToken(payload) {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payloadEncoded = btoa(JSON.stringify({
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    }));

    const message = header + '.' + payloadEncoded;
    const signature = await this.createSignature(message);

    return message + '.' + signature;
  }

  async createSignature(message) {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(this.secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
  }

  async verifyToken(token) {
    try {
      const [header, payload, signature] = token.split('.');
      const message = header + '.' + payload;

      const expectedSignature = await this.createSignature(message);
      if (signature !== expectedSignature) return null;

      const decodedPayload = JSON.parse(atob(payload));
      if (decodedPayload.exp < Math.floor(Date.now() / 1000)) return null;

      return decodedPayload;
    } catch (error) {
      return null;
    }
  }
}
```

## Option 5: Passwordless Authentication
**Email-based authentication:**

```javascript
// Email-based authentication with RxDB
class PasswordlessAuth {
  constructor() {
    this.db = null;
    this.pendingTokens = new Map();
  }

  async init() {
    this.db = await createRxDatabase({
      name: 'passwordless-auth',
      storage: getRxStorageIndexedDB()
    });
  }

  async sendLoginLink(email) {
    // Generate secure token
    const token = crypto.randomUUID();
    const expiresAt = Date.now() + (15 * 60 * 1000); // 15 minutes

    // Store token temporarily
    this.pendingTokens.set(token, { email, expiresAt });

    // Send email (you'll need an email service)
    const loginUrl = `https://yourapp.com/login?token=${token}`;
    await this.sendEmail(email, 'Login Link', `Click here: ${loginUrl}`);
  }

  async verifyToken(token) {
    const tokenData = this.pendingTokens.get(token);
    if (!tokenData || tokenData.expiresAt < Date.now()) {
      return false;
    }

    // Clean up used token
    this.pendingTokens.delete(token);

    // Create or update user
    let user = await this.db.users.findOne(tokenData.email).exec();
    if (!user) {
      user = await this.db.users.insert({
        email: tokenData.email,
        createdAt: new Date().toISOString()
      });
    }

    return user;
  }
}
```

## Recommendation

For your guest portal with RxDB, I recommend **Supabase Auth** because:

1. **No external service dependency** - You host PostgreSQL yourself
2. **Excellent RxDB integration** - JWT-based authentication works perfectly
3. **Production-ready** - Battle-tested authentication system
4. **Rich features** - User management, roles, social logins
5. **Scalable** - Handles thousands of users efficiently

**Setup Steps:**
1. Host PostgreSQL on your elest.io server
2. Deploy Supabase (GoTrue + PostgreSQL)
3. Configure RxDB to use Supabase JWTs for data access control
4. Implement role-based permissions for admins/moderators/guests

This gives you enterprise-grade authentication without the complexity of Authentik on shared hosting, while maintaining full control over your data and infrastructure.
