import { COPY } from '@/constants/copy';

interface RatingStarsProps {
  rating: number;
  ariaLabel?: string;
}

// 5-pointed star polygon in 40×40 viewBox, outer r=18 inner r=7.2
const STAR_PATH =
  'M20,2 24.2,14.2 37.1,14.4 26.8,22.2 30.6,34.6 20,27.2 9.4,34.6 13.2,22.2 2.9,14.4 15.8,14.2Z';

export function RatingStars({ rating, ariaLabel }: RatingStarsProps) {
  const filledCount = Math.round(Math.min(Math.max(rating, 0), 5));

  return (
    <div
      style={{ display: 'flex', gap: 4, flexShrink: 0 }}
      aria-label={ariaLabel ?? COPY.ui.starsAriaLabel(filledCount)}
      role="img"
    >
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < filledCount;
        return (
          <svg
            key={i}
            width={40}
            height={40}
            viewBox="0 0 40 40"
            fill={filled ? '#DE9200' : 'none'}
            stroke="#DE9200"
            strokeWidth={filled ? 0 : 1.5}
          >
            <path d={STAR_PATH} />
          </svg>
        );
      })}
    </div>
  );
}
