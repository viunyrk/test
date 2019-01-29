import { createStore, combineReducers } from 'redux'
import messenger from './reducers/messenger'

export default createStore(combineReducers({ messenger }));
