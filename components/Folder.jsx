import {Text, TouchableOpacity, View} from 'react-native';

export default function Folder({name, uris}) {
  return (
    <View style={{alignItems: 'center', marginBottom: 20}}>
      <TouchableOpacity
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'white',
        }}></TouchableOpacity>
      <Text>{name}</Text>
    </View>
  );
}
