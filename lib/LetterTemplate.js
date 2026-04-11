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
    page.drawText(displayContactPerson, { x: 60, y: currentY, size: 11, font: fontBold, color: textColor });
    currentY -= 15;
    page.drawText(displayCompanyName, { x: 60, y: currentY, size: 11, font: font, color: textColor });
    currentY -= 14;
    
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
    const p1 = `This is to certify that ${displayCompanyName} is participating in the PowerPax India Renewable Energy Expo – Varanasi Edition 2026 being organised by Renewable Mirror (Tresub Media Pvt. Ltd.) at Deendayal Hastkala Sankul (Trade Centre), Bada Lalpur, Chandmari, Varanasi, Uttar Pradesh – 221002 from 2nd – 3rd May 2026 and have been allotted Stand No. ${standNumber}${hallText}.`;
    
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
    page.drawText("For Renewable Mirror / Tresub Media Pvt. Ltd.", { x: 60, y: currentY, size: 10.5, font: fontBold, color: textColor });
    
    // Stamp/Signature Position
    page.drawImage(stampImage, {
      x: 60,
      y: currentY - 70,
      width: 80,
      height: 80
    });
    
    currentY -= 85;
    page.drawText("Authorized Signatory", { x: 60, y: currentY, size: 11, font: fontBold, color: textColor });

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
    
    window.open(blobUrl, '_blank');
    return true;

  } catch (err) {
    console.error("Failed to generate letter:", err);
    alert("Generation Failed: Please check console for details.");
    return false;
  }
};
