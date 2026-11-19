import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h2 className="text-3xl font-serif text-[#23180D] mb-3">Page Not Found</h2>
      <p className="text-sm text-[#7A644E] mb-6">
        The card design or page you are looking for does not exist or has moved.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 rounded-full bg-[#14213D] text-white text-sm font-medium hover:bg-[#1E3A8A] transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
