import {FlatList, SafeAreaView} from 'react-native';

import Album from './Album';
import Folder from './Folder';

import {NON_GROUP_FOLDERS} from '../appConfigs';

// The page that shows the albums and folders.
export default function HomePage({albums, folders, status, onStatus}) {
  // albums and folders data, folders data will be append after albums'
  const data = Object.keys(albums).map((title, i) => {
    return {id: i, title, isAlbum: true};
  });

  // as using index as key, avoid duplicate key by adding previous data length as offset
  const offset = data.length;
  [...NON_GROUP_FOLDERS]
    .filter(title => folders[title] != null)
    .forEach((title, i) => data.push({id: i + offset, title, isAlbum: false}));

  const renderItem = ({item}) => {
    const props = {key: item.id, title: item.title, status, onStatus};
    return item.isAlbum ? <Album {...props} /> : <Folder {...props} />;
  };

  // TODO: Move this to appConfig.js
  // put numColumns into const to avoid changing number of columns dynamically
  const numColumns = 3;
  return (
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        key={numColumns}
        numColumns={numColumns}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
}
