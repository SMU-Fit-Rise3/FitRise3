import { configureStore } from '@reduxjs/toolkit';
import modalVisibleReducer from './modalVisible';

const store = configureStore({
  reducer: {
    modalVisible: modalVisibleReducer
  },
});

export default store;