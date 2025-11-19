# Firebase/GCP Backend Setup Guide

## 🎯 Phase 3B: Backend Infrastructure Implementation

This guide provides step-by-step instructions for setting up the complete Firebase/GCP backend infrastructure for the music-responsive GIF animator.

---

## 📋 Prerequisites

- Firebase CLI installed: `npm install -g firebase-tools`
- Google Cloud SDK installed: `gcloud` command available
- Google Cloud Project with billing enabled
- GitHub repository access

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Client (React App)                      │
│                   GitHub Pages / Vercel                      │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ├── Firebase Auth (Email, Google, Apple OAuth)
                 ├── Firestore (Projects, Users, Usage)
                 ├── Cloud Storage (Images, Audio, Frames, Videos)
                 └── Cloud Functions (YouTube, Processing, Analytics)
                             │
                             ├── YouTube Audio Extractor
                             ├── Advanced Audio Analysis (Meyda.js)
                             ├── Usage Tracking & Billing
                             └── Project Management
```

---

## 🚀 Step 1: Firebase Project Setup

### 1.1 Create Firebase Project

```bash
# Login to Firebase
firebase login

# Initialize project (run in project root)
cd /path/to/Moir--Rgb-gif-lab
firebase init

# Select the following services:
# [x] Firestore
# [x] Functions
# [x] Hosting
# [x] Storage
# [x] Emulators
```

**Configuration Options:**
- **Firestore:** Use default rules (will customize later)
- **Functions:** TypeScript, ESLint enabled
- **Hosting:** Public directory = `dist`, Single-page app = Yes
- **Storage:** Use default rules
- **Emulators:** Select all (Auth, Functions, Firestore, Storage)

### 1.2 Link to GCP Project

```bash
# List your GCP projects
gcloud projects list

# Link Firebase to existing GCP project
firebase use --add

# Or create new project
gcloud projects create music-gif-animator-[YOUR-ID]
firebase use music-gif-animator-[YOUR-ID]
```

### 1.3 Enable Required APIs

```bash
# Enable Cloud Functions API
gcloud services enable cloudfunctions.googleapis.com

# Enable Cloud Build API
gcloud services enable cloudbuild.googleapis.com

# Enable Cloud Storage API
gcloud services enable storage.googleapis.com

# Enable Firebase Authentication API
gcloud services enable identitytoolkit.googleapis.com

# Enable Firestore API
gcloud services enable firestore.googleapis.com
```

---

## 🔐 Step 2: Authentication Setup

### 2.1 Enable Auth Providers

```bash
# Open Firebase Console
firebase open auth

# Enable the following sign-in methods:
# - Email/Password
# - Google
# - Apple (optional, requires Apple Developer account)
```

### 2.2 Configure OAuth Providers

**Google OAuth:**
1. Go to Firebase Console → Authentication → Sign-in method
2. Click Google → Enable
3. Add your project's authorized domains:
   - `localhost`
   - `domusgpt.github.io`
   - (Add your custom domain if applicable)

**Apple OAuth (Optional):**
1. Requires Apple Developer account ($99/year)
2. Create Service ID in Apple Developer Console
3. Add redirect URLs
4. Copy Service ID, Team ID, and Key ID to Firebase

### 2.3 Create Auth Service (Frontend)

Create `services/authService.ts`:

```typescript
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';

// Firebase config (from Firebase Console)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export class AuthService {
  // Email/Password sign up
  static async signUpWithEmail(email: string, password: string): Promise<User> {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    return credential.user;
  }

  // Email/Password sign in
  static async signInWithEmail(email: string, password: string): Promise<User> {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  }

  // Google OAuth
  static async signInWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);
    return credential.user;
  }

  // Apple OAuth
  static async signInWithApple(): Promise<User> {
    const provider = new OAuthProvider('apple.com');
    const credential = await signInWithPopup(auth, provider);
    return credential.user;
  }

  // Sign out
  static async signOut(): Promise<void> {
    await signOut(auth);
  }

  // Auth state listener
  static onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  // Get current user
  static getCurrentUser(): User | null {
    return auth.currentUser;
  }
}
```

---

## 💾 Step 3: Firestore Database Setup

### 3.1 Create Database

```bash
# Create Firestore database
gcloud firestore databases create --location=us-central

# Or use Firebase Console
firebase open firestore
```

### 3.2 Define Data Models

**Collections:**

```
/users/{userId}
  - email: string
  - displayName: string
  - photoURL: string
  - plan: 'free' | 'pro' | 'enterprise'
  - createdAt: timestamp
  - usage: {
      framesGenerated: number
      videosExported: number
      storageUsed: number
      lastReset: timestamp
    }

/projects/{projectId}
  - userId: string
  - name: string
  - imageUrl: string
  - audioUrl: string
  - audioMetadata: {
      title: string
      duration: number
      format: string
    }
  - animationOptions: {
      variantId: string
      frameCount: number
      choreographyStyle: string
      musicIntensity: number
      clipDuration: number
    }
  - frames: string[] // Array of frame URLs
  - timeline: object // Generated timeline
  - status: 'draft' | 'processing' | 'complete' | 'failed'
  - createdAt: timestamp
  - updatedAt: timestamp

/analytics/{eventId}
  - userId: string
  - event: string
  - timestamp: timestamp
  - metadata: object
```

### 3.3 Security Rules

Create `firestore.rules`:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated() && isOwner(userId);
      allow write: if isAuthenticated() && isOwner(userId);
    }

    // Projects collection
    match /projects/{projectId} {
      allow read: if isAuthenticated() &&
        (resource.data.userId == request.auth.uid ||
         resource.data.visibility == 'public');

      allow create: if isAuthenticated() &&
        request.resource.data.userId == request.auth.uid;

      allow update, delete: if isAuthenticated() &&
        resource.data.userId == request.auth.uid;
    }

    // Analytics (write-only for clients)
    match /analytics/{eventId} {
      allow write: if isAuthenticated();
    }
  }
}
```

Deploy rules:

```bash
firebase deploy --only firestore:rules
```

### 3.4 Create Firestore Service (Frontend)

Create `services/firestoreService.ts`:

```typescript
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';

const db = getFirestore();

export interface UserData {
  email: string;
  displayName: string;
  plan: 'free' | 'pro';
  usage: {
    framesGenerated: number;
    videosExported: number;
  };
}

export interface ProjectData {
  userId: string;
  name: string;
  imageUrl: string;
  audioUrl?: string;
  status: 'draft' | 'processing' | 'complete';
  createdAt: Date;
  updatedAt: Date;
}

export class FirestoreService {
  // Create or update user
  static async saveUser(userId: string, data: Partial<UserData>): Promise<void> {
    await setDoc(doc(db, 'users', userId), {
      ...data,
      updatedAt: Timestamp.now()
    }, { merge: true });
  }

  // Get user data
  static async getUser(userId: string): Promise<UserData | null> {
    const docSnap = await getDoc(doc(db, 'users', userId));
    return docSnap.exists() ? docSnap.data() as UserData : null;
  }

  // Create project
  static async createProject(projectData: Omit<ProjectData, 'createdAt' | 'updatedAt'>): Promise<string> {
    const projectRef = doc(collection(db, 'projects'));
    await setDoc(projectRef, {
      ...projectData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return projectRef.id;
  }

  // Get user's projects
  static async getUserProjects(userId: string): Promise<ProjectData[]> {
    const q = query(
      collection(db, 'projects'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc'),
      limit(50)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ProjectData));
  }

  // Update project
  static async updateProject(projectId: string, data: Partial<ProjectData>): Promise<void> {
    await updateDoc(doc(db, 'projects', projectId), {
      ...data,
      updatedAt: Timestamp.now()
    });
  }

  // Delete project
  static async deleteProject(projectId: string): Promise<void> {
    await deleteDoc(doc(db, 'projects', projectId));
  }
}
```

---

## 📦 Step 4: Cloud Storage Setup

### 4.1 Configure Storage Buckets

```bash
# Create buckets via gcloud
gsutil mb gs://music-gif-animator-images
gsutil mb gs://music-gif-animator-audio
gsutil mb gs://music-gif-animator-frames
gsutil mb gs://music-gif-animator-exports
```

### 4.2 Storage Security Rules

Create `storage.rules`:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    // User uploads (images, audio)
    match /uploads/{userId}/{allPaths=**} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && isOwner(userId) &&
        request.resource.size < 100 * 1024 * 1024; // 100MB limit
    }

    // Generated frames
    match /frames/{userId}/{allPaths=**} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && isOwner(userId);
    }

    // Exported videos
    match /exports/{userId}/{allPaths=**} {
      allow read: if isAuthenticated() && isOwner(userId);
      allow write: if isAuthenticated() && isOwner(userId);
    }
  }
}
```

Deploy:

```bash
firebase deploy --only storage:rules
```

### 4.3 Storage Service (Frontend)

Create `services/storageService.ts`:

```typescript
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll
} from 'firebase/storage';

const storage = getStorage();

export class StorageService {
  // Upload image
  static async uploadImage(userId: string, file: File): Promise<string> {
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `uploads/${userId}/images/${fileName}`);

    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  // Upload audio
  static async uploadAudio(userId: string, file: File): Promise<string> {
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `uploads/${userId}/audio/${fileName}`);

    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  // Upload generated frames
  static async uploadFrames(userId: string, projectId: string, frames: Blob[]): Promise<string[]> {
    const urls: string[] = [];

    for (let i = 0; i < frames.length; i++) {
      const storageRef = ref(storage, `frames/${userId}/${projectId}/frame_${i}.png`);
      await uploadBytes(storageRef, frames[i]);
      const url = await getDownloadURL(storageRef);
      urls.push(url);
    }

    return urls;
  }

  // Delete project files
  static async deleteProjectFiles(userId: string, projectId: string): Promise<void> {
    const framesRef = ref(storage, `frames/${userId}/${projectId}`);
    const list = await listAll(framesRef);

    await Promise.all(
      list.items.map(item => deleteObject(item))
    );
  }
}
```

---

## ☁️ Step 5: Cloud Functions Setup

### 5.1 Initialize Functions

```bash
cd functions
npm install

# Install additional dependencies
npm install youtube-dl-exec express cors @google-cloud/storage
npm install --save-dev @types/express @types/cors
```

### 5.2 YouTube Audio Extractor Function

Create `functions/src/youtubeExtractor.ts`:

```typescript
import * as functions from 'firebase-functions';
import youtubedl from 'youtube-dl-exec';
import { Storage } from '@google-cloud/storage';

const storage = new Storage();
const BUCKET_NAME = 'music-gif-animator-audio';

export const extractYouTubeAudio = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { youtubeUrl } = data;

  if (!youtubeUrl) {
    throw new functions.https.HttpsError('invalid-argument', 'YouTube URL is required');
  }

  try {
    // Download audio using youtube-dl
    const output = await youtubedl(youtubeUrl, {
      extractAudio: true,
      audioFormat: 'mp3',
      output: '/tmp/%(id)s.%(ext)s'
    });

    // Upload to Cloud Storage
    const fileName = `${context.auth.uid}/${Date.now()}.mp3`;
    await storage.bucket(BUCKET_NAME).upload(output, {
      destination: fileName,
      metadata: {
        contentType: 'audio/mpeg'
      }
    });

    // Get signed URL
    const [url] = await storage
      .bucket(BUCKET_NAME)
      .file(fileName)
      .getSignedUrl({
        action: 'read',
        expires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      });

    return { audioUrl: url };
  } catch (error) {
    console.error('YouTube extraction error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to extract audio from YouTube');
  }
});
```

### 5.3 Usage Tracking Function

Create `functions/src/usageTracking.ts`:

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

export const trackUsage = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { event, metadata } = data;
  const userId = context.auth.uid;

  try {
    // Update user usage statistics
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'User not found');
    }

    const userData = userDoc.data();
    const usage = userData?.usage || {
      framesGenerated: 0,
      videosExported: 0,
      storageUsed: 0,
      lastReset: admin.firestore.Timestamp.now()
    };

    // Update usage based on event
    switch (event) {
      case 'frames_generated':
        usage.framesGenerated += metadata.count || 0;
        break;
      case 'video_exported':
        usage.videosExported += 1;
        usage.storageUsed += metadata.size || 0;
        break;
    }

    // Check if usage exceeds plan limits
    const plan = userData?.plan || 'free';
    const limits = getPlanLimits(plan);

    if (usage.framesGenerated > limits.framesPerMonth) {
      throw new functions.https.HttpsError(
        'resource-exhausted',
        'Monthly frame generation limit exceeded'
      );
    }

    // Save updated usage
    await userRef.update({ usage });

    // Log analytics
    await db.collection('analytics').add({
      userId,
      event,
      metadata,
      timestamp: admin.firestore.Timestamp.now()
    });

    return { success: true, usage };
  } catch (error) {
    console.error('Usage tracking error:', error);
    throw error;
  }
});

function getPlanLimits(plan: string) {
  const limits: Record<string, any> = {
    free: {
      framesPerMonth: 500,
      videosPerMonth: 10,
      maxDuration: 30
    },
    pro: {
      framesPerMonth: 5000,
      videosPerMonth: 100,
      maxDuration: 300
    }
  };

  return limits[plan] || limits.free;
}
```

