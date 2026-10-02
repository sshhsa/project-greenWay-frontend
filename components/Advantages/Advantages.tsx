// Власник: Анастасія

import css from './Advantages.module.css';

const advantages = [
  {
    title: 'Реальні відгуки',
    description:
      'Користувачі діляться чесними враженнями, щоб ви робили правильний вибір.',
    icon: 'icon-checkbox',
  },
  {
    title: 'Зручні фільтри',
    description:
      'Шукайте за типом локації, регіоном, наявністю зручностей та іншими критеріями.',
    icon: 'icon-filter',
  },
  {
    title: 'Спільнота мандрівників',
    description:
      'Додавайте власні улюблені місця та діліться своїми неймовірними знахідками.',
    icon: 'icon-feedback',
  },
];

export default function Advantages() {
  return (
    <section className={css.advantages}>
      <div className={css.container}>
        <h2 className={css.title}>Ключові переваги</h2>

        <ul className={css.list}>
          {advantages.map(({ title, description, icon }) => (
            <li className={css.item} key={title}>
              <svg className={css.icon} aria-hidden="true">
                <use href={`/sprite.svg#${icon}`} />
              </svg>

              <h3 className={css.itemTitle}>{title}</h3>

              <p className={css.description}>{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}