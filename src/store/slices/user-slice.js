import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { profile: null, status: "idle" },
  reducers: {
    setProfile: (state, action) => { state.profile = action.payload; },
    setStatus: (state, action) => { state.status = action.payload; },
    clearUser: (state) => { state.profile = null; state.status = "idle"; },
  },
});

export const { setProfile, setStatus, clearUser } = userSlice.actions;
export default userSlice.reducer;
