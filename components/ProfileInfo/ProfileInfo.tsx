'use client';

import { useEffect, useState } from 'react';

import { getUserById } from '@/lib/api/getUserById';
import { useAuthStore } from '@/lib/store/authStore';
import type { User } from '@/types/user';
import { AnimatePresence } from 'motion/react';
import EditProfileModal from '@/components/EditProfileModal/EditProfileModal';
import Image from 'next/image';

import css from './ProfileInfo.module.css';

type ProfileInfoProps = {
  userId?: string;
};

export default function ProfileInfo({ userId }: ProfileInfoProps) {
  const currentUser = useAuthStore((state) => state.user);
  const [user, setUser] = useState<User | null>(userId ? null : currentUser);

  const isOwnProfile = !userId;
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    if (!userId) {
      setUser(currentUser);
      return;
    }

    const fetchUser = async () => {
      try {
        const data = await getUserById(userId);
        setUser(data);
      } catch {
        setUser(null);
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
        <Image
          className={css.avatar}
          src={user.avatarUrl}
          alt={user.name}
          width={145}
          height={145}
        />
      ) : (
        <div className={`${css.avatar} ${css.avatarFallback}`} aria-hidden="true">
          {firstLetter}
        </div>
      )}

      <div className={css.userInfo}>
        <h2 className={css.name}>{user.name}</h2>
        <p className={css.articles}>Статей: {user.articlesAmount}</p>
        {isOwnProfile && (
          <button
            type="button"
            className={css.editButton}
            onClick={() => setIsEditOpen(true)}
          >
            Редагувати профіль
          </button>
        )}
      </div>
      <AnimatePresence>
        {isEditOpen && (
          <EditProfileModal user={user} onClose={() => setIsEditOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
