// src/store/index.js
import { legacy_createStore as createStore } from 'redux'

const initialState = {
  sidebarShow: true,
  theme: 'light',
  isAuthenticated: !!localStorage.getItem('token'), // Initialize from localStorage
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    case 'login':
      return { ...state, isAuthenticated: true }
    case 'logout':
      localStorage.removeItem('token')
      return { ...state, isAuthenticated: false }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store
