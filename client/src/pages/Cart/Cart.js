import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import {
  getCartItems,
  updateCart,
  checkout
} from '../../actions/userActions';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown, faSmile } from '@fortawesome/free-solid-svg-icons';

import UserLayout from '../../hoc/UserLayout';

import CartList from '../../components/CartList';
import Button from '../../components/Button';


class Cart extends Component {
  state = {
    loading: true,
    total: 0,
    showTotal: false,
    showSuccess: false
  };

  async componentDidMount() {
    const { cart } = this.props.user.userData;

    let cartItems = [];

    if (cart && cart.length) {
      cartItems = cart.map(({ id }) => id);
    }

    await this.props.dispatch(getCartItems(cartItems, cart));

    const { cartDetail } = this.props.user;

    if (cartDetail.length) this.calculateTotal(cartDetail);
  };

  removeFromCart = async (id) => {
    const { cart } = this.props.user.userData;

    const tmpCart = cart.map((item) => {
      if (item.id === id && item.quantity) --item.quantity;

      if (!item.quantity) return null;

      return item;
    });

    const newCart = tmpCart.filter((item) => !!item);

    await this.props.dispatch(updateCart(newCart));

    const { cartDetail } = this.props.user;

    if (cartDetail.length) {
      this.calculateTotal(cartDetail)
    } else {
      this.setState({
        total: 0,
        showTotal: false
      });
    }
  };

  calculateTotal = (cartDetail) => {
    let total = 0;

    cartDetail.forEach((item) => {
      total += parseInt(item.price, 10) * item.quantity;
    });

    this.setState({
      total,
      showTotal: true
    });
  };

  onCheckout = async () => {
    await this.props.dispatch(checkout({
      cartDetail: this.props.user.cartDetail
    }));

    if (this.props.user.successBuy) {
      this.setState({
        showTotal: false,
        showSuccess: true
      });
    }
  }

  render() {
    const products = this.props.user.cartDetail;

    return (
      <UserLayout>
        <h1 className="mt-0">My Cart</h1>
        {
          products && products.length ?
            <CartList
              products={ products }
              type="cart"
              removeItem={ (id) => this.removeFromCart(id) }
            />
          :
            this.state.showSuccess ?
              <div className="cart-msg">
                <FontAwesomeIcon
                  className="cart-msg__icon"
                  icon={ faSmile }
                />
                <p>THANK YOU</p>
                <p>YOUR ORDER IS NOW COMPLETE</p>
              </div>
            :
              <div className="cart-msg">
                <FontAwesomeIcon
                  className="cart-msg__icon"
                  icon={ faFrown }
                />
                <p>You have no items</p>
              </div>
        }
        {
          this.state.showTotal ?
            <Fragment>
              <div className="cart-total">
                Total amount: { `$ ${this.state.total}`}
              </div>

              <Button
                title="Checkout"
                runAction={ () => this.onCheckout() }
                className="btn_blue btn_cta"
              />
            </Fragment>
          : null
        }
      </UserLayout>
    );
  };
};


export default connect(({ user }) => ({
  user
}))(Cart);
