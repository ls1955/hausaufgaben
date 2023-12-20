Recommend to skim through this before reading the source code.

Relationships
* album => a group of folder
* folder => a group of photo

Variables
```
albums
  key => album's title (String)
  value => folder's title (Set)

folders
  key => folder' title (String)
  value => {
    count (Number)
    imageUris (Array of String)
  } (Object)
```

Notes
* "album" in CameraRoll === "folder" in this project
