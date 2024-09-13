import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getStrategies = createAsyncThunk("/leads/content", async () => {
  const response = await axios.get("/api/users?page=2", {});
  return response.data;
});

export const strategiesSlice = createSlice({
  name: "strategies",
  initialState: {
    isLoading: false,
    strategies: [],
  },
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(getStrategies.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getStrategies.fulfilled, (state) => {
      state.strategies = []; //action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(getStrategies.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export default strategiesSlice.reducer;
