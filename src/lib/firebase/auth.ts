// Firebase Auth helper functions for parent authentication.
// All auth operations go through these helpers — never call Firebase Auth directly from components.

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  UserCredential,
} from 'firebase/auth';
import { auth } from './config';

/** Signs in an existing parent account with email and password. */
export async function signIn(email: string, password: string): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

/** Creates a new parent account with email and password. */
export async function signUp(email: string, password: string): Promise<UserCredential> {
  return createUserWithEmailAndPassword(auth, email, password);
}

/** Signs out the currently authenticated parent. */
export async function signOut(): Promise<void> {
  return firebaseSignOut(auth);
}

/** Subscribes to auth state changes and calls the callback with the current user.
 *  Returns an unsubscribe function — always call it in useEffect cleanup to prevent memory leaks. */
export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}
