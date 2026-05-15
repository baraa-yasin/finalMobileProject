import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Mail, User } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/src/api/firebaseConfig';
import AppHeader from '@/src/components/AppHeader';

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

  const pickImage = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

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

      const uri = result.assets[0].uri;
      setSavingImage(true);
      setPhotoUri(uri);
      await AsyncStorage.setItem(getPhotoStorageKey(user.uid), uri);
      await setDoc(doc(db, 'users', user.uid), { localPhotoUri: uri }, { merge: true });
    } catch (error) {
      console.error('Error picking profile image:', error);
      Alert.alert('خطأ', 'تعذر اختيار الصورة. حاول مرة أخرى.');
    } finally {
      setSavingImage(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <AppHeader />

      <View style={styles.titleBand}>
        <View style={styles.headerText}>
          <Text style={styles.title}>الحساب الشخصي</Text>
          <Text style={styles.subtitle}>بيانات الحساب والصورة</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#145300" />
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.profileCard}>
            <View style={styles.avatarWrap}>
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarFallback}>
                  <User color="#0b3a00" size={46} />
                </View>
              )}
              <TouchableOpacity style={styles.cameraButton} onPress={pickImage} disabled={savingImage}>
                {savingImage ? <ActivityIndicator size="small" color="#fff" /> : <Camera color="#fff" size={20} />}
              </TouchableOpacity>
            </View>

            <Text style={styles.name}>{name}</Text>

            <View style={styles.infoRow}>
              <Mail color="#145300" size={18} />
              <Text style={styles.infoText}>{email || 'لا يوجد بريد إلكتروني'}</Text>
            </View>

            <TouchableOpacity style={styles.changePhotoButton} onPress={pickImage} disabled={savingImage}>
              <Camera color="#fff" size={18} />
              <Text style={styles.changePhotoText}>{savingImage ? 'جاري الحفظ...' : 'اختيار صورة من المعرض'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  titleBand: {
    height: 78,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    elevation: 2,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    elevation: 2,
  },
  headerText: { alignItems: 'flex-end' },
  title: { fontSize: 24, fontWeight: '900', color: '#0b3a00' },
  subtitle: { marginTop: 2, fontSize: 13, color: '#666' },
  content: { flex: 1, padding: 20 },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eef0ef',
    elevation: 2,
  },
  avatarWrap: { width: 132, height: 132, position: 'relative', marginBottom: 18 },
  avatar: { width: 132, height: 132, borderRadius: 66, backgroundColor: '#eef0ef' },
  avatarFallback: {
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: '#eef9ea',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 2,
    left: 2,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#145300',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: { fontSize: 24, fontWeight: '900', color: '#111827', textAlign: 'center', marginBottom: 14 },
  infoRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 18,
  },
  infoText: { color: '#374151', fontSize: 14, fontWeight: '700' },
  changePhotoButton: {
    minHeight: 50,
    borderRadius: 16,
    backgroundColor: '#145300',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    paddingHorizontal: 18,
    width: '100%',
  },
  changePhotoText: { color: '#fff', fontSize: 15, fontWeight: '900' },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
