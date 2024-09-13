import LineChart from "./components/LineChart";
import BarChart from "./components/BarChart";
import DoughnutChart from "./components/DoughnutChart";
import PieChart from "./components/PieChart";
import ScatterChart from "./components/ScatterChart";
import StackBarChart from "./components/StackBarChart";
import Datepicker from "react-tailwindcss-datepicker";
import { useState } from "react";

function Charts() {
  const [dateValue, setDateValue] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const handleDatePickerValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setDateValue(newValue);
  };

  return (
    <>
      <Datepicker
        containerClassName="w-72"
        value={dateValue}
        theme={"light"}
        inputClassName="input input-bordered w-72"
        popoverDirection={"down"}
        toggleClassName="invisible"
        onChange={handleDatePickerValueChange}
        showShortcuts={true}
        primaryColor={"white"}
      />
      {/** ---------------------- Different charts ------------------------- */}
      <div className="mt-0 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StackBarChart />
        <BarChart />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DoughnutChart />
        <PieChart />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ScatterChart />
        <LineChart />
      </div>
    </>
  );
}

export default Charts;
