import React from 'react';
import Button from '../../components/Button/Button';

const Homepage: React.FC = () => {
  return (
    <Button onClick={() => window.alert('hello xbell')}>
      button
    </Button>
  );
}

export default Homepage;
