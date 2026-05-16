import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import styles from './styles';
import type { LoginFormValues } from './types';

type LoginFormProps = {
  control: Control<LoginFormValues>;
  errors: FieldErrors<LoginFormValues>;
  loading: boolean;
  onSubmit: () => void;
};

export default function LoginForm({ control, errors, loading, onSubmit }: LoginFormProps) {
  return (
    <>
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
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={onSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'جاري التحميل...' : 'دخول'}</Text>
      </TouchableOpacity>
    </>
  );
}
