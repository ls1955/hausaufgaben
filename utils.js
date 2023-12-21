import {CameraRoll} from '@react-native-camera-roll/camera-roll';

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
  return title.length <= length ? title : `${title.substring(0, 7)}...`
}

export {getImageUris, formatTitle};
