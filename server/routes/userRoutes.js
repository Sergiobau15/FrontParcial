const express = require('express');
const router = express.Router();
const { createUser, updateUser, updatePassword, getUser, getUsers, getUsersI,validationUser, desactivateUser } = require('../controllers/user');

router.post('/create', createUser);
router.post('/update', updateUser);
router.post('/password', updatePassword);
router.post('/validation', validationUser);
router.get('/desactivate/:id', desactivateUser);
router.get('/', getUsers);
router.get('/idle', getUsersI);
router.get('/user/:id', getUser);


module.exports = router;