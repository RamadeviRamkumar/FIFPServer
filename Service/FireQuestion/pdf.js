const PDFDocument = require('pdfkit');
const { Buffer } = require('buffer');  // Required for buffer handling
const path = require('path')

exports.pdfFormat = async (data, userName) => {
    return new Promise((resolve, reject) => {
        // Create a new PDF document
        const doc = new PDFDocument();
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers)); // Push the PDF data into the buffers array
        doc.on('end', () => {
            try {
                // Once the document is finished, convert the buffers to a base64-encoded string
                const pdfBuffer = Buffer.concat(buffers);
                const base64PDF = pdfBuffer.toString('base64');
                resolve(base64PDF); // Resolve the promise with the base64 PDF
            } catch (error) {
                reject(error); // Reject the promise if something goes wrong
            }
        });

        doc.on('error', (error) => {
            reject(error); // Handle any error that occurs during PDF generation
        });
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleString();
        const margin = 15;
        // Draw a border around the A4 page
        doc.rect(margin, margin, doc.page.width - 2 * margin, doc.page.height - 2 * margin)
            .stroke();
        const imagePath = path.join(__dirname, '../../Assets/FireLogo.png');  // Local image path
        doc.image(imagePath, 25, 8, { width: 90 })

        // Add content to the PDF document
        doc.fillColor('purple').fontSize(19).font('Times-Bold').text(' FINANCIAL INDEPENDENT FOCUS PASSION', 110, 38);
        doc.moveDown();
        doc.fillColor('#9a9995').fontSize(12).font('Times-Bold').text(`Name : ${userName.toUpperCase()}`, 38, 70, { align: 'left' })

        const truncatedName = formattedDate.length > 20 ? formattedDate.substring(0, 20) + '...' : formattedDate;
        const textWidth = doc.widthOfString(`name : ${truncatedName}`);
        const startHX = 530 - textWidth;
        doc.fillColor('black')
            .fontSize(12)
            .font('Times-Bold')
            .text(`Date : ${formattedDate}`, startHX, 70);

        doc.strokeColor('#FF5733')
            .lineWidth(2)
            .moveTo(15, 95)  // Start position at (50, 200)
            .lineTo(597, 95) // End position at (550, 200)
            .stroke();

        doc.moveDown(2);

        const pageWidth2 = doc.page.width
        doc.fillColor('green').fontSize(13).font('Times-Bold').text('Personal Infomation', (pageWidth2 - doc.widthOfString('Personal Infomation')) / 2)
        doc.fillColor('black')
        const retirementData = [
            ["Age", `${data.age}`],
            ["Retirement Age", `${data.retireage}`],
            ["Current Expense", `${data.currentExpense}`],
            ["Inflation", `${data.inflation} %`],
            ["Monthly Savings", `${data.monthlysavings}`],
            ["Retirement Savings", `${data.retirementsavings}`],
            ["Prereturn Percentage", `${data.prereturn} %`],
            ["Postreturn Percentage", `${data.postreturn} %`],
            ["Expectancy", `${data.expectancy}`],
            ["Start Date", `${data.startDate}`],
        ];

        let retireStartY = doc.y;
        const retireRowHeight = 23;
        const retireCol1Width = 200;
        const retireCol2Width = 150;
        const retirePageWidth = doc.page.width;
        const retireTableWidth = retireCol1Width + retireCol2Width; // Total width of the table
        const retireStartX = (retirePageWidth - retireTableWidth) / 2; // Center the table horizontally

        // Draw table
        retirementData.forEach(([label, value]) => {
            doc.strokeColor("#8d8d8d").lineWidth(0.5).rect(retireStartX, retireStartY, retireCol1Width + retireCol2Width, retireRowHeight).stroke();

            // Draw vertical line between columns
            doc.moveTo(retireStartX + retireCol1Width, retireStartY).lineTo(retireStartX + retireCol1Width, retireStartY + retireRowHeight).stroke();

            // Align text vertically in the row
            const textY = retireStartY + retireRowHeight / 3; // Center text vertically in the row

            doc
                .fontSize(11)
                .font("Times-Bold")
                .text(label, retireStartX + 5, textY, { width: retireCol1Width - 10, align: "left" });
            doc
                .fontSize(11)
                .font("Times-Roman")
                .text(value, retireStartX + retireCol1Width + 5, textY, { width: retireCol2Width - 10, align: "left" });

            retireStartY += retireRowHeight;
        });
        doc.moveDown()
        const pageWidth1 = doc.page.width; // Get the page width
        doc
            .fillColor('green')
            .font('Times-Bold')
            .fontSize(13)
            .text('Retirement Plan against for Income', (pageWidth1 - doc.widthOfString('Retirement Plan against for Income')) / 2);
            
        doc.fillColor('black')
        const tableData = [
            ["Years Left For Retirement", `${data.RetirementCalculations.yearsLeftForRetirement}`],
            ["Monthly Expenses After Retirement", `${data.RetirementCalculations.monthlyExpensesAfterRetirement}`],
            ["Targeted Savings", `${data.RetirementCalculations.targetedSavings}`],
            ["Total Savings At Retirement", `${data.RetirementCalculations.totalSavingsAtRetirement}`],
            ["Accumulated Savings", `${data.RetirementCalculations.accumulatedSavings}`],
            ["Shortfall In Savings", `${data.RetirementCalculations.shortfallInSavings}`],
            ["Existing Savings Growth", `${data.RetirementCalculations.existingSavingsGrowth}`],
            ["ExtraOne Time Savings Required", `${data.RetirementCalculations.extraOneTimeSavingsRequired}`],
            ["ExtraMonthly Savings Required", `${data.RetirementCalculations.extraMonthlySavingsRequired}`],
            ["Annual StepUp Percentage", `${data.RetirementCalculations.annualStepUpPercentage}`],
            ["Yearly Investment", `${data.RetirementCalculations.yearlyInvestment}`],
            ["RetirementDate", `${data.RetirementCalculations.retirementDate}`],

        ];
        let startY = doc.y;
        const rowHeight = 23;
        const col1Width = 200;
        const col2Width = 150;
        const pageWidth = doc.page.width;
        const tableWidth = col1Width + col2Width; // Total width of the table
        const startX = (pageWidth - tableWidth) / 2; // Center the table horizontally
        // Draw table
        tableData.forEach(([label, value]) => {
            // Draw row border
            doc.strokeColor("#8d8d8d").lineWidth(0.5).rect(startX, startY, col1Width + col2Width, rowHeight).stroke();

            // Draw vertical line between columns
            doc.moveTo(startX + col1Width, startY).lineTo(startX + col1Width, startY + rowHeight).stroke();

            // Draw first column (Label)
            doc
                .fontSize(11)
                .font("Times-Bold")
                .text(label, startX + 5, startY + 7, { width: col1Width - 10 });

            // Draw second column (Value)
            doc
                .fontSize(11)
                .font("Times-Roman")
                .text(value, startX + col1Width + 5, startY + 7, { width: col2Width - 10 });

            // Move to next row
            startY += rowHeight;
        });

        doc.addPage();
        // Draw a border around the A4 page
        doc.rect(margin, margin, doc.page.width - 2 * margin, doc.page.height - 2 * margin)
            .stroke();
        const pageWidth3 = doc.page.width
        doc.fillColor('green').fontSize(13).font('Times-Bold').text('Retirement Plan', (pageWidth3 - doc.widthOfString('Withdraw Plan')) / 2, 35).moveDown();
        doc.fillColor('black')
       
        if (data.withdrawPlan && typeof data.withdrawPlan === 'object') {
            const { year: years, withdrawal: withdrawals, networth, permonthexpenses, ReturnsRate } = data.withdrawPlan;

            if ([years, withdrawals, networth, permonthexpenses, ReturnsRate].every(Array.isArray)) {
                const table = {
                    headers: ['Year', 'Withdrawal', 'Net Worth', 'Return', 'Month Expenses'],
                    rows: years.map((year, index) => [
                        year.toString(),
                        withdrawals[index].toLocaleString(),
                        networth[index].toLocaleString(),
                        ReturnsRate[index].toLocaleString(),
                        permonthexpenses[index].toLocaleString()
                    ])
                };

                const colWidths = [60, 100, 100, 80, 100];
                const rowHeight = 25;
                const tableWidth = colWidths.reduce((a, b) => a + b, 0);
                const startX = (doc.page.width - tableWidth) / 2;
                const margin = 50;
                const maxY = doc.page.height - margin;
                let y = margin;

                doc.strokeColor('#3498DB');

                function drawRow(row, isHeader = false) {
                    doc.font(isHeader ? 'Times-Bold' : 'Times-Roman').fontSize(10);
                    row.forEach((text, i) => {
                        let x = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
                        doc.rect(x, y, colWidths[i], rowHeight).stroke();
                        doc.text(text, x + 5, y + 8, { width: colWidths[i] - 10, align: 'center' });
                    });
                    y += rowHeight;
                }

                function checkPageLimit() {
                    const margin1 = 15;
                    if (y + rowHeight > maxY) {
                        doc.addPage();
                        doc.rect(margin1, margin1, doc.page.width - 2 * margin1, doc.page.height - 2 * margin1)
                            .stroke();
                        doc.strokeColor('#3498DB');
                        y = margin;
                        drawRow(table.headers, true);
                    }
                }

                drawRow(table.headers, true);
                table.rows.forEach(row => {
                    checkPageLimit();
                    drawRow(row);
                });

            } else {
                console.error('One or more arrays in withdrawPlan are missing or not arrays');
            }
        } else {
            console.error('data.withdrawPlan is not an object or is undefined');
        }

        doc.addPage();
        // Draw a border around the A4 page
        doc.rect(margin, margin, doc.page.width - 2 * margin, doc.page.height - 2 * margin)
            .stroke();
        const pageWidth5 = doc.page.width
        doc.fillColor('green').fontSize(13).font('Times-Bold').text('Retirement Plan for Stepup', (pageWidth5 - doc.widthOfString('Stepup Withdraw Plan')) / 2, 35)
        doc.fillColor('black')
        doc.moveDown(1);

        if (data.withdrawPlan && typeof data.withdrawPlan === 'object') {
            const { year: years, withdrawal: withdrawals, networthStepup, permonthexpenses, ReturnsStepup } = data.withdrawPlan;

            // Check if all required arrays exist
            if ([years, withdrawals, networthStepup, permonthexpenses, ReturnsStepup].every(Array.isArray)) {
                const table = {
                    headers: ['Year', 'Withdrawal', 'Stepup Net Worth', 'Stepup Return', 'Month Expenses'],
                    rows: years.map((year, index) => [
                        year,
                        withdrawals[index].toLocaleString(),
                        networthStepup[index].toLocaleString(),
                        ReturnsStepup[index].toLocaleString(),
                        permonthexpenses[index].toLocaleString()
                    ])
                };

                const rowHeight = 25;
                const colWidths = [60, 100, 100, 80, 100];
                const tableWidth = colWidths.reduce((a, b) => a + b, 0);
                const startX = (doc.page.width - tableWidth) / 2;
                const margin = 50;
                const maxY = doc.page.height - margin;
                let y = margin;

                doc.strokeColor('#3498DB');

                function drawRow(row, isHeader = false) {
                    doc.font(isHeader ? 'Times-Bold' : 'Times-Roman').fontSize(10);
                    row.forEach((text, i) => {
                        let x = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
                        doc.rect(x, y, colWidths[i], rowHeight).stroke();
                        doc.text(text, x + 5, y + 8, { width: colWidths[i] - 10, align: 'center' });
                    });
                    y += rowHeight;
                }
                function checkPageLimit() {
                    const margin1 = 15;
                    if (y + rowHeight > maxY) {
                        doc.addPage();
                        doc.rect(margin1, margin1, doc.page.width - 2 * margin1, doc.page.height - 2 * margin1)
                            .stroke();
                        doc.strokeColor('#3498DB');
                        y = margin;
                        drawRow(table.headers, true);
                    }
                }

                drawRow(table.headers, true);
                table.rows.forEach(row => {
                    checkPageLimit();
                    drawRow(row);
                });

            } else {
                console.error('One or more arrays in withdrawPlan are missing or not arrays');
            }
        } else {
            console.error('data.withdrawPlan is not an object or is undefined');
        }

        doc.addPage();
        // Draw a border around the A4 page
        doc.rect(margin, margin, doc.page.width - 2 * margin, doc.page.height - 2 * margin)
            .stroke();
        const pageWidth6 = doc.page.width
        doc.fillColor('green').fontSize(13).font('Times-Bold').text('Retirement Plan for SIP', (pageWidth6 - doc.widthOfString('SIP Withdraw Plan')) / 2, 35)
        doc.fillColor('black')
        doc.moveDown(1);
        if (data.withdrawPlan && typeof data.withdrawPlan === 'object') {
            const { year: years, withdrawal: withdrawals, networthSIP, permonthexpenses, ReturnSIP } = data.withdrawPlan;

            // Check if all required arrays exist
            if ([years, withdrawals, networthSIP, permonthexpenses, ReturnSIP].every(Array.isArray)) {
                const table = {
                    headers: ['Year', 'Withdrawal', 'Net Worth SIP', 'Return SIP', 'Month Expenses'],
                    rows: years.map((year, index) => [
                        year,
                        withdrawals[index].toLocaleString(),
                        networthSIP[index].toLocaleString(),
                        ReturnSIP[index].toLocaleString(),
                        permonthexpenses[index].toLocaleString()
                    ])
                };

                const rowHeight = 25;
                const colWidths = [60, 100, 100, 80, 100];
                const tableWidth = colWidths.reduce((a, b) => a + b, 0);
                const startX = (doc.page.width - tableWidth) / 2;
                const margin = 50;
                const maxY = doc.page.height - margin;
                let y = margin;

                doc.strokeColor('#3498DB');

                function drawRow(row, isHeader = false) {
                    doc.font(isHeader ? 'Times-Bold' : 'Times-Roman').fontSize(10);
                    row.forEach((text, i) => {
                        let x = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
                        doc.rect(x, y, colWidths[i], rowHeight).stroke();
                        doc.text(text, x + 5, y + 8, { width: colWidths[i] - 10, align: 'center' });
                    });
                    y += rowHeight;
                }

                function checkPageLimit() {
                    const margin1 = 15;
                    if (y + rowHeight > maxY) {
                        doc.addPage();
                        doc.rect(margin1, margin1, doc.page.width - 2 * margin1, doc.page.height - 2 * margin1)
                            .stroke();
                        doc.strokeColor('#3498DB');
                        y = margin;
                        drawRow(table.headers, true);
                    }
                }

                drawRow(table.headers, true);
                table.rows.forEach(row => {
                    checkPageLimit();
                    drawRow(row);
                });
            } else {
                console.error('One or more arrays in withdrawPlan are missing or not arrays');
            }
        } else {
            console.error('data.withdrawPlan is not an object or is undefined');
        }

        doc.end();
    });
};

