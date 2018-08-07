import React, { Component } from 'react';
import { connect } from 'react-redux';

import MyAux from '../../hoc/MyAux/MyAux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import axios from '../../axios-orders';

class BurgerBuilder extends Component {
    state = {                       
        purchasing: false    
    }

    componentDidMount() {
        console.log(this.props);   
        this.props.onInitIngredients();    
    }

    updatePurchaseState(ingredients) {       
        const sum = Object.keys(ingredients)
            .map((igKey) => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            } , 0);

        return sum > 0;
    }
    
    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    }

    render () {
        const disabledInfo = {
            ...this.props.ings
        };
        for(let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null;
        let burger = this.props.error? <p>ingredients can't be loaded!</p> : <Spinner />;
        
        if (this.props.ings) {
            burger = (
                <MyAux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                        ingredientsAdded={this.props.onIngredientAdded}
                        ingredientsRemoved={this.props.onIngredientRemove}
                        disabled={disabledInfo} 
                        purchasable={this.updatePurchaseState(this.props.ings)}
                        ordered={this.purchaseHandler}
                        price={this.props.totalPrice}/>
                </MyAux>
            );

            orderSummary = <OrderSummary 
                ingredients={this.props.ings} 
                price={this.props.totalPrice}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}/>
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

const mapStateToProps = (state) => {
    return {
        ings: state.burgerBuilder.ingredients,
        totalPrice: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemove: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));