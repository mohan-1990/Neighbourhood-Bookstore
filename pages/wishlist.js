import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

import EmptyWishlist from '../components/EmptyWishlist';
import SignInPromptTemplate from '../components/SignInPromptTemplate';
import WishlistItemCard from '../components/WishlistItemCard';
import getItemById from '../utils/getItemById';
import { useSelector } from 'react-redux';

const fade = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.85);
  }
  5% {
    opacity: 1;
    transform: scale(1);
  }
  20% {
    opacity: 1;
    transform: scale(1);
  }
  40% {
    opacity: 1;
    transform: scale(1);
  }
  60% {
    opacity: 1;
    transform: scale(1);
  }
  80% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1);
  }
`;

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

const Div = styled.div`
  padding: 16px;

  .title {
    font-size: 18px;
    font-weight: 500;

    span {
      font-size: 16px;
      font-weight: 400;
    }
  }

  .books {
    margin: 16px 0;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;

    @media (max-width: 1024px) {
      grid-template-columns: repeat(4, 1fr);
    }

    @media (max-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 640px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`;

const Notification = styled.div`
  background-color: #333;
  color: white;
  padding: 16px;
  border-radius: 6px;
  font-size: 14px;
  position: fixed;
  top: 138px;
  right: 16px;
  z-index: 10;
  display: flex;
  align-items: center;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.16);
  display: none;

  p {
    margin-left: 8px;
  }

  &.activate {
    display: flex;
    animation: ${fade} 3s;
  }

  @media (max-width: 640px) {
    top: auto;
    bottom: 16px;
    padding: 10px;
  }
`;

const Wishlist = () => {
  const [books, setBooks] = useState([]);
  const [activateNotification, setActivateNotification] = useState(false);
  const [imageToBeNotified, setImageToBeNotified] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  useEffect(async () => {

    const items = await Promise.all(
      wishlistItems.map(async (item) => {
        const itemDetails = await getItemById(item.itemId);
        return { ...itemDetails };
      })
    );

    setBooks(() => {
      setIsLoading(false);
      return items;
    });
  }, [wishlistItems]);

  useEffect(() => {
    if (imageToBeNotified) {
      setActivateNotification(true);
      setTimeout(() => {
        setActivateNotification(false);
      }, 3000);
    }
  }, [imageToBeNotified]);

  return (
    <>
      <Head>
        <title>Wishlist</title>
      </Head>
      <MainNav>
        <Link href="/">Home</Link> / <span>Wishlist</span>
      </MainNav>
      {!isLoading &&
        (user ? (
          books.length > 0 ? (
            <Div>
              <div className="title">
                Wishlist <span>({books.length} items)</span>
              </div>
              <div className="books">
                {books.map((item) => (
                  <WishlistItemCard
                    key={item.id}
                    {...item}
                    setImage={setImageToBeNotified}
                  />
                ))}
              </div>
            </Div>
          ) : (
            <EmptyWishlist />
          )
        ) : (
          <SignInPromptTemplate type="wishlist" />
        ))}
      <Notification
        className={`notification ${activateNotification ? 'activate' : ''}`}
      >
        {imageToBeNotified && (
          <Image
            src={imageToBeNotified}
            width={33}
            height={41}
            layout="fixed"
            priority
          />
        )}
        <p>Item added to cart successfully</p>
      </Notification>
    </>
  );
};

export default Wishlist;
