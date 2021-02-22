"use strict";
module.exports = (sequelize, DataTypes) => {
  var Gallery = sequelize.define("Gallery", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    danbooru_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    gelbooru_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    upload_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    uploader_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    image_width: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    image_height: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    rating: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    file_ext: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pixiv_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    tag_general: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    material: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    characters: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    artist: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    file_size: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return Gallery;
};
