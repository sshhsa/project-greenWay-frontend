'use client';

import { useEffect, useState } from 'react';

import { getUserById } from '@/lib/api/getUserById';
import { useAuthStore } from '@/lib/store/authStore';
import type { User } from '@/types/user';

import css from './ProfileInfo.module.css';

type ProfileInfoProps = {
  userId?: string;
};

export default function ProfileInfo({ userId }: ProfileInfoProps) {
  const currentUser = useAuthStore((state) => state.user);
  const [user, setUser] = useState<User | null>(
    userId ? null : currentUser
  );

  useEffect(() => {
    if (!userId) {
      setUser(currentUser);
      return;
    }

    const fetchUser = async () => {
      try {
        const data = await getUserById(userId);
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, [userId, currentUser]);

  if (!user) {
    return null;
  }

  const firstLetter = user.name.charAt(0).toUpperCase();

  return (
    <div className={css.profileWrapper}>
      {user.avatarUrl ? (
        <img
          className={css.avatar}
          src={user.avatarUrl}
          alt={user.name}
        />
      ) : (
        <div className={css.avatar}>
          {firstLetter}
        </div>
      )}

      <div className={css.userInfo}>
        <h2 className={css.name}>{user.name}</h2>
        <p className={css.articles}>
          Статей: {user.articlesAmount}
        </p>
      </div>
    </div>
  );
}
