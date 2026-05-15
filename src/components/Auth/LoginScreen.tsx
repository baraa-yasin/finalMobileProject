import React, { useCallback } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { useLogin } from '@/src/hooks/useAuthActions';
import { getErrorMessage } from '@/src/lib/errorHandler';

type LoginFormValues = {
  email: string;
  password: string;
};

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const loginMutation = useLogin();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = useCallback(
    async (values: LoginFormValues) => {
      try {
        await loginMutation.mutateAsync(values);
        router.replace('/(tabs)' as any);
      } catch (error) {
        Alert.alert('خطأ في الدخول', getErrorMessage(error, 'البريد أو كلمة المرور غير صحيحة'));
      }
    },
    [loginMutation, router]
  );

  const loading = loginMutation.isPending;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>تسجيل الدخول</Text>
        <Text style={styles.subtitle}>مرحبا بك في SwiftShift</Text>

        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="email"
            rules={{
              required: 'البريد الإلكتروني مطلوب',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'البريد الإلكتروني غير صحيح' },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="البريد الإلكتروني"
                style={styles.input}
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

          <Controller
            control={control}
            name="password"
            rules={{ required: 'كلمة المرور مطلوبة' }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="كلمة المرور"
                style={styles.input}
                value={value}
                onChangeText={onChange}
                secureTextEntry
              />
            )}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
        </View>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleSubmit(handleLogin)}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'جاري التحميل...' : 'دخول'}</Text>
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
    fontSize: 16,
  },
  button: {
    backgroundColor: '#14450B',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  footerText: { textAlign: 'center', marginTop: 20, color: '#666' },
  link: { color: '#14450B', fontWeight: 'bold' },
  errorText: { color: '#C62828', textAlign: 'right', marginTop: -8 },
});

export default LoginScreen;
