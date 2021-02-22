const models = require("../models");
const { searchRename } = require("../searchForImage");

exports.get_full_images = function (req, res, next) {
  res.render("gallery/fullhd", {
    title: "Express",
    images: datas,
    user: req.user,
  });
};

exports.show_image = function (req, res, next) {
  return models.Gallery.findOne({
    where: {
      danbooru_id: req.params.image_id,
    },
  }).then((image) => {
    if (image) {
      res.render("gallery/image", {
        title: "Express",
        image: image.dataValues,
        user: req.user,
      });
    } else res.redirect("/gallery");
  });
};

exports.show_images = function (req, res, next) {
  return models.Gallery.findAll().then((images) => {
    if (images) {
      // console.log(images[0].dataValues.image_name);
      res.render("gallery", {
        title: "Express",
        images: images,
        user: req.user,
      });
    } else res.redirect("/gallery");

    // res.render("lead/leads", {
    //   title: "Express",
    //   leads: leads,
    //   user: req.user,
    // });
    // console.log(leads);
  });
};
// console.log(show_images());

exports.submit_image = function (req, res, next) {
  searchRename().then(() => {
    res.redirect("/gallery");
  });

  // console.log("lead email:", req.body.lead_email);
};

exports.delete_image = function (req, res, next) {
  return models.Gallery.destroy({
    where: {
      danbooru_id: req.params.image_id,
    },
  }).then((result) => {
    res.redirect("/gallery");
  });
};
