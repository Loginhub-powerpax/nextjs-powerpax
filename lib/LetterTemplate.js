
export const generateParticipationLetter = (exhibitorData) => {
  const {
    auth_company_name,
    company_name,
    contactPerson,
    address,
    city,
    state,
    pincode,
    standNumber = '[Stall No.]',
    created_at
  } = exhibitorData;

  const displayCompanyName = auth_company_name || company_name || 'Exhibitor Company';
  const displayContactPerson = contactPerson || '[Exhibitor Name]';
  const displayAddress = address || '[Address Line 1]';
  const displayCityState = `${city || ''}, ${state || ''}, ${pincode || ''}`.trim() || '[City, State, PIN]';
  const displayDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Participation Letter - ${displayCompanyName}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 0;
          color: #1a1a1a;
          line-height: 1.5;
          background: #fff;
        }
        .page {
          width: 210mm;
          min-height: 297mm;
          padding: 20mm;
          margin: 10mm auto;
          background: white;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          position: relative;
          box-sizing: border-box;
        }
        @media print {
          body { background: none; }
          .page { margin: 0; box-shadow: none; width: 100%; height: 100%; }
          @page { size: A4; margin: 0; }
        }

        /* Header Layout */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }
        .logo-box {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .logo-img {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #ef4444, #3b82f6, #facc15);
          clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 10px;
          border-radius: 5px;
        }
        .tresub-brand h1 {
          margin: 0;
          font-size: 24px;
          color: #333;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .tresub-brand p {
          margin: 0;
          font-size: 12px;
          color: #ef4444;
          font-weight: bold;
        }
        .address-top {
          font-size: 11px;
          color: #444;
          line-height: 1.3;
          max-width: 400px;
          border-left: 2px solid #84cc16;
          padding-left: 10px;
          margin-top: 10px;
        }
        .color-bars-top {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .bar { width: 40px; height: 5px; }

        /* Content */
        .content-area {
          margin-top: 40px;
        }
        .exhibitor-info {
          margin-bottom: 40px;
          font-weight: 500;
        }
        .subject-main {
          text-align: center;
          text-decoration: underline;
          font-weight: bold;
          margin-bottom: 30px;
          font-size: 18px;
        }
        .ref-line {
          margin-bottom: 20px;
          font-weight: 500;
        }
        .letter-body {
          margin-bottom: 30px;
          text-align: justify;
        }
        .letter-body p {
          margin-bottom: 20px;
        }
        .closing {
          margin-bottom: 40px;
        }
        .signature-section {
          margin-top: 30px;
        }
        
        /* Footer */
        .footer-fixed {
          position: absolute;
          bottom: 20mm;
          left: 20mm;
          right: 20mm;
          border-top: 1px solid #ccc;
          padding-top: 15px;
        }
        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          font-size: 10px;
          color: #666;
        }
        .footer-address {
           max-width: 350px;
        }
        .social-icons-row {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }
        .icon-circle {
          width: 18px;
          height: 18px;
          background: #333;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 10px;
        }
        .stamp-area {
          position: absolute;
          bottom: 80px;
          left: 50px;
          opacity: 0.2;
          transform: rotate(-15deg);
        }
        .stamp-circle {
          width: 120px;
          height: 120px;
          border: 4px double #1e40af;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #1e40af;
          font-weight: bold;
          font-size: 10px;
          text-align: center;
          padding: 10px;
        }
      </style>
    </head>
    <body>
      <div class="page">
        <!-- Header -->
        <div class="header">
          <div>
            <div class="logo-box">
               <div class="logo-img">TRESUB</div>
               <div class="tresub-brand">
                 <h1>TRESUB</h1>
                 <p>media private limited</p>
               </div>
            </div>
            <div class="address-top">
              Registered & Corp. Address:- Office No- 14130,14130A, 14th Floor,<br>
              Gaur City Mall, Sector- 4 C, Greater Noida 201318, Uttar Pradesh, India<br>
              Tel: +91 120 5162126, +91 120 7184983
            </div>
          </div>
          <div class="color-bars-top">
            <div class="bar" style="background: #3b82f6;"></div>
            <div class="bar" style="background: #facc15;"></div>
            <div class="bar" style="background: #ef4444;"></div>
          </div>
        </div>

        <!-- Content -->
        <div class="content-area">
          <div style="text-align: right; margin-bottom: 20px;">
            <strong>Date:</strong> ${displayDate}
          </div>

          <div class="exhibitor-info">
            ${displayContactPerson}<br>
            ${displayCompanyName}<br>
            ${displayAddress}<br>
            ${displayCityState}
          </div>

          <div class="subject-main">TO WHOM IT MAY CONCERN</div>

          <div class="ref-line">
            Ref: Letter of Participation in <strong>PowerPax India Renewable Energy Expo – Varanasi Edition 2026</strong>
          </div>

          <div class="letter-body">
            <p>
              This is to certify that <strong>${displayCompanyName}</strong> is participating in the <strong>PowerPax India Renewable Energy Expo – Varanasi Edition 2026</strong> being organised by <strong>Renewable Mirror (Tresub Media Pvt. Ltd.)</strong> at <strong>Deendayal Hastkala Sankul (Trade Centre), Bada Lalpur, Chandmari, Varanasi, Uttar Pradesh – 221002</strong> from <strong>2nd – 3rd May 2026</strong> and have been allotted <strong>Stand No. ${standNumber}</strong>.
            </p>
            <p>
              This certificate is issued to facilitate transportation and clearance of exhibition materials for display in PowerPax India Renewable Energy Expo – Varanasi Edition 2026.
            </p>
            <p>
              May we request you to kindly extend all possible assistance / support to them.
            </p>
          </div>

          <div class="closing">
            Yours Sincerely,<br>
            <strong>For Renewable Mirror / Tresub Media Pvt. Ltd.</strong>
          </div>

          <div class="signature-section" style="margin-top: 50px;">
            <strong>Authorized Signatory</strong><br>
            <span style="font-size: 13px; color: #666;">PowerPax India Renewable Energy Expo – Varanasi Edition 2026</span><br>
            <span style="font-size: 13px; color: #3b82f6;">www.powerpaxindia.com</span>
          </div>
        </div>

        <!-- Stamp Watermark -->
        <div class="stamp-area">
           <div class="stamp-circle">
             TRESUB MEDIA<br>PVT. LTD.<br>---<br>GR. NOIDA
           </div>
        </div>

        <!-- Footer -->
        <div class="footer-fixed">
          <div class="footer-content">
            <div class="footer-address">
              <strong>Registered Address:</strong> Office No- 14130, 14130A, 14th Floor, Gaur City Mall, Sector- 4 C, Greater Noida 201318, Uttar Pradesh, India, Tel: +91 0120 5162126
              <div class="social-icons-row">
                <div class="icon-circle">f</div>
                <div class="icon-circle">in</div>
                <div class="icon-circle">t</div>
                <div class="icon-circle">i</div>
                <div class="icon-circle">y</div>
              </div>
            </div>
            <div style="font-style: italic; color: #999;">
              Tresub Media Private Limited
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};
