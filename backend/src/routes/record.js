const express = require('express');
const router = express.Router();
const { addRecord } = require('../controllers/record/addRecord');
const { getSingleRecord } = require('../controllers/record/getSingleRecord');
const { getRecord } = require('../controllers/record/getRecord');
const { editRecord } = require('../controllers/record/editRecord');
const { deleteRecord } = require('../controllers/record/deleteRecord');
const { getCalories } = require('../controllers/record/getCalories');
const { uploadImage} = require('../controllers/record/uploadImage');
const { upload } = require('../config/upload');

// 新增飲食紀錄
router.post('/addRecord', addRecord); 

// 獲取單筆飲食紀錄
router.get('/getSingleRecord', getSingleRecord); 

// 獲取飲食紀錄
router.get('/getRecord', getRecord); 

// 編輯飲食紀錄
router.put('/editRecord', editRecord); 

// 刪除飲食紀錄
router.delete('/deleteRecord', deleteRecord); 

// 獲取卡路里
router.get('/getCalories', getCalories); 

// 上傳圖片
router.post('/uploadImage', upload.single('image'), uploadImage);

module.exports = router;