import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { baseApi } from '../api/baseApi.js'
import authReducer from '../features/auth/authSlice.js'

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefault) => getDefault().concat(baseApi.middleware),
})

setupListeners(store.dispatch)
