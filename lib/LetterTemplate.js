import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export const generateParticipationLetter = async (exhibitorData) => {
  try {
    const {
      auth_company_name,
      company_name,
      contactPerson,
      address,
      city = '',
      state = '',
      pincode = '',
      standNumber = '[Stall No.]'
    } = exhibitorData;

    const displayCompanyName = auth_company_name || company_name || 'Exhibitor Company';
    const displayContactPerson = contactPerson || '[Exhibitor Name]';
    const displayAddress = address || '[Address Line 1]';
    const displayCityState = `${city}, ${state}, ${pincode}`.replace(/^, | ,|, $/g, '').trim() || '[City, State, PIN]';
    const displayDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    // Fetch the letterhead PDF installed in the public folder
    const existingPdfBytes = await fetch('/letterhead.pdf').then((res) => {
       if (!res.ok) throw new Error("Could not load letterhead.pdf");
       return res.arrayBuffer();
    });

    // Load the official PDFDocument template
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    
    // Embed standard fonts for crisp vector text
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Grab the first page to draw onto
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // standard black/dark-gray layout color
    const textColor = rgb(0.1, 0.1, 0.1); 

    // Helper Function to wrap text
    let currentY = 570; // Adjusted starting Y offset to allow for large PDF letterhead headers
    const lineHeight = 16;
    
    const drawWrappedText = (text, startX, startY, maxWidth, fontRef, size) => {
       const words = text.split(' ');
       let line = '';
       let y = startY;
       
       for (let n = 0; n < words.length; n++) {
         const testLine = line + words[n] + ' ';
         const textWidth = fontRef.widthOfTextAtSize(testLine, size);
         if (textWidth > maxWidth && n > 0) {
           firstPage.drawText(line, { x: startX, y, size, font: fontRef, color: textColor });
           line = words[n] + ' ';
           y -= lineHeight;
         } else {
           line = testLine;
         }
       }
       firstPage.drawText(line, { x: startX, y, size, font: fontRef, color: textColor });
       return y - lineHeight;
    };

    // --- Drawing the Letter Content --- //

    // Write Date Header
    firstPage.drawText(`Date: ${displayDate}`, {
      x: 430,
      y: 690,
      size: 11,
      font: fontBold,
      color: textColor,
    });

    // Exhibitor Address Block
    firstPage.drawText(displayContactPerson, { x: 70, y: 660, size: 11, font: fontBold, color: textColor });
    firstPage.drawText(displayCompanyName, { x: 70, y: 645, size: 11, font: font, color: textColor });
    firstPage.drawText(displayAddress, { x: 70, y: 630, size: 11, font: font, color: textColor });
    firstPage.drawText(displayCityState, { x: 70, y: 615, size: 11, font: font, color: textColor });

    // Subject
    firstPage.drawText("TO WHOM IT MAY CONCERN", {
      x: 215,
      y: 570,
      size: 13,
      font: fontBold,
      color: rgb(0,0,0),
    });
    // Subject Underline
    firstPage.drawLine({ start: { x: 215, y: 568 }, end: { x: 395, y: 568 }, thickness: 1, color: rgb(0,0,0) });

    // Ref line
    firstPage.drawText("Ref: Letter of Participation in PowerPax India Renewable Energy Expo – Varanasi Edition 2026", {
      x: 70,
      y: 530,
      size: 11,
      font: fontBold,
      color: textColor,
    });

    currentY = 490;

    // Paragraph 1
    const p1 = `This is to certify that ${displayCompanyName} is participating in the PowerPax India Renewable Energy Expo – Varanasi Edition 2026 being organised by Renewable Mirror (Tresub Media Pvt. Ltd.) at Deendayal Hastkala Sankul (Trade Centre), Bada Lalpur, Chandmari, Varanasi, Uttar Pradesh – 221002 from 2nd – 3rd May 2026 and have been allotted Stand No. ${standNumber}.`;
    currentY = drawWrappedText(p1, 70, currentY, 460, font, 11);
    
    currentY -= 15;
    
    // Paragraph 2
    const p2 = `This certificate is issued to facilitate transportation and clearance of exhibition materials for display in PowerPax India Renewable Energy Expo – Varanasi Edition 2026.`;
    currentY = drawWrappedText(p2, 70, currentY, 460, font, 11);
    
    currentY -= 15;

    // Paragraph 3
    const p3 = `May we request you to kindly extend all possible assistance / support to them.`;
    currentY = drawWrappedText(p3, 70, currentY, 460, font, 11);

    currentY -= 45;

    // Closing Block
    firstPage.drawText("Yours Sincerely,", { x: 70, y: currentY, size: 11, font: font, color: textColor });
    currentY -= lineHeight;
    firstPage.drawText("For Renewable Mirror / Tresub Media Pvt. Ltd.", { x: 70, y: currentY, size: 11, font: fontBold, color: textColor });
    
    currentY -= 65;
    firstPage.drawText("Authorized Signatory", { x: 70, y: currentY, size: 11, font: fontBold, color: textColor });

    // Save Output and Trigger Download
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    
    // Auto-trigger Download
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `Participation_Letter_${displayCompanyName.substring(0, 15).replace(/\\W+/g, '')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Also open in a new tab as a fallback
    window.open(blobUrl, '_blank');
    
    return true;

  } catch (err) {
    console.error("Failed to generate PDF on Letterhead template:", err);
    alert("Generation Failed: Ensure 'letterhead.pdf' is in the public folder!");
    return false;
  }
};
