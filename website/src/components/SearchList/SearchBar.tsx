import React from 'react';
import { Input, Paper, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search'
import styled from '@emotion/styled';

const Root = styled(Paper)`
  height: 55px;
  width: 550px;
  display: flex;
  flex-direction: row;
  padding: 4px 14px;
`;

export type SearchBarProps = {
  onSearch(kw: string): void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch = () => {},
}) => {
  const [value, setValue] = React.useState('');
   const handleKeyUp: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.charCode === 13 || e.key === "Enter") {
      onSearch(value);
    }
  }
  return (
    <Root elevation={3}>
      <Input value={value} onChange={e => setValue(e.target.value)} onKeyUp={handleKeyUp} placeholder="搜索联系人" fullWidth disableUnderline />
      <IconButton onClick={() => onSearch(value)}>
        <SearchIcon />
      </IconButton>
    </Root>
  );
}

export default SearchBar;
