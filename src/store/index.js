import { configureStore } from "@reduxjs/toolkit";

import courseReducer from "@/store/slices/course-slice";
import onboardingReducer from "@/store/slices/onboarding-slice";
import roadmapReducer from "@/store/slices/roadmap-slice";
import uiReducer from "@/store/slices/ui-slice";
import userReducer from "@/store/slices/user-slice";

export const store = configureStore({
  reducer: { user: userReducer, roadmap: roadmapReducer, course: courseReducer, onboarding: onboardingReducer, ui: uiReducer },
  devTools: process.env.NODE_ENV !== "production",
});
