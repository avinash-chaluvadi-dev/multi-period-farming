import React from 'react';

const addProduce = ({ produceItems }) => {
  return (
    <>
      {produceItems.map((item, index) => (
        <div key={index}>
          <input type="text" value={item} readOnly />
        </div>
      ))}
    </>
  );
};

export default addProduce;