import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  User as FirebaseUser,
  Auth
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  Firestore
} from "firebase/firestore";

// Read environment variables (standard Vite VITE_ prefix)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if all essential keys exist
export const isFirebaseConfigured = !!(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  firebaseConfig.appId
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    // Prompt-based auth configuration can go here if needed
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
}

export { auth, db, googleProvider };

// Auth helper: Sign in with Google
export const loginWithGoogle = async (): Promise<FirebaseUser | null> => {
  if (!isFirebaseConfigured || !auth || !googleProvider) {
    console.warn("Firebase is not configured. Google Sign-In is unavailable in Local Mode.");
    return null;
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google Sign-In error:", error);
    throw error;
  }
};

// Auth helper: Sign out
export const logoutUser = async (): Promise<void> => {
  if (!isFirebaseConfigured || !auth) {
    return;
  }
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Firebase Sign-out error:", error);
    throw error;
  }
};

// Firestore helper: Save user loyalty profile
export const saveLoyaltyProfileToDb = async (uid: string, profileData: any): Promise<void> => {
  if (!isFirebaseConfigured || !db) return;
  try {
    const userDocRef = doc(db, "users", uid);
    await setDoc(userDocRef, {
      ...profileData,
      updatedAt: Date.now()
    }, { merge: true });
  } catch (error) {
    console.error("Error saving loyalty profile to Firestore:", error);
  }
};

// Firestore helper: Get user loyalty profile
export const getLoyaltyProfileFromDb = async (uid: string): Promise<any | null> => {
  if (!isFirebaseConfigured || !db) return null;
  try {
    const userDocRef = doc(db, "users", uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
  } catch (error) {
    console.error("Error fetching loyalty profile from Firestore:", error);
  }
  return null;
};

// Firestore helper: Save table booking
export const saveBookingToDb = async (bookingData: any): Promise<string | null> => {
  if (!isFirebaseConfigured || !db) return null;
  try {
    const colRef = collection(db, "bookings");
    const docRef = await addDoc(colRef, {
      ...bookingData,
      createdAt: Date.now()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving booking to Firestore:", error);
    return null;
  }
};

// Firestore helper: Save order
export const saveOrderToDb = async (orderData: any): Promise<string | null> => {
  if (!isFirebaseConfigured || !db) return null;
  try {
    const colRef = collection(db, "orders");
    const docRef = await addDoc(colRef, {
      ...orderData,
      createdAt: Date.now()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving order to Firestore:", error);
    return null;
  }
};

// Firestore helper: Save feedback
export const saveFeedbackToDb = async (feedbackData: any): Promise<string | null> => {
  if (!isFirebaseConfigured || !db) return null;
  try {
    const colRef = collection(db, "feedbacks");
    const docRef = await addDoc(colRef, {
      ...feedbackData,
      createdAt: Date.now()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving feedback to Firestore:", error);
    return null;
  }
};
