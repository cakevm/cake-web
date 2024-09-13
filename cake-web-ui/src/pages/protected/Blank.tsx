import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";

import DocumentIcon from "@heroicons/react/24/solid/DocumentIcon";

const InternalPage: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Page Title" }));
  }, []);

  return (
    <div className="hero h-4/5 bg-base-200">
      <div className="hero-content text-center text-accent">
        <div className="max-w-md">
          <DocumentIcon className="inline-block size-48" />
          <h1 className="mt-2 text-5xl font-bold">Blank Page</h1>
        </div>
      </div>
    </div>
  );
}

export default InternalPage;
