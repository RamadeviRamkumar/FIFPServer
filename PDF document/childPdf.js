const PDFDocument = require('pdfkit');
const { Buffer } = require('buffer');
const path = require('path');

exports.pdfFormat = async (name, data) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            try {
                const pdfBuffer = Buffer.concat(buffers);
                resolve(pdfBuffer.toString('base64'));
            } catch (error) {
                reject(error);
            }
        });
        doc.on('error', reject);

        // Formatting details
        const margin = 15;
        doc.rect(margin, margin, doc.page.width - 2 * margin, doc.page.height - 2 * margin).stroke();
        doc.image(path.join(__dirname, '../Assets/FireLogo.png'), 17, 8, { width: 90 });
        doc.fillColor('#5924d3').fontSize(19).font('Times-Bold').text('FINANCIAL INDEPENDENT FOCUS PASSION', 130, 38, { align: 'right' });
        doc.moveDown().fillColor('black').fontSize(12).font('Times-Bold').text(`Name : ${name.toUpperCase()}`, 25, 70);
        doc.text(`Date : ${new Date().toLocaleString()}`, 612 - 230, 70, { align: 'right' });
        doc.strokeColor('black').lineWidth(1).moveTo(15, 90).lineTo(597, 90).stroke();
        doc.moveDown();

        // Function to draw a table
        const drawTable = (title, childData) => {
            const tableWidth = 310; // Total width of the table
            const pageWidth = doc.page.width;
            const startX = (pageWidth - tableWidth) / 2; // Calculate center alignment
            const col1Width = 160;
            const col2Width = 150;
            const rowHeight = 23;

            // Draw table title centered
            doc.fillColor('#5924d3').fontSize(15).font('Times-Bold').text(title, (pageWidth - doc.widthOfString(title)) / 2);
            doc.fillColor('black');
            let yPos = doc.y; // Start Y position
            childData.forEach(([label, value]) => {
                doc.strokeColor("#8d8d8d").lineWidth(0.5).rect(startX, yPos, tableWidth, rowHeight).stroke();
                // Draw vertical line between columns
                doc.moveTo(startX + col1Width, yPos).lineTo(startX + col1Width, yPos + rowHeight).stroke();
                // Align text within cells
                doc.fontSize(11).font("Times-Bold").text(label, startX + 5, yPos + 7, { width: col1Width - 10 });
                doc.fontSize(11).font("Times-Roman").text(value, startX + col1Width + 5, yPos + 7, { width: col2Width - 10 });
                yPos += rowHeight; // Move to the next row
            });

            doc.moveDown();
        };

        // Check and display education plans
        if (data.firstchild[0].childname || data.secondchild[0].childname) {
            if (data.firstchild[0].childname) {
                doc.moveDown(1);
                drawTable('1st Child Education Plan', [
                    ["Name", data.firstchild[0].childname],
                    ["Age", data.firstchild[0].currentage],
                    ["Study Duration", data.firstchild[0].study_duration],
                    ["Education Estimate Amount", data.firstchild[0].education_estimateamount],
                    ["Current Savings", data.firstchild[0].firstchild_current_savings],
                    ["Inflation", data.inflationrate],
                    ["Returns", data.returnrate],
                    ["Inflation Amount", data.firstchildwith_inflationamount],
                    ["Future Amount", data.firstchild_totalFutureCost],
                    ["Interest of Savings", data.firstchild_savingsInterest],
                    ["Monthly SIP", data.firstchild_monthlysiP],
                    ["Existing Savings", data.firstchild_existingSavings]
                ]);
                doc.moveDown(1);
            }
            if (data.secondchild[0].childname) {
                drawTable('2nd Child Education Plan', [
                    ["Name", data.secondchild[0].childname],
                    ["Age", data.secondchild[0].currentage],
                    ["Study Duration", data.secondchild[0].study_duration],
                    ["Education Estimate Amount", data.secondchild[0].education_estimateamount],
                    ["Current Savings", data.secondchild[0].secondchild_current_savings],
                    ["Inflation", data.inflationrate],
                    ["Returns", data.returnrate],
                    ["Inflation Amount", data.secondchilddwith_inflationamount],
                    ["Future Amount", data.secondchild_totalFutureCost],
                    ["Interest of Savings", data.secondchild_savingsInterest],
                    ["Monthly SIP", data.secondchild_monthlysip],
                    ["Existing Savings", data.secondchild_existingSavings]
                ]);
            }
        }
        doc.end();
    });
};
