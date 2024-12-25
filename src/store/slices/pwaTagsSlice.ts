import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@store/store";

interface MyPwas {
  pwaTags: string[];
  activeTags: string[];
}

const initialState: MyPwas = {
  pwaTags: [],
  activeTags: [],
};

export const pwaTagsSlice = createSlice({
  name: "pwaTags",
  initialState,
  reducers: {
    setPwaTags: (state, action: PayloadAction<string[]>) => {
      const uniqueTags = Array.from(new Set(action.payload));
      state.pwaTags = uniqueTags;
    },
    setActiveTags: (state, action: PayloadAction<string[]>) => {
      state.activeTags = action.payload;
    },
    addActiveTag: (state, action: PayloadAction<string>) => {
      state.activeTags.push(action.payload);
    },
    removeActiveTag: (state, action: PayloadAction<string>) => {
      state.activeTags = state.activeTags.filter(
        (tag) => tag !== action.payload
      );
    },
    clearActiveTags: (state) => {
      state.activeTags = [];
    },
  },
});

export const {
  setPwaTags,
  setActiveTags,
  addActiveTag,
  removeActiveTag,
  clearActiveTags,
} = pwaTagsSlice.actions;

export const getActiveTags = (state: RootState) => state.pwaTags.activeTags;
export const getPwaTags = (state: RootState) => state.pwaTags.pwaTags;

export default pwaTagsSlice.reducer;
