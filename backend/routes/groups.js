const express = require('express');
const router = express.Router();

const groupsCtrl = require('../controller/group');


router.get('/new', groupsCtrl.new);

router.post('/', groupsCtrl.create);

module.exports = router;