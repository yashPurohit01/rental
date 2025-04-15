import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FormData {
  userId?:string
  firstName: string;
  lastName: string;
  wheels: string;
  vehicleType: string;
  model: string;
  startDate: any;
  endDate: any;
}

const initialState: FormData = {
  userId:'',
  firstName: '',
  lastName: '',
  wheels: '',
  vehicleType: '',
  model: '',
  startDate: null,
  endDate: null,
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setFormData(state, action: PayloadAction<Partial<FormData>>) {
      return { ...state, ...action.payload };
    },
    resetFormData() {
      return initialState;
    },
  },
});

export const { setFormData, resetFormData } = formSlice.actions;
export default formSlice.reducer;
