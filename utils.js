import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {openDocumentTree, moveFile, listFiles} from 'react-native-saf-x';
import {showMessage} from 'react-native-flash-message';

import {
  APP_NAME,
  MAX_IMAGE_PER_FOLDER,
  PERMISSION_REQUIRED_DIRECTORIES,
} from './appConfigs';

// Returns an array of media URIs (String) of given folderTitle.
const getMediaUris = async ({folderTitle, first = MAX_IMAGE_PER_FOLDER}) => {
  const photos = await CameraRoll.getPhotos({
    first,
    groupName: folderTitle,
  });

  return photos.edges.map(edge => edge.node.image.uri);
};

// Returns the first media URIs of folderTitle.
const getThumbnailUri = async ({folderTitle}) => {
  const photos = await getMediaUris({folderTitle, first: 1});
  return photos[0];
};

// Abbreviate title if it exceed *maxLength*.
const abbreviate = ({title, maxLength = 15}) => {
  return title.length <= maxLength
    ? title
    : `${title.substring(0, maxLength - 3)}...`;
};

const INVALID_FILE_CHAR = /[\/:*?"<>|]/g;
// Returns a new folderTitle where invalid file characters are remove.
const sanitize = ({folderTitle}) => {
  return folderTitle.replaceAll(INVALID_FILE_CHAR, '');
};

const sortObjectByKeyAlphabetically = ({object, ignoreCase = false}) => {
  if (ignoreCase) {
    const collator = new Intl.Collator();
    return Object.fromEntries(
      Object.entries(object).sort((a, b) => {
        return collator.compare(a[0].toLowerCase(), b[0].toLowerCase());
      }),
    );
  }
  return Object.fromEntries(Object.entries(object).sort());
};

const sortSetNumerically = ({set}) => {
  return new Set(
    [...set].sort((a, b) => toNumber({str: a}) - toNumber({str: b})),
  );
};

// Moves all the images and videos from Download directory automatically into new directory.
// The new directory will be determined by given folder name input.
const organizeDownloadFolder = async ({
  folderTitle,
  category,
  isToStaging,
  albums,
}) => {
  const dirs = await checkScopedStoragePermissions();

  if (Object.keys(dirs).length === 0) {
    console.error('Please give permissions to all required directories');
    return;
  }

  const assets = await getAssets({uri: dirs.downloadDir.uri});

  await moveAssets({
    assets,
    folder: sanitize({folderTitle}),
    category,
    albums,
    dirs,
    isToStaging,
  });
};

// Check if required directories had granted permissions. Return an object containing
// these dir (empty object if any dir fail to have have permission).
const checkScopedStoragePermissions = async () => {
  const result = {};

  for (const dirName of PERMISSION_REQUIRED_DIRECTORIES) {
    let dir = await AsyncStorage.getItem(dirName);

    if (dir == null) {
      dir = await requestScopedStoragePermission(dirName);
    } else {
      dir = JSON.parse(dir);
    }

    // if the permission is still not granted, we are done
    if (dir == null) {
      console.log(
        `Permission for ${dir} is not granted, please give the permission.`,
      );
      return {};
    }
    result[dirName] = dir;
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
// react-native-saf-x from given uri. Return empty array if no files.
const getAssets = async ({uri}) => {
  try {
    let assets = await listFiles(uri);

    return assets.filter(asset => /\.(jpg|jpeg|png|gif|mp4)$/.test(asset.name));
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Move the assets to their correct destination.
const moveAssets = async ({
  assets,
  folder,
  category,
  albums,
  dirs,
  isToStaging,
}) => {
  if (assets.length === 0) {
    console.info(
      'No file to move. Please ensure files exist in download directory.',
    );
    return;
  }

  const {downloadDir} = dirs;

  for (const asset of assets) {
    const srcUri = `${downloadDir.uri}/${asset.name}`;

    let folderPath = getNewFolderPath({
      category,
      isToStaging,
      albums,
      dirs,
      folder,
    });
    const destUri = `${folderPath}/${asset.name}`;

    // NOTE: will replace existing same file
    await moveFile(srcUri, destUri, {replaceIfDestinationExists: true});
  }
};

// Returns a new folder path.
const getNewFolderPath = ({category, isToStaging, albums, dirs, folder}) => {
  const {defaultDir, doujinDir, stagingDir} = dirs;

  if (isToStaging) return `${stagingDir.uri}/${folder}`;

  try {
    if (category === 'doujin') {
      let albumTitle = '本子';
      let folderIds = [...albums[albumTitle]].map(title =>
        toNumber({str: title}),
      );
      let latestId = Math.max(...folderIds) + 1;
      return `${doujinDir.uri}/${albumTitle}${latestId}`;
    } else if (category === 'vanilla') {
      let albumTitle = 'Vanilla';
      let folderIds = [...albums[albumTitle]].map(title =>
        toNumber({str: title}),
      );
      let latestId = Math.max(...folderIds) + 1;
      return `${doujinDir.uri}/${albumTitle}${latestId}`;
    }
  } catch (error) {
    throw 'Album did not exist when organize via category. Did you use the correct appConfig? Throw from getNewFolderPath.';
  }

  return `${defaultDir.uri}/${folder}`;
};

// Return the number from str. Only use the first consequences of encountered digits as result.
// Return -1 if the str does not contain any digits.
const toNumber = ({str}) => {
  let match = str.match(/\d+/);

  if (match == null) return -1;

  return +str.match(/\d+/)[0];
};

const showErrorFlash = ({error}) => {
  const type = 'danger';
  showMessage({
    message: APP_NAME,
    description: error.message,
    type,
    duration: 4000,
  });
};

const showInvalidInputFlash = () => {
  const description = 'Please enter a folder title or category.';
  const type = 'default';
  showMessage({message: APP_NAME, description, type, duration: 3000});
};

const showSuccessOrganizeFlash = () => {
  const description = 'Finish organize download folder.';
  showMessage({message: APP_NAME, description, type: 'success'});
};

// TODO: Expose an option of resetting scoped storage permissions?

export {
  abbreviate,
  checkScopedStoragePermissions,
  getMediaUris,
  getThumbnailUri,
  organizeDownloadFolder,
  requestScopedStoragePermission,
  showErrorFlash,
  showInvalidInputFlash,
  showSuccessOrganizeFlash,
  sortObjectByKeyAlphabetically,
  sortSetNumerically,
};
