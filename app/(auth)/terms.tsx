import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function terms() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/terms');
  }, []);

  return null;
}