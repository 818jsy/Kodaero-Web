import React from 'react';
import './MenuItem.css';
import restaurant_icon from "./assets/images/icon_restaurant.svg"; // 필요한 스타일을 위한 CSS 파일

function MenuItem({ name, price }) {
    return (
        <div className="menu-item">
            <img src={restaurant_icon} alt="Restaurant Icon" className="restaurant-icon"/>
            <span className="menu-name">{name}</span>
            <span className="menu-price">{price}</span>
        </div>
    );
}

export default MenuItem;
