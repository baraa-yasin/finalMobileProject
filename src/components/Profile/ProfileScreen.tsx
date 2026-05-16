import React, { useEffect, useState } from 'react';
import { Alert, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import AppHeader from '@/src/components/AppHeader';
import MovesBottomNavigation from '@/src/components/MovesBottomNavigation';
import { auth, db } from '@/src/api/firebaseConfig';
import { ProfileCard, ProfileHeader, ProfileLoadingState, styles } from './profileComponents';

const getPhotoStorageKey = (uid?: string) => `profile-photo-${uid || 'guest'}`;

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [savingImage, setSavingImage] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        setEmail(user.email || '');

        const cachedPhoto = await AsyncStorage.getItem(getPhotoStorageKey(user.uid));
        if (cachedPhoto) setPhotoUri(cachedPhoto);

        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setName(String(data.name || user.displayName || user.email || 'مستخدم'));
        } else {
          setName(user.displayName || user.email || 'مستخدم');
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        setName(auth.currentUser?.displayName || auth.currentUser?.email || 'مستخدم');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const saveProfileImage = async (uri: string) => {
    const user = auth.currentUser;
    if (!user) return;

    setSavingImage(true);
    setPhotoUri(uri);
    await AsyncStorage.setItem(getPhotoStorageKey(user.uid), uri);
    await setDoc(doc(db, 'users', user.uid), { localPhotoUri: uri }, { merge: true });
  };

  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('تنبيه', 'نحتاج إذن الوصول للمعرض لاختيار الصورة.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled || !result.assets[0]?.uri) return;
      await saveProfileImage(result.assets[0].uri);
    } catch (error) {
      console.error('Error picking profile image:', error);
      Alert.alert('خطأ', 'تعذر اختيار الصورة. حاول مرة أخرى.');
    } finally {
      setSavingImage(false);
    }
  };

  const takePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('تنبيه', 'نحتاج إذن استخدام الكاميرا لالتقاط الصورة.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled || !result.assets[0]?.uri) return;
      await saveProfileImage(result.assets[0].uri);
    } catch (error) {
      console.error('Error taking profile image:', error);
      Alert.alert('خطأ', 'تعذر التقاط الصورة. حاول مرة أخرى.');
    } finally {
      setSavingImage(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <AppHeader />
      <ProfileHeader />

      {loading ? (
        <ProfileLoadingState />
      ) : (
        <ProfileCard
          name={name}
          email={email}
          photoUri={photoUri}
          savingImage={savingImage}
          onPickImage={pickImage}
          onTakePhoto={takePhoto}
        />
      )}

      <MovesBottomNavigation />
    </SafeAreaView>
  );
}
