import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  loading: false,
  error: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload
    },
    addToCart: (state, action) => {
      const item = action.payload
      const existingItem = state.items.find(cartItem => cartItem.product === item.product)
      
      if (existingItem) {
        existingItem.quantity += item.quantity
      } else {
        state.items.push(item)
      }
    },
    updateCartItem: (state, action) => {
      const { productId, quantity } = action.payload
      const item = state.items.find(cartItem => cartItem.product === productId)
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(cartItem => cartItem.product !== productId)
        } else {
          item.quantity = quantity
        }
      }
    },
    removeFromCart: (state, action) => {
      const productId = action.payload
      state.items = state.items.filter(cartItem => cartItem.product !== productId)
    },
    clearCart: (state) => {
      state.items = []
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const { 
  setCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart, 
  setLoading, 
  setError 
} = cartSlice.actions

export default cartSlice.reducer