export const getRemainingMs = (arrivalAt?: string) => {
  if (!arrivalAt) return 0;
  const target = new Date(arrivalAt).getTime();
  if (Number.isNaN(target)) return 0;
  return Math.max(target - Date.now(), 0);
};

export const formatRemainingTime = (remainingMs: number) => {
  if (remainingMs <= 0) return 'وصل';

  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes <= 0) return `${seconds} ث`;
  return `${minutes} د ${seconds.toString().padStart(2, '0')} ث`;
};
