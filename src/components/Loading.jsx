import {ActivityIndicator, View, Text} from 'react-native';
import { DarkTheme } from '@react-navigation/native';

// A component that show a spinning thingy and loading text.
export default function Loading() {
  return (
    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      <ActivityIndicator color={DarkTheme.colors.text} size={50} />
      <Text>Loading, please wait...</Text>
    </View>
  );
}
