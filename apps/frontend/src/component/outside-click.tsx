import { useEffect, useRef } from 'react';

export const OutsideClick = ({
  children,
  onOutsideClick,
}: {
  children: React.ReactNode;
  onOutsideClick: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const handleClick = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      onOutsideClick();
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);
  return <div ref={ref}>{children}</div>;
};
