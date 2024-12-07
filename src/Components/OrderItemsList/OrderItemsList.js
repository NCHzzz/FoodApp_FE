import React from 'react';
import { Link } from 'react-router-dom';
import Price from '../Price/Price';
import classes from './OrderItemsList.module.css';

export default function OrderItemsList({ order }) {
  return (
    <table className={classes.table}>
      <tbody>
        <tr>
          <td colSpan="5">
            <h3>Order Items:</h3>
          </td>
        </tr>
        {order.items.map(item => (
          <tr key={item.food.id}>
            <td>
              <Link to={`/food/${item.food.id}`}>
                <img src={`/${item.food.imageUrl}`} />
                

              </Link>
            </td>
            <td colSpan="1">{item.food.name}</td>
            <td colSpan="3">{item.quantity}</td>
            <td><Price price={item.price}/></td>
          </tr>
        ))}

        <tr>
          <td colSpan="4"></td>
          <td>
            <strong>Total:</strong>
          </td>
          <td className={classes.total_Price}>
            <Price price={order.totalPrice} />
          </td>
        </tr>
      </tbody>
    </table>
  );
}
