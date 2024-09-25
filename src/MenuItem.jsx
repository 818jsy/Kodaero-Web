import React from 'react';
import styles from './MenuItem.module.css';
import restaurant_icon from "./assets/images/icon_restaurant.svg"; // 필요한 스타일을 위한 CSS 파일

function MenuItem({ name, price }) {
    return (
        <div className={styles.menuItem}>
            <img src={restaurant_icon} alt="Restaurant Icon" className={styles.restaurantIcon}/>
            <span className={styles.menuName}>{name}</span>
            <span className={styles.menuPrice}>{price}</span>
        </div>
    );
}

export default MenuItem;
