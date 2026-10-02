'use client';

import css from './ProfileInfo.module.css';

export default function ProfileInfo() {
const user = {
name: "Назар Ткаченко",
avatarUrl: "/avatar.png",
articlesAmount: 6,
};

return (
<div className={css.profileWrapper}>
<img
className={css.avatar}
src={user.avatarUrl}
alt={user.name}
/>
<div className={css.userInfo}>
<h2 className={css.name}>{user.name}</h2>
<p className={css.articles}>Статей: {user.articlesAmount}</p>
</div>
</div>
);
}