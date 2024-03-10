const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single('image'), async (req, res) => {
    const folderName = req.body.folderName;
    try {
        const result = await cloudinary.uploader.upload_stream({
        folder: folderName
        }, (error, result) => {
            if (error) throw new Error(error);
            res.json({ imageUrl: result.secure_url });
        }).end(req.file.buffer);
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        res.status(500).send('Server error uploading image');
    }
});

module.exports = router;