import React from 'react';
import { Typography } from '@mui/material';
import styled from '@emotion/styled';

const Root = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ThrowError = () => {

  React.useEffect(() => {
    setTimeout(() => {
      throw new Error('抛一个错');
    })
  }, []);

  return (
    <Root>
      <Typography>
        看起来一切正常，但控制台报错了
      </Typography>
    </Root>
  )
}

export default ThrowError;
