import { useEffect, useState } from "react";

function StatCard({
  title,
  value,
  numericValue,
  prefix = "",
  suffix = "",
  description,
  icon,
}) {
  const [displayValue, setDisplayValue] = useState(
    numericValue ?? value
  );

  useEffect(() => {
    if (numericValue === undefined) {
      setDisplayValue(value);
      return;
    }

    const duration = 900;
    const startTime = performance.now();

    function animate(currentTime) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(
        elapsedTime / duration,
        1
      );

      const easedProgress =
        1 - Math.pow(1 - progress, 3);

      const currentValue =
        numericValue * easedProgress;

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    const animationFrame =
      requestAnimationFrame(animate);

    return () =>
      cancelAnimationFrame(animationFrame);
  }, [numericValue, value]);

  function formatDisplayedValue() {
    if (numericValue === undefined) {
      return value;
    }

    const formattedNumber =
      Number(displayValue).toLocaleString("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });

    return `${prefix}${formattedNumber}${suffix}`;
  }

  return (
    <div
      className="
        rounded-2xl
        border border-gray-200
        bg-white
        p-6
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-1
        hover:shadow-md
        dark:border-gray-800
        dark:bg-gray-900
        dark:shadow-black/20
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {formatDisplayedValue()}
          </p>

          {description && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default StatCard;