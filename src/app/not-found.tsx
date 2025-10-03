import Image from "next/image";
import { MoveLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 py-12">
      <Image
        src="/NotFoundImage.svg"
        alt="Page not found illustration"
        height={250}
        width={250}
      />
      <h1 className="text-4xl font-bold tracking-tight text-ce  nter mb-2">
        Ooops! Something went wrong.
      </h1>
      <p className="text-xl text-gray-600 text-center mb-6">
        The page you are looking for does not exist.
      </p>
      <Button asChild>
        <a href="/" className="inline-flex items-center gap-2">
          <MoveLeft className="w-5 h-5" />
          <span>Go back home</span>
        </a>
      </Button>
    </div>
  );
}
