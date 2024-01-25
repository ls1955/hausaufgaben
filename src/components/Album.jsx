import {useContext} from 'react';
import {View} from 'react-native';

import {AlbumsContext} from '../contexts/AlbumsContext';
import Cover from './Cover';
import TitleText from './TitleText';

// A component that represents an album cover.
export default function Album({title, navigation}) {
  const count = useContext(AlbumsContext)[title].size;

  const handleNav = () => navigation.navigate('AlbumFolders', {title});

  return (
    <View style={{alignItems: 'center', marginBottom: 20, marginRight: 15}}>
      <Cover onNav={handleNav} />
      <TitleText>{title}</TitleText>
      <TitleText style={{fontSize: 12, marginTop: 2}}>{count}</TitleText>
    </View>
  );
}
