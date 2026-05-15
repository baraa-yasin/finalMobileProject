import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { AuthProvider } from '@/src/context/AuthContext';
import { queryClient } from '@/src/lib/queryClient';

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
};
