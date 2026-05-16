import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import styles from './styles';
import type { RegisterFormValues } from './types';

type RegisterFormProps = {
  control: Control<RegisterFormValues>;
  errors: FieldErrors<RegisterFormValues>;
  loading: boolean;
  onSubmit: () => void;
};

export default function RegisterForm({ control, errors, loading, onSubmit }: RegisterFormProps) {
  return (
    <>
      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name="name"
          rules={{ required: 'الاسم مطلوب', minLength: { value: 2, message: 'الاسم قصير' } }}
          render={({ field: { onChange, value } }) => (
            <TextInput placeholder="الاسم الكامل" style={styles.input} value={value} onChangeText={onChange} />
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
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={onSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'جاري إنشاء الحساب...' : 'تسجيل'}</Text>
      </TouchableOpacity>
    </>
  );
}
