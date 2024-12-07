import React, { useEffect, useReducer, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAll, getAllStatus } from '../../services/orderService';
import classes from './OrdersPage.module.css';
import Title from '../../Components/Title/Title';
import DateTime from '../../Components/DateTime/DateTime';
import Price from '../../Components/Price/Price';
import NotFound from '../../Components/NotFound/NotFound';
import Search from '../../Components/Search/Search';
import { updateOrderStatus } from '../../services/orderService';
import { useAuth } from '../../hooks/useAuth';


const initialState = {};
const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'ALL_STATUS_FETCHED':
      return { ...state, allStatus: payload };
    case 'ORDERS_FETCHED':
      return { ...state, orders: payload };
    case 'ORDER_STATUS_UPDATED':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === payload.orderId ? { ...order, status: payload.newStatus } : order
        ),
      };
    default:
      return state;
  }
};

export default function OrdersPage() {
  const [{ allStatus, orders }, dispatch] = useReducer(reducer, initialState);
  const { filter } = useParams();
  // const [selectedStatus] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    getAllStatus().then(status => {
      dispatch({ type: 'ALL_STATUS_FETCHED', payload: status });
    });
    getAll(filter).then(orders => {
      dispatch({ type: 'ORDERS_FETCHED', payload: orders });
    });
  }, [filter]);

  const handleStatusChange = async(orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      dispatch({ type: 'ORDER_STATUS_UPDATED', payload: { orderId, newStatus } });
    } catch (error) {
      console.error('Failed to update order status', error);
    }
  };

  return (
    <div className={classes.container}>
      <Title title="Orders" margin="1.5rem 0 0 .2rem" fontSize="1.9rem" />
      <Search
          searchRoute="/track/"
          defaultRoute="/track/"
          placeholder="Search Order"
          margin="1rem 0"
        />
      {allStatus && (
        <div className={classes.all_status}>
          <Link to="/orders" className={!filter ? classes.selected : ''}>
            All
          </Link>
          {allStatus.map(state => (
            <Link
              key={state}
              className={state == filter ? classes.selected : ''}
              to={`/orders/${state}`}
            >
              {state}
            </Link>
          ))}
        </div>
      )}

      {orders?.length === 0 && (
        <NotFound
          linkRoute={filter ? '/orders' : '/'}
          linkText={filter ? 'Show All' : 'Go To Home Page'}
        />
      )}

      {orders &&
        orders.map(order => (
          <div key={order.id} className={classes.order_summary}>
            <div className={classes.header}>
              <span>{order.id}</span>
              <span>
                <DateTime date={order.createdAt} />
              </span>
              {user?.isAdmin && (
                <div className={classes.statusContainer}>
                  <select
                    className={classes.statusOptions}
                    value={order.status}
                    onChange={e => handleStatusChange(order.id, e.target.value)}
                  >
                    <option value={order.status} disabled>{order.status}</option>
                    {allStatus.filter(status => status !== order.status).map(status => (
                      <option className={classes.option} key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className={classes.items}>
              {order.items.map(item => (
                <Link key={item.food.id} to={`/food/${item.food.id}`}>
                  <img src={item.food.imageUrl} alt={item.food.name} />
                </Link>
              ))}

            </div>
            <div className={classes.footer}>
              <div>
                <Link to={`/track/${order.id}`}>Show Order</Link>
              </div>
              <div>
                <span className={classes.price}>
                  <Price price={order.totalPrice} />
                </span>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
