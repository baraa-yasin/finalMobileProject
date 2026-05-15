import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/src/api/firebaseConfig';

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = LoginPayload & {
  name: string;
};

export const loginUser = async ({ email, password }: LoginPayload) => {
  return signInWithEmailAndPassword(auth, email.trim(), password);
};

export const registerUser = async ({ name, email, password }: RegisterPayload) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  const { user } = userCredential;

  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    name: name.trim(),
    email: email.trim(),
    createdAt: new Date().toISOString(),
  });

  return userCredential;
};

export const logoutUser = () => signOut(auth);
