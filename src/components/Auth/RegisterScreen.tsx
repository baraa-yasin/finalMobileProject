import React, { useCallback } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { useRegister } from '@/src/hooks/useAuthActions';
import { getErrorMessage } from '@/src/lib/errorHandler';
import {
  RegisterFooter,
  RegisterForm,
  RegisterFormValues,
  RegisterHeader,
  styles,
} from './registerComponents';

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
        router.replace('/home' as any);
      } catch (error) {
        Alert.alert('خطأ', getErrorMessage(error));
      }
    },
    [registerMutation, router]
  );

  const loading = registerMutation.isPending;

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scroll}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.inner}>
          <RegisterHeader />
          <RegisterForm
            control={control}
            errors={errors}
            loading={loading}
            onSubmit={handleSubmit(handleRegister)}
          />
          <RegisterFooter onLoginPress={() => router.back()} />
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default RegisterScreen;
