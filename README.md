# CollabNation

CollabNation is a React + Vite + TypeScript social collaboration platform using Firebase Authentication, Firestore, Realtime Database, and Storage.

## 1) Prerequisites

Install these first:

- Node.js 20+ (recommended LTS)
- npm 10+
- Firebase CLI (`npm install -g firebase-tools`)
- A Firebase project you own
- VS Code

## 2) Clone and open in VS Code

```bash
git clone <YOUR_REPO_URL>
cd CollabNationTest-
code .
```

## 3) Install dependencies

From the VS Code terminal in project root:

```bash
npm install
```

If your network/proxy blocks npm, configure npm registry access first.

## 4) Create environment file

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Open `.env` and set all Firebase web app values:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_DATABASE_URL`

You can get these from Firebase Console:

- **Project settings** → **General** → **Your apps** (Web app config)
- **Realtime Database** → copy database URL

## 5) Enable Firebase products

In Firebase Console for your project, enable:

1. **Authentication**
   - Enable **Email/Password** sign-in provider

2. **Cloud Firestore**
   - Create database (production mode)

3. **Realtime Database**
   - Create database

4. **Storage**
   - Create default bucket

## 6) Deploy security rules

Login and link project:

```bash
firebase login
firebase use --add
```

Deploy rules in this repo:

```bash
firebase deploy --only firestore:rules,database,storage
```

## 7) Run the app locally

```bash
npm run dev
```

Open the URL shown in terminal (usually `http://localhost:5173`).

## 8) Create initial test users and data

1. Go to `/signup` and create at least 2 users.
2. Login and create a few projects from **Create** in feed.
3. Open **Discover** and verify users/match scores appear.
4. Open **Messages** and send chat messages.
5. Open profiles and update bio/skills/interests.

## 9) Functional test checklist

Run through these checks manually:

- Signup / Login / Logout
- Protected routes redirect unauthenticated users to login
- Create project works and appears in feed
- Feed sorting tabs switch ordering (Hot/New/Top/Rising)
- Project detail page loads and comments can be posted
- Collaboration request button creates pending request (without duplicates)
- Discover page loads users and skill filter works
- Messages send/receive in realtime
- Profile updates save correctly

## 10) Security test checklist

Use Firebase Consoles + app actions to validate:

- User public data in `usersPublic`, private data in `usersPrivate`
- Unauthorized updates to another user's profile are denied
- Non-owner project update/delete is denied
- Collaboration request status changes only by project owner
- RTDB messages only readable/writable for participants
- Storage avatar uploads restricted by auth + size + content type

## 11) Type-check and build

```bash
npx tsc --noEmit
npm run build
```

If either fails, resolve TypeScript/package issues before deploy.

## 12) Optional: production deploy

Build and deploy Firebase hosting (if hosting target is configured):

```bash
npm run build
firebase deploy
```

## 13) Common troubleshooting

### App shows Firebase config errors
- Verify `.env` exists in project root.
- Confirm all `VITE_FIREBASE_*` values are present and correct.
- Restart dev server after `.env` edits.

### Permission denied errors
- Confirm rules were deployed from this repository.
- Verify you are authenticated in app.
- Check document paths match expected collections (`usersPublic`, `usersPrivate`, `projects`, etc.).

### Messages not appearing
- Confirm Realtime Database is enabled.
- Confirm `VITE_FIREBASE_DATABASE_URL` matches the active Firebase project.

---

If you follow the steps above in order, the app will run locally in VS Code and be ready for manual functional/security testing.
