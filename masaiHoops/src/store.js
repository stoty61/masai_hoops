import { configureStore } from '@reduxjs/toolkit'
import loginReducer from './slices/login_info'
import teamReducer from './slices/team_info'
import globalInfoReducer from './slices/globalInfo'

export default configureStore({
  reducer: {
    loginInfo: loginReducer,
    team: teamReducer,
    globalInfo: globalInfoReducer
  },
})