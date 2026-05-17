import React, { useCallback } from 'react';
import { Alert, KeyboardAvoidingView, Platform, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { useLogin } from '@/src/hooks/useAuthActions';
import { getErrorMessage } from '@/src/lib/errorHandler';
import {LoginFooter, LoginForm, LoginFormValues, LoginHeader, styles,} from './loginComponents';

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
        router.replace('/home' as any);
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
        <LoginHeader />
        <LoginForm
          control={control}
          errors={errors}
          loading={loading}
          onSubmit={handleSubmit(handleLogin)}
        />
        <LoginFooter onRegisterPress={() => router.push('/register' as any)} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
