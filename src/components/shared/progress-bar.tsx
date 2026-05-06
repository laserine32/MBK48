"use client";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const ProgressBar = () => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsLoading(true);
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);
    };
    const handleRouteChangeComplete = () => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    };
    const linkingElements = document.querySelectorAll(".linking");
    linkingElements.forEach((element) => {
      element.addEventListener("click", handleRouteChangeStart);
    });
    handleRouteChangeStart();
    const timeout = setTimeout(handleRouteChangeComplete, 1000);
    return () => {
      linkingElements.forEach((element) => {
        element.removeEventListener("click", handleRouteChangeStart);
      });
      clearTimeout(timeout);
    };
  }, [pathname, searchParams]);

  if (!isLoading) return null;
  return (
    <>
      <div className="fixed top-0 left-0 z-50 h-1 w-full">
        <div className="h-full bg-primary transition-all duration-300 ease-in-out" style={{ width: `${progress}%` }} />
      </div>
    </>
  );
};

export default ProgressBar;
