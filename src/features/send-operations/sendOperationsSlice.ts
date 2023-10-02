import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { SendOperation } from '../../types';
import { sendOperationsApi } from '../../app/services/send-operations';

interface InitialState {
    sendOperations: SendOperation[] | null
}

const initialState: InitialState = {
    sendOperations: null
}

const slice = createSlice({
    name: 'sendOperations',
    initialState,
    reducers: {
        logout: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(sendOperationsApi.endpoints.getAllSendOperations.matchFulfilled, (state, action) => {
                state.sendOperations = action.payload;
            })
    },
});

export default slice.reducer;

export const selectSendOperations = (state: RootState) => state.sendOperations;