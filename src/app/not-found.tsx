import "./globals.css";

export default function NotFound() {
  return (
    <div className="h-full flex flex-col justify-center items-center px-10">
      <h1 className="text-8xl tracking-wide p-5">nurserie.</h1>
      <h2>404 - Not Found</h2>
      <p>The page you are looking for does not exist</p>
      <a href="/" className="flex gap-2 items-center py-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
          />
        </svg>
        Go back home
      </a>
    </div>
  );
}
