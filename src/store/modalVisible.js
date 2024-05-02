import { createSlice } from '@reduxjs/toolkit';

//modal 관련 변수
const initialState = {
  modal3dVisible: true, 
}

export const modalVisibleSlice = createSlice({
  name: 'modalVisible',
  initialState,
  reducers: {
    off: (state) => {
      state.modal3dVisible = false;
    },
    on: (state) => {
      state.modal3dVisible = true;
    }
  }
});

export const modalVisibleActions = modalVisibleSlice.actions;
export default modalVisibleSlice.reducer;