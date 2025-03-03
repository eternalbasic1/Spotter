import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTripDetails, createDailyLog } from "../api";

interface DutyStatus {
  status: string;
  start_time: number | "";
  end_time: number | "";
}

interface DailyLog {
  date: string;
  total_miles_driven: number;
  total_mileage: number;
  carrier_name?: string;
  office_address?: string;
  vehicle_details?: string;
  duty_status: DutyStatus[]; // ✅ Array of JSON objects
  remarks?: string;
  tripId: number;
}

const DailyLogForm: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const tripData = await getTripDetails(Number(tripId));

        if (!tripData) {
          setError("No Trip found with this ID.");
          return;
        }

        setDailyLogs(
          Array.from({ length: tripData.num_days }, () => ({
            date: "",
            total_miles_driven: 0,
            total_mileage: 0,
            carrier_name: "",
            office_address: "",
            vehicle_details: "",
            duty_status: [{ status: "offDuty", start_time: "", end_time: "" }], // ✅ Default array
            remarks: "",
            tripId: tripData.tripId,
          }))
        );
      } catch (error) {
        setError("No Trip exists with the given Trip ID.");
      }
    };

    fetchTripData();
  }, [tripId]);

  const handleDailyLogChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDailyLogs((prevLogs) =>
      prevLogs.map((log, i) =>
        i === index
          ? { ...log, [name]: name.includes("total") ? Number(value) : value }
          : log
      )
    );
  };

  const handleDutyStatusChange = (
    logIndex: number,
    dutyIndex: number,
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDailyLogs((prevLogs) =>
      prevLogs.map((log, i) =>
        i === logIndex
          ? {
              ...log,
              duty_status: log.duty_status.map((duty, j) =>
                j === dutyIndex
                  ? {
                      ...duty,
                      [name]: name.includes("time") ? value : Number(value),
                    }
                  : duty
              ),
            }
          : log
      )
    );
  };

  const addDutyStatusEntry = (logIndex: number) => {
    setDailyLogs((prevLogs) =>
      prevLogs.map((log, i) =>
        i === logIndex
          ? {
              ...log,
              duty_status: [
                ...log.duty_status,
                { status: "offDuty", start_time: 0, end_time: 1 },
              ],
            }
          : log
      )
    );
  };

  const removeDutyStatusEntry = (logIndex: number, dutyIndex: number) => {
    setDailyLogs((prevLogs) =>
      prevLogs.map((log, i) =>
        i === logIndex
          ? {
              ...log,
              duty_status: log.duty_status.filter((_, j) => j !== dutyIndex),
            }
          : log
      )
    );
  };

  const submitDailyLogs = async (e: FormEvent) => {
    e.preventDefault();
    try {
      for (const log of dailyLogs) {
        await createDailyLog(log);
      }
      alert("Daily logs submitted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error submitting daily logs:", error);
    }
  };

  if (error) {
    return (
      <div className="w-screen h-screen flex flex-col justify-center items-center bg-white">
        <p className="text-xl font-semibold text-red-600">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-black text-white py-2 px-4 rounded-md font-medium hover:bg-gray-800 transition"
        >
          Go Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-white ">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl w-full mt-150">
        <h2 className="text-2xl font-semibold text-black text-center mb-6 mt-12">
          Enter Daily Logs
        </h2>
        <form onSubmit={submitDailyLogs} className="space-y-5">
          {dailyLogs.map((log, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg p-4 mb-4"
            >
              <h3 className="text-lg font-medium text-black mb-3">
                Day {index + 1}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="date"
                  name="date"
                  onChange={(e) => handleDailyLogChange(index, e)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  name="total_miles_driven"
                  placeholder="Total Miles Driven"
                  onChange={(e) => handleDailyLogChange(index, e)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  name="total_mileage"
                  placeholder="Total Mileage"
                  onChange={(e) => handleDailyLogChange(index, e)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  name="carrier_name"
                  placeholder="Carrier Name"
                  onChange={(e) => handleDailyLogChange(index, e)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  name="office_address"
                  placeholder="Office Address"
                  onChange={(e) => handleDailyLogChange(index, e)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  name="vehicle_details"
                  placeholder="Vehicle Details"
                  onChange={(e) => handleDailyLogChange(index, e)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />

                {/* Duty Status */}
                <div className="col-span-2">
                  <h4 className="text-md font-medium">Duty Status</h4>
                  {log.duty_status.map((duty, dutyIndex) => (
                    <div key={dutyIndex} className="mt-2 border p-3 rounded-md">
                      <select
                        name="status"
                        value={duty.status}
                        onChange={(e) =>
                          handleDutyStatusChange(index, dutyIndex, e)
                        }
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="offDuty">Off Duty</option>
                        <option value="sleeperBerth">Sleeper Berth</option>
                        <option value="driving">Driving</option>
                        <option value="onDuty">On Duty</option>
                      </select>
                      <div className="flex gap-2 mt-2">
                        <input
                          type="number"
                          name="start_time"
                          placeholder="Start Time"
                          min="0"
                          max="24"
                          value={duty.start_time}
                          onChange={(e) =>
                            handleDutyStatusChange(index, dutyIndex, e)
                          }
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                        <input
                          type="number"
                          name="end_time"
                          placeholder="End Time"
                          min="0"
                          max="24"
                          value={duty.end_time}
                          onChange={(e) =>
                            handleDutyStatusChange(index, dutyIndex, e)
                          }
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDutyStatusEntry(index, dutyIndex)}
                        className="text-red-500 mt-2"
                      >
                        Remove Entry
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addDutyStatusEntry(index)}
                    className="text-blue-500 mt-2"
                  >
                    + Add Duty Status
                  </button>
                </div>
                <textarea
                  name="remarks"
                  placeholder="Remarks"
                  onChange={(e) => handleDailyLogChange(index, e)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md"
          >
            Submit Daily Logs
          </button>
        </form>
      </div>
    </div>
  );
};

export default DailyLogForm;