### 5.4 Deploy Functions

```bash
# Build functions
cd functions
npm run build

# Deploy all functions
firebase deploy --only functions

# Or deploy specific function
firebase deploy --only functions:extractYouTubeAudio
```

---

## 💳 Step 6: Stripe Integration (Optional)

### 6.1 Setup Stripe

```bash
# Install Stripe extension
firebase ext:install stripe/firestore-stripe-payments

# Follow prompts to configure:
# - Stripe API keys (from Stripe Dashboard)
# - Products and prices
# - Webhook configuration
```

### 6.2 Create Pricing Plans

In Stripe Dashboard:

**Free Plan:**
- Price: $0/month
- Features: 500 frames/month, 10 videos, 30s max duration

**Pro Plan:**
- Price: $19/month
- Features: 5000 frames/month, 100 videos, 300s max duration

**Enterprise Plan:**
- Price: Custom
- Features: Unlimited

### 6.3 Add Stripe to Frontend

```typescript
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export class PaymentService {
  static async createCheckoutSession(priceId: string, userId: string) {
    const stripe = await stripePromise;

    // Call Cloud Function to create checkout session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId, userId })
    });

    const session = await response.json();

    // Redirect to Checkout
    await stripe?.redirectToCheckout({ sessionId: session.id });
  }
}
```

---

## 🔧 Step 7: Environment Variables

### 7.1 Create `.env.local`

```env
# Firebase
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# Gemini AI
VITE_GEMINI_API_KEY=your_gemini_api_key

# Stripe (Optional)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 7.2 Add to GitHub Secrets

```bash
# Add secrets to GitHub repository
gh secret set FIREBASE_API_KEY
gh secret set GEMINI_API_KEY
gh secret set STRIPE_PUBLISHABLE_KEY
```

---

## 🧪 Step 8: Testing with Emulators

### 8.1 Start Emulators

```bash
# Start all emulators
firebase emulators:start

# Access Emulator UI at:
# http://localhost:4000
```

### 8.2 Connect Frontend to Emulators

Add to your app initialization:

```typescript
import { connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';
import { connectStorageEmulator } from 'firebase/storage';

if (import.meta.env.DEV) {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199);
}
```

---

## 📊 Step 9: Monitoring & Analytics

### 9.1 Enable Cloud Monitoring

```bash
# Enable Cloud Monitoring API
gcloud services enable monitoring.googleapis.com

# Create log-based metrics
gcloud logging metrics create function_errors \
  --description="Count of function errors" \
  --log-filter='resource.type="cloud_function" AND severity="ERROR"'
```

### 9.2 Set Up Alerts

1. Go to Cloud Console → Monitoring → Alerting
2. Create alert policies for:
   - Function errors
   - High latency
   - Storage quota exceeded
   - Authentication failures

---

## 🚀 Step 10: Deployment

### 10.1 Deploy Everything

```bash
# Deploy all Firebase services
firebase deploy

# This deploys:
# - Firestore rules
# - Storage rules
# - Cloud Functions
# - Hosting (if configured)
```

### 10.2 Verify Deployment

```bash
# Check function URLs
firebase functions:list

# Test function
firebase functions:shell

# View logs
firebase functions:log
```

---

## ✅ Verification Checklist

- [ ] Firebase project created and linked
- [ ] Authentication providers enabled
- [ ] Firestore database created with security rules
- [ ] Cloud Storage buckets created with rules
- [ ] Cloud Functions deployed and tested
- [ ] Environment variables configured
- [ ] Emulators working locally
- [ ] Monitoring and alerts set up
- [ ] Stripe integration (if using paid plans)
- [ ] GitHub Actions updated with secrets

---

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Cloud Functions Guide](https://firebase.google.com/docs/functions)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [YouTube Audio Extraction](https://github.com/yt-dlp/yt-dlp)
- [Stripe Payments](https://stripe.com/docs/payments)

---

## 🛟 Troubleshooting

**Issue:** Functions deployment fails
- **Solution:** Check Node.js version (must be 18 or 20)
- Run `firebase functions:config:get` to check config

**Issue:** CORS errors
- **Solution:** Configure CORS in Cloud Functions
- Add allowed origins to Firebase Hosting config

**Issue:** Storage upload fails
- **Solution:** Check storage rules
- Verify file size limits

**Issue:** Authentication redirect fails
- **Solution:** Add authorized domains in Firebase Console
- Check OAuth redirect URIs

---

**Ready to deploy! 🚀**
