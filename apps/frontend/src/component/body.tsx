export function Body({ children }: { children: React.ReactNode }) {
  return (
    <main className="py-10">
      <div className="px-0 sm:px-2">{children}</div>
    </main>
  );
}
