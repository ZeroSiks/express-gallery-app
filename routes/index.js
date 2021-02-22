var express = require("express");
var router = express.Router();

let landing = require("../controllers/landing");
let user = require("../controllers/user");
let gallery = require("../controllers/gallery");

let { isLoggedIn, hasAuth } = require("../middleware/hasAuth");

router.get("/login", user.show_login);
router.get("/signup", user.show_signup);
router.post("/login", user.login);
router.post("/signup", user.signup);
router.post("/logout", user.logout);
router.get("/logout", user.logout);
/* GET home page. */

router.post("/gallery", gallery.submit_image);
router.get("/gallery/", gallery.show_images);
router.get("/fullhd", gallery.get_full_images);
router.get("/gallery/:image_id", gallery.show_image);
router.post("/gallery/:image_id/delete_image", hasAuth, gallery.delete_image);

router.get("/", landing.get_landing);
router.post("/", landing.submit_lead);
router.get("/leads", hasAuth, landing.show_leads);
router.get("/lead/:lead_id", hasAuth, landing.show_lead);
router.get("/lead/:lead_id/edit", hasAuth, landing.show_edit_lead);
router.post("/lead/:lead_id/edit", hasAuth, landing.edit_lead);
router.post("/lead/:lead_id/delete", hasAuth, landing.delete_lead);
router.post("/lead/:lead_id/delete-json", hasAuth, landing.delete_lead_json);

module.exports = router;
