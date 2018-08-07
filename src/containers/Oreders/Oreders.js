import React, { Component } from 'react';
import { connect } from 'react-redux';

import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import Order from '../../components/Order/Order';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner'

class Oreders extends Component {

    componentDidMount() {
        this.props.onFetchOrders();
    }

    render() {
        let order = <Spinner />
        if (!this.props.loading) {
            order = (
                <div>
                    {
                        this.props.orders.map((order) => (
                            <Order 
                                key={order.id}
                                ingredients={order.ingredients}
                                price={order.price} />
                        ))
                    }               
                </div>
            );
        }
        return order;
    }
}

const mapStateToProps = (state) => {
    return {
        orders: state.order.orders,
        loading: state.order.loading
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onFetchOrders: () => dispatch(actions.fetchOrders())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Oreders, axios));