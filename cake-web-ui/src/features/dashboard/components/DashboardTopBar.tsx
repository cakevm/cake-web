import ArrowDownTrayIcon from "@heroicons/react/24/outline/ArrowDownTrayIcon";
import ShareIcon from "@heroicons/react/24/outline/ShareIcon";
import EnvelopeIcon from "@heroicons/react/24/outline/EnvelopeIcon";
import EllipsisVerticalIcon from "@heroicons/react/24/outline/EllipsisVerticalIcon";
import ArrowPathIcon from "@heroicons/react/24/outline/ArrowPathIcon";
import { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";


function DashboardTopBar({ updateDashboardPeriod }) {
  const [dateValue, setDateValue] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const handleDatePickerValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setDateValue(newValue);
    updateDashboardPeriod(newValue);
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="">
        <Datepicker
          containerClassName="w-72 "
          value={dateValue}
          inputClassName="input input-bordered w-72"
          popoverDirection={"down"}
          toggleClassName="invisible"
          onChange={handleDatePickerValueChange}
          showShortcuts={true}
          primaryColor={"blue"}
        />
        {/* <SelectBox 
                options={periodOptions}
                labelTitle="Period"
                placeholder="Select date range"
                containerStyle="w-72"
                labelStyle="hidden"
                defaultValue="TODAY"
                updateFormValue={updateSelectBoxValue}
            /> */}
      </div>
      <div className="text-right">
        <button className="btn btn-ghost btn-sm normal-case">
          <ArrowPathIcon className="mr-2 w-4" />
          Refresh Data
        </button>
        <button className="btn btn-ghost btn-sm ml-2 normal-case">
          <ShareIcon className="mr-2 w-4" />
          Share
        </button>

        <div className="dropdown dropdown-end dropdown-bottom ml-2">
          <label
            tabIndex={0}
            className="btn btn-square btn-ghost btn-sm normal-case"
          >
            <EllipsisVerticalIcon className="w-5" />
          </label>
          <ul
            tabIndex={0}
            className="menu-compact menu dropdown-content w-52 rounded-box bg-base-100 p-2 shadow"
          >
            <li>
              <a>
                <EnvelopeIcon className="w-4" />
                Email Digests
              </a>
            </li>
            <li>
              <a>
                <ArrowDownTrayIcon className="w-4" />
                Download
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DashboardTopBar;
