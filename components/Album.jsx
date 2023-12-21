import {Text, TouchableOpacity, View} from 'react-native';

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
      <Text>{title}</Text>
    </View>
  );
}

// TOWRITE:
// Should update the status when itself is being clicked, such that folder
// underneath is display
// Should also include flag to notify that its going into folder from album
// Looks like we need another state here.
