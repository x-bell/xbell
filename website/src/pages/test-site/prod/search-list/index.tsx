import React from 'react';
import SearchList, { CardInfo } from '@site/src/components/SearchList';
import Header from '@site/src/components/Header';
import { ContextProvider } from '@site/src/components/Context';

const dataSource: CardInfo[] = [
  {
    username: '皮卡丘',
    avatar: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/test-website/avatar/pikachu.png',
  },
  {
    username: '可达鸭',
    avatar: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/test-website/avatar/psyduck.png',
  },
  {
    username: '伊布',
    avatar: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/test-website/avatar/eevee.png',
  },
  {
    username: '小火龙',
    avatar: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/test-website/avatar/charmander.png',
  },
  {
    username: '马里奥',
    avatar: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/test-website/avatar/super_mario.png',
  },
  {
    username: '妙蛙种子',
    avatar: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/test-website/avatar/bullbasaur.png'
  },
  {
    username: '胖丁',
    avatar: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/test-website/avatar/jigglypuff.png',
  },
  {
    username: '杰尼龟',
    avatar: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/test-website/avatar/squirtle.png',
  },
  {
    username: '喵喵',
    avatar: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/test-website/avatar/meowth.png',
  },
  {
    username: '卡比兽',
    avatar: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/test-website/avatar/snorlax.png',
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
