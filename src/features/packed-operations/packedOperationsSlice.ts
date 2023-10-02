import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { PackedOperation } from '../../types';
import { packedOperationsApi } from '../../app/services/packed-operations';

interface InitialState {
    packedOperations: PackedOperation[] | null
}

const initialState: InitialState = {
    packedOperations: null
}

const slice = createSlice({
    name: 'packedOperations',
    initialState,
    reducers: {
        logout: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(packedOperationsApi.endpoints.getAllPackedOperations.matchFulfilled, (state, action) => {
                state.packedOperations = action.payload;
            })
    },
});

export default slice.reducer;

export const selectPackedOperations = (state: RootState) => state.packedOperations;