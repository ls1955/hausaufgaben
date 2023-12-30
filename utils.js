import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {openDocumentTree, moveFile, listFiles} from 'react-native-saf-x';

import {
  MAX_IMAGE_PER_FOLDER,
  PERMISSION_REQUIRED_DIRECTORIES,
} from './appConfigs';

// Returns an array of media URIs (String) of given folderTitle.
const getMediaUris = async ({folderTitle}) => {
  const photos = await CameraRoll.getPhotos({
    first: MAX_IMAGE_PER_FOLDER,
    groupName: folderTitle,
  });

  return photos.edges.map(edge => edge.node.image.uri);
};

// Shorten giving album/folder title if it exceed given length, length is default to 10.
const formatTitle = ({title, length = 10}) => {
  return title.length <= length ? title : `${title.substring(0, 7)}...`;
};

// Moves all the images and videos from Download directory automatically into new directory.
// The new directory will be determined by given folder name input.
const organizeDownloadFolder = async ({folderTitle, category, isToStaging}) => {
  const dirs = await checkScopedStoragePermissions();

  if (Object.keys(dirs).length === 0) {
    console.error('Please give permissions to all required directories');
    return;
  }

  const {downloadDir} = dirs;
  const assets = await getAssets({dir: downloadDir});

  await moveAssets({assets, folder: folderTitle, category, dirs, isToStaging});
};

// Check if required directories had granted permissions. Return an object containing
// these dir (empty object if any dir fail to have have permission).
const checkScopedStoragePermissions = async () => {
  const result = {};

  for (const dirName of PERMISSION_REQUIRED_DIRECTORIES) {
    let dir = await AsyncStorage.getItem(dirName);

    if (dir == null) {
      dir = await requestScopedStoragePermission(dirName);
    }

    // if the permission is still not granted, we are done
    if (dir == null) {
      console.log(
        `Permission for ${dir} is not granted, please give the permission.`,
      );
      return {};
    }
    result[dir] = dir;
  }

  return result;
};

// Request the scoped storage permission for given dirName, return dir of dirName if granted, else null.
// This function is use when the permission hasn't been granted before.
const requestScopedStoragePermission = async dirName => {
  // WARNING: On author device, select SD CARD ROOT Directory will BLOW UP the app.
  const dir = await openDocumentTree(true);

  if (dir == null) return null;

  await AsyncStorage.setItem(dirName, JSON.stringify(dir));
  return dir;
};

// Return all the image, gifs or videos files' in <DocumentFileDetail> format of
// react-native-saf-x from dir.
const getAssets = async ({dir}) => {
  let assets = await listFiles(dir.uri);

  return assets.filter(ass => /\.(jpg|jpeg|png|gif|mp4)$/.test(ass.name));
};

// Move the assets to their correct destination.
const moveAssets = async ({assets, folder, category, dirs, isToStaging}) => {
  if (assets.length === 0) {
    console.error(
      'No file to move. Please ensure files exist in download directory.',
    );
    return;
  }

  const {downloadDir} = dirs;

  for (const asset of assets) {
    const srcUri = `${downloadDir.uri}/${ass.name}`;

    let folderPath = getNewFolderPath({category, isToStaging, dirs, folder});
    const destUri = `${folderPath}/${asset.name}`;

    // NOTE: will replace existing same file
    await moveFile(srcUri, destUri, {replaceIfDestinationExists: true});
  }
};

// Returns a new folder path.
const getNewFolderPath = ({category, isToStaging, dirs, folder}) => {
  const {defaultDir, doujinDir, stagingDir} = dirs;

  if (isToStaging) return `${stagingDir.uri}/${folder}`;

  switch(category) {
    // FIXME: The folder is usually "" if the category is set, have to figure out the folder name yourself
    case "doujin":
    case "vanilla":
      return `${doujinDir.uri}/${folder}`
  }

  return `${defaultDir.uri}/${folder}`;
};

// TODO: Expose an option of resetting scoped storage permissions?

export {
  getMediaUris,
  formatTitle,
  organizeDownloadFolder,
  checkScopedStoragePermissions,
  requestScopedStoragePermission,
};
