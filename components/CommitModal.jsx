import {Modal, Pressable, Text, TextInput, View} from 'react-native';
import {useState} from 'react';

// This modal is show when user want to move downloaded images/videos into a new directory.
// It includes a folder name text input, and predefined options (like Vanilla, Doujin, etc...)
// is plan to be included in the future.
export default function CommitModal({status, onStatus}) {
  const [folderName, setFolderName] = useState('');

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={true}
      onRequestClose={() => onStatus({...status, showModal: false})}>
      <View>
        <TextInput
          onChangeText={setFolderName}
          placeholder="folder-name"
          value={folderName}
          autoFocus={true}
        />
        <View>
          <Pressable onPress={() => console.log("Commiting the file...")}>
            <Text>Commit</Text>
          </Pressable>
          <Pressable onPress={() => onStatus({...status, showModal: false})}>
            <Text>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
