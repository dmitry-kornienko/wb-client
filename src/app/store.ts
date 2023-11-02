import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import auth from '../features/auth/authSlice';
import components from '../features/components/componentsSlice';
import complects from '../features/complects/complectsSlice';
import buyOperations from '../features/buy-operations/buyOperationsSlice';
import packedOperations from '../features/packed-operations/packedOperationsSlice';
import sendOperations from '../features/send-operations/sendOperationsSlice';
import reports from '../features/reports/reportsSlice';
import calculatedComponents from '../features/calculated-components/calculatedComponentsSlice';
import { api } from './services/api';
import { listenerMiddleware } from '../middleware/auth';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth,
    components,
    complects,
    buyOperations,
    packedOperations,
    sendOperations,
    reports,
    calculatedComponents
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware).prepend(listenerMiddleware.middleware)
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
