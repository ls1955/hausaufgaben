import {Text, TouchableOpacity, View} from 'react-native';

import {formatTitle} from '../../utils';

// A component that represent a folder cover.
export default function Folder({title, navigation}) {
  const handleNav = () => navigation.navigate('FolderContents', {title});

  return (
    <View style={{alignItems: 'center', marginBottom: 20, marginRight: 15}}>
      <TouchableOpacity
        onPress={handleNav}
        style={{width: 110, height: 110, backgroundColor: 'white'}}
      />
      <Text>{formatTitle({title})}</Text>
    </View>
  );
}
