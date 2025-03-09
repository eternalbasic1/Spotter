import React, { useState } from "react";
import { generateTripPDF } from "../api";

interface GenerateTripPDFProps {
  tripId: string;
}

const GenerateTripPDF: React.FC<GenerateTripPDFProps> = ({ tripId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setLoading(true);
    setError(null); // Clear error when retrying

    try {
      await generateTripPDF(parseInt(tripId)); // Convert string to number
    } catch (err) {
      console.error("Error generating trip PDF:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Generate Trip PDF</h2>
        <p className="text-gray-600">
          Click the button below to generate and download the trip ZIP file.
        </p>

        <button
          onClick={handleDownload}
          className="mt-4 px-5 py-2 text-white bg-blue-500 rounded-md flex items-center justify-center gap-2 disabled:opacity-50 mx-auto"
          disabled={loading}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Download ZIP"
          )}
        </button>

        {/* Error message below the button */}
        {error && (
          <p className="mt-3 text-red-500 text-sm font-medium">{error}</p>
        )}
      </div>
    </div>
  );
};

export default GenerateTripPDF;
