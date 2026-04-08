"use client";

import { use, useState, useEffect } from 'react';
import Link from 'next/link';

const formTitles = {
  'F01': 'Show Directory (Company Profile & Product Index)',
  'F02': 'Directory Map Board Lettering',
  'F03': 'Exhibitor Name Badges',
  'F04': 'Fascia Name - Shell Scheme Package',
  'F05': 'Insurance Coverage Public Liability Refunds',
  'F06': 'Additional Furniture Requirements',
  'F07': 'Electricity Charges for Designer Stalls'
};

export default function FormDetailPage({ params }) {
  const unwrappedParams = use(params);
  const formId = unwrappedParams.id || 'F01';
  const formTitle = formTitles[formId] || 'Form Details';

  const [isComplete, setIsComplete] = useState(false);
  const [authCompanyName, setAuthCompanyName] = useState("");
  
  // Shared fields
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [tel, setTel] = useState("");
  const [fax, setFax] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [mobile, setMobile] = useState("");
  const [description, setDescription] = useState("");
  const [productCategory, setProductCategory] = useState("");

  const [logoPreview, setLogoPreview] = useState(null);

  // Badges fields (F03)
  const [badges, setBadges] = useState([]);
  const [isAddingBadge, setIsAddingBadge] = useState(false);
  const [newBadge, setNewBadge] = useState({
    type: 'Exhibitor', title: 'Mr.', firstName: '', lastName: '', mobile: '', altMobile: '', email: '',
    altEmail: '', companyName: '', designation: '', dob: '', idProofType: 'Aadhar Card', idProofNumber: '',
    emergencyContact: '', emergencyNumber: '', emergencyRelation: '', terms: false
  });

  // Fascia Name (F04)
  const [fasciaName, setFasciaName] = useState("");
  const [standNumber, setStandNumber] = useState("");
  const [hallNumber, setHallNumber] = useState("");
  const [customFascia, setCustomFascia] = useState(false);
  const [dateField, setDateField] = useState("");

  // Furniture (F06)
  const [furnitureOrders, setFurnitureOrders] = useState({
    A1: { qty: 0, price: 1000 }, A2: { qty: 0, price: 1500 }, A3: { qty: 0, price: 1500 }, A4: { qty: 0, price: 2000 },
    A5: { qty: 0, price: 1500 }, A6: { qty: 0, price: 2250 }, A7: { qty: 0, price: 4500 }, A8: { qty: 0, price: 5500 },
    A9: { qty: 0, price: 2000 }, A10: { qty: 0, price: 1500 }, A11: { qty: 0, price: 2500 }, A12: { qty: 0, price: 5500 }, A13: { qty: 0, price: 7500 }
  });
  const furnitureTotal = Object.values(furnitureOrders).reduce((acc, item) => acc + (item.qty * item.price), 0);
  const furnitureGrandTotal = furnitureTotal + (furnitureTotal * 0.18);

  const handleFurnitureQtyChange = (code, qty) => {
    setFurnitureOrders(prev => ({
      ...prev,
      [code]: { ...prev[code], qty: Number(qty) }
    }));
  };

  // Electricity (F07)
  const [electricityItem, setElectricityItem] = useState("");
  const [wifiItem, setWifiItem] = useState("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('companyName');
      if (storedName) {
        setAuthCompanyName(storedName);
        setNewBadge(prev => ({ ...prev, companyName: storedName }));
      }

      const stored = localStorage.getItem('submittedForms');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed[formId]) {
          setIsComplete(true);
          const data = parsed[formId];
          if (data.companyName) setCompanyName(data.companyName);
          if (data.contactPerson) setContactPerson(data.contactPerson);
          if (data.address) setAddress(data.address);
          if (data.country) setCountry(data.country);
          if (data.tel) setTel(data.tel);
          if (data.fax) setFax(data.fax);
          if (data.email) setEmail(data.email);
          if (data.website) setWebsite(data.website);
          if (data.mobile) setMobile(data.mobile);
          if (data.description) setDescription(data.description);
          if (data.productCategory) setProductCategory(data.productCategory);
          if (data.logoPreview) setLogoPreview(data.logoPreview);

          if (data.badges) setBadges(data.badges);
          
          if (data.fasciaName) setFasciaName(data.fasciaName);
          if (data.standNumber) setStandNumber(data.standNumber);
          if (data.hallNumber) setHallNumber(data.hallNumber);
          if (data.customFascia) setCustomFascia(data.customFascia);
          if (data.dateField) setDateField(data.dateField);

          if (data.furnitureOrders) setFurnitureOrders(data.furnitureOrders);
          if (data.electricityItem) setElectricityItem(data.electricityItem);
          if (data.wifiItem) setWifiItem(data.wifiItem);

        } else if (storedName) {
           setCompanyName(storedName);
           setFasciaName(storedName);
        }
      } else if (storedName) {
         setCompanyName(storedName);
         setFasciaName(storedName);
      }
    }
  }, [formId]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsComplete(true);
    let payload = {};
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('submittedForms');
      const parsed = stored ? JSON.parse(stored) : {};
      payload = {
        formId, companyName: companyName || authCompanyName,
        contactPerson, address, country, tel, fax, email, website, mobile, description, productCategory, logoPreview,
        badges, fasciaName, standNumber, hallNumber, customFascia, dateField,
        furnitureOrders, electricityItem, wifiItem,
        timestamp: Date.now()
      };
      parsed[formId] = payload;
      localStorage.setItem('submittedForms', JSON.stringify(parsed));
    }
    try {
      await fetch('/api/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    } catch(err) { console.error("API dispatch failed:", err); }
    alert(`Successfully saved and submitted form ${formId}!`);
  };

  const handleSaveBadge = (e) => {
    e.preventDefault();
    if (badges.length >= 6) { alert("Only 6 badges allowed per login. Please make a request for more badges."); return; }
    if (!newBadge.terms) { alert("Please accept the terms and conditions"); return; }
    const badgeToPush = { ...newBadge, urn: `URN${Math.floor(Math.random() * 10000)}`, status: 'Pending' };
    const updatedBadges = [...badges, badgeToPush];
    setBadges(updatedBadges);
    setIsAddingBadge(false);
    
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('submittedForms');
      const parsed = stored ? JSON.parse(stored) : {};
      const F03Data = parsed[formId] || {};
      F03Data.badges = updatedBadges;
      F03Data.formId = formId; 
      F03Data.companyName = authCompanyName;
      F03Data.timestamp = Date.now();
      parsed[formId] = F03Data;
      localStorage.setItem('submittedForms', JSON.stringify(parsed));
      setIsComplete(true);
      try { fetch('/api/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(F03Data) }); } catch(err) {}
    }
    setNewBadge({ type: 'Exhibitor', title: 'Mr.', firstName: '', lastName: '', mobile: '', altMobile: '', email: '', altEmail: '', companyName: authCompanyName, designation: '', dob: '', idProofType: 'Aadhar Card', idProofNumber: '', emergencyContact: '', emergencyNumber: '', emergencyRelation: '', terms: false });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { alert("File size exceeds 2 MB limit."); return; }
      const reader = new FileReader();
      reader.onloadend = () => { setLogoPreview(reader.result); };
      reader.readAsDataURL(file);
    }
  };

  // ------------------------- F01: COMPANY PROFILE -------------------------
  const renderF01Form = () => (
    <form className="form-work-area card mt-20" onSubmit={handleSubmit}>
      <div className="section-title"><h3>Company Profile</h3></div>
      <div className="form-row"><label>Company Name</label><input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="gray-input" required /></div>
      <div className="form-row-grid"><div className="form-row"><label>Contact Person</label><input type="text" value={contactPerson} onChange={e => setContactPerson(e.target.value)} className="gray-input" required /></div><div className="form-row"><label>Address</label><input type="text" value={address} onChange={e => setAddress(e.target.value)} className="gray-input" required /></div></div>
      <div className="form-row-grid"><div className="form-row"><label>Country</label><input type="text" value={country} onChange={e => setCountry(e.target.value)} className="gray-input" required /></div><div className="form-row"><label>Tel</label><input type="text" value={tel} onChange={e => setTel(e.target.value)} className="gray-input" /></div><div className="form-row"><label>Fax</label><input type="text" value={fax} onChange={e => setFax(e.target.value)} className="gray-input" /></div></div>
      <div className="form-row-grid"><div className="form-row"><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="gray-input" required /></div><div className="form-row"><label>Website</label><input type="text" value={website} onChange={e => setWebsite(e.target.value)} className="gray-input" /></div></div>
      <div className="form-row" style={{ maxWidth: '400px' }}><label>Mobile Number</label><input type="tel" value={mobile} onChange={e => setMobile(e.target.value)} className="gray-input" required /></div>
      <div className="form-row mt-20"><label>Description Words (max 100)</label><textarea value={description} onChange={e => setDescription(e.target.value)} className="gray-input" rows="5" required></textarea></div>
      <div className="form-actions-footer mt-40"><button type="submit" className="btn-save">{isComplete ? "Update Form" : "Save Changes"}</button></div>
    </form>
  );

  // ------------------------- F02: DIRECTORY MAP BOARD -------------------------
  const renderF02Form = () => (
    <form className="form-work-area card mt-20" onSubmit={handleSubmit}>
      <div className="section-title"><h3>Directory Map Board Details</h3></div>
      <div className="form-row mt-20"><label>COMPANY NAME</label><input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="gray-input uppercase-input" maxLength="35" required /></div>
      <div className="form-row-grid mt-20" style={{ gridTemplateColumns: '1fr 1fr', maxWidth: '600px' }}>
        <div className="form-row"><label>Booth Number</label><input type="text" value={standNumber} onChange={e => setStandNumber(e.target.value)} className="gray-input" required /></div>
        <div className="form-row"><label>Hall Number</label><input type="text" value={hallNumber} onChange={e => setHallNumber(e.target.value)} className="gray-input" required /></div>
      </div>
      <div className="form-actions-footer mt-40"><button type="submit" className="btn-save">{isComplete ? "Update Form" : "Save Changes"}</button></div>
    </form>
  );

  // ------------------------- F03: BADGES -------------------------
  const renderF03List = () => (
    <div className="badge-container-card mt-20">
      <div className="badge-status-bar"><div>Total Badges Used : {badges.length}/6</div><div>Status <span className="badge-status-lbl">In Draft</span></div></div>
      <div className="badge-header-info">
        <div className="badge-info-text"><h4>No. of Badges Alloted : - 5 Exhibitor & 1 Service badges</h4></div>
        <div className="badge-action-btns">
          <div className="badge-action-row mt-10"><button className="btn-green" onClick={() => setIsAddingBadge(true)} disabled={badges.length >= 6}>+ Add Badge</button></div>
        </div>
      </div>
      <div className="badge-table-wrapper">
        <table className="badge-table">
          <thead><tr><th>#</th><th>Type</th><th>URN</th><th>Name</th><th>Company Name</th><th>Email</th><th>Mobile</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {badges.length === 0 ? <tr><td colSpan="9" style={{textAlign: "center", padding: "20px"}}>No badges added yet.</td></tr> : badges.map((badge, idx) => (
              <tr key={idx}><td>{idx + 1}</td><td>{badge.type}</td><td>{badge.urn}</td><td>{badge.firstName} {badge.lastName}</td><td>{badge.companyName}</td><td>{badge.email}</td><td>{badge.mobile}</td><td><span className="badge-status-pill">{badge.status}</span></td><td><i className="fas fa-bars" style={{color: '#22c55e', cursor: 'pointer'}}></i></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderF03AddBadge = () => (
    <form className="card mt-20" onSubmit={handleSaveBadge} style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ background: '#f8fafc', padding: '15px 20px', borderBottom: '1px solid #e2e8f0' }}><h3 style={{ margin: 0, fontSize: '16px' }}>Badge</h3></div>
      <div style={{ padding: '30px' }}>
        <div className="form-row-grid" style={{ gridTemplateColumns: '100px 1fr 1fr' }}>
          <div className="form-row"><label>Title</label><select className="gray-input" value={newBadge.title} onChange={e => setNewBadge({...newBadge, title: e.target.value})}><option>Mr.</option><option>Ms.</option><option>Mrs.</option></select></div>
          <div className="form-row"><label>First Name</label><input type="text" className="gray-input" value={newBadge.firstName} onChange={e => setNewBadge({...newBadge, firstName: e.target.value})} required /></div>
          <div className="form-row"><label>Last Name</label><input type="text" className="gray-input" value={newBadge.lastName} onChange={e => setNewBadge({...newBadge, lastName: e.target.value})} required /></div>
        </div>
        <div className="form-row-grid">
          <div className="form-row"><label>Email Id</label><input type="email" className="gray-input" value={newBadge.email} onChange={e => setNewBadge({...newBadge, email: e.target.value})} required /></div>
          <div className="form-row"><label>Company Name</label><input type="text" className="gray-input" value={newBadge.companyName} onChange={e => setNewBadge({...newBadge, companyName: e.target.value})} required /></div>
        </div>
        <div className="terms-section mt-20">
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '12px', cursor: 'pointer' }}><input type="checkbox" checked={newBadge.terms} onChange={e => setNewBadge({...newBadge, terms: e.target.checked})} style={{ marginTop: '3px' }}/><span>I accept the Terms and Conditions</span></label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px' }}><button type="submit" className="btn-green">Save</button><button type="button" className="btn-gray" onClick={() => setIsAddingBadge(false)}>Cancel</button></div>
      </div>
    </form>
  );

  // ------------------------- F04: FASCIA NAME -------------------------
  const renderF04Form = () => (
    <form className="form-work-area card mt-20" onSubmit={handleSubmit}>
      <div className="section-title text-center" style={{ textAlign: 'center', marginBottom: '30px' }}>
        <span className="highlight-yellow" style={{ fontSize: '13px' }}>FASCIA NAME &ndash; SHELL SCHEME PACKAGE</span>
      </div>
      <div className="form-row-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <div className="form-row"><label>Company Name</label><input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="gray-input" required /></div>
        <div className="form-row"><label>Booth No</label><input type="text" value={standNumber} onChange={e => setStandNumber(e.target.value)} className="gray-input" required /></div>
        <div className="form-row"><label>Date</label><input type="date" value={dateField} onChange={e => setDateField(e.target.value)} className="gray-input" required /></div>
        <div className="form-row"><label>Address</label><input type="text" value={address} onChange={e => setAddress(e.target.value)} className="gray-input" required /></div>
        <div className="form-row"><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="gray-input" required /></div>
        <div className="form-row"><label>Tel / Mobile</label><input type="tel" value={tel} onChange={e => setTel(e.target.value)} className="gray-input" /></div>
      </div>
      <div className="form-row mt-20">
        <label>1. FASCIA NAME (Max 30 Letters)</label>
        <input type="text" value={fasciaName} onChange={e => setFasciaName(e.target.value.substring(0,30))} className="gray-input uppercase-input" style={{ letterSpacing: '4px' }} placeholder="BLOCK LETTERS" required />
      </div>
      <div className="form-row mt-20">
        <label>2. Customized Fascia</label>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input type="checkbox" checked={customFascia} onChange={e => setCustomFascia(e.target.checked)} />
          <span>Please send us a quotation based on our attached logo (Tick if required)</span>
        </div>
      </div>
      {(customFascia) && (
        <div className="logo-upload-box">
          <input type="file" accept=".png,.jpg,.jpeg" onChange={handleLogoUpload} />
          {logoPreview && <img src={logoPreview} style={{maxHeight:'50px', marginTop: '10px'}} alt="Logo" />}
        </div>
      )}
      <div className="form-actions-footer mt-40">
        <button type="submit" className="btn-save">{isComplete ? "Update Form" : "Save Changes"}</button>
      </div>
    </form>
  );

  // ------------------------- F06: FURNITURE REQUIREMENTS -------------------------
  const renderF06Form = () => {
    const itemNames = { A1: 'Standard Chair (Black)', A2: 'Wooden-Leg Chair (White)', A3: 'Standard Chair (White)', A4: 'Leather Bar Stool', A5: 'Steel Brochure Stand', A6: 'Single Seater Sofa', A7: 'Double Seater Sofa', A8: 'Triple Seater Sofa', A9: 'Glass Round Table', A10: 'Standard Octonorm Information Counter', A11: 'Octonorm Lockable Table', A12: 'Glass Showcase', A13: 'Standing Glass Showcase' };
    return (
    <form className="form-work-area card mt-20" onSubmit={handleSubmit}>
      <div className="section-title text-center" style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h3 className="highlight-yellow" style={{ fontSize: '15px' }}>ADDITIONAL FURNITURE REQUIREMENTS</h3>
      </div>
      <div className="form-row-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <div className="form-row"><label>Company Name</label><input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="gray-input" required /></div>
        <div className="form-row"><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="gray-input" /></div>
      </div>
      <div className="badge-table-wrapper mt-20">
        <table className="badge-table" style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse'}}>
          <thead><tr><th>Code</th><th>PARTICULARS</th><th>Unit Price</th><th>QTY</th><th>Total</th></tr></thead>
          <tbody>
            {Object.keys(furnitureOrders).map(code => (
              <tr key={code} style={{ borderBottom: '1px solid #eee' }}>
                <td>{code}</td><td>{itemNames[code]}</td><td>{furnitureOrders[code].price}/-</td>
                <td><input type="number" min="0" value={furnitureOrders[code].qty} onChange={e => handleFurnitureQtyChange(code, e.target.value)} className="gray-input" style={{ width: '70px', padding: '5px' }} /></td>
                <td>{furnitureOrders[code].qty * furnitureOrders[code].price}/-</td>
              </tr>
            ))}
            <tr style={{ background: '#f8fafc' }}><td colSpan="4" style={{ textAlign: 'right', fontWeight: 'bold' }}>NET TOTAL</td><td style={{ fontWeight: 'bold' }}>{furnitureTotal}/-</td></tr>
            <tr><td colSpan="4" style={{ textAlign: 'right', fontWeight: 'bold' }}>GST 18%</td><td style={{ fontWeight: 'bold' }}>{furnitureTotal * 0.18}/-</td></tr>
            <tr style={{ background: '#e2e8f0' }}><td colSpan="4" style={{ textAlign: 'right', fontWeight: 'bold' }}>GRAND TOTAL (INR)</td><td style={{ fontWeight: 'bold', color: '#16a34a' }}>{furnitureGrandTotal}/-</td></tr>
          </tbody>
        </table>
      </div>
      <div className="form-actions-footer mt-40">
        <button type="submit" className="btn-save">{isComplete ? "Update Form" : "Save Changes"}</button>
      </div>
    </form>
    );
  };

  // ------------------------- F07: ELECTRICITY CHARGES -------------------------
  const renderF07Form = () => (
    <form className="form-work-area card mt-20" onSubmit={handleSubmit}>
      <div className="section-title text-center" style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h3 className="highlight-yellow" style={{ fontSize: '15px' }}>ELECTRICITY CHARGES FOR DESIGNER STALLS</h3>
      </div>
      <div className="form-row-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <div className="form-row"><label>Company Name</label><input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="gray-input" required /></div>
        <div className="form-row"><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="gray-input" /></div>
      </div>
      <div className="form-row-grid mt-20">
        <div className="form-row">
           <label>ELECTRICITY CHARGES FOR DESIGNER STALLS</label>
           <select value={electricityItem} onChange={e => setElectricityItem(e.target.value)} className="gray-input" required>
             <option value="">Select Requirement</option>
             <option value="UP to 9 sqm. : 2000/-">UP to 9 sqm. - 2000/-</option>
             <option value="UP to 18 sqm : 3000/-">UP to 18 sqm - 3000/-</option>
             <option value="UP to 30 sqm : 4000/-">UP to 30 sqm - 4000/-</option>
             <option value="UP to 31-36 sqm : 5000/-">UP to 31-36 sqm - 5000/-</option>
             <option value="UP to 37-48 sqm : 7000/-">UP to 37-48 sqm - 7000/-</option>
           </select>
        </div>
        <div className="form-row">
           <label>WI-FI CHARGES FOR EXHIBITOR</label>
           <select value={wifiItem} onChange={e => setWifiItem(e.target.value)} className="gray-input">
             <option value="">Select Requirement</option>
             <option value="UP to 18 sqm. : 1000/-">UP to 18 sqm. - 1000/-</option>
             <option value="above 20 sqm : 2000/-">above 20 sqm - 2000/-</option>
           </select>
        </div>
      </div>
      <div className="form-actions-footer mt-40">
        <button type="submit" className="btn-save">{isComplete ? "Update Form" : "Save Changes"}</button>
      </div>
    </form>
  );

  return (
    <div className="form-detail-wrapper">
      <header className="dashboard-header thin">
        <div className="header-left"><span>Welcome, <strong>{authCompanyName}</strong></span></div>
        <div className="header-right"><i className="fas fa-user-circle"></i></div>
      </header>

      <div className="form-header-bar">
        <div className="container">
          <div className="header-bar-content">
            <Link href="/dashboard" className="back-btn"><i className="fas fa-chevron-left"></i></Link>
            <h1>{formId} - {formTitle}</h1>
            <div className="header-badges">
              {isComplete ? <span className="badge status-complete">Complete</span> : <span className="badge status-pending">Pending</span>}
              <span className="badge badge-deadline">Deadline: 29 Apr 2026</span>
            </div>
          </div>
        </div>
      </div>

      <main className="form-detail-content">
        <div className="container">
          <div className="wide-info-card" style={{ display: formId === 'F03' && isAddingBadge ? 'none' : 'block' }}>
            <h3>Company detail</h3>
            <div className="summary-list">
               <div className="summary-row"><strong>Company name</strong><span>{companyName}</span></div>
               <div className="summary-row"><strong>Email</strong><span>{email}</span></div>
               <div className="summary-row"><strong>Address</strong><span>{address}</span></div>
            </div>
          </div>

          {formId === 'F01' ? renderF01Form() : null}
          {formId === 'F02' ? renderF02Form() : null}
          {formId === 'F03' ? (isAddingBadge ? renderF03AddBadge() : renderF03List()) : null}
          {formId === 'F04' ? renderF04Form() : null}
          {formId === 'F06' ? renderF06Form() : null}
          {formId === 'F07' ? renderF07Form() : null}

          <div className="contact-queries-footer card mt-20" style={{ display: formId === 'F03' && isAddingBadge ? 'none' : 'block' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '16px' }}>For any questions or queries, please contact</h3>
            <div className="summary-list">
              <div className="summary-row"><strong>Contact Person</strong><span>Subhas Chandra</span></div>
              <div className="summary-row"><strong>Company name</strong><span>Tresub media pvt ltd</span></div>
              <div className="summary-row"><strong>Mobile no</strong><span>+91 9899072636</span></div>
              <div className="summary-row"><strong>Email</strong><span>neha@electricalmirror.net</span></div>
            </div>
          </div>
        </div>
      </main>

      <footer className="dashboard-footer">
        <p>Copyright © PowerPax India 2026.</p>
      </footer>
    </div>
  );
}
