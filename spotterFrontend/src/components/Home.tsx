import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHealth } from "../api";

const Home: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        await getHealth();
        setLoading(false); // Set loading to false when the health check is successful
      } catch (error) {
        console.error("Error occurred while connecting to the backend:", error);
        setLoading(false); // Also set loading to false in case of error to allow retries or updates
      }
    };

    fetchHealth(); // Call the function
  }, []);

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gray-100">
      {loading ? (
        <div className="flex flex-col items-center">
          <p className="text-xl font-medium text-gray-800">
            Please wait a moment, we're getting things ready for you.
          </p>
          <span className="block mt-2 w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></span>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default Home;
