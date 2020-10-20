import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
    // todos: todosReduce,
})

const store = configureStore({
    reducer: rootReducer,
})

export default store