import {Pressable, Text, TextInput, View} from 'react-native';
import {useState} from 'react';
import CheckBox from '@react-native-community/checkbox';
import SelectDropdown from 'react-native-select-dropdown';

import {organizeDownloadFolder} from '../../utils';
import {CATEGORY_OPTIONS} from '../../appConfigs';

// A modal that shows up for user to organize his/her download folder.
export default function OrganizeDownloadModal({navigation}) {
  const [folderTitle, setFolderTitle] = useState('');
  const [isToStaging, setIsToStaging] = useState(false);
  const [category, setCategory] = useState('');

  const handleOrganize = async () => {
    try {
      if (folderTitle === '' && category === '') {
        // TODO: notify with flash message
        console.log('Please enter a folderTitle or select a category');
        return;
      }
      await organizeDownloadFolder({title: folderTitle, category, isToStaging});
      // TODO: notify with a flash message.
    } catch (error) {
      // TODO: Warn with flash message.
      console.error(error);
    }
  };
  const handleClose = () => navigation.goBack();

  return (
    <View style={{backgroundColor: 'rgb(1,1,1)', top: '20%', padding: 20}}>
      <View>
        <FolderTitleInput value={folderTitle} onChangeText={setFolderTitle} />
        <Text>Or</Text>
        <CategorySelect onSelect={setCategory} />
      </View>
      <StagingCheckbox value={isToStaging} onValueChange={setIsToStaging} />
      <ActionButtons onOrganize={handleOrganize} onCancel={handleClose} />
    </View>
  );
}

function FolderTitleInput({value, onChangeText}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      autoFocus={true}
      placeholder="folder-name"
    />
  );
}

function CategorySelect({onSelect}) {
  return (
    <SelectDropdown
      data={CATEGORY_OPTIONS}
      onSelect={onSelect}
      buttonTextAfterSelection={item => item}
      defaultValue=""
    />
  );
}

function StagingCheckbox({value, onValueChange}) {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <CheckBox value={value} onValueChange={onValueChange} />
      <Text>To Staging Folder</Text>
    </View>
  );
}

function ActionButtons({onOrganize, onCancel}) {
  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
      <Pressable onPress={onOrganize}>
        <Text>Organize</Text>
      </Pressable>
      <Pressable onPress={onCancel}>
        <Text>Cancel</Text>
      </Pressable>
    </View>
  );
}
