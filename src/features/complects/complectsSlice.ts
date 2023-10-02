import { Complect } from '../../types';
import { createSlice } from '@reduxjs/toolkit';
import { complectsApi } from '../../app/services/complects';
import { RootState } from '../../app/store';

interface InitialState {
    complects: Complect[] | null
}

const initialState: InitialState = {
    complects: null
}

const slice = createSlice({
    name: 'complects',
    initialState,
    reducers: {
        logout: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(complectsApi.endpoints.getAllComplects.matchFulfilled, (state, action) => {
                state.complects = action.payload;
            })
    },
});

export default slice.reducer;

export const selectComplects = (state: RootState) => state.complects;