import React from 'react'
import CardBody from '../components/CardBody';
import { Link } from 'react-router-dom';

const arrowStyle = {
  position: "fixed",
  bottom: "2rem",
  right: "2rem",
  fontSize: "3rem",
  color: "#808080",
  cursor: "pointer",
};

const Cards = () => {
  const cardData = [
    { text: 'Texto 1', color: 'red' },
    { text: 'Texto 2', color: 'blue' },
    { text: 'Texto 3', color: 'green' },
    { text: 'Texto 4', color: 'orange' },
    { text: 'Texto 5', color: 'purple' },
  ];

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',  backgroundColor: "#fff"}}>
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      {cardData.map((card, index) => (
        <div key={index} style={{ margin: '9vh' }}>
          <CardBody text={card.text} color={card.color} />
        </div>
      ))}
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      {cardData.map((card, index) => (
        <div key={index} style={{ margin: '9vh' }}>
          <CardBody text={card.text} color={card.color} />
        </div>
      ))}
    </div>
    <Link to="/body">
        <div style={arrowStyle}>&#9654;</div>
      </Link>
  </div>
  );
}

export default Cards;