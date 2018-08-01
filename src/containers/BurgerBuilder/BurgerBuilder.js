import React, { Component } from 'react';

import MyAux from '../../hoc/MyAux/MyAux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';


const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7,
}


class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        console.log(this.props);
        axios.get('/ingredients.json')
            .then((response) => {
                this.setState({ingredients: response.data});
            })
            .catch((err) =>{
                this.setState({error: true});
            })
    }

    updatePurchaseState(ingredients) {       
        const sum = Object.keys(ingredients)
            .map((igKey) => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            } , 0);

        this.setState({purchasable: sum > 0});
    }



    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updateCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updateCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) {
            return;
        }
        const updateCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updateCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        // alert('You continue');        

        const queryParams = [];
        
        for (let key in this.state.ingredients) {
            queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(this.state.ingredients[key])}`);
        }
        queryParams.push('price=' + this.state.totalPrice.toFixed(2));
        const queryString = queryParams.join('&');

        this.props.history.push({
            pathname: '/checkout',
            search: `?${queryString}`
        });
    }

    render () {
        const disabledInfo = {
            ...this.state.ingredients
        };
        for(let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null;
        let burger = this.state.error? <p>ingredients can't be loaded!</p> : <Spinner />;
        
        if (this.state.ingredients) {
            burger = (
                <MyAux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls
                        ingredientsAdded={this.addIngredientHandler}
                        ingredientsRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo} 
                        purchasable={this.state.purchasable}
                        ordered={this.purchaseHandler}
                        price={this.state.totalPrice}/>
                </MyAux>
            );

            orderSummary = <OrderSummary 
                ingredients={this.state.ingredients} 
                price={this.state.totalPrice}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}/>
        } 

        if (this.state.loading) {
            orderSummary = <Spinner />
        }      

        return (
            <MyAux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>    
                {burger}         
            </MyAux>          
        );
    }

}

export default withErrorHandler(BurgerBuilder, axios);