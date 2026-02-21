import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-8">Sorry, the page you're looking for doesn't exist.</p>
      <Link to="/" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
        Go Back Home
      </Link>
    </div>
  );
}