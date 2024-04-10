import { createSlice } from '@reduxjs/toolkit'

export const globalInfoSlice = createSlice({
  name: 'globalInfo',
  initialState: {
    value: 10,
    activeTab: "home", 
  },
  reducers: {

    setActiveTab: (state, action) => {
      console.log(action.payload);
      state.activeTab = action.payload
    }


  },
})

// Action creators are generated for each case reducer function
export const { setActiveTab } = globalInfoSlice.actions

export default globalInfoSlice.reducer