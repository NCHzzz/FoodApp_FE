import React from 'react';
import { Link } from 'react-router-dom';
import Price from '../../Components/Price/Price';
import Title from '../../Components/Title/Title';
import { useCart } from '../../hooks/useCart';
import classes from './CartPage.module.css';
import NotFound from '../../Components/NotFound/NotFound';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faX } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../hooks/useAuth';
import LoginPage from '../Login/LoginPage';

export default function CartPage() {
  const { cart, removeFromCart, changeQuantity } = useCart();
  const { user } = useAuth();

  return (
    <>
      {user === null ? (
        <LoginPage />
      ) : (
        <>
          <Title title="Cart Page" margin="1.5rem 0 0 2.5rem" />

          {cart.items.length === 0 ? (
            <NotFound message="Cart Page Is Empty!" />
          ) : (
            <div className={classes.container}>
              <ul className={classes.list}>
                {cart.items.map((item) => (
                  <li key={item.food.id}>
                    <div>
                      <img src={`${item.food.imageUrl}`} alt={item.food.name} />
                    </div>

                    <div className={classes.foodName}>
                      <Link to={`/food/${item.food.id}`}>{item.food.name}</Link>
                    </div>

                    <div className={classes.selectContainer}>
                      <select
                        className={classes.customSelect}
                        value={item.quantity}
                        onChange={(e) => changeQuantity(item, Number(e.target.value))}
                      > 
                        {[...Array(10)].map((_, index) => (
                          <option key={index + 1} className={classes.quantityOption}>{index + 1}</option>
                        ))} 
                      </select>
                    </div>

                    <div>
                      <Price price={item.price} />
                    </div>

                    <div>
                      <button
                        className={classes.remove_button}
                        onClick={() => removeFromCart(item.food.id)}
                      >
                        {/* <FontAwesomeIcon icon={faX} /> */}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className={classes.checkout}>
                <div>
                  <div className={classes.foods_count}>{cart.totalCount}</div>
                  <div className={classes.total_price}>
                    <Price price={cart.totalPrice} />
                  </div>
                </div>

                <Link to="/checkout">Checkout</Link>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}