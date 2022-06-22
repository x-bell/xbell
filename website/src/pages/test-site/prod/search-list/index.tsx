import React from 'react';
import SearchList, { CardInfo } from '@site/src/components/SearchList';
import Header from '@site/src/components/Header';
import { ContextProvider } from '@site/src/components/Context';

const dataSource: CardInfo[] = [
  {
    username: '皮卡丘',
    avatar: 'avatar/pikachu.png',
  },
  {
    username: '可达鸭',
    avatar: 'avatar/psyduck.png',
  },
  {
    username: '伊布',
    avatar: 'avatar/eevee.png',
  },
  {
    username: '小火龙',
    avatar: 'avatar/charmander.png',
  },
  {
    username: '马里奥',
    avatar: 'avatar/super_mario.png',
  },
  {
    username: '妙蛙种子',
    avatar: 'avatar/bullbasaur.png'
  },
  {
    username: '胖丁',
    avatar: 'avatar/jigglypuff.png',
  },
  {
    username: '杰尼龟',
    avatar: 'avatar/squirtle.png',
  },
  {
    username: '喵喵',
    avatar: 'avatar/meowth.png',
  },
  {
    username: '卡比兽',
    avatar: 'avatar/snorlax.png',
  },
];

const SearchListPage: React.FC = () => {
  return (
    <ContextProvider>
      <Header />
      <SearchList dataSource={dataSource} />
    </ContextProvider>
  );
}

export default SearchListPage;
