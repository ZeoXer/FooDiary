const express = require('express');
const router = express.Router();
const { createUserData } = require('../controllers/user/createUserData');
const { editUserData } = require('../controllers/user/editUserData');
const { updatePassword } = require('../controllers/user/updataPassword');
const { deleteUser } = require('../controllers/user/deleteUser');
const { getUserData } = require('../controllers/user/getUserData');

// 更新密碼
router.put('/updatePassword', updatePassword); 

// 建立使用者資料
router.post('/createUserData', createUserData); 

// 修改使用者資料
router.put('/editUserData', editUserData); 

// 刪除使用者
router.delete('/deleteUser', deleteUser); 

// 取得使用者資料
router.get('/getUserData', getUserData); 


module.exports = router;
