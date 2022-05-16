import Link from 'next/link';
import Head from 'next/head';
import styled from 'styled-components';

const Div = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
  text-align: center;

  .title {
    font-size: 64px;
    font-weight: 600;
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

    @media (max-width: 640px) {
      font-size: 56px;
    }
  }

  .text {
    margin-top: 30px;
  }

  a {
    display: block;
    margin-top: 40px;
    padding: 14px 42px;
    text-decoration: none;
    font-weight: 500;
    border: none;
    border-radius: 10px;
    background: #64b0f1;
    background: -webkit-linear-gradient(to right, #64b0f1, #0d67b5);
    background: linear-gradient(to right, #64b0f1, #0d67b5);
    color: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
`;

const Home = () => {
  return (
    <>
      <Head>
        <title>Shop your favourite books online from Neighbourhood bookstore</title>
      </Head>
      <Div>
        <p className="title">Your favorite books in a single place</p>
        <p className="text">New collections added weekly. Hunderds of books categories!</p>
        <Link href="/collections">Shop Now</Link>
      </Div>
    </>
  );
};

export default Home;
