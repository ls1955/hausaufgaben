import {Text, TouchableOpacity, View} from 'react-native';

export default function Folder({
  name,
  uris,
  status,
  onStatus,
  fromAlbum = false,
}) {
  // NOTE: Is uris prop obsolete?

  handleStatus = () => {
    const newState = fromAlbum ? 'inFolderFromAlbum' : 'inFolder';
    onStatus({...status, state: newState, selectedFolder: name});
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
      <Text>{name}</Text>
    </View>
  );
}
