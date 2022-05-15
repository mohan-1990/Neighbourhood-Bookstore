import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import PublisherFilter from '../../components/PublisherFilter';
import CategoryFilter from '../../components/CategoryFilter';
import ItemCard from '../../components/ItemCard';
import SortSelect from '../../components/SortSelect';
import getItems from '../../utils/getItems';
import SmallSort from '../../components/SmallSort';
import SmallFilter from '../../components/SmallFilter';
import EmptyResults from '../../components/EmptyResults';

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
  flex: 1;
  display: flex;

  .aside {
    width: 300px;
    padding: 16px;

    .title {
      font-size: 18px;
      font-weight: 500;
    }
  }

  .main {
    width: 100%;
    padding: 16px;
    display: flex;
    flex-direction: column;

    .top {
      display: flex;

      .title {
        font-size: 18px;
        font-weight: 500;
        margin-right: auto;
      }
    }

    .books {
      margin: 16px 0;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }
  }

  @media (max-width: 1024px) {
    .main {
      .books {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  }

  @media (max-width: 768px) {
    .main {
      .books {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }

  @media (max-width: 640px) {
    .main {
      .top {
        align-items: center;

        .sort-filter {
          display: flex;
        }
      }

      .books {
        margin-bottom: 0;
      }
    }
  }
`;

const Products = ({ books, publishers, categories }) => {
  const [width, setWidth] = useState(window.innerWidth);
  const filteredPublishers = useSelector((state) => state.filter.publishers);
  const filteredCategories = useSelector((state) => state.filter.categories);
  const filteredSort = useSelector((state) => state.filter.sort);

  let filteredBooks;

  filteredBooks =
    filteredPublishers.length > 0
      ? [...books].filter((value) => filteredPublishers.includes(value.publisher))
      : [...books];

  filteredBooks =
    filteredCategories.length > 0
      ? filteredBooks.filter((value) =>
          filteredCategories.includes(value.category)
        )
      : filteredBooks;

  if (filteredSort === 'price_high_to_low') {
    filteredBooks = filteredBooks.sort((a, b) => +b.price - +a.price);
  } else if (filteredSort === 'price_low_to_high') {
    filteredBooks = filteredBooks.sort((a, b) => +a.price - +b.price);
  }

  useEffect(() => {
    const handleWindowResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Collections</title>
      </Head>
      <MainNav>
        <Link href="/">Home</Link> / <span>Collections</span>
      </MainNav>
      <Div>
        {width > 640 && (
          <aside className="aside">
            <div className="title">Filters</div>
            <PublisherFilter items={publishers} />
            <CategoryFilter items={categories} />
          </aside>
        )}
        <main className="main">
          <div className="top">
            <div className="title">Collections</div>
            {width > 640 ? (
              <SortSelect />
            ) : (
              <div className="sort-filter">
                <SmallSort />
                <SmallFilter publisherItems={publishers} categoryItems={categories} />
              </div>
            )}
          </div>
          {filteredBooks.length > 0 ? (
            <div className="books">
              {filteredBooks.map((item, index) => (
                <ItemCard key={item.id} {...item} setPriority={index < 8} />
              ))}
            </div>
          ) : (
            <EmptyResults />
          )}
        </main>
      </Div>
    </>
  );
};

export const getStaticProps = async (context) => {

  const items = await getItems();

  const publishers = items.reduce((previous, current) => {
    if (!previous.includes(current.publisher)) {
      previous.push(current.publisher);
    }

    return previous;
  }, []);

  const categories = items.reduce((previous, current) => {
    if (!previous.includes(current.category)) {
      previous.push(current.category);
    }

    return previous;
  }, []);

  return {
    props: {
      books: items,
      publishers,
      categories,
    },
  };
};

export default Products;
