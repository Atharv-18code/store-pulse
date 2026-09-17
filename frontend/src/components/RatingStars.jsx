import { Star } from "lucide-react";
export default function RatingStars({
  value = 0,
  onChange,
  readonly = false,
  size = 20,
}) {
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          aria-label={`Rate ${star} stars`}
          className={
            readonly
              ? "cursor-default"
              : "cursor-pointer transition-transform hover:scale-110"
          }
        >
          <Star
            style={{ width: size, height: size }}
            className={
              star <= value
                ? "fill-amber-400 text-amber-400"
                : "fill-slate-100 text-slate-200"
            }
          />
        </button>
      ))}
    </div>
  );
}
