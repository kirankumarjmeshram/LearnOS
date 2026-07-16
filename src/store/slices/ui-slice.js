import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: { sidebarOpen: false, activeModal: null },
  reducers: {
    setSidebarOpen: (state, action) => { state.sidebarOpen = action.payload; },
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen; },
    setActiveModal: (state, action) => { state.activeModal = action.payload; },
  },
});

export const { setSidebarOpen, toggleSidebar, setActiveModal } = uiSlice.actions;
export default uiSlice.reducer;
