const mongoose = require("mongoose");

// 定義 FoodContent 子結構
const foodContentSchema = new mongoose.Schema({
    foodName: { type: String, required: true, trim: true }, 
    weightInGram: { type: Number, required: true, min: 0 }, 
    calories: { type: Number, required: true, min: 0 }, 
    suggestion: { type: String, trim: true } 
});

// 定義 Record Schema
const recordSchema = new mongoose.Schema({
    userID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    whichMeal: { 
        type: String, 
        required: true, 
        enum: ["Breakfast", "Lunch", "Dinner", "Snack"], 
        trim: true 
    },
    mealTime: { type: Date, required: true }, 
    foodContent: { 
        type: [foodContentSchema], 
        required: true,
        validate: [arrayLimit, "至少需要一項食物內容"]
    }
});

// 驗證食物內容是否至少有一項
function arrayLimit(val) {
    return val.length > 0;
}

const Record = mongoose.model("Record", recordSchema);

module.exports = { Record };
