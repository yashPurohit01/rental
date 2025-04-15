import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import formSlice from './formSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  form: persistReducer(persistConfig, formSlice),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
