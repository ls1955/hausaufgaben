import {Text, TouchableOpacity, View} from 'react-native';

// A component that represents the facade of an album (not the folders underneath).
export default function Album({name, status, onStatus}) {
  // TODO: Include thumbnails consists of folders

  const handleStatus = () => {
    onStatus({...status, state: 'inAlbum', selectedAlbum: name});
  };

  return (
    <View style={{alignItems: 'center', marginBottom: 20}}>
      <TouchableOpacity
        onPress={handleStatus}
        style={{width: 100, height: 100, backgroundColor: 'white'}}
      />
      <Text>{name}</Text>
    </View>
  );
}

// TOWRITE:
// Should update the status when itself is being clicked, such that folder
// underneath is display
// Should also include flag to notify that its going into folder from album
// Looks like we need another state here.
