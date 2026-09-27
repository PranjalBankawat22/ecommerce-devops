type StarRatingProps = {
  rating: number;
  maxStars?: number;
};

export function StarRating({ rating, maxStars = 5 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of ${maxStars}`} role="img">
      {Array.from({ length: maxStars }, (_, i) => {
        const filled = i + 1 <= Math.floor(rating);
        const partial = !filled && i < rating;
        return (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            className="w-3.5 h-3.5"
            aria-hidden="true"
          >
            {partial ? (
              <defs>
                <linearGradient id={`half-${i}`}>
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="50%" stopColor="#D1D5DB" />
                </linearGradient>
              </defs>
            ) : null}
            <path
              fill={filled ? "#F59E0B" : partial ? `url(#half-${i})` : "#D1D5DB"}
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z"
            />
          </svg>
        );
      })}
    </div>
  );
}
