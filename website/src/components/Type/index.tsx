import React from 'react';
import styles from './index.module.css';

const Type = ({
  children
}) => {
  return (
    <span className={styles.text}>&lt;{children}&gt;</span>
  );
}

export default Type;
