import { Report } from '../../types';
import { createSlice } from '@reduxjs/toolkit';
import { reportsApi } from '../../app/services/reports';
import { RootState } from '../../app/store';

interface InitialState {
    reports: Report[] | null
}

const initialState: InitialState = {
    reports: null
}

const slice = createSlice({
    name: 'reports',
    initialState,
    reducers: {
        logout: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(reportsApi.endpoints.getAllReports.matchFulfilled, (state, action) => {
                state.reports = action.payload;
            })
    },
});

export default slice.reducer;

export const selectComponents = (state: RootState) => state.reports;