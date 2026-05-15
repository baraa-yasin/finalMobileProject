import React, { useCallback } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { useRegister } from '@/src/hooks/useAuthActions';
import { getErrorMessage } from '@/src/lib/errorHandler';

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
};

const RegisterScreen: React.FC = () => {
  const router = useRouter();
  const registerMutation = useRegister();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const handleRegister = useCallback(
    async (values: RegisterFormValues) => {
      try {
        await registerMutation.mutateAsync(values);
        Alert.alert('نجاح', 'تم إنشاء الحساب بنجاح');
        router.replace('/(tabs)' as any);
      } catch (error) {
        Alert.alert('خطأ', getErrorMessage(error));
      }
    },
    [registerMutation, router]
  );

  const loading = registerMutation.isPending;

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
            <Controller
              control={control}
              name="name"
              rules={{ required: 'الاسم مطلوب', minLength: { value: 2, message: 'الاسم قصير' } }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="الاسم الكامل"
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

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
              rules={{
                required: 'كلمة المرور مطلوبة',
                minLength: { value: 6, message: 'كلمة المرور 6 أحرف على الأقل' },
              }}
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
            onPress={handleSubmit(handleRegister)}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'جاري إنشاء الحساب...' : 'تسجيل'}</Text>
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

export default RegisterScreen;
