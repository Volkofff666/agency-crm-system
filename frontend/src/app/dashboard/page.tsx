'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold">ЗАГРУЗКА...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="brutal-box p-4 mb-8">
        <div className="container flex justify-between items-center">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--brutal-accent)' }}>
            NOCTO CRM
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-bold">{user?.full_name}</p>
              <p className="text-sm text-gray-400">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="brutal-button"
            >
              ВЫЙТИ
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Клиенты */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold mb-2">КЛИЕНТЫ</h2>
            <p className="text-4xl font-bold" style={{ color: 'var(--brutal-accent)' }}>0</p>
            <p className="text-sm text-gray-400 mt-2">Всего клиентов</p>
          </div>

          {/* Проекты */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold mb-2">ПРОЕКТЫ</h2>
            <p className="text-4xl font-bold" style={{ color: 'var(--brutal-accent)' }}>0</p>
            <p className="text-sm text-gray-400 mt-2">Активных проектов</p>
          </div>

          {/* Задачи */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold mb-2">ЗАДАЧИ</h2>
            <p className="text-4xl font-bold" style={{ color: 'var(--brutal-accent)' }}>0</p>
            <p className="text-sm text-gray-400 mt-2">Открытых задач</p>
          </div>
        </div>

        {/* Быстрые действия */}
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold mb-4">БЫСТРЫЕ ДЕЙСТВИЯ</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="brutal-button">НОВЫЙ КЛИЕНТ</button>
            <button className="brutal-button">НОВЫЙ ПРОЕКТ</button>
            <button className="brutal-button">НОВАЯ ЗАДАЧА</button>
            <button className="brutal-button">НОВОЕ КП</button>
          </div>
        </div>
      </main>
    </div>
  );
}
