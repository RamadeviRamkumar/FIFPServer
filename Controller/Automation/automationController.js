const puppeteer = require('puppeteer');
const categories = require('../../config/MutualFunds/performanceCategory');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const Performance = require('../../Models/MutualFunds/performanceDataModel');
const promisify = require("util").promisify;
const unlinkFile = promisify(fs.unlink);
const otherData = require('./otherData')
const equityData = require('./equityData')
const hybridData = require('./hybridData')
const solutionData = require('./solutionData')
const debtData = require('./debtData')


const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

exports.getAll = async (req, res) => {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args:[
                '--no-sandbox', '--disable-setuid-sandbox'
            ]
        });
        console.log("puppeteer is opened")
        const page = await browser.newPage();
        await page.setViewport({ width: 1250, height: 850 });
        await page.goto('https://www.amfiindia.com/');
        await sleep(5000);
        await page.click('.grid_3.omega');
        await sleep(5000);
        await page.click('.nav-box.last');
        await sleep(5000);
        await page.click('ul.otherdata > li:nth-child(5) > a');
        await sleep(8000);

        const allFrame = await page.frames();
        const fundPerformanceFrame = allFrame.find((frame) => frame.url().includes('valueresearchonline.com'));
        // const messageSelector = 'td[colspan="14"]'

        // const messageText = await fundPerformanceFrame.$eval(messageSelector, element => element.textContent.trim());

        // if (messageText === 'The underlying data is unavailable.') {
        //     console.log('Message found. Closing the browser.');
        //     await browser.close(); 
        //     return res.status(200).json({message:"The Data Not Available"})
        // }
