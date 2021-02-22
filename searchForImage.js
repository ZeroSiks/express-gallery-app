const fs = require("fs");
const models = require("./models");
const Danbooru = require("danbooru");
const {
  searchFolder,
  destinationFolder,
  notFoundFolder,
  sagiriKey,
} = require("./config.json");
const booru = new Danbooru();
const Bottleneck = require("bottleneck");
const sagiri = require("sagiri");
const client = sagiri(sagiriKey, {
  results: 2,
});
const limiter = new Bottleneck({
  reservoir: 200,
  reservoirRefreshAmount: 200,
  reservoirRefreshInterval: 24 * 60 * 60 * 1000, // must be divisible by 250
  maxConcurrent: 1,
  minTime: 5995,
});
const pixivName = new RegExp(/^(\d{8}_[p]\d+)/);
const imgExt = ["jpg", "jpeg", "png", "gif"];

setDanbooruData = async function (post, image_id) {
  if (post.id) {
    return (postData = {
      danbooru_id: post.id,
      upload_date: post.created_at,
      uploader_id: post.uploader_id,
      rating: post.rating,
      image_width: post.image_width,
      image_height: post.image_height,
      file_ext: post.file_ext,
      pixiv_id: post.pixiv_id,
      tag_general: post.tag_string_general.split(" "),
      characters: post.tag_string_character.split(" "),
      material: post.tag_string_copyright.split(" "),
      artist: post.tag_string_artist,
      file_size: post.file_size,
      source: post.source,
    });
    // console.log("POTT ===== " + postData.artist);
  } else {
    console.log("ID Missing! " + image_id);
    // console.log(post.source);
    return false;
  }
};

const danbooruByPixivID = async (image_id) => {
  return booru.posts({ tags: `pixiv:${image_id}` }).then((post) => {
    if (typeof post[0] === "object" && post[0] !== null) {
      // console.log(post);
      return setDanbooruData(post[0], image_id);
    } else return false;
    // console.log(post);
  });
};

const danbooruByID = async (image_id) => {
  return booru.posts(parseInt(image_id)).then(async (post) => {
    if (post) {
      return (postData = await setDanbooruData(post, image_id));
    } else return false;
  });
};

const renameFile = (searchFolder, destinationFolder, file, newname) => {
  fs.rename(searchFolder + file, destinationFolder + newname, (err) => {
    if (err) console.log(err);
  });
};

limiter.on("idle", async function () {
  await new Promise((r) => setTimeout(r, 2000));
  console.log("Completed.");
});

const searchImage = async function (searchFolder, file, ext) {
  try {
    await new Promise((r) => setTimeout(r, 3000));
    const results = await limiter.schedule(() =>
      client(searchFolder + file, { mask: [9] })
    );
    const newNewName = await results[0];
    console.log("Similarity = " + newNewName.similarity);
    if (newNewName && newNewName.similarity > 90) {
      const newstr = newNewName.raw.data.danbooru_id;
      console.log(
        "File will be renamed from " + file + " ===> " + newstr + "." + ext
      );
      return newstr;
    } else {
      console.log("Image was not found ==> " + file);
      renameFile(searchFolder, notFoundFolder, file, file);
      return false;
    }
  } catch (err) {
    console.log(err);
  }
  // limiter.currentReservoir().then((reservoir) => console.log(reservoir));
};

const pushToGallery = function (data) {
  return models.Gallery.findOne({
    where: {
      danbooru_id: data.danbooru_id,
    },
  }).then((lead) => {
    if (!lead) {
      return models.Gallery.create({
        danbooru_id: data.danbooru_id,
        upload_date: data.upload_date,
        uploader_id: data.uploader_id,
        rating: data.rating,
        image_width: data.image_width,
        image_height: data.image_height,
        file_ext: data.file_ext,
        pixiv_id: data.pixiv_id,
        tag_general: data.tag_general,
        material: data.material,
        characters: data.characters,
        artist: data.artist,
        file_size: data.file_size,
        source: data.source,
        image_name: data.image_name,
      }).then((lead) => {
        // console.log("/gallery/b");
      });
    } else console.log("image already exists");
  });
};

exports.searchRename = async function () {
  const files = fs.readdirSync(searchFolder);
  console.log("There are " + files.length + " files in this folder");
  for (const file of files) {
    const ext = file.split(".").pop();
    if (imgExt.includes(ext)) {
      if (pixivName.test(file) == true) {
        // console.log(file);
        danbooruByPixivID(file).then((imageData) => {
          if (imageData != false) {
            imageData.image_name = file;
            pushToGallery(imageData);
            renameFile(searchFolder, destinationFolder, file, file);
          } else {
            renameFile(searchFolder, notFoundFolder, file, file);
          }
        });
        // console.log(imageData);
      } else {
        searchImage(searchFolder, file, ext).then(async (imageID) => {
          if (imageID != false) {
            const imageData = await danbooruByID(imageID);
            if (imageData != false) {
              imageData.image_name = imageID + "." + ext;
              pushToGallery(imageData);
              renameFile(
                searchFolder,
                destinationFolder,
                file,
                imageID + "." + ext
              );
            } else {
              renameFile(searchFolder, notFoundFolder, file, file);
            }
          }
        });
      }
    } else {
      console.log(file + " is not an image!");
    }
  }
};
