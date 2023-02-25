import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit';


export interface Suggestion {
    tag: string,
    relevance: number
}

export interface State {
    suggestions: Suggestion[]
}

const initialState: State = {
    suggestions: []
}


const storeSlice = createSlice({
  name: 'store',
  initialState: initialState,
  reducers: {
    replaceSuggestions: (state: State, action: PayloadAction<Suggestion[]>) => {
      state.suggestions = [...action.payload];
    },
  },
})


export const { replaceSuggestions } = storeSlice.actions;
storeSlice.reducer;


export default configureStore({
    reducer: {
      store: storeSlice.reducer,
    },
})