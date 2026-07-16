import { createSlice } from "@reduxjs/toolkit";

import { onboardingDefaults } from "@/schemas/onboarding";

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState: { data: onboardingDefaults, currentStep: 0, isComplete: false },
  reducers: {
    setOnboardingData: (state, action) => { state.data = { ...state.data, ...action.payload }; },
    setOnboardingStep: (state, action) => { state.currentStep = action.payload; },
    completeOnboarding: (state) => { state.isComplete = true; },
    resetOnboarding: (state) => { state.data = onboardingDefaults; state.currentStep = 0; state.isComplete = false; },
  },
});

export const { setOnboardingData, setOnboardingStep, completeOnboarding, resetOnboarding } = onboardingSlice.actions;
export default onboardingSlice.reducer;
