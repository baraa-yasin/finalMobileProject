import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../src/api/firebaseConfig'; 

const RegisterScreen: React.FC = () => {
  const router = useRouter();
  
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegister = async () => {
    if (name === '' || email === '' || password === '') {
      Alert.alert('تنبيه', 'يرجى تعبئة جميع الحقول');
      return;
    }

    setLoading(true);
    try {
      // 1. إنشاء الحساب في Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. تخزين بيانات المستخدم الإضافية في Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        createdAt: new Date().toISOString(),
      });

      Alert.alert('نجاح', 'تم إنشاء الحساب بنجاح');
      router.replace('/(tabs)' as any);
    } catch (error: any) {
      Alert.alert('خطأ', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ backgroundColor: '#fff' }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <View style={styles.inner}>
          <Text style={styles.title}>إنشاء حساب</Text>
          <Text style={styles.subtitle}>انضم إلى SwiftShift اليوم</Text>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="الاسم الكامل"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              placeholder="البريد الإلكتروني"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              placeholder="كلمة المرور"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && { opacity: 0.7 }]} 
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'جاري إنشاء الحساب...' : 'تسجيل'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.footerText}>
              لديك حساب بالفعل؟ <Text style={styles.link}>سجل دخولك</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#14450B', textAlign: 'right' },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'right', marginBottom: 40 },
  inputContainer: { gap: 15 },
  input: { 
    backgroundColor: '#F5F5F5', 
    padding: 18, 
    borderRadius: 12, 
    textAlign: 'right',
    fontSize: 16 
  },
  button: { 
    backgroundColor: '#14450B', 
    padding: 18, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 30 
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  footerText: { textAlign: 'center', marginTop: 20, color: '#666' },
  link: { color: '#14450B', fontWeight: 'bold' }
});

export default RegisterScreen;