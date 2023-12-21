// This file contains various configurations related to the App itself.

// Maximum image amount per folder. It exists because CameraRoll require an image amount when
// fetching photos. Modify this if you think this isn't enough.
const MAX_IMAGE_PER_FOLDER = 300;

// Folders that do not wanna be put into a group.
const NON_GROUP_FOLDERS = new Set(['Download', 'Whatsapp', '相机', '下载']);

export {MAX_IMAGE_PER_FOLDER, NON_GROUP_FOLDERS};
