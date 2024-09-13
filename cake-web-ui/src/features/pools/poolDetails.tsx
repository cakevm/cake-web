import React, {useEffect, useState} from "react";
import {pool, PoolDetailsResponse} from "../../client";
import {Link, useParams} from "react-router-dom";


const PoolDetails: React.FC = () => {
    const { address } = useParams<{ address: string }>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [poolData, setPoolData] = useState<PoolDetailsResponse|null>(null);

    useEffect(() => {
        const fetchPoolData = async () => {
            try {
                const data = await pool({ address: address as string });
                setPoolData(data);
            } catch (err) {
                setError("Failed to fetch pool data");
            } finally {
                setLoading(false);
            }
        };

        if (address) {
            fetchPoolData();
        }
    }, [address]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <Link to="/app/pools">Back to Pools</Link>
            <br />
            <br />
            <h1>Pool Details</h1>
            {poolData ? (

                    <table className="table w-full">
                        <thead>
                        <tr>
                            <th>
                                Key
                            </th>
                            <th>
                                Value
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Address</td>
                            <td>{poolData.address}</td>
                        </tr>
                        <tr>
                            <td>Protocol</td>
                            <td>{poolData.protocol}</td>
                        </tr>
                        <tr>
                            <td>Symbol</td>
                            <td>{poolData.pool_class}</td>
                        </tr>
                        <tr>
                            <td>Fee</td>
                            <td>{poolData.fee}</td>
                        </tr>
                        </tbody>
                    </table>
            ) : (
                <div>No data available</div>
            )}
        </div>
    );
};

export default PoolDetails;