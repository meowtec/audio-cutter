import React from 'react';

const Icon = ({ icon }: { icon: string | { id: string } }) => {
  const id = typeof icon === 'string' ? icon : icon.id;

  return (
    <svg className={`icon __${id}`}>
      <use xlinkHref={`#${id}`} />
    </svg>
  );
};

export default Icon;
