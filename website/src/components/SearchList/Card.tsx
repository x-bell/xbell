import React from 'react';
import { Paper } from '@mui/material';
import styled from '@emotion/styled';
import useBaseUrl from '@docusaurus/useBaseUrl'

export type CardInfo = {
  username: string;
  avatar: string;
}

const Root = styled(Paper)`
  margin-bottom: 20px;
  padding: 12px;
  margin-right: 12px;
`;

const Img = styled.img`
  width: 250px;
`;

const Name = styled.div`
  font-size: 24px;
  margin-top: 8px;
  text-align: center;
`;

const Card: React.FC<CardInfo> = ({
  username,
  avatar
}) => {

  return (
    <Root elevation={3}>
      <Img src={useBaseUrl(avatar)} />
      <Name>
        {username}
      </Name>
    </Root>
  );
}

export default Card;
