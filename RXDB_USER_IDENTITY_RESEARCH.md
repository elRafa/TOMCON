# RxDB User Identity Handling Research

## How RxDB Handles User Identity

**RxDB itself does NOT have built-in authentication** - it's a database layer that focuses on data storage, querying, and synchronization. User identity must be handled at the application level.

## Recommended User Identity Approaches

### 1. Integrate with Existing Netlify Identity (Your Current Setup)

Since you already use Netlify Identity, this is the **recommended approach**:

```javascript
// In your guest portal app
import netlifyIdentity from 'netlify-identity-widget';

// Initialize Netlify Identity
netlifyIdentity.init();

// Get current user
const user = netlifyIdentity.currentUser();

// RxDB collections with user context
const db = await createRxDatabase({
  name: 'guest-portal',
  storage: getRxStorageIndexedDB()
});

await db.addCollections({
  guests: {
    schema: guestSchema
  },
  questions: {
    schema: questionSchema
  }
});

// Add user context to documents
await db.guests.insert({
  ...guestData,
  userId: user?.id,
  email: user?.email,
  role: user?.app_metadata?.roles?.[0] || 'guest'
});
```

**Benefits:**
- ✅ No additional authentication service needed
- ✅ Already integrated with your existing setup
- ✅ Handles user sessions automatically
- ✅ Secure token-based authentication

### 2. RxDB + JWT Tokens (Custom Implementation)

```javascript
// Store JWT token in localStorage/sessionStorage
const token = localStorage.getItem('authToken');

// Include user context in all RxDB operations
const db = await createRxDatabase({
  name: 'guest-portal',
  storage: getRxStorageIndexedDB()
});

// Add middleware to inject user context
db.collections.guests.preInsert((doc) => {
  doc.userId = getCurrentUserId();
  doc.createdAt = new Date().toISOString();
  return doc;
}, false);
```

### 3. User Sessions in RxDB Collections

Store user sessions in RxDB itself:

```javascript
// User sessions collection
await db.addCollections({
  userSessions: {
    schema: {
      version: 0,
      primaryKey: 'id',
      type: 'object',
      properties: {
        id: { type: 'string' },
        userId: { type: 'string' },
        email: { type: 'string' },
        role: { type: 'string' },
        token: { type: 'string' },
        expiresAt: { type: 'string' },
        lastLogin: { type: 'string' }
      }
    }
  }
});

// Check user session on app start
const currentSession = await db.userSessions
  .findOne()
  .where('expiresAt')
  .gt(new Date().toISOString())
  .exec();

if (currentSession) {
  // User is logged in
  setCurrentUser(currentSession);
} else {
  // Redirect to login
  redirectToLogin();
}
```

## Security Considerations

### 1. Data Encryption
```javascript
// Encrypt sensitive data
const encryptedStorage = getRxStorageIndexedDB({
  encryption: {
    algorithm: 'aes-256-gcm',
    key: userSpecificKey // Derive from user password/token
  }
});
```

### 2. Row-Level Security (RLS)
```javascript
// Add middleware for access control
db.collections.questions.preInsert((doc) => {
  const currentUser = getCurrentUser();

  // Guests can only create questions for themselves
  if (doc.guestId !== currentUser.id && currentUser.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  return doc;
}, false);
```

### 3. User-Specific Data Filtering
```javascript
// Filter queries based on user permissions
const getQuestionsForUser = (user) => {
  if (user.role === 'admin' || user.role === 'moderator') {
    // Admins/mods see all questions
    return db.questions.find().exec();
  } else {
    // Guests only see their own questions
    return db.questions.find()
      .where('guestId').eq(user.id)
      .exec();
  }
};
```

## Role-Based Access Control (RBAC)

