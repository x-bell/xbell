import React from 'react';

const Button: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
}> = ({
  children,
  onClick
}) => {
  return (
    <div className="biz-button" onClick={onClick}>
      {children}
    </div>
  )
}

export default Button;