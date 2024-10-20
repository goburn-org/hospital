import { ReactNode, useState } from 'react';
import { classNames } from '../utils/classNames';
export type ButtonOnClickEvent = React.MouseEvent<
  HTMLButtonElement,
  MouseEvent
>;

export const LoadingButton = ({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  className: string;
  onClick: (e: ButtonOnClickEvent) => Promise<unknown>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <button
      type="button"
      onClick={(e) => {
        setIsLoading(true);
        onClick(e).finally(() => {
          setIsLoading(false);
        });
      }}
      className={classNames(
        className,
        isLoading ? 'cursor-wait opacity-50' : '',
      )}
    >
      {children}
    </button>
  );
};
