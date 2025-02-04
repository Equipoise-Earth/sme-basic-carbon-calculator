import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Link href="/welcome">
        <button className="px-6 py-3 bg-teal-600 text-white rounded-lg text-lg hover:bg-teal-700">
          Go to Welcome Page
        </button>
      </Link>
    </div>
  );
}