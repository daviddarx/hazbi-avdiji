import { createSlice } from '@reduxjs/toolkit';

export interface uiStateType {
  ui: {
    scrollToTopOnPageChange: boolean;
    changeCurrentColorsId: number;
    hiddenTopBar: boolean;
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
    hiddenTopBar: false,
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
    setHiddenTopBar: (state, action) => {
      state.hiddenTopBar = action.payload;
    },
    changeCurrentColors: (state, action) => {
      state.changeCurrentColorsId = action.payload;
    },
  },
});

export default uiSlice;
