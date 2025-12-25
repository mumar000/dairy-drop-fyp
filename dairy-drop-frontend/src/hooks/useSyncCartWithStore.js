import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCart } from '../features/cart/cartSlice.js';
import { useGetCartQuery } from '../api/cartApi.js';

// Custom hook to sync cart data from API to Redux store
export const useSyncCartWithStore = () => {
  const dispatch = useDispatch();
  const { data: cartData, isLoading, isError } = useGetCartQuery();
  
  // Sync cart data to Redux store when it changes
  useEffect(() => {
    if (cartData && !isLoading && !isError) {
      dispatch(setCart(cartData));
    }
  }, [cartData, isLoading, isError, dispatch]);

  return { cartData, isLoading, isError };
};