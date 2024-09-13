import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Charts from "../../features/charts";
import { setPageTitle } from "../../features/common/headerSlice";

const InternalPage: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Analytics" }));
  }, []);

  return <Charts />;
}

export default InternalPage;
