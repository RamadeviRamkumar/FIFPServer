const path = require("path");

const fetchLogFilePath = (fileName) => {
    const logDir = path.join(__dirname, "../utils");
    const filePath = path.join(logDir, fileName);

    if (!fileName.endsWith(".log")) {
        throw new Error("Invalid file format");
    }

    return filePath;
};

module.exports = {
    fetchLogFilePath,
};
