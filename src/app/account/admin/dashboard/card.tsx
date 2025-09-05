export default function Card({ name, path }: { name: string; path: string }) {
  return (
    <a
      className="w-full h-full p-32 border-2 rounded-2xl text-center text-3xl"
      href={path}
    >
      {name}
    </a>
  );
}
