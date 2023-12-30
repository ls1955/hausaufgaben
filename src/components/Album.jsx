import { useContext } from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import { AlbumsContext } from '../../contexts/AlbumsContext';
import {formatTitle} from '../../utils';

// A component that represents an album cover.
export default function Album({title, navigation}) {
  // TODO: Include thumbnails consists of folders

  const count = useContext(AlbumsContext)[title].size;

  const handleNav = () => navigation.navigate('AlbumFolders', {title});

  return (
    <View style={{alignItems: 'center', marginBottom: 20, marginRight: 15}}>
      <TouchableOpacity
        onPress={handleNav}
        style={{width: 110, height: 110, backgroundColor: 'white'}}
      />
      <Text style={{fontWeight: "bold"}}>{formatTitle({title})}</Text>
      <Text style={{fontSize: 12, marginTop: 2}}>{count}</Text>
    </View>
  );
}
