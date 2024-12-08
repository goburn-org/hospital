import { classNames } from '../utils/classNames';

export function Body({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={classNames(className ? className : 'py-10')}>
      <div className="px-0 sm:px-2">{children}</div>
    </main>
  );
}