console.log("started mf data download")
        if (fundPerformanceFrame) {
            const downloadPath = path.join(__dirname, 'downloads');
            if (!fs.existsSync(downloadPath)) {
                fs.mkdirSync(downloadPath);
            }

            await page._client().send('Page.setDownloadBehavior', {
                behavior: 'allow',
                downloadPath: downloadPath,
            });

            // Equity
            for (const category of categories.equityCategories) {
                await fundPerformanceFrame.select('#end-type', '1');
                await fundPerformanceFrame.select('#primary-category', 'SEQ');
                await fundPerformanceFrame.select('#category', category.value);
                await fundPerformanceFrame.select('#amc', 'ALL');
                await sleep(3000);
                await fundPerformanceFrame.click('.btn.btn-primary.amfi-btn');
                await sleep(5000);
                await fundPerformanceFrame.click('a#download-report-excel small');
                await sleep(3000);

                const files = fs.readdirSync(downloadPath);
                const downloadedFile = files.find(file => file.endsWith('.xls'));

                if (downloadedFile) {
                    const oldFilePath = path.join(downloadPath, downloadedFile);
                    const newFilePath = path.join(downloadPath, `Equity_${category.name}.xls`);
                    fs.renameSync(oldFilePath, newFilePath);
                    let counter = 1
                    console.log(`File renamed to: ${newFilePath}_${counter}`);
                    counter++

                    const workbook = await xlsx.readFile(newFilePath);
                    const sheetName = workbook.SheetNames[0];
                    const workSheet = workbook.Sheets[sheetName];

                    const range = workSheet['!ref'];
                    if (range) {
                        const [start, end] = range.split(':');
                        const lastRow = parseInt(end.replace(/[^\d]/g, ''));
                        const lastColumnIndex = xlsx.utils.decode_col(end.match(/[A-Z]+/)[0]);
                        console.log("Total rows: ", lastRow);
                        console.log("Total Columns:", lastColumnIndex + 1)

                        const startRow = 7;
                        for (let rowNumber = startRow; rowNumber <= lastRow; rowNumber++) {
                            const data = [];
                            for (let col = 1; col <= lastColumnIndex; col++) {
                                const cellAddress = xlsx.utils.encode_cell({ r: rowNumber - 1, c: col - 1 });
                                const cell = workSheet[cellAddress];
                                data.push(cell ? cell.v : null);
                            }

                            const isRowEmptyExceptFirstColumn = data.slice(1).every((value) => value === null);
                            if (isRowEmptyExceptFirstColumn) {
                                console.log(`Row ${rowNumber} skipped: Only column 1 has data.`);
                                continue;
                            }

                            const performanceData = equityData(data);
                            const isEmptyPerformance = Object.values(performanceData.NAV).every(val => val === null);
                            if (isEmptyPerformance) {
                                console.log(`Skipping empty performance data for row ${rowNumber}`);
                                continue;
                            }

                            const performance = new Performance(performanceData);
                            await performance.save();
                        }
                    } else {
                        console.log("No data range found in the sheet.");
                    }


                    await unlinkFile(newFilePath);

                } else {
                    console.log(`File for category ${category.name} not found`);
                }
            }

            // Debt

            for (const category of categories.deptCategories) {
                await fundPerformanceFrame.select('#end-type', '1');
                await fundPerformanceFrame.select('#primary-category', 'SDT');
                await fundPerformanceFrame.select('#category', category.value);
                await fundPerformanceFrame.select('#amc', 'ALL');
                await sleep(3000);
                await fundPerformanceFrame.click('.btn.btn-primary.amfi-btn');
                await sleep(5000);
                await fundPerformanceFrame.click('a#download-report-excel small');
                await sleep(3000);

                const files = fs.readdirSync(downloadPath);
                const downloadedFile = files.find(file => file.endsWith('.xls'));

                if (downloadedFile) {
                    const oldFilePath = path.join(downloadPath, downloadedFile);
                    const newFilePath = path.join(downloadPath, `Debt_${category.name}.xls`);
                    fs.renameSync(oldFilePath, newFilePath);
                    console.log(`File renamed to: ${newFilePath}`);

                    const workbook = await xlsx.readFile(newFilePath);
                    const sheetName = workbook.SheetNames[0];
                    const workSheet = workbook.Sheets[sheetName];

                    const range = workSheet['!ref'];
                    if (range) {
                        const [start, end] = range.split(':');
                        const lastRow = parseInt(end.replace(/[^\d]/g, ''));
                        const lastColumnIndex = xlsx.utils.decode_col(end.match(/[A-Z]+/)[0]); 

                        console.log("Total rows: ", lastRow);
                        console.log("Total columns: ", lastColumnIndex + 1);

                        const startRow = 7;
                        for (let rowNumber = startRow; rowNumber <= lastRow; rowNumber++) {
                            const data = [];
                            for (let col = 0; col <= lastColumnIndex; col++) { // Adjust loop to last available column
                                const cellAddress = xlsx.utils.encode_cell({ r: rowNumber - 1, c: col });
                                const cell = workSheet[cellAddress];
                                data.push(cell ? cell.v : null);
                            }

                            const isRowEmptyExceptFirstColumn = data.slice(1).every((value) => value === null);
                            if (isRowEmptyExceptFirstColumn) {
                                console.log(`Row ${rowNumber} skipped: Only column 1 has data.`);
                                continue;
                            }

                            const performanceData = debtData(data);

                            
                            const isEmptyPerformance = Object.values(performanceData.NAV).every(val => val === null);
                            if (isEmptyPerformance) {
                                console.log(`Skipping empty performance data for row ${rowNumber}`);
                                continue;
                            }

                            const performance = new Performance(performanceData);
                            await performance.save();
                        }
                    } else {
                        console.log("No data range found in the sheet.");
                    }


                    await unlinkFile(newFilePath);
                    console.log(`File deleted: ${newFilePath}`);
                } else {
                    console.log(`File for category ${category.name} not found`);
                }
            }

            // Hybrid

            for (const category of categories.hybridCategories) {
                await fundPerformanceFrame.select('#end-type', '1');
                await fundPerformanceFrame.select('#primary-category', 'SHY');
                await fundPerformanceFrame.select('#category', category.value);
                await fundPerformanceFrame.select('#amc', 'ALL');
                await sleep(3000);
                await fundPerformanceFrame.click('.btn.btn-primary.amfi-btn');
                await sleep(5000);
                await fundPerformanceFrame.click('a#download-report-excel small');
                await sleep(3000);

                const files = fs.readdirSync(downloadPath);
                const downloadedFile = files.find(file => file.endsWith('.xls'));

                if (downloadedFile) {
                    const oldFilePath = path.join(downloadPath, downloadedFile);
                    const newFilePath = path.join(downloadPath, `Hybrid_${category.name}.xls`);
                    fs.renameSync(oldFilePath, newFilePath);
                    console.log(`File renamed to: ${newFilePath}`);

                    const workbook = await xlsx.readFile(newFilePath);
                    const sheetName = workbook.SheetNames[0];
                    const workSheet = workbook.Sheets[sheetName];

                    const range = workSheet['!ref'];
                    if (range) {
                        const [start, end] = range.split(':');
                        const lastRow = parseInt(end.replace(/[^\d]/g, ''));
                        const lastColumnIndex = xlsx.utils.decode_col(end.match(/[A-Z]+/)[0]); 

                        console.log("Total rows: ", lastRow);
                        console.log("Total columns: ", lastColumnIndex + 1);
                        

                        const startRow = 7;
                        for (let rowNumber = startRow; rowNumber <= lastRow; rowNumber++) {
                            const data = [];
                            for (let col = 1; col <= lastColumnIndex; col++) {
                                const cellAddress = xlsx.utils.encode_cell({ r: rowNumber - 1, c: col - 1 });
                                const cell = workSheet[cellAddress];
                                data.push(cell ? cell.v : null);
                            }

                            const isRowEmptyExceptFirstColumn = data.slice(1).every((value) => value === null);
                            if (isRowEmptyExceptFirstColumn) {
                                console.log(`Row ${rowNumber} skipped: Only column 1 has data.`);
                                continue; 
                            }

                            const performanceData = hybridData(data);

                            const isEmptyPerformance = Object.values(performanceData.NAV).every(val => val === null);
                            if (isEmptyPerformance) {
                                console.log(`Skipping empty performance data for row ${rowNumber}`);
                                continue;
                            }

                            const performance = new Performance(performanceData);
                            await performance.save();
                        }
                    } else {
                        console.log("No data range found in the sheet.");
                    }

                    await unlinkFile(newFilePath);

                } else {
                    console.log(`File for category ${category.name} not found`);
                }
            }

            // SolutionOriented

            for (const category of categories.solutionOrientedCategories) {
                await fundPerformanceFrame.select('#end-type', '1');
                await fundPerformanceFrame.select('#primary-category', 'SSO');
                await fundPerformanceFrame.select('#category', category.value);
                await fundPerformanceFrame.select('#amc', 'ALL');
                await sleep(3000);
                await fundPerformanceFrame.click('.btn.btn-primary.amfi-btn');
                await sleep(5000);
                await fundPerformanceFrame.click('a#download-report-excel small');
                await sleep(3000);

                const files = fs.readdirSync(downloadPath);
                const downloadedFile = files.find(file => file.endsWith('.xls'));

                if (downloadedFile) {
                    const oldFilePath = path.join(downloadPath, downloadedFile);
                    const newFilePath = path.join(downloadPath, `SolutionOriented_${category.name}.xls`);
                    fs.renameSync(oldFilePath, newFilePath);
                    console.log(`File renamed to: ${newFilePath}`);

                    const workbook = await xlsx.readFile(newFilePath);
                    const sheetName = workbook.SheetNames[0];
                    const workSheet = workbook.Sheets[sheetName];

                    const range = workSheet['!ref'];
                    if (range) {
                        const [start, end] = range.split(':');
                        const lastRow = parseInt(end.replace(/[^\d]/g, ''));
                        const lastColumnIndex = xlsx.utils.decode_col(end.match(/[A-Z]+/)[0]); 

                        console.log("Total rows: ", lastRow);
                        console.log("Total columns: ", lastColumnIndex + 1);

                        const startRow = 7;
                        for (let rowNumber = startRow; rowNumber <= lastRow; rowNumber++) {
                            const data = [];
                            for (let col = 1; col <= lastColumnIndex; col++) {
                                const cellAddress = xlsx.utils.encode_cell({ r: rowNumber - 1, c: col - 1 });
                                const cell = workSheet[cellAddress];
                                data.push(cell ? cell.v : null);
                            }

                            const isRowEmptyExceptFirstColumn = data.slice(1).every((value) => value === null);
                            if (isRowEmptyExceptFirstColumn) {
                                console.log(`Row ${rowNumber} skipped: Only column 1 has data.`);
                                continue; 
                            }

                            const performanceData = solutionData(data);

                            const isEmptyPerformance = Object.values(performanceData.NAV).every(val => val === null);
                            if (isEmptyPerformance) {
                                console.log(`Skipping empty performance data for row ${rowNumber}`);
                                continue;
                            }

                            const performance = new Performance(performanceData);
                            await performance.save();
                        }
                    } else {
                        console.log("No data range found in the sheet.");
                    }

                    // Delete file after processing
                    await unlinkFile(newFilePath);

                } else {
                    console.log(`File for category ${category.name} not found`);
                }
            }
            //Other
            for (const category of categories.otherCategories) {
                await fundPerformanceFrame.select('#end-type', '1');
                await fundPerformanceFrame.select('#primary-category', 'SOTH');
                await fundPerformanceFrame.select('#category', category.value);
                await fundPerformanceFrame.select('#amc', 'ALL');
                await sleep(3000);
                await fundPerformanceFrame.click('.btn.btn-primary.amfi-btn');
                await sleep(5000);
                await fundPerformanceFrame.click('a#download-report-excel small');
                await sleep(3000);

                const files = fs.readdirSync(downloadPath);
                const downloadedFile = files.find(file => file.endsWith('.xls'));

                if (downloadedFile) {
                    const oldFilePath = path.join(downloadPath, downloadedFile);
                    const newFilePath = path.join(downloadPath, `Other_${category.name}.xls`);
                    fs.renameSync(oldFilePath, newFilePath);
                    console.log(`File renamed to: ${newFilePath}`);

                    const workbook = await xlsx.readFile(newFilePath);
                    const sheetName = workbook.SheetNames[0];
                    const workSheet = workbook.Sheets[sheetName];

                    const range = workSheet['!ref'];
                    if (range) {
                        const [start, end] = range.split(':');
                        const lastRow = parseInt(end.replace(/[^\d]/g, ''));
                        const lastColumnIndex = xlsx.utils.decode_col(end.match(/[A-Z]+/)[0]); 

                        console.log("Total rows: ", lastRow);
                        console.log("Total columns: ", lastColumnIndex + 1);

                        const startRow = 7;
                        for (let rowNumber = startRow; rowNumber <= lastRow; rowNumber++) {
                            const data = [];
                            for (let col = 1; col <= lastColumnIndex; col++) {
                                const cellAddress = xlsx.utils.encode_cell({ r: rowNumber - 1, c: col - 1 });
                                const cell = workSheet[cellAddress];
                                data.push(cell ? cell.v : null);
                            }

                            const isRowEmptyExceptFirstColumn = data.slice(1).every((value) => value === null);
                            if (isRowEmptyExceptFirstColumn) {
                                console.log(`Row ${rowNumber} skipped: Only column 1 has data.`);
                                continue; 
                            }

                            const performanceData = otherData(data);
                            const isEmptyPerformance = Object.values(performanceData.NAV).every(val => val === null);
                            if (isEmptyPerformance) {
                                console.log(`Skipping empty performance data for row ${rowNumber}`);
                                continue;
                            }

                            const performance = new Performance(performanceData);
                            await performance.save();
                        }
                    } else {
                        console.log("No data range found in the sheet.");
                    }

                    // Delete file after processing
                    await unlinkFile(newFilePath);

                } else {
                    console.log(`File for category ${category.name} not found`);
                }
            }

           
        } else {
            console.log("fundperformance frame not found");
            return res.status(200).json({ message: "FundPerformance Frame Not Found" });
        }
        return res.status(201).json({ message: "Files processed and data saved successfully!" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error });
    } finally {
        if (browser) {
            await browser.close();
            console.log("Puppeteer browser closed.");
        }
    }
};

