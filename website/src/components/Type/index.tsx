import React from 'react';
import styles from './index.module.css';

const Type = ({
  children
}) => {
  return (
    <span className={styles.text}>{children}</span>
  );
}

export default Type;
