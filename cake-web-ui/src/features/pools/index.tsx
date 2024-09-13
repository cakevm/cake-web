import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getPoolsContent } from "./poolsSlice";
import PaginationInput from "../../components/Input/PaginationInput";
import { RootState, useAppDispatch } from "../../app/store.ts";
import SelectBox from "../../components/Input/SelectBox.tsx";
import { useNavigate } from "react-router-dom";

const Pools: React.FC = () => {
  const { pools, totalItems } = useSelector((state: RootState) => state.pools);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [poolProtocol, setPoolProtocol] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    dispatch(getPoolsContent({ page, poolProtocol }));
  };

  useEffect(() => {
    dispatch(getPoolsContent({ page: currentPage, poolProtocol }));
  }, []);

  const poolProtocols: { name: string; value: string }[] = [
    { name: "ALL", value: "" },
    { name: "UNKNOWN", value: "UNKNOWN" },
    { name: "UNISWAP_V2", value: "UNISWAP_V2" },
    { name: "UNISWAP_V2_LIKE", value: "UNISWAP_V2_LIKE" },
    { name: "NOMISWAP_STABLE", value: "NOMISWAP_STABLE" },
    { name: "SUSHISWAP", value: "SUSHISWAP" },
    { name: "SUSHISWAP_V3", value: "SUSHISWAP_V3" },
    { name: "DOOAR_SWAP", value: "DOOAR_SWAP" },
    { name: "SAFESWAP", value: "SAFESWAP" },
    { name: "MINISWAP", value: "MINISWAP" },
    { name: "SHIBASWAP", value: "SHIBASWAP" },
    { name: "UNISWAP_V3", value: "UNISWAP_V3" },
    { name: "UNISWAP_V3_LIKE", value: "UNISWAP_V3_LIKE" },
    { name: "PANCAKE_V3", value: "PANCAKE_V3" },
    { name: "INTEGRAL", value: "INTEGRAL" },
    { name: "MAVERICK", value: "MAVERICK" },
    { name: "CURVE", value: "CURVE" },
    { name: "LIDO_ST_ETH", value: "LIDO_ST_ETH" },
    { name: "LIDO_WST_ETH", value: "LIDO_WST_ETH" },
    { name: "ROCKET_ETH", value: "ROCKET_ETH" },
  ];

  const updatePoolProtocol = ({
                                value,
  }: {
    updateType: string;
    value: string;
  }) => {

    setPoolProtocol(value);
    dispatch(getPoolsContent({ page: currentPage, poolProtocol: value }));
  };

  const handleOnClick = (address: string) => {
    navigate(`/app/pools/${address}`);
  };

  return (
    <>
      <div className="mb-4 flex">
        <div className="w-1/2">
          <SelectBox
              options={poolProtocols}
              labelTitle="Protocol"
              placeholder="Select protocol"
              containerStyle="w-72"
              labelStyle="hidden"
              defaultValue={undefined}
              updateFormValue={updatePoolProtocol}
              updateType={""}          />
        </div>
        <div className="w-1/2 text-right">
          <span className="text-s italic leading-9">
            Total pools: {totalItems}
          </span>
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Address</th>
              <th>Fee</th>
              <th>Class</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pools.map((l, k) => {
              return (
                <tr key={k} onClick={() => handleOnClick(l.address)}>
                  <td>
                    {l.address.slice(0, 6)}...{l.address.slice(-4)}
                  </td>
                    <td>
                      {(parseFloat(BigInt(l.fee).toString()) / 10000).toString()}{" "}
                      %
                    </td>
                    <td>{l.pool_class}</td>
                    <td>
                      <a
                          href={"https://etherscan.io/address/" + l.address}
                          rel="noopener noreferrer"
                          target="_blank"
                      >
                        Etherscan
                      </a>
                    </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <PaginationInput
          totalPages={totalItems}
          currentPage={currentPage}
          onPageChange={handlePageChange}
      />
    </>
  );
};

export default Pools;
