import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
// استيراد وظيفة تسجيل الدخول من فيربيس
import { signInWithEmailAndPassword } from 'firebase/auth';
// استيراد إعدادات الفيربيس التي أنشأناها في مجلد src
import { auth } from '../src/api/firebaseConfig'; 

const LoginScreen: React.FC = () => {
  const router = useRouter();
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert('تنبيه', 'يرجى تعبئة جميع الحقول');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // بعد النجاح، نتوجه لمجلد التبويبات (الشاشة الرئيسية)
      router.replace('/(tabs)' as any);
    } catch (error: any) {
      Alert.alert('خطأ في الدخول', 'البريد أو كلمة المرور غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>تسجيل الدخول</Text>
        <Text style={styles.subtitle}>مرحباً بك في SwiftShift</Text>

        <View style={styles.inputContainer}>
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
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'جاري التحميل...' : 'دخول'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/register' as any)}>
          <Text style={styles.footerText}>
            ليس لديك حساب؟ <Text style={styles.link}>سجل الآن</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
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

export default LoginScreen;