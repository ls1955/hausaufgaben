import { NON_GROUP_FOLDERS } from "../appConfigs";

// Returns an albums object that contain grouped folders.
export default getGroupedAlbums = folders => {
  const albums = {};

  Object.keys(folders).forEach(folderTitle => {
    if (NON_GROUP_FOLDERS.has(folderTitle)) return;

    const albumTitle = folderTitle[0].toUpperCase();

    albums[albumTitle] = albums[albumTitle] ?? new Set();
    albums[albumTitle].add(folderTitle);
  })
  return albums;
};
