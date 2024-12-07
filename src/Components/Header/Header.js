import React from 'react';
import classes from './header.module.css';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import Search from '../Search/Search';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useClearCart } from '../../hooks/useClearCart';

export default function Header() {
    const { user } = useAuth();

    const {cart} = useCart();

    const { logout } = useClearCart();

    return (
    <header className={classes.header}>
        <div className={classes.container}>
            <Link to="/" className={classes.logo}>
                FOS
            </Link>
            <div className={classes.search}>
                <Search />
            </div>
            <nav>
                <ul>
                    {
                        user? (
                        <li className={classes.menu_container}>
                            <Link to="/dashboard">
                                <FontAwesomeIcon icon={faUser} />
                            </Link>
                            <div className={classes.menu}>
                                <Link to="/profile">Profile</Link>
                                <Link to="/orders">Orders</Link>
                                <a onClick={logout}>Logout</a>
                            </div>
                        </li> ) :
                        (<Link to="/login">Login</Link>)
                    }

                    <li>
                        <Link to="/cart">
                            {user !== null ? 
                            <>  
                                <FontAwesomeIcon icon={faShoppingCart} />
                                {cart.totalCount > 0 && <span className={classes.cart_count}>{cart.totalCount}</span>}
                            </> : <><FontAwesomeIcon icon={faShoppingCart} /></>}
                            
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    </header>
    );
}
