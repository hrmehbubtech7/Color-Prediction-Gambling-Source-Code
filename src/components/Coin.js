import React, { Component } from 'react';
import 'styles/Coin.css';
import heads from 'assets/img/coin-heads.png';
import tails from 'assets/img/coin-tails.png';
class Coin extends Component {
  render() {
    return (
      <div className='Coin'>
        <div className={`Coin-inner ${this.props.side}`}>
          <div className='Coin-heads'>
            <img src={heads} alt='heads' width='200px' height='200px' />
          </div>
          <div className='Coin-tails'>
            <img src={tails} alt='tails' width='200px' height='200px' />
          </div>
        </div>
      </div>
    );
  }
}
export default Coin;
