import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold text-blue-600">404</h1>

      <p className="text-lg text-slate-600">
        The page you are looking for does not exist.
      </p>

      <Link
        to="/"
        className="mt-2 rounded-xl bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
      >
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
