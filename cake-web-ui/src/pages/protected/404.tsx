import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import FaceFrownIcon from "@heroicons/react/24/solid/FaceFrownIcon";

const InternalPage: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "" }));
  }, []);

  return (
    <div className="hero h-4/5 bg-base-200">
      <div className="hero-content text-center text-accent">
        <div className="max-w-md">
          <FaceFrownIcon className="inline-block size-48" />
          <h1 className="text-5xl font-bold">404 - Not Found</h1>
        </div>
      </div>
    </div>
  );
}

export default InternalPage;
