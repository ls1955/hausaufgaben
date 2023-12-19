import {Text, TouchableOpacity, View} from 'react-native';

export default function Folder({name, uris, status, onStatus}) {
  // Update the state before going into folder's photos
  handleStatus = () => {
    onStatus({...status, state: "inFolder", selectedFolder: name})
  };

  return (
    <View style={{alignItems: 'center', marginBottom: 20}}>
      <TouchableOpacity
        onPress={handleStatus}
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'white',
        }}></TouchableOpacity>
      <Text>{name}</Text>
    </View>
  );
}
