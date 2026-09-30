import Image from 'next/image';

import type { User } from '@/types/user';

import css from './UserBar.module.css';

type Props = {
  user: User;
  onLogout: () => void;
  onEditProfile: () => void;
};

export default function UserBar({ user, onLogout, onEditProfile }: Props) {
  return (
    <div className={css.userBar}>
      {/* Аватар + ім'я — кнопка редагування профілю (додаткове завдання, Маркіян) */}
      <button className={css.profileButton} type="button" onClick={onEditProfile} title="Редагувати профіль">
        {user.avatarUrl ? (
          <Image className={css.avatar} src={user.avatarUrl} alt="" width={40} height={40} />
        ) : (
          <span className={css.avatarFallback} aria-hidden="true">{user.name.charAt(0).toUpperCase()}</span>
        )}
        <span className={css.name}>{user.name}</span>
        <span className="visually-hidden">— редагувати профіль</span>
      </button>
      <button className={css.logoutButton} type="button" onClick={onLogout} aria-label="Вийти з облікового запису" title="Вийти">
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" />
          <path d="m16 17 5-5-5-5M21 12H9" />
        </svg>
      </button>
    </div>
  );
}
