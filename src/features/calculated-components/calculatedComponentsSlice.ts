import { Component } from '../../types';
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type InitialStateType = {
    list: Component[]
}

const initialState: InitialStateType = {
    list: []
} 

const calculatedComponentsSlice = createSlice({
    name: 'calculated-components',
    initialState,
    reducers: {
        addCalculatedComponents(state, action: PayloadAction<Component[]>) {
            state.list = action.payload
        },
        clearFormCalculated(state) {
            state.list = []
        }
    }
});

export const { addCalculatedComponents, clearFormCalculated } = calculatedComponentsSlice.actions;
export default calculatedComponentsSlice.reducer;