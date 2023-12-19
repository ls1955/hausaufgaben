import {Text, TouchableOpacity, View} from 'react-native';

// A component that contains folders.
export default function Album({name, status, onStatus}) {
  // TODO: Include thumbnails consists of folders
  // TODO: Include an onpressed event that update the status

  return (
    <View style={{flex: 1, alignItems: 'center', marginBottom: 20}}>
      <TouchableOpacity
        style={{width: '90%', height: 110, backgroundColor: 'grey'}}
      />
      <Text>{name}</Text>
    </View>
  );
}

// TOWRITE:
// An album that contain the name and thumbnails of its folders
// Should update the status when itself is being clicked, such that folder
// underneath is display
// Should also include flag to notify that its going into folder from album
// Looks like we need another state here.
