const fs = require('fs');
const path = require('path');

// Path to the directory containing SVG files
const svgDirectory = './icons'; // Update this path to your SVG folder

// Base name for the output JSON file
const baseOutputJsonFile = 'svgs.json';

// Function to generate a unique JSON filename with today's date
function getOutputJsonFile() {
    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    const outputJsonFile = path.join('.', `${formattedDate}_${baseOutputJsonFile}`); // Update this path to where you want to save the JSON file

    // Check if the file already exists
    if (fs.existsSync(outputJsonFile)) {
        return outputJsonFile;
    }

    return outputJsonFile;
}

// Function to generate JSON file from SVG files in the directory
function generateSvgJson() {
    fs.readdir(svgDirectory, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        // Filter out only SVG files
        const svgFiles = files.filter(file => path.extname(file).toLowerCase() === '.svg');

        // Create JSON object
        const jsonContent = svgFiles;

        // Get the output JSON file path
        const outputJsonFile = getOutputJsonFile();

        // Write JSON file
        fs.writeFile(outputJsonFile, JSON.stringify(jsonContent, null, 4), (err) => {
            if (err) {
                console.error('Error writing JSON file:', err);
                return;
            }
            console.log('JSON file has been saved:', outputJsonFile);
        });
    });
}

// Run the function
generateSvgJson();
