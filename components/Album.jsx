import {Text, View} from 'react-native';

// A component that contains folders.
export default function Album({name}) {
  // TODO: Include folders thumbnails?

  return (
    <View style={{flex: 1,alignItems: 'center', marginBottom: 20}}>
      <View style={{width: '90%', height: 110, backgroundColor: "yellow"}}></View>
      <Text>{name}</Text>
    </View>
  );
}
