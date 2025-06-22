import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 mt-12 py-4 text-center text-sm text-gray-500">
      <p className="mb-1">© 2025 PrepMyWeek™ – Created by Benjamin Farthing</p>
      <div className="flex justify-center gap-4">
        <a
          href="https://www.linkedin.com/in/benjamin-farthing-397a3064"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-500 transition-colors"
        >
          LinkedIn
        </a>
        <a
          href="https://github.com/bfarth20"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-500 transition-colors"
        >
          GitHub
        </a>
        <Link href="/about" className="hover:text-blue-500 transition-colors">
          Meet the Designer
        </Link>
      </div>
    </footer>
  );
}
