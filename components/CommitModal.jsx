import {Modal, Pressable, Text, TextInput, View} from 'react-native';
import {useState} from 'react';

import {organizeDownloadFolder} from '../utils';

// This modal is show when user want to move downloaded images/videos into a new directory.
// It includes a folder name text input, and predefined options (like Vanilla, Doujin, etc...)
// is plan to be included in the future.
export default function CommitModal({status, onStatus}) {
  const [folderTitle, setFolderTitle] = useState('');

  const handleCommit = async () => {
    try {
      await organizeDownloadFolder({folder: folderTitle});
      console.log('The files had been successfully moved.');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={true}
      onRequestClose={() => onStatus({...status, showModal: false})}>
      <View>
        <TextInput
          onChangeText={setFolderTitle}
          placeholder="folder-name"
          value={folderTitle}
          autoFocus={true}
        />
        <View>
          <Pressable onPress={handleCommit}>
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
