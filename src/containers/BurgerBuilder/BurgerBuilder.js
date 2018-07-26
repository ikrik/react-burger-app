import React, { Component } from 'react';

import MyAux from '../../hoc/MyAux';
import Burger from '../../components/Burger/Burger';

class BurgerBuilder extends Component {
    state = {
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        }
    }

    render () {
        return (
            <MyAux>
                <Burger ingredients={this.state.ingredients} />
                <div>
                    Build Controls
                </div>
            </MyAux>          
        );
    }

}

export default BurgerBuilder;