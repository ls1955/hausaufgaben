import { FlatList, SafeAreaView } from 'react-native';

import Album from './Album';
import Folder from './Folder';

import {nonGroupFolders} from '../app_configs';

// The page that shows the albums and folders.
export default function HomePage({
  foldersByAlbum,
  urisByFolder,
  status,
  onStatus,
}) {
  // albums and folders data, folders data will be append after albums'
  const data = Object.keys(foldersByAlbum).map((album, i) => {
    return {id: i, name: album, isAlbum: true};
  });
  // as using index as key, avoid duplicate key by adding previous data length as offset
  const offset = data.length;
  [...nonGroupFolders]
    .filter(folder => urisByFolder[folder] != null)
    .forEach((folder, i) =>
      data.push({id: i + offset, name: folder, isAlbum: false}),
    );

  const renderItem = ({item}) => {
    const props = {key: item.id, name: item.name, status, onStatus};
    return item.isAlbum ? <Album {...props} /> : <Folder {...props} />;
  };

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
