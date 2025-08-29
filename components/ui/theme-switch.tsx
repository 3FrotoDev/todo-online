"use client";

import { Button } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { Skeleton } from "@heroui/skeleton";
import { Icon } from "@iconify/react";

type props = {
  className?: string;
};

export const AnimatedThemeToggler = ({ className }: props) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isThemeReady, setIsThemeReady] = useState(false);

  useEffect(() => {
    if (resolvedTheme) {
      setIsThemeReady(true);
    }
  }, [resolvedTheme]);

  useEffect(() => {
    if (theme) {
      setIsDarkMode(theme === "dark");
    }
  }, [theme]);

  const changeTheme = async () => {
    if (!buttonRef.current || isTransitioning) return;

    try {
      setIsTransitioning(true);

      const { top, left, width, height } = buttonRef.current.getBoundingClientRect();
      const y = top + height / 2;
      const x = left + width / 2;

      const right = window.innerWidth - left;
      const bottom = window.innerHeight - top;
      const maxRad = Math.hypot(Math.max(left, right), Math.max(top, bottom));

      if (document.startViewTransition) {
        try {
          await document.startViewTransition(() => {
            setTheme(theme === "light" ? "dark" : "light");
          }).ready;

          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${maxRad * 0.8}px at ${x}px ${y}px)`,
                `circle(${maxRad}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 1200,
              easing: "cubic-bezier(0.4, 0, 0.2, 1)",
              pseudoElement: "::view-transition-new(root)",
            },
          );

          document.body.animate(
            {
              transform: [
                "scale(1)",
                "scale(1.02)",
                "scale(1)",
              ],
            },
            {
              duration: 1200,
              easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            },
          );

          document.body.style.overflowX = "hidden";
          document.documentElement.style.overflowX = "hidden";
        } catch (error) {
          setTheme(theme === "light" ? "dark" : "light");
        }
      } else {
        setTheme(theme === "light" ? "dark" : "light");
      }

      setTimeout(() => {
        setIsTransitioning(false);
        document.body.style.overflowX = "";
        document.documentElement.style.overflowX = "";
      }, 1300);

    } catch (error) {
      console.error("Theme transition failed:", error);
      setIsTransitioning(false);
      setTheme(theme === "light" ? "dark" : "light");
    }
  };

  if (!isThemeReady) {
    return (
      <Skeleton className={`rounded-lg ${className}`}>
        <div className="w-10 h-10 bg-default-300 rounded-lg" />
      </Skeleton>
    );
  }

  return (
    <Button
      ref={buttonRef}
      isIconOnly
      variant="light"
      className={className}
      onPress={changeTheme}
      disabled={isTransitioning}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="flex items-center justify-center"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDarkMode ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
                duration: 0.3
              }}
            >
              <Icon icon="moon" name="moon" width={22} />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
                duration: 0.3
              }}
            >
              <Icon icon="sun" name="moon" width={22} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Button>
  );
};
