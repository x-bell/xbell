import React from 'react';
import SearchList, { CardInfo } from '@site/src/components/SearchList';
import Header from '@site/src/components/Header';
import { ContextProvider } from '@site/src/components/Context';

const dataSource: CardInfo[] = [
  {
    username: 'dev_皮卡丘',
    avatar: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/test-website/avatar/pikachu.png',
  },
  {
    username: 'dev_可达鸭',
    avatar: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/test-website/avatar/psyduck.png',
  },
  {
    username: 'dev_伊布',
    avatar: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/test-website/avatar/eevee.png',
  },
  {
    username: 'dev_小火龙',
    avatar: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/test-website/avatar/charmander.png',
  },
  {
    username: 'dev_马里奥',
    avatar: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/test-website/avatar/super_mario.png',
  },
  {
    username: 'dev_妙蛙种子',
    avatar: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/test-website/avatar/bullbasaur.png'
  },
  {
    username: 'dev_胖丁',
    avatar: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/test-website/avatar/jigglypuff.png',
  },
  {
    username: 'dev_杰尼龟',
    avatar: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/test-website/avatar/squirtle.png',
  },
  {
    username: 'dev_喵喵',
    avatar: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/test-website/avatar/meowth.png',
  },
  {
    username: 'dev_卡比兽',
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
