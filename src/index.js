import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App';
import registerServiceWorker from './registerServiceWorker';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import {logger} from 'redux-logger';

const pizzaReducer = (state = {}, action) => {
    if(action.type === 'ADD'){
        console.log('add to menu reducer');
        return {
            ...state,
            menu: action.payload,
            cart: []
        }
    } else if(action.type === 'ADD_TO_CART'){
        console.log('adding to cart');
        let currentMenu = state.menu;
        let idToChange = currentMenu.findIndex(item => {
            return item._id === action.payload;
        })
        console.log(idToChange);
        currentMenu[idToChange].quantity = currentMenu[idToChange].quantity + 1;
        let itemsInCart = currentMenu
            .filter(item => {
                return item.quantity > 0;
            });
        let total = 0;
        for(let item of itemsInCart){
            total += (item.cost * item.quantity);
        }
        console.log(state);
        return {
            ...state,
            menu: [
                ...currentMenu
            ],
            cart: [
                ...state.cart, 
                currentMenu[idToChange]
            ],
            order_total: total
        }
    } else if(action.type === 'DELETE_FROM_CART'){
        console.log('deleting from cart');
        let currentMenu = state.menu;
        let idToChange = currentMenu.findIndex(item => {
            return item._id === action.payload;
        })
        if(currentMenu[idToChange].quantity > 0){
            currentMenu[idToChange].quantity = currentMenu[idToChange].quantity - 1;
        }
        let itemsInCart = currentMenu
            .filter(item => {
                return item.quantity > 0;
            });
        let currentCart = state.cart;
        let indexToDelete = currentCart.findIndex(item => {
            return item._id === action.payload;
        })
        let newCart = [];
        let total = 0;
        for(let item of itemsInCart){
            total += (item.cost * item.quantity);
        }
        if(currentCart.length === 1){
            newCart = [];
            total = 0;
        } else {
            newCart = currentCart.splice(indexToDelete, 1);
        }
        return {
            ...state,
            menu: [
                ...currentMenu
            ],
            cart: [
                ...newCart
            ],
            order_total: total
        }
    } else {
        return state;
    }
}
const customerReducer = (state = {}, action) => {
    if(action.type === 'ADD_CUSTOMER'){
        return action.payload;
    }
    return state;
}

const storeInstance = createStore(
    combineReducers({
        pizzaReducer,
        customerReducer
    }),
    applyMiddleware(logger)
);

ReactDOM.render(<Provider store={storeInstance}><App /></Provider>, document.getElementById('root'));
registerServiceWorker();
