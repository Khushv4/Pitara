import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div
      className="
      min-h-screen
      flex
      flex-col
      justify-center
      items-center
      bg-[#F9F8F6]
    "
    >
      <h1 className="text-8xl font-bold">
        404
      </h1>

      <p className="mt-4 text-gray-600">
        Page not found
      </p>

      <Link
        to="/"
        className="
        mt-8
        bg-[#1A531A]
        text-white
        px-6
        py-3
        rounded-xl
      "
      >
        Back Home
      </Link>
    </div>
  );
}

export default NotFound;