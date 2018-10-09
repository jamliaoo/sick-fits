import React, { Component } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import ItmeStyles from "./styles/ItemStyles";
import Title from "./styles/Title";
import PriceTag from "./styles/PriceTag";
import formatMoney from "../lib/formatMoney";

export default class Item extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired
  };

  render() {
    const { title, id, price, description, image } = this.props.item;
    return (
      <ItmeStyles>
        {image && <img src={image} alt={title} />}
        <Title>
          <Link
            href={{
              pathname: "/item",
              query: { id }
            }}
          >
            <a>{title}</a>
          </Link>
        </Title>
        <PriceTag>{formatMoney(price)}</PriceTag>
        <p>{description}</p>
        <div className="buttonList">
          <Link
            href={{
              pathname: "update",
              query: { id }
            }}
          >
            <a>Edit</a>
          </Link>
          <button>Add To Cart</button>
          <button>Delete</button>
        </div>
      </ItmeStyles>
    );
  }
}
