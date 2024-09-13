import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import PoolDetails from "../../features/pools/poolDetails.tsx";

const InternalPage: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Pools" }));
  }, []);

  return <PoolDetails />;
}

export default InternalPage;
