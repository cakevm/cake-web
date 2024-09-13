import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { getStrategies } from "./strategiesSlice.ts";
import { RootState, useAppDispatch } from "../../app/store.ts";

const Strategies: React.FC = () => {
  const { strategies } = useSelector((state: RootState) => state.strategies);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getStrategies());
  }, []);

  return (
    <>
      {/* Leads List in table format loaded from slice after api call */}
      <div className="w-full overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {strategies.map((_l, k) => {
              return (
                <tr key={k}>
                  <td></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Strategies;
