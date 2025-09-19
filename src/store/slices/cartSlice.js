import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find(x => x.id === item.id);

      if (existItem) {
        state.cartItems = state.cartItems.map(x =>
          x.id === existItem.id ? item : x,
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
    },
    deleteFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(x => x.id !== action.payload);
    },
    updateCartItem: (state, action) => {
      const {id, quantity} = action.payload;
      state.cartItems = state.cartItems.map(item =>
        item.id === id ? {...item, quantity} : item,
      );
    },
  },
});

export const {addToCart, deleteFromCart, updateCartItem} = cartSlice.actions;

export default cartSlice.reducer;
