import {Text, TouchableOpacity, View} from 'react-native';

import { formatTitle } from '../../utils';

// A component that represents the facade of an album (not the folders underneath).
export default function Album({title, status, onStatus}) {
  // TODO: Include thumbnails consists of folders

  const handleStatus = () => {
    onStatus({...status, state: 'inAlbum', selectedAlbum: title});
  };

  return (
    <View style={{alignItems: 'center', marginBottom: 20, marginRight: 15}}>
      <TouchableOpacity
        onPress={handleStatus}
        style={{width: 110, height: 110, backgroundColor: 'white'}}
      />
      <Text>{formatTitle({title})}</Text>
    </View>
  );
}
