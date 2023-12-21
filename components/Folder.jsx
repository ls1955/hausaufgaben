import {Text, TouchableOpacity, View} from 'react-native';

import { formatTitle } from '../utils';

export default function Folder({title, status, onStatus, isFromAlbum}) {
  handleStatus = () => {
    const newState = isFromAlbum ? 'inFolderFromAlbum' : 'inFolder';
    onStatus({...status, state: newState, selectedFolder: title});
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
