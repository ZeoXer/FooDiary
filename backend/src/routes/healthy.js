const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const healthyCollection = {
    healthy: { type : String },
}

const Healthy = mongoose.model('Healthy', healthyCollection, 'healthy');

router.get('/', async (req, res) => {
    try {
        const healthy_status = await Healthy.find();
        if (healthy_status.length === 0) {
            console.log("Is empty!");
        }
        console.log("db data:", healthy_status);
        res.status(200).json(healthy_status);
    } catch (err) {
        res.status(500).json({ message: 'database search error (healthy api)', error: err });
    }
});

module.exports = router;