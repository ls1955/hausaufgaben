import {StyleSheet, Text} from 'react-native';

// A Text-like component that abbreviate given text if it exceed one line.
export default function TitleText({style = {}, children}) {
  return (
    <Text
      numberOfLines={1}
      ellipsizeMode="tail"
      style={[styles.default, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  default: {fontWeight: 'bold', textAlign: 'center'},
});
