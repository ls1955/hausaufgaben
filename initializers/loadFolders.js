import {CameraRoll} from '@react-native-camera-roll/camera-roll';

// Returns all folders title and count from this device. 
export default loadFolders = async () => {
  const folders = await CameraRoll.getAlbums();
  const newFolders = {};

  folders.forEach((item) => {
    newFolders[item['title']] = {count: item['count'], imageUris: []}
  });

  return newFolders;
};
