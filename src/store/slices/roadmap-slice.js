import { createSlice } from "@reduxjs/toolkit";

const roadmapSlice = createSlice({
  name: "roadmap",
  initialState: { activeRoadmapId: null, status: "idle" },
  reducers: {
    setActiveRoadmapId: (state, action) => { state.activeRoadmapId = action.payload; },
    setRoadmapStatus: (state, action) => { state.status = action.payload; },
    clearRoadmap: (state) => { state.activeRoadmapId = null; state.status = "idle"; },
  },
});

export const { setActiveRoadmapId, setRoadmapStatus, clearRoadmap } = roadmapSlice.actions;
export default roadmapSlice.reducer;
