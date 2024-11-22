import { useRef, useEffect } from "react";
import { throttle } from "lodash";

interface MouseProps {
  setIsVisible: (isVisible: boolean) => void;
}

export const Mouse: React.FC<MouseProps> = ({ setIsVisible }) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseMove = throttle(() => {
    // 清除之前的定时器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 设置新的定时器
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    // 显示元素
    setIsVisible(true);
  }, 100);

  useEffect(() => {
    // 监听鼠标移动事件
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      // 清除事件监听器和定时器
      window.removeEventListener("mousemove", handleMouseMove);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return null;
};
