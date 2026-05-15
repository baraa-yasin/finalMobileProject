import { useQuery } from '@tanstack/react-query';
import { getActiveDrivers } from '@/src/services/driverService';

export const driversQueryKey = ['drivers', 'active'];

export const useDrivers = () => {
  return useQuery({
    queryKey: driversQueryKey,
    queryFn: getActiveDrivers,
  });
};
