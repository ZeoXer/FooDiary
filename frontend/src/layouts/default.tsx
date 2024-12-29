import { Link } from "@nextui-org/link";

import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow">
        {children}
      </main>
      <footer className="bg-gray-100 py-4">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} FooDiary. All rights reserved.
          </p>
          <div className="flex justify-center gap-4 mt-2">
            <Link
              isExternal
              className="text-sm text-gray-600 hover:text-violet-600"
              href="https://github.com/ZeoXer/FooDiary"
            >
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
