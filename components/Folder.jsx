import {Text, TouchableOpacity, View} from 'react-native';

export default function Folder({title, status, onStatus, fromAlbum = false}) {
  handleStatus = () => {
    const newState = fromAlbum ? 'inFolderFromAlbum' : 'inFolder';
    onStatus({...status, state: newState, selectedFolder: title});
  };

  return (
    <View style={{alignItems: 'center', marginBottom: 20, marginRight: 15}}>
      <TouchableOpacity
        onPress={handleStatus}
        style={{
          width: 110,
          height: 110,
          backgroundColor: 'white',
        }}></TouchableOpacity>
      <Text>{title}</Text>
    </View>
  );
}
