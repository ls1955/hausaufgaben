import {useContext} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import {FoldersContext} from '../../contexts/FoldersContext';
import {formatTitle} from '../../utils';

// A component that represent a folder cover.
export default function Folder({title, navigation}) {
  const handleNav = () => navigation.navigate('FolderContents', {title});

  const count = useContext(FoldersContext)[title].count;

  return (
    <View style={{alignItems: 'center', marginBottom: 20, marginRight: 15}}>
      <TouchableOpacity
        onPress={handleNav}
        style={{width: 110, height: 110, backgroundColor: 'white'}}
      />
      <Text style={{fontWeight: "bold"}}>{formatTitle({title})}</Text>
      <Text style={{fontSize: 12, marginTop: 2}}>{count}</Text>
    </View>
  );
}
