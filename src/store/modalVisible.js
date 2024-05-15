import { createSlice } from '@reduxjs/toolkit';

//modal 관련 변수
const initialState = {
  modal3dVisible: true, 
  loadingVisible: false,
}

export const modalVisibleSlice = createSlice({
  name: 'modalVisible',
  initialState,
  reducers: {
    // 3D 모달 제어
    off: (state) => {
      state.modal3dVisible = false;
    },
    on: (state) => {
      state.modal3dVisible = true;
    },
    // 로딩 모달 제어
    turnOffLoading: (state) => {
      state.loadingVisible = false;
    },
    turnOnLoading: (state) => {
      state.loadingVisible = true;
    }
  }
});

export const modalVisibleActions = modalVisibleSlice.actions;
export default modalVisibleSlice.reducer;