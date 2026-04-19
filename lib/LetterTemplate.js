import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export const generateParticipationLetter = async (exhibitorData) => {
  try {
    const {
      auth_company_name,
      company_name,
      contactPerson,
      address,
      country = '',
      mobile = '',
      email = '',
      standNumber = '[Stall No.]',
      hallNumber = '',
      created_at
    } = exhibitorData;

    const displayCompanyName = company_name || auth_company_name || 'Exhibitor Company';
    const displayContactPerson = contactPerson || '[Exhibitor Name]';
    const displayAddress = address || '[Address Line 1]';
    const displayLocation = country || '[Country]';
    const displayDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    // 1. Create a new PDF Document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 Size

    // 2. Fetch and embed images
    const [headerBytes, footerBytes, stampBytes] = await Promise.all([
      fetch('/letter_header.png').then(res => res.arrayBuffer()),
      fetch('/letter_footer.png').then(res => res.arrayBuffer()),
      fetch('/letter_stamp.png').then(res => res.arrayBuffer())
    ]);

    const headerImage = await pdfDoc.embedPng(headerBytes);
    const footerImage = await pdfDoc.embedPng(footerBytes);
    const stampImage = await pdfDoc.embedPng(stampBytes);

    // 3. Draw Header and Footer
    // Header spans across the top
    const headerDims = headerImage.scale(0.5); // Adjust scale as needed
    page.drawImage(headerImage, {
      x: 0,
      y: 841.89 - 80,
      width: 595.28,
      height: 80,
    });

    // Footer spans across the bottom
    page.drawImage(footerImage, {
      x: 0,
      y: 0,
      width: 595.28,
      height: 60,
    });

    // 4. Embed Fonts
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const textColor = rgb(0, 0, 0);

    // 5. Letter Content
    let currentY = 730;

    // Date
    page.drawText(`Date: ${displayDate}`, { x: 450, y: currentY, size: 10, font: fontBold, color: textColor });
    currentY -= 30;

    // Address Block
    page.drawText(displayCompanyName, { x: 60, y: currentY, size: 11, font: fontBold, color: textColor });
    currentY -= 15;
    
    // Address wrapping
    const maxWidth = 300;
    const addressLines = displayAddress.match(new RegExp('.{1,' + 45 + '}(\\s|$)', 'g')) || [displayAddress];
    addressLines.forEach(line => {
      page.drawText(line.trim(), { x: 60, y: currentY, size: 10, font: font, color: textColor });
      currentY -= 12;
    });
    page.drawText(displayLocation, { x: 60, y: currentY, size: 10, font: font, color: textColor });
    currentY -= 40;

    // Subject Header
    const subjectText = "TO WHOM IT MAY CONCERN";
    const subjectWidth = fontBold.widthOfTextAtSize(subjectText, 14);
    page.drawText(subjectText, { x: (595.28 - subjectWidth) / 2, y: currentY, size: 14, font: fontBold, color: textColor });
    page.drawLine({
      start: { x: (595.28 - subjectWidth) / 2, y: currentY - 2 },
      end: { x: (595.28 + subjectWidth) / 2, y: currentY - 2 },
      thickness: 1,
      color: textColor
    });
    currentY -= 40;

    // Reference
    page.drawText("Ref: Letter of Participation in PowerPax India Renewable Energy Expo – Varanasi Edition 2026", {
      x: 60,
      y: currentY,
      size: 10.5,
      font: fontBold,
      color: textColor
    });
    currentY -= 35;

    // Paragraph 1
    const hallText = hallNumber ? ` in Hall No. ${hallNumber}` : '';
    const p1 = `This is to certify that ${displayCompanyName} is participating in the PowerPax India Renewable Energy Expo – Varanasi Edition 2026 being organised by Tresub Media Pvt. Ltd. at Deendayal Hastkala Sankul (Trade Centre), Bada Lalpur, Chandmari, Varanasi, Uttar Pradesh – 221002 from 2nd – 3rd May 2026 and have been allotted Stand No. ${standNumber}${hallText}.`;
    
    const drawWrappedText = (text, startX, startY, maxWidth, fontRef, size) => {
      const words = text.split(' ');
      let line = '';
      let y = startY;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const textWidth = fontRef.widthOfTextAtSize(testLine, size);
        if (textWidth > maxWidth && n > 0) {
          page.drawText(line, { x: startX, y, size, font: fontRef, color: textColor });
          line = words[n] + ' ';
          y -= 15;
        } else {
          line = testLine;
        }
      }
      page.drawText(line, { x: startX, y, size, font: fontRef, color: textColor });
      return y - 15;
    };

    currentY = drawWrappedText(p1, 60, currentY, 475, font, 10.5);
    currentY -= 15;

    // Paragraph 2
    const p2 = `This certificate is issued to facilitate transportation and clearance of exhibition materials for display in PowerPax India Renewable Energy Expo – Varanasi Edition 2026.`;
    currentY = drawWrappedText(p2, 60, currentY, 475, font, 10.5);
    currentY -= 15;

    // Paragraph 3
    const p3 = `May we request you to kindly extend all possible assistance / support to them.`;
    currentY = drawWrappedText(p3, 60, currentY, 475, font, 10.5);
    currentY -= 40;

    // Closing
    page.drawText("Yours Sincerely,", { x: 60, y: currentY, size: 10.5, font: font, color: textColor });
    currentY -= 15;
    page.drawText("For Tresub Media Pvt. Ltd.", { x: 60, y: currentY, size: 10.5, font: fontBold, color: textColor });
    
    // Stamp/Signature Position
    page.drawImage(stampImage, {
      x: 60,
      y: currentY - 70,
      width: 80,
      height: 80
    });
    
    currentY -= 85;
    page.drawText("Authorized Signatory", { x: 60, y: currentY, size: 10.5, font: fontBold, color: textColor });

    // 6. Save and Download
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `PowerPax_Certificate_${displayCompanyName.replace(/\\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.error("Failed to generate letter:", err);
    return false;
  }
};

export const generateFullSubmissionReport = async (groupedForms) => {
  try {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const textColor = rgb(0.1, 0.1, 0.1);
    
    let page = pdfDoc.addPage([595.28, 841.89]);
    let currentY = 800;
    const margin = 50;
    const width = 595.28 - (2 * margin);

    const checkNewPage = (needed) => {
      if (currentY - needed < 50) {
        page = pdfDoc.addPage([595.28, 841.89]);
        currentY = 800;
        return true;
      }
      return false;
    };

    const companyName = groupedForms[0]?.company_name || 'Exhibitor Report';
    page.drawText(`SUBMISSION REPORT: ${companyName}`, { x: margin, y: currentY, size: 16, font: fontBold, color: textColor });
    currentY -= 30;
    page.drawText(`Generated on: ${new Date().toLocaleString()}`, { x: margin, y: currentY, size: 10, font: font, color: rgb(0.4, 0.4, 0.4) });
    currentY -= 40;

    groupedForms.forEach((sub, idx) => {
      checkNewPage(40);
      page.drawRectangle({ x: margin - 5, y: currentY - 20, width: width + 10, height: 25, color: rgb(0.9, 0.95, 1) });
      page.drawText(`${sub.form_id}: ${sub.form_title}`, { x: margin, y: currentY - 15, size: 12, font: fontBold, color: rgb(0, 0.3, 0.6) });
      currentY -= 45;

      let displayData = sub.all_data || {};
      if (typeof displayData === 'string') {
        try { displayData = JSON.parse(displayData); } catch(e) {}
      }

      Object.entries(displayData).forEach(([key, value]) => {
        if (!value || key === 'logoPreview') return;
        
        let label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        let valStr = '';

        if (key === 'badges' && Array.isArray(value)) {
          value.forEach((b, bi) => {
            checkNewPage(20);
            page.drawText(`Badge ${bi + 1}: ${b.firstName} ${b.lastName} (${b.type})`, { x: margin + 10, y: currentY, size: 10, font: fontBold, color: textColor });
            currentY -= 15;
            Object.entries(b).forEach(([bk, bv]) => {
              if (bk === 'terms') return;
              checkNewPage(15);
              page.drawText(`${bk}: ${bv || '-'}`, { x: margin + 30, y: currentY, size: 9, font: font, color: textColor });
              currentY -= 12;
            });
            currentY -= 5;
          });
        } else if (key === 'furnitureOrders' && typeof value === 'object') {
          Object.entries(value).forEach(([code, item]) => {
            if (item.qty > 0) {
              checkNewPage(15);
              page.drawText(`Code ${code}: ${item.qty} units`, { x: margin + 10, y: currentY, size: 10, font: font, color: textColor });
              currentY -= 15;
            }
          });
        } else {
          valStr = typeof value === 'object' ? JSON.stringify(value) : value.toString();
          checkNewPage(20);
          page.drawText(`${label}:`, { x: margin, y: currentY, size: 10, font: fontBold, color: textColor });
          const textX = margin + 120;
          // Simple wrap
          const wrapped = valStr.match(/.{1,60}/g) || [valStr];
          wrapped.forEach(line => {
             checkNewPage(15);
             page.drawText(line, { x: textX, y: currentY, size: 10, font: font, color: textColor });
             currentY -= 15;
          });
          currentY -= 5;
        }
      });
      currentY -= 20;
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Full_Report_${companyName.replace(/\s+/g, '_')}.pdf`;
    link.click();
    return true;
  } catch (err) {
    console.error("Report generation failed:", err);
    return false;
  }
};
