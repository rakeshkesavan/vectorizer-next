"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const cors_1 = __importDefault(require("cors"));
const vectorizer_1 = require("@neplex/vectorizer");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const promises_1 = require("fs/promises");
const app = (0, express_1.default)();
const port = 5000;
// Use the CORS middleware
app.use((0, cors_1.default)());
// Ensure the uploads directory exists
const uploadsDir = path_1.default.join(__dirname, 'uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir);
}
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path_1.default.extname(file.originalname)); // Appends the file extension
    },
});
const upload = (0, multer_1.default)({ storage: storage });
app.post('/upload', upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const imagePath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    if (!imagePath) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    try {
        // Read the file using readFile
        const imageBuffer = yield (0, promises_1.readFile)(imagePath);
        // Vectorize the image using the correct usage of vectorizer
        const svg = yield (0, vectorizer_1.vectorize)(imageBuffer, {
            colorMode: 0 /* ColorMode.Color */,
            colorPrecision: 6,
            filterSpeckle: 4,
            spliceThreshold: 45,
            cornerThreshold: 60,
            hierarchical: 0 /* Hierarchical.Stacked */,
            mode: 2 /* PathSimplifyMode.Spline */,
            layerDifference: 5,
            lengthThreshold: 5,
            maxIterations: 2,
            pathPrecision: 5,
        });
        const vectorPath = path_1.default.join(uploadsDir, `${path_1.default.basename(imagePath, path_1.default.extname(imagePath))}.svg`);
        // Write the vectorized SVG to a file using writeFile
        yield (0, promises_1.writeFile)(vectorPath, svg);
        res.json({ message: 'Image uploaded and vectorized successfully', vectorPath });
    }
    catch (error) {
        console.error('Error vectorizing image:', error);
        res.status(500).json({ message: 'Failed to process image' });
    }
}));
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
