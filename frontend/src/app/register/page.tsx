'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/Auth';
import { getToken } from '@/lib/auth';

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    if (getToken()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSuccess = () => {
    router.push('/dashboard');
  };

  return <AuthForm onSuccess={handleSuccess} mode="register" />;
}
