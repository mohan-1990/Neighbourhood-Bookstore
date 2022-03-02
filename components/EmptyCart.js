import styled from 'styled-components';

import { CartIcon } from '../assets/icons';

const Div = styled.div`
  background-color: #f6f6f6;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .round {
    border: 1px #374e62 dashed;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;

    .icon {
      margin: 24px 24px;
      width: 32px;
      height: 32px;

      path,
      line {
        stroke-width: 1px;
      }
    }
  }

  .text {
    margin-top: 24px;
    font-family: 'EB Garamond', serif;
    font-size: 20px;
    font-weight: 500;
  }
`;

const EmptyCart = () => {
  return (
    <Div>
      <div className="round">
        <CartIcon />
      </div>
      <p className="text">Your shopping bag is empty</p>
    </Div>
  );
};

export default EmptyCart;