import { isAxiosError } from 'axios';

export const getErrorMessage = (error: unknown, fallback = 'حدث خطأ غير متوقع') => {
  if (isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  if (typeof error === 'string') {
    return error;
  }

  return fallback;
};