### User Roles for Your Use Case:
```javascript
const USER_ROLES = {
  GUEST: 'guest',           // Panelists, performers
  MODERATOR: 'moderator',   // Event staff
  ADMIN: 'admin'           // Organizers
};

// Permission matrix
const PERMISSIONS = {
  [USER_ROLES.GUEST]: {
    canEditOwnProfile: true,
    canViewOwnQuestions: true,
    canCreateQuestions: true,
    canViewAllQuestions: false,
    canApproveContent: false,
    canPublishContent: false
  },
  [USER_ROLES.MODERATOR]: {
    canEditOwnProfile: true,
    canViewOwnQuestions: true,
    canCreateQuestions: true,
    canViewAllQuestions: true,
    canApproveContent: false,
    canPublishContent: false
  },
  [USER_ROLES.ADMIN]: {
    canEditOwnProfile: true,
    canViewOwnQuestions: true,
    canCreateQuestions: true,
    canViewAllQuestions: true,
    canApproveContent: true,
    canPublishContent: true
  }
};
```

### Content Approval Workflow:
```javascript
// Status-based workflow
const CONTENT_STATUSES = {
  DRAFT: 'draft',
  PENDING_REVIEW: 'pending_review',
  APPROVED: 'approved',
  PUBLISHED: 'published',
  REJECTED: 'rejected'
};

// Example approval flow
const approveContent = async (contentId, user) => {
  if (!PERMISSIONS[user.role].canApproveContent) {
    throw new Error('Insufficient permissions');
  }

  await db.content.atomicUpdate(contentId, (doc) => {
    doc.status = CONTENT_STATUSES.APPROVED;
    doc.approvedBy = user.id;
    doc.approvedAt = new Date().toISOString();
    return doc;
  });
};
```

## Integration with Your Existing Netlify Identity

### Seamless Integration Pattern:
```javascript
// Auth state management
class AuthManager {
  constructor() {
    this.currentUser = null;
    this.db = null;

    netlifyIdentity.on('login', this.handleLogin.bind(this));
    netlifyIdentity.on('logout', this.handleLogout.bind(this));
  }

  async handleLogin(user) {
    this.currentUser = user;

    // Initialize RxDB with user context
    this.db = await this.initializeDatabase(user);

    // Sync user-specific data
    await this.syncUserData(user);
  }

  async handleLogout() {
    this.currentUser = null;

    // Clean up user-specific data
    if (this.db) {
      await this.db.destroy();
      this.db = null;
    }
  }

  async initializeDatabase(user) {
    const db = await createRxDatabase({
      name: `guest-portal-${user.id}`, // User-specific database
      storage: getRxStorageIndexedDB()
    });

    // Add collections with user context
    await db.addCollections({
      profile: profileSchema,
      questions: questionSchema,
      resources: resourceSchema
    });

    return db;
  }
}
```

## Data Synchronization Strategy

### Local-First with Optional Sync:
```javascript
// RxDB replication with your backend
const syncWithBackend = async (db, user) => {
  const replicationState = db.questions.syncGraphQL({
    url: 'https://your-api.com/graphql',
    headers: {
      'Authorization': `Bearer ${user.token}`
    },
    push: {
      queryBuilder: (doc) => ({
        query: `
          mutation CreateQuestion($input: CreateQuestionInput!) {
            createQuestion(input: $input) { id }
          }
        `,
        variables: { input: doc }
      })
    },
    pull: {
      queryBuilder: () => ({
        query: `
          query GetQuestions($userId: ID!) {
            questions(userId: $userId) {
              id title content status
            }
          }
        `,
        variables: { userId: user.id }
      })
    }
  });

  return replicationState;
};
```

## Best Practices Summary

### 1. **Use Netlify Identity** - Leverage your existing authentication
### 2. **Implement Row-Level Security** - Filter data based on user roles
### 3. **User-Specific Databases** - Isolate user data for better security
### 4. **Status-Based Workflows** - Draft → Review → Approved → Published
### 5. **Local-First Design** - Data works offline, syncs when possible
### 6. **Encryption** - Encrypt sensitive user data
### 7. **Audit Trail** - Track who made what changes when

## Conclusion

RxDB provides excellent primitives for user identity management but requires you to implement the authentication layer yourself. **Netlify Identity integration is the best approach** because:

- ✅ No additional services needed
- ✅ Secure, battle-tested authentication
- ✅ Seamless integration with your existing setup
- ✅ Handles user sessions and tokens automatically
- ✅ Supports role-based access control

The combination of Netlify Identity + RxDB gives you a robust, secure, and scalable solution for your guest portal user management needs.
