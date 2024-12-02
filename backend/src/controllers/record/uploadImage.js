// 
//

// 處理圖片上傳
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: '請提供圖片文件' });
        }

        res.status(200).json({message: '圖片上傳成功'});

    } catch (err) {

        console.error('圖片上傳錯誤:', err);
        res.status(500).json({ message: '伺服器錯誤', error: err.message });
    }
};

module.exports = { uploadImage };
