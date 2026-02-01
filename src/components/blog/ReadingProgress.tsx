import { useEffect, useState } from "react";

interface ReadingProgressProps {
  color?: string;
  height?: number;
}

const ReadingProgress = ({
  color = "hsl(142 76% 36%)",
  height = 3,
}: ReadingProgressProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;
      setProgress(scrollPercent * 100);
    };

    window.addEventListener("scroll", updateProgress);
    updateProgress(); // Initial calculation

    return () => {
      window.removeEventListener("scroll", updateProgress);
    };
  }, []);

  if (progress === 0) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm"
      style={{ height: `${height + 4}px` }}
    >
      <div
        className="h-full transition-all duration-150 ease-out"
        style={{
          width: `${progress}%`,
          backgroundColor: color,
          boxShadow: `0 0 10px ${color}50`,
        }}
      />
    </div>
  );
};

export default ReadingProgress;

