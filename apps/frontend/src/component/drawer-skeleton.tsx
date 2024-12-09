export const DrawerSkeleton = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: React.ReactNode;
}) => {
  return (
    <div className="w-[800px]">
      <div className="flex items-center justify-between">{title}</div>
      <div className="max-h-[90vh]">{children}</div>
    </div>
  );
};
