import React from 'react';
import styles from './index.module.css';
import clsx from 'clsx';

const Tag: React.FC<{
  type: 'browser' | 'node.js'
}> = ({
  type
}) => {
  return <span className={clsx(styles.text, {[styles.secondary]: type === 'browser'})}>{type}</span>
};

export default Tag;
