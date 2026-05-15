import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/src/api/firebaseConfig';

export type Driver = {
  id: string;
  name?: string;
  type?: string;
  rate?: string | number;
  active?: boolean;
  avatar?: string;
  avatarUrl?: string;
  photoURL?: string;
  photoUrl?: string;
  image?: string;
  imageUrl?: string;
};

export const getActiveDrivers = async () => {
  const driversQuery = query(collection(db, 'drivers'), where('active', '==', true));
  const snapshot = await getDocs(driversQuery);

  return snapshot.docs.map((driverDoc) => ({
    id: driverDoc.id,
    ...driverDoc.data(),
  })) as Driver[];
};
