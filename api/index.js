const router = require("express").Router();

router.use("/comments", require("./comments"));
router.use("/posts", require("./posts"));
router.use("/likes", require("./likes"));
router.use("/users", require("./users"));
router.use("/videos", require("./videos"));

module.exports = router;
