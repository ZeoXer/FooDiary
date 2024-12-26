import { Link } from "@nextui-org/link";
import { button as buttonStyles } from "@nextui-org/theme";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
    <DefaultLayout>
      {/* Main Section */}
      <section className="flex flex-col items-center justify-center gap-6 py-10 md:py-16">
        {/* Logo Section */}
        <div className="flex justify-center">
          <img
            src="/assets/FooDiary.png"
            alt="FooDiary Logo"
            className="w-36 h-36 object-contain"
          />
        </div>

        {/* Title Section */}
        <div className="text-center max-w-xl">
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            歡迎來到 <span className="text-violet-600">FooDiary</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 sm:text-xl">
            開始記錄你的飲食!
          </p>
        </div>

        {/* Buttons Section */}
        <div className="flex gap-4 mt-6">
          <Link
            href="/login"
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "solid",
            })}
          >
            Log In
          </Link>
          <Link
            href="/register"
            className={buttonStyles({
              color: "secondary",
              radius: "full",
              variant: "shadow",
            })}
          >
            Sign Up
          </Link>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-100 py-4">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} FooDiary. All rights reserved.
          </p>
          <div className="flex justify-center gap-4 mt-2">
            <Link
              href="https://github.com/ZeoXer/FooDiary"
              isExternal
              className="text-sm text-gray-600 hover:text-violet-600"
            >
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </DefaultLayout>
  );
}
