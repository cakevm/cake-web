import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Pool, PoolProtocol, pools, PoolsData } from "../../client";

export const getPoolsContent = createAsyncThunk(
  "pools/fetchByPage",
  async (
    { page, poolProtocol }: { page: number; poolProtocol: string },
    { rejectWithValue },
  ) => {
    return pools({
      page: page,
      limit: 20,
      protocol: poolProtocol === "" ? undefined: poolProtocol as PoolProtocol,
    } as PoolsData).catch((err) => rejectWithValue(err));
  },
);

export const poolsSlice = createSlice({
  name: "pools",
  initialState: {
    isLoading: false,
    totalItems: 0,
    pools: Array<Pool>(),
  },
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(getPoolsContent.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getPoolsContent.fulfilled, (state, action) => {
      state.pools = action.payload.pools;
      state.totalItems = action.payload.total;
      state.isLoading = false;
    });
    builder.addCase(getPoolsContent.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export default poolsSlice.reducer;
