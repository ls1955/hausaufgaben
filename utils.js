import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {openDocumentTree, moveFile, listFiles} from 'react-native-saf-x';

import {MAX_IMAGE_PER_FOLDER} from './appConfigs';

// Returns an array of image URIs (String) of given folderTitle.
const getImageUris = async ({folderTitle}) => {
  const photos = await CameraRoll.getPhotos({
    first: MAX_IMAGE_PER_FOLDER,
    groupName: folderTitle,
  });

  return photos.edges.map(edge => edge.node.image.uri);
};

// Shorten giving title if it exceed given length, length is default to 10.
const formatTitle = ({title, length = 10}) => {
  return title.length <= length ? title : `${title.substring(0, 7)}...`;
};

// Moves all the images and videos from Download directory automatically into new directory.
// The new directory will be determined by given folder name input.
const organizeDownloadFolder = async ({folder}) => {
  const {srcDir, defaultDir, doujinDir} = await checkScopedStoragePermissions();

  if (!(srcDir && defaultDir && doujinDir)) {
    console.error(
      'Please give permissions for source, default and doujin directory',
    );
    return;
  }

  let srcFiles = await listFiles(srcDir.uri);
  srcFiles = srcFiles.filter(f => /\.(jpg|jpeg|png|gif|mp4)$/.test(f.name));

  if (srcFiles.length === 0) {
    console.error(
      'No file to move. Please ensure files exist and corrected directories are selected.',
    );
    return;
  }

  for (const f of srcFiles) {
    const srcUri = `${srcDir.uri}/${f.name}`;
    // NOTE: Extract base uri decision logic
    const destBaseUri = folder.startsWith('本子')
      ? doujinDir.uri
      : defaultDir.uri;
    const destUri = `${destBaseUri}/${folder}/${f.name}`;

    // NOTE: Replace existing files with same name.
    await moveFile(srcUri, destUri, {replaceIfDestinationExists: true});
  }
};

// Check if srcDir, defaultDir and doujinDir are granted permissions.
// Return an object containing three dir (null for any dir that do not have permission).
const checkScopedStoragePermissions = async () => {
  try {
    // The source dir. Usually is the download folder
    let srcDir = await AsyncStorage.getItem('srcDir');
    if (srcDir == null) {
      srcDir = await requestScopedStoragePermission('srcDir');
    }

    // The default dir to use when storing medias
    let defaultDir = await AsyncStorage.getItem('defaultDir');
    if (defaultDir == null) {
      defaultDir = await requestScopedStoragePermission('defaultDir');
    }

    // The dir to use when storing doujin, vanilla...
    let doujinDir = await AsyncStorage.getItem('doujinDir');
    if (doujinDir == null) {
      doujinDir = await requestScopedStoragePermission('doujinDir');
    }

    return {srcDir, defaultDir, doujinDir};
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Request the scoped storage permission for given dirName, return dir of dirName if granted, else null.
// This function is use when the permission hasn't been granted before.
const requestScopedStoragePermission = async dirName => {
  // WARNING: On author device, select SD CARD ROOT Directory will BLOW UP the app.
  const dir = await openDocumentTree(true);

  if (dir == null) throw `The access for ${dirName} is not granted.`;

  await AsyncStorage.setItem(dirName, JSON.stringify(dir));
  return dir;
};

// TODO: Expose an option of resetting scoped storage permissions?

export {
  getImageUris,
  formatTitle,
  organizeDownloadFolder,
  checkScopedStoragePermissions,
  requestScopedStoragePermission,
};
