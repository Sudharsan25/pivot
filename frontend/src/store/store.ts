import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import urgesReducer from './urgesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    urges: urgesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

