import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-900">Trip Logger</h1>
        <p className="mt-3 text-gray-600">
          Effortlessly track and log your amazing journeys.
        </p>
        <Link to="/trip">
          <button className="mt-6 px-6 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
