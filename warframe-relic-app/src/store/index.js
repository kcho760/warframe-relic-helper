import { createStore, applyMiddleware, combineReducers } from 'redux';
import {thunk} from 'redux-thunk';

// Initial state
const initialState = {};

// Example reducer
const exampleReducer = (state = { options: [] }, action) => {
  switch (action.type) {
    case 'SET_OPTIONS':
      return { ...state, options: action.payload };
    default:
      return state;
  }
};

// Combine reducers if you have more than one
const rootReducer = combineReducers({
  example: exampleReducer,
  // Add other reducers here
});

// Create the store with the rootReducer and middleware
const store = createStore(rootReducer, initialState, applyMiddleware(thunk));

export default store;
