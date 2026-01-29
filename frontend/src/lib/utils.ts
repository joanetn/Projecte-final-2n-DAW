import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { QueryClient } from '@tanstack/react-query';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  },
});
export const setCurrentUser = (user: any) => {
  queryClient.setQueryData(['currentUser'], user);
}
export const getCurrentUser = () => {
  return queryClient.getQueryData(['currentUser']);
}
export const clearCurrentUser = () => {
  queryClient.removeQueries({ queryKey: ['currentUser'] });
}
