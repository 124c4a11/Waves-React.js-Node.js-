import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { frets, price } from '../../utils/fixedCategories';

import {
  getBrands,
  getWoods,
  getProductsToShop
} from '../../actions/productsActions'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTh } from '@fortawesome/free-solid-svg-icons'

import Button from '../../components/Button';
import PageTopBar from '../../components/PageTopBar';
import CollapseCheckbox from '../../components/CollapseCheckbox';
import CollapseRadio from '../../components/CollapseRadio';
import LoadMoreCards from '../../components/LoadMoreCards';

class Shop extends Component {
  state = {
    grid: true,
    limit: 6,
    skip: 0,
    filters: {
      brand: [],
      frets: [],
      wood: [],
      price: []
    }
  };

  async componentDidMount() {
    await this.props.dispatch(getBrands());
    await this.props.dispatch(getWoods());
    await this.props.dispatch(getProductsToShop(
      this.state.skip,
      this.state.limit,
      this.state.filters
    ));
  }

  showFilteredResults = async (filters) => {
    await this.props.dispatch(getProductsToShop(
      0,
      this.state.limit,
      filters
    ));

    this.setState({ skip: 0 });
  };

  loadMoreCards = async () => {
    let skip = this.state.skip + this.state.limit;

    await this.props.dispatch(getProductsToShop(
      skip,
      this.state.limit,
      this.state.filters,
      this.props.products.toShop
    ));

    this.setState({ skip });
  };

  handlePrice = (value) => {
    const data = price;

    let arr = [];

    for (let key in data) {
      if (data[key]._id === parseInt(value, 10)) {
        arr = data[key].array
      }
    }

    return arr;
  };

  handleFilters = (filters, category) => {
    const newFilters = { ...this.state.filters };

    newFilters[category] = filters;

    if (category === 'price') {
      let priceValues = this.handlePrice(filters);

      newFilters[category] = priceValues;
    }

    this.showFilteredResults(newFilters);

    this.setState({ filters: newFilters });
  };

  handleGrid = (isGrid) => {
    this.setState({ grid: isGrid });
  }

  render() {
    const { products } = this.props;

    return (
      <div className="flex-grow-1 d-flex flex-direction-column">
        <PageTopBar title="Browse Products" />

        <div className="flex-grow-1 d-flex">
          <div className="container layout">
            <aside className="layout-sidebar py-0">
              <CollapseCheckbox
                title="Brands"
                list={ products.brands }
                handleFilters={ (filters) => this.handleFilters(filters, 'brand') }
                initState={ true }
              />
              <CollapseCheckbox
                title="Frets"
                list={ frets }
                handleFilters={ (filters) => this.handleFilters(filters, 'frets') }
                initState={ false }
              />
              <CollapseCheckbox
                title="Woods"
                list={ products.woods }
                handleFilters={ (filters) => this.handleFilters(filters, 'wood') }
                initState={ false }
              />
              <CollapseRadio
                title="Price"
                list={ price }
                handleFilters={ (filters) => this.handleFilters(filters, 'price') }
                initState={ false }
              />
            </aside>
            <div className="layout-content py-1">
              {
                products.toShop && products.toShop.length ?
                  <Fragment>
                    <div className="grid-bar">
                      <Button
                        type="icon"
                        icon={ <FontAwesomeIcon icon={ faTh } /> }
                        runAction={ () => this.handleGrid(true) }
                        className={ `${this.state.grid ? 'btn_icon-active' : ''}` }
                      />
                      <Button
                        type="icon"
                        icon={ <FontAwesomeIcon icon={ faBars } /> }
                        runAction={ () => this.handleGrid(false) }
                        className={ `${!this.state.grid ? 'btn_icon-active' : ''}` }
                      />
                    </div>

                    <LoadMoreCards
                      grid={ this.state.grid }
                      limit={ this.state.limit }
                      size={ products.toShopSize }
                      products={ products.toShop }
                      loadMore={ () => this.loadMoreCards() }
                    />
                  </Fragment>
                :
                  <p className="no-result">Sorry, no results!</p>
              }
            </div>
          </div>
        </div>
      </div>
    );
  };
};


export default connect(({ products }) => ({
  products
}))(Shop);
