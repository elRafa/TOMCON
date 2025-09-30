# Guest Portal Solution Research

## Requirements Analysis
The user wants to add a resource portal for guests (panelists, moderators, performers) with:
1. **Promotion resources** - Tools to help promote the event on social media
2. **Profile management** - Allow guests to manage their presence on the frontend website
3. **Q&A access** - See questions submitted via their "cards" on the frontend
4. **Admin/moderator access** - Allow admins and moderators to see submitted questions
5. **Approval workflow** - Allow admins to approve changes made by guests and push to live site

**Constraints**: No SQL database or external service dependencies.

## Autobase (Pear Runtime) Assessment

### What is Autobase?
- Multiwriter data structure for decentralized applications
- Uses event sourcing with causal ordering
- Designed for P2P systems with conflict resolution
- Supports optimistic appends and indexing
- Complex setup involving baselines, operations, and causal DAG

### Why NOT Suitable:
1. **Overkill for use case** - Designed for decentralized multiwriter scenarios, not content management
2. **Complex setup** - Requires understanding of causal ordering, baselines, and operations
3. **Poor fit for approval workflow** - No built-in user permissions or approval mechanisms
4. **Learning curve** - Steep learning curve for the team
5. **No UI components** - No admin interface or content management tools

## Alternative Solutions (No SQL/External Services)

### 1. RxDB - Recommended
**Pros:**
- Local-first reactive database with IndexedDB backend
- Built-in replication support (can sync with your existing infrastructure later)
- Schema validation and TypeScript support
- Multiple storage adapters (IndexedDB, LocalStorage, SQLite, etc.)
- Reactive queries that update UI automatically
- Rich ecosystem with plugins for encryption, compression, etc.
- Production-ready with good documentation

**Cons:**
- Learning curve for RxDB-specific patterns
- More complex than simple JSON solutions

### 2. SignalDB
**Pros:**
- Lightweight with MongoDB-like interface
- Reactive queries with automatic UI updates
- Multiple storage providers (IndexedDB, LocalStorage, etc.)
- Good TypeScript support
- Simpler API than RxDB

**Cons:**
- Newer project, less mature ecosystem
- Fewer advanced features than RxDB

### 3. Verdant
**Pros:**
- Built for collaboration and sync
- Good for real-time features
- Handles conflicts well
- Type-safe with schema definitions

**Cons:**
- Primarily designed for sync scenarios
- May be overkill for local-only use case

### 4. Simple JSON File Solutions
**Pros:**
- Minimal dependencies
- Easy to understand and implement
- Good for simple CRUD operations
- Can use existing Node.js fs module

**Cons:**
- No built-in reactivity (need to implement manually)
- No built-in querying capabilities
- Manual conflict resolution
- No schema validation
- No built-in backup/recovery

Examples: `node-json-db`, `lowdb`, `filejson`, `mycro-db`

## Recommended Architecture for Guest Portal

### Option 1: RxDB (Recommended)
```
Frontend (React/Vue) + RxDB Client
    ↓
IndexedDB/LocalStorage
    ↓
Optional: RxDB Server for sync (if needed later)
```

### Option 2: Hybrid Approach
```
Frontend + Simple JSON storage for data
    ↓
Custom approval workflow logic
    ↓
Git-based deployment for "push to live"
```

## Implementation Strategy

1. **Data Structure:**
   ```javascript
   // Guests collection
   {
     id: "guest-123",
     name: "Panelist Name",
     bio: "Bio text...",
     socialLinks: {...},
     status: "draft|approved|published"
   }

   // Questions collection
   {
     id: "question-456",
     guestId: "guest-123",
     question: "User question...",
     submittedBy: "user@example.com",
     status: "pending|answered"
   }

   // Resources collection
   {
     id: "resource-789",
     type: "social-media-kit",
     content: {...},
     accessRoles: ["panelist", "performer"]
   }
   ```

2. **User Roles & Permissions:**
   - Guest (read/write own data)
   - Moderator (read all questions, moderate content)
   - Admin (approve changes, publish to live site)

3. **Approval Workflow:**
   - Guests make changes → status = "draft"
   - Admins review → status = "approved"
   - Deploy script pushes approved changes to live site

## Conclusion

**RxDB is the best fit** because:
- Handles complex relationships between guests, questions, and resources
- Built-in reactivity for real-time UI updates
- Schema validation prevents data corruption
- Can start local-only and add sync later if needed
- Rich ecosystem for future expansion
- No external service dependencies

**Avoid Autobase** because:
- Designed for different use case (decentralized multiwriter systems)
- Too complex for content management workflow
- No built-in approval or permission system
- Steep learning curve for web development team
