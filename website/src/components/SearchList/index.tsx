import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { CircularProgress, Typography } from '@mui/material';
import Card, { CardInfo } from './Card';
import SearchBar from './SearchBar';
import VisibilityIcon from '@mui/icons-material/Visibility';



const Root = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const List = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

const StyledCircularProgress = styled(CircularProgress)`
  margin-top: 40px;
`;

const Empty = styled.div`
  margin-top: 40px;
`;

const EmptyText = styled.div`
`;

// const Card: React.FC = () => {
//   return (
//     <div>

//     </div>
//   )
// }

export {
  CardInfo
}

const SearchList: React.FC<{
  dataSource: CardInfo[]
}> = ({
  dataSource = []
}) => {
  const [keywords, setKeywords] = React.useState('');
  // const displayList = React.useMemo(() => dataSource.filter(data => data.username.includes(keywrods)), [
  //   dataSource,
  //   keywrods
  // ]);
  const mockRequest = (kw: string) => {
    return new Promise<CardInfo[]>(resolve => {
      setTimeout(() => {
        const res = kw ? dataSource.filter(data => data.username.includes(kw)) : dataSource;
        resolve(res)
      }, 1500);
    })
  };
  const { loading, data } = useRequest(() => mockRequest(keywords), {
    refreshDeps: [keywords],
  })
  const ret = (() => {
    if (loading) {
      return <StyledCircularProgress  />
    }
    if (data?.length) {
      return data.map((cardInfo) => {
        return (
          <Card key={cardInfo.username} {...cardInfo} />
        )
      })
    }

    return (<Empty>
      <VisibilityIcon color="warning" sx={{ fontSize: 100 }} />
      <Typography color="GrayText">
        找不到联系人
      </Typography>
    </Empty>
    );
  })();
  return (
    <Root>
      <SearchBar onSearch={setKeywords} />
      <List className="list-container">
        {ret}
      </List>
    </Root>
  );
}

export default SearchList;
