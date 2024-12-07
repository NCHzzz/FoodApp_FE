import React from 'react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { createOrder } from '../../services/orderService';
import classes from './CheckoutPage.module.css';
import Title from '../../Components/Title/Title';
import Input from '../../Components/Input/Input';
import Button from '../../Components/Button/Button';
import OrderItemsList from '../../Components/OrderItemsList/OrderItemsList';
import Map from '../../Components/Map/Map';

export default function CheckoutPage() {
  const { cart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState({ ...cart });

  const [paymentMethod, setPaymentMethod] = useState('');
  const { clearCart } = useCart();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const submit = async data => {
    // if (!order.addressLatLng) {
    //   toast.warning('Please select your location on the map');
    //   return;
    // }
    if (paymentMethod === 'cash') {
      await createOrder({ ...order, name: data.name, address: data.address, paymentMethod: 'CASH' });
      toast.success('Place Order Successfully', 'Success');
      clearCart();
      navigate('/');
    }
    else if (paymentMethod === 'paypal') {
      await createOrder({ ...order, name: data.name, address: data.address, paymentMethod: 'PAYPAL' });
      navigate('/payment');
    }

    else {
      toast.warning('Please select a payment method');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(submit)} className={classes.container}>
        <div className={classes.content}>
          <Title title="Order Form" fontSize="1.6rem" />
          <div className={classes.inputs}>
            <Input
              defaultValue={user.name}
              label="Name"
              {...register('name')}
              error={errors.name}
            />
            <Input
              defaultValue={user.address}
              label="Address"
              {...register('address')}
              error={errors.address}
            />
          </div>
          <OrderItemsList order={order} />
        </div>

        {/* <div>
          <Title title="Your Location" fontSize="1.6rem" />
          <Map
            location={order.addressLatLng}
            onChange={latlng => {
              console.log(latlng);
              setOrder({ ...order, addressLatLng: latlng });
            }}
          />
        </div> */}

        <div className={classes.payment_method}>
          <Title title="Payment Method" fontSize="1.6rem" />
          <div className={classes.type_of_pay}>
            <label>
              <input
                type="checkbox"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={e => setPaymentMethod(e.target.checked ? 'cash' : '')}
              />
              Cash (COD) 
            </label>

            {/* <label>
              <input
                  type="checkbox"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={e => setPaymentMethod(e.target.checked ? 'paypal' : '')}
                />
                Paypal Credit Card
            </label> */}
          </div>
        </div>

        <div className={classes.buttons_container}>
          <div className={classes.buttons}>
            <Button
              type="submit"
              text={paymentMethod === 'cash' ? 'Place Order' : 'Go To Payment'}
              width="100%"
              height="3rem"
            />
          </div>
        </div>
      </form>
    </>
  );
}
