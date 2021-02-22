"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Galleries", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      danbooru_id: {
        type: Sequelize.INTEGER,
        unique: true,
      },
      gelbooru_id: {
        type: Sequelize.INTEGER,
        unique: true,
      },
      upload_date: {
        type: Sequelize.DATE,
      },
      uploader_id: {
        type: Sequelize.INTEGER,
      },
      image_width: {
        type: Sequelize.INTEGER,
      },
      image_height: {
        type: Sequelize.INTEGER,
      },
      rating: {
        type: Sequelize.STRING,
      },
      file_ext: {
        type: Sequelize.STRING,
      },
      pixiv_id: {
        type: Sequelize.INTEGER,
      },
      tag_general: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      material: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      characters: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      artist: {
        type: Sequelize.STRING,
      },
      file_size: {
        type: Sequelize.INTEGER,
      },
      source: {
        type: Sequelize.STRING,
      },
      image_name: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Gallery");
  },
};

// npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string

// npx sequelize-cli db:migrate

// npx sequelize-cli model:generate --name Gallery --attributes danbooru_id:integer,upload_date:date,uploader_id:integer,image_width:integer,image_height:integer,rating:string,file_ext:string,pixiv_id:integer,tag_general:array:string,material:array:string,characters:array:string,artist:string,file_size:integer,source:string,image_name:string
