import { Component } from '../../types';
import { createSlice } from '@reduxjs/toolkit';
import { componentsApi } from '../../app/services/components';
import { RootState } from '../../app/store';

interface InitialState {
    components: Component[] | null
}

const initialState: InitialState = {
    components: null
}

const slice = createSlice({
    name: 'components',
    initialState,
    reducers: {
        logout: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(componentsApi.endpoints.getAllComponents.matchFulfilled, (state, action) => {
                state.components = action.payload;
            })
    },
});

export default slice.reducer;

export const selectComponents = (state: RootState) => state.components;