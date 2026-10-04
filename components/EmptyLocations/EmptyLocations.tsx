import Link from 'next/link';
import css from './EmptyLocations.module.css';

interface Props {
  title: string;
  link: string;
  linkText: string;
}

export default function EmptyLocations({ title, linkText, link }: Props) {
  return (
    <div className={css.emptyLocations}>
      <h2 className={css.title}>{title}</h2>
      <Link href={link} className={css.link}>{linkText}</Link>
    </div>
  );
}
