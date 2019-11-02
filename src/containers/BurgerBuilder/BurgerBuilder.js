import React, { Component } from 'react';
import { connect } from 'react-redux';

import Auxiliary from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import axios from '../../axios-orders';

// const INGREDIENT_PRICES = {
//     salad: .5,
//     cheese: .4,
//     meat: 1.3,
//     bacon: .7
// };

export class BurgerBuilder extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }
    state = {
        // ingredients: {
        //     salad: 0,
        //     bacon: 0,
        //     cheese: 0,
        //     meat: 0
        // },
        // ingredients: null,
        // totalPrice: 4,
        // purchasable: false,
        purchasing: false
        // loading: false,
        // error: false
    }

    componentDidMount() {
        // axios.get('/ingredients.json').then(response => {
        //     this.setState({ingredients: response.data});
        // }).catch(error => {
        //     this.setState({error: true});
        // });
        this.props.onInitIngredients();
    }

    updatePurchaseState(ingredients) {
        // const ingredients = { // we use the updatedIngredients because the way the setState works we get the old state in addIngredientHandler and removeIngredientHandler
        //     ...this.state.ingredients
        // };
        const sum = Object.keys(ingredients).map(igKey => {
            return ingredients[igKey];
        }).reduce((sum, el) => {
            return sum + el;
        }, 0);
        // this.setState({purchasable: sum > 0});
        return sum > 0;
    }

    // addIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     const updatedCount = oldCount + 1;
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     };
    //     updatedIngredients[type] = updatedCount;
    //     const priceAddition = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice + priceAddition;
    //     this.setState({ingredients: updatedIngredients, totalPrice: newPrice});
    //     this.updatePurchaseState(updatedIngredients);
    // }

    // removeIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     if (oldCount <= 0) {
    //         return;
    //     }
    //     const updatedCount = oldCount - 1;
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     };
    //     updatedIngredients[type] = updatedCount;
    //     const priceDeduction = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice - priceDeduction;
    //     this.setState({ingredients: updatedIngredients, totalPrice: newPrice});
    //     this.updatePurchaseState(updatedIngredients);
    // }

    purchaseHandler = () => {
        if (this.props.isAuthenticated) {
            this.setState({purchasing: true});
        } else {
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push('/auth');
        }

    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        // alert('You Continue!');

        // const queryParams = [];
        // for (let i in this.state.ingredients) {
        //     queryParams.push(encodeURIComponent(i) + `=${encodeURIComponent(this.state.ingredients[i])}`);
        // }
        // queryParams.push(`price=${this.state.totalPrice}`);
        // const queryString = queryParams.join('&');
        // this.props.history.push({
        //     pathname: '/checkout',
        //     search: `?${queryString}`
        // });

        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    }
    
    render () {
        const disabledInfo = {
            ...this.props.ings
        };
        for ( let key in disabledInfo ) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null;
        let burger = this.props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;

        if ( this.props.ings ) {
            burger = (
                <Auxiliary>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        purchasable={this.updatePurchaseState(this.props.ings)}
                        ordered={this.purchaseHandler}
                        price={this.props.price}
                        isAuth={this.props.isAuthenticated} />
                </Auxiliary>
            );
            orderSummary = <OrderSummary
                ingredients={this.props.ings}
                price={this.props.price}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler} />;
        }
        // {salad: true, meat: false, ...}
        return (
            <Auxiliary>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Auxiliary>
        );
    }

    // render() {
    //     const disabledInfo = {
    //         ...this.props.ings
    //     };
    //     for (let key in disabledInfo) {
    //         disabledInfo[key] = disabledInfo[key] <= 0;
    //     }
    //     let orderSummary = <OrderSummary ingredients={this.props.ings} purchaseCancelled={this.purchaseCancelHandler}
    //         purchaseContinued={this.purchaseContinueHandler} price={this.props.price} />;
    //     // if (this.state.loading) {
    //     //     orderSummary = <Spinner />;
    //     // }
    //     let burger = 
    //         <Auxiliary>
    //             <Burger ingredients={this.props.ings} />
    //             <BuildControls
    //                 ingredientAdded={this.props.onIngredientAdded}
    //                 ingredientRemoved={this.props.onIngredientRemoved}
    //                 disabled={disabledInfo}
    //                 price={this.props.price}
    //                 purchasable={this.updatePurchaseState(this.props.ings)}
    //                 ordered={this.purchaseHandler} />
    //         </Auxiliary>;
    //         if (!this.props.ings) {
    //             burger = this.props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;
    //             orderSummary = <Spinner />;
    //         }
    //     return (
    //         <Auxiliary>
    //             <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
    //                 {orderSummary}
    //             </Modal>
    //             {burger}
    //         </Auxiliary>
    //     );
    // }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    };
};

const mapDispatchToProps = dispatch => {
    return {
        // onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
        // onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));