import { createSlice } from '@reduxjs/toolkit'

export const loginSlice = createSlice({
  name: 'loginInfo',
  initialState: {
    value: 0,
    username: "",
    password: "", 
    email: ""
  },
  reducers: {
    increment: (state) => {
      state.value += 1
    },

    decrement: (state) => {
      state.value -= 1
    },

    incrementByAmount: (state, action) => {
      state.value += action.payload
    },

    setUsername: (state, action) => {
      state.username = action.payload;
    },

    setPassword: (state, action) => {
      state.password = action.payload;
    },

    setEmail: (state, action) => {
      state.email = action.payload;
    },


  },
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount, setUsername, setEmail, setPassword } = loginSlice.actions

export default loginSlice.reducer