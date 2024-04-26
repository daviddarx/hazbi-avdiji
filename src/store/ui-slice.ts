import { createSlice } from '@reduxjs/toolkit';

export interface uiStateType {
  ui: {
    scrollToTopOnPageChange: boolean;
    changeCurrentColorsId: number;
    system: {
      os: string | undefined;
      browser: string | undefined;
    };
  };
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    scrollToTopOnPageChange: true,
    changeCurrentColorsId: 0,
    system: {
      os: undefined,
      browser: undefined,
    },
  },
  reducers: {
    setSystem: (state, action) => {
      state.system = action.payload;
    },
    setScrollToTopOnPageChange: (state, action) => {
      state.scrollToTopOnPageChange = action.payload;
    },
    changeCurrentColors: (state, action) => {
      state.changeCurrentColorsId = action.payload;
    },
  },
});

export default uiSlice;
