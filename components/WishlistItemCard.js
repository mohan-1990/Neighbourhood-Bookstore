import { useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { arrayUnion, arrayRemove } from 'firebase/firestore';

import { CloseIcon } from '../assets/icons';
import BetterLink from './BetterLink';
import { useSelector } from 'react-redux';
import { setCart, setWishlist } from '../services/firebase/dataAccess';
import { getFormattedCurrency } from '../utils/getFormattedCurrency';

const Div = styled.div`
  font-size: 14px;
  border: 1px #eee solid;

  .item {
    position: relative;

    .delete {
      border: 1px #ddd solid;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2px;
      position: absolute;
      top: 8px;
      right: 8px;
      z-index: 5;
      background-color: #f4f4f4;
      color: #888;
      cursor: pointer;

      .icon {
        width: 16px;
        height: 16px;
        stroke-width: 2px;
      }
    }

    a {
      text-decoration: none;
      color: inherit;
    }

    .info {
      padding: 8px;

      .publisher {
        font-weight: 500;
      }

      .name {
        color: #777;
        margin: 8px 0;
      }

      .amount {
        font-weight: 500;
      }
    }
  }

  .cart {
    font: inherit;
    font-weight: 500;
    background-color: white;
    color: #0d67b5;
    display: block;
    outline: none;
    cursor: pointer;
    border: none;
    border-top: 1px #eee solid;
    padding: 8px;
    width: 100%;
  }
`;

const ModalDiv = styled.div`
  padding: 16px;

  .title {
    color: #0d67b5;
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 32px;
  }

  .error {
    margin-bottom: 16px;
    color: #ff4646;
  }

  .sizes {
    display: flex;

    button {
      font: inherit;
      font-size: 14px;
      font-weight: 500;
      border: 1px #ddd solid;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50px;
      height: 50px;
      margin-right: 8px;
      background-color: white;
      cursor: pointer;

      &.active {
        border-color: #0d67b5;
        color: #0d67b5;
      }

      &:last-child {
        margin-right: 0;
      }

      @media (hover: hover) {
        transition: border 240ms;

        &:hover {
          border-color: #0d67b5;
        }
      }
    }
  }

  .done {
    font: inherit;
    border-radius: 6px;
    background: #64b0f1;
    background: -webkit-linear-gradient(to right, #64b0f1, #0d67b5);
    background: linear-gradient(to right, #64b0f1, #0d67b5);
    color: white;
    font-weight: 500;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-top: 32px;
    outline: none;
    cursor: pointer;
    padding: 14px 28px;
    border: none;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
`;

const WishlistItemCard = ({
  id,
  imageURL,
  publisher,
  author,
  name,
  price,
  category,
  setImage,
}) => {
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);
  const cartItem = cartItems.find(
    (item) => item.itemId === id
  );
  const cartItemIndex = cartItems.findIndex(
    (item) => item.itemId === id
  );
  const isInCart = !!cartItem;

  const deleteItemHandler = () => {
      setWishlist(user.uid,
        arrayRemove({ itemId: id })
    ).catch((error) => console.log(error));
  };

  const removeItemHandler = () => {
    setWishlist(user.uid,
      arrayRemove({ itemId: id})
    )
    .then(() => {
      setImage(imageURL);
    })
    .catch((error) => console.log(error));
  };

  const moveToCartHandler = (ev, fromModal = false) => {
    if (isInCart) {
      const updatedItem = {
        ...cartItem,
        itemQuantity: (+cartItem.itemQuantity + 1).toString(),
      };
      const updatedItems = [...cartItems];
      updatedItems.splice(cartItemIndex, 1, updatedItem);
      setCart(user.uid, updatedItems)
      .then(() => {
        removeItemHandler();
      })
      .catch((error) => console.log(error));
    } else {
      setCart(user.uid, arrayUnion({
          itemId: id,
          itemQuantity: '1',
        })
      )
      .then(() => {
        removeItemHandler();
      })
      .catch((error) => console.log(error));
    }
  };

  return (
    <>
      <Div>
        <div className="item">
          <button className="delete" onClick={deleteItemHandler}>
            <CloseIcon />
          </button>
          <BetterLink href={`/collections/${id}`}>
            <Image
              src={imageURL}
              width={220}
              height={275}
              layout="responsive"
            />
          </BetterLink>
          <div className="info">
            <div className="brand">{publisher}</div>
            <div className="name">{name}</div>
            <div className="amount">{`Rs. ${getFormattedCurrency(
              price
            )}`}</div>
          </div>
        </div>
        <button className="cart" onClick={moveToCartHandler}>
          Move to Cart
        </button>
      </Div>
    </>
  );
};

export default WishlistItemCard;
