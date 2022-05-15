import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styled, { keyframes } from 'styled-components';
import { useSelector } from 'react-redux';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';

import getAllStaticPaths from '../../utils/getAllStaticPaths';
import getItemById from '../../utils/getItemById';
import { db } from '../../services/firebase-config';
import { getFormattedCurrency } from '../../utils/getFormattedCurrency';

const MainNav = styled.div`
  font-size: 14px;
  background-color: #f4f4f4;
  padding: 16px;

  a {
    text-decoration: none;
    color: inherit;
  }

  span {
    color: #999;
  }
`;

const rotation = keyframes`
  from {
        transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }    
`;

const Div = styled.div`
  padding: 32px;

  .card {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;

    .image {
      width: 330px;
    }

    .info {
      margin: 16px;
      padding: 16px;

      .publisher {
        font-size: 20px;
        font-weight: 500;
      }

      .name {
        color: #777;
        margin: 16px 0;
      }

      .amount {
        font-size: 20px;
        font-weight: 500;
      }

      .size-box {
        margin-top: 32px;

        .head {
          margin-bottom: 16px;
          display: flex;
          align-items: baseline;

          .title {
            font-weight: 500;
          }

          .chart {
            color: #0d67b5;
            margin-left: 16px;
            font-size: 14px;
            cursor: pointer;

            @media (hover: hover) {
              &:hover {
                text-decoration: underline;
              }
            }

            @media (hover: none) {
              &:active {
                text-decoration: underline;
              }
            }
          }
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
      }

      .actions {
        margin-top: 32px;
        display: flex;

        button {
          font: inherit;
          font-weight: 500;
          border-radius: 6px;
          display: flex;
          justify-content: center;
          align-items: center;
          outline: none;
          cursor: pointer;
          border: none;
          width: 145px;
          height: 48px;
        }

        .cart {
          background: #64b0f1;
          background: -webkit-linear-gradient(to right, #64b0f1, #0d67b5);
          background: linear-gradient(to right, #64b0f1, #0d67b5);
          color: white;
          margin-left: 16px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

          .loader {
            width: 18px;
            height: 18px;
            border: 2px solid #fff;
            border-bottom-color: transparent;
            border-radius: 50%;
            display: block;
            animation: ${rotation} 1s linear infinite;
          }
        }

        .wishlist {
          background-color: white;
          border: 1px #0d67b5 solid;
          color: #0d67b5;
        }
      }
    }
  }

  @media (max-width: 640px) {
    padding: 16px;

    .card {
      flex-direction: column;

      .image {
        width: 100%;
      }

      .info {
        width: 100%;
        padding: 0;
        margin-bottom: 0;

        .publisher {
          font-size: 18px;
          font-weight: 500;
        }

        .name {
          color: #777;
          margin: 8px 0;
        }

        .amount {
          font-size: 18px;
          font-weight: 500;
        }

        .size-box {
          margin-top: 16px;
        }

        .actions {
          margin-top: 24px;

          button {
            width: 100%;
          }
        }
      }
    }
  }
`;

const ModalDiv = styled.div`
  padding: 16px;

  .title {
    color: #0d67b5;
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 16px;
  }

  .table {
    overflow: auto;

    table {
      border-collapse: collapse;
      font-size: 14px;
      width: 474px;

      &.jeans {
        width: 356px;
      }

      th {
        font-weight: 500;
      }

      td,
      th {
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        text-align: center;
        padding: 16px;
      }

      tr {
        th:first-child,
        td:first-child {
          border-left: 1px solid #ddd;
        }

        th:last-child,
        td:last-child {
          border-right: 1px solid #ddd;
        }
      }
    }
  }
`;

const ItemDetails = ({ id, imageURL, publisher, category, name, price, author }) => {
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const cartItems = useSelector((state) => state.cart.items);
  const router = useRouter();

  const isWishlisted = !!wishlistItems.find((value) => value.itemId === id);

  const cartItem = cartItems.find(
    (item) => item.itemId === id
  );
  const cartItemIndex = cartItems.findIndex(
    (item) => item.itemId === id
  );
  const isInCart = !!cartItem;

  const addToWishlistHandler = () => {
    if (user) {
      updateDoc(doc(db, 'wishlist', user.uid), {
        items: arrayUnion({
          itemId: id
        }),
      }).catch((error) => console.log(error));
    } else {
      router.push('/signin');
    }
  };

  const addToCartHandler = () => {
    if (user) {
      setIsLoading(true);
      if (isInCart) {
        const updatedItem = {
          ...cartItem,
          itemQuantity: (+cartItem.itemQuantity + 1).toString(),
        };
        const updatedItems = [...cartItems];
        updatedItems.splice(cartItemIndex, 1, updatedItem);
        updateDoc(doc(db, 'cart', user.uid), {
          items: updatedItems,
        })
          .then(() => {
            removeItemHandler();
          })
          .catch((error) => console.log(error))
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        updateDoc(doc(db, 'cart', user.uid), {
          items: arrayUnion({
            itemId: id,
            itemQuantity: '1',
          }),
        })
          .catch((error) => console.log(error))
          .finally(() => {
            setIsLoading(false);
          });
      }
    } else {
      router.push('/signin');
    }
  };

  return (
    <>
      <MainNav>
        <Link href="/">Home</Link>
        {' / '}
        <Link href="/collections">Collections</Link>
        {' / '}
        <span>{` ${publisher} ${name}`}</span>
      </MainNav>
      <Div>
        <div className="card">
          <div className="image">
            <Image
              src={imageURL}
              width={330}
              height={412}
              layout="responsive"
            />
          </div>
          <div className="info">
            <div className="publisher">{publisher}</div>
            <div className="name">{name}</div>
            <div className="amount">{`Rs. ${getFormattedCurrency(
              price
            )}`}</div>
            <div className="actions">
              <button
                className="wishlist"
                onClick={addToWishlistHandler}
                disabled={isWishlisted}
              >
                {isWishlisted ? 'Wishlisted' : 'Wishlist'}
              </button>
              <button
                className="cart"
                onClick={addToCartHandler}
                disabled={isLoading}
              >
                {isLoading ? <span className="loader"></span> : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </Div>
    </>
  );
};

export const getStaticPaths = async () => {
  const paths = await getAllStaticPaths();

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async (context) => {
  const cid = context.params.cid;
  const item = await getItemById(cid);

  return {
    props: {
      ...item,
    },
  };
};

export default ItemDetails;
