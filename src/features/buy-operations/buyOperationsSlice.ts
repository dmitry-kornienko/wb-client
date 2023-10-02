import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { BuyOperation } from '../../types';
import { buyOperationsApi } from '../../app/services/buy-operations';

interface InitialState {
    buyOperations: BuyOperation[] | null
}

const initialState: InitialState = {
    buyOperations: null
}

const slice = createSlice({
    name: 'buyOperations',
    initialState,
    reducers: {
        logout: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(buyOperationsApi.endpoints.getAllBuyOperations.matchFulfilled, (state, action) => {
                state.buyOperations = action.payload;
            })
    },
});

export default slice.reducer;

export const selectBuyOperations = (state: RootState) => state.buyOperations;