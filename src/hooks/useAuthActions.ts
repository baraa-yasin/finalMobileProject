import { useMutation } from '@tanstack/react-query';
import { loginUser, registerUser, type LoginPayload, type RegisterPayload } from '@/src/services/authService';

export const useLogin = () => {
  return useMutation({
    mutationFn: (payload: LoginPayload) => loginUser(payload),
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerUser(payload),
  });
};
