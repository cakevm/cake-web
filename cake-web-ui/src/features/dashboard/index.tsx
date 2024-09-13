import DashboardStats from "./components/DashboardStats";
import { ArrowUpCircleIcon } from "@heroicons/react/16/solid";
import React from "react";

const Dashboard: React.FC = () => {

  return (
    <>
      <div className="mt-2 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStats
          title="Block number"
          icon={<ArrowUpCircleIcon className="size-8" />}
          value="TODO"
          description="-1 seconds ago"
          colorIndex={0}
        />
      </div>
    </>
  );
}

export default Dashboard;
