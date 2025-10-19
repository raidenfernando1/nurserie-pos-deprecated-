export default function Loading() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="h-14 w-14 rounded-full border-4" />
        <div className="absolute inset-0 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
}
