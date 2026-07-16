import { createSlice } from "@reduxjs/toolkit";

const courseSlice = createSlice({
  name: "course",
  initialState: { activeCourseId: null, status: "idle" },
  reducers: {
    setActiveCourseId: (state, action) => { state.activeCourseId = action.payload; },
    setCourseStatus: (state, action) => { state.status = action.payload; },
    clearCourse: (state) => { state.activeCourseId = null; state.status = "idle"; },
  },
});

export const { setActiveCourseId, setCourseStatus, clearCourse } = courseSlice.actions;
export default courseSlice.reducer;
