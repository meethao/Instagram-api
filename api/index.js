const router = module.exports = require('express').Router();

router.use('/comments', require('./comments').router);
router.use('/posts', require('./posts').router);
router.use('/likes', require('./likes').router);
router.use('/users', require('./users').router);