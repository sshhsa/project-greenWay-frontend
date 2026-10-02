// Власник: Валерій (див. docs/FRONTEND_TASKS.md)
// Мапа розташування локації за координатами з бекенду (OpenStreetMap embed, без залежностей)
// Використання: LocationDetails (після опису), LocationForm (під пошуком місця)

import { buildOsmEmbedUrl, type Coordinates } from './osmEmbedUrl';
import css from './LocationMap.module.css';

type Props = {
  coordinates?: Coordinates | null;
  title?: string;
  className?: string;
};

export default function LocationMap({
  coordinates,
  title = 'Мапа розташування локації',
  className,
}: Props) {
  const src = buildOsmEmbedUrl(coordinates);
  const wrapperClassName = className ? `${css.locationMap} ${className}` : css.locationMap;

  if (!src) {
    return (
      <div className={`${wrapperClassName} ${css.fallback}`} role="note" aria-label={title}>
        <p className={css.fallbackText}>Координати локації недоступні.</p>
      </div>
    );
  }

  return (
    <div className={wrapperClassName}>
      <iframe
        className={css.frame}
        src={src}
        title={title}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
}
