"use client";

import { use, useState, useEffect } from 'react';
import Link from 'next/link';

const formTitles = {
  'F01': 'Show Directory (Company Profile & Product Index)',
  'F02': 'Directory Map Board Lettering',
  'F03': 'Exhibitor Name Badges',
  'F04': 'Fascia Name - Shell Scheme Package',
  'F05': 'Additional Furniture Requirements',
  'F06': 'Electricity Charges for Designer Stalls'
};

export default function FormDetailPage({ params }) {
  const unwrappedParams = use(params);
  const formId = unwrappedParams.id || 'F01';
  const formTitle = formTitles[formId] || 'Form Details';

  const [isComplete, setIsComplete] = useState(false);
  const [authCompanyName, setAuthCompanyName] = useState("");
  const [authUsername, setAuthUsername] = useState("");
  const [exhibitorData, setExhibitorData] = useState(null);
  
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
  const [gstNumber, setGstNumber] = useState("-");

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
  const [standType, setStandType] = useState("");
  const [standSize, setStandSize] = useState("");
  const [openSide, setOpenSide] = useState("");
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
      const storedExhibitor = localStorage.getItem('exhibitorData');
      
      if (storedExhibitor) {
        const data = JSON.parse(storedExhibitor);
        setExhibitorData(data);
        if (data.company_name) {
          setAuthCompanyName(data.company_name);
          setNewBadge(prev => ({ ...prev, companyName: data.company_name }));
        }
        if (data.username) setAuthUsername(data.username);
        // Master data is NOT pre-filled into forms anymore to respect the "only what I filled" request
      } else if (storedName) {
        setAuthCompanyName(storedName);
        setNewBadge(prev => ({ ...prev, companyName: storedName }));
      }

      const stored = localStorage.getItem('submittedForms');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed[formId]) {
          const data = parsed[formId];
          if (data && typeof data === 'object') {
            setIsComplete(true);
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
            if (data.standType) setStandType(data.standType);
            if (data.standSize) setStandSize(data.standSize);
            if (data.openSide) setOpenSide(data.openSide);
            if (data.customFascia) setCustomFascia(data.customFascia);
            if (data.dateField) setDateField(data.dateField);
            if (data.furnitureOrders) setFurnitureOrders(data.furnitureOrders);
            if (data.electricityItem) setElectricityItem(data.electricityItem);
            if (data.wifiItem) setWifiItem(data.wifiItem);
          }
        }
      }

      // --- LIVE RECOVERY FROM DB --- 
      // If we have a username, check the live database to be sure
      const storedUsername = localStorage.getItem('username') || storedName;
      if (storedUsername) {
        fetch('/api/submissions', { cache: 'no-store' })
          .then(res => res.json())
          .then(result => {
             if (result.success && result.data) {
               const mySub = result.data.find(s => 
                 (s.username === storedUsername || 
                  s.auth_company_name === storedUsername ||
                  s.auth_company_name === storedName ||
                  s.username === storedName) && 
                 s.form_id === formId
               );
               if (mySub && mySub.all_data && typeof mySub.all_data === 'object') {
                 const data = mySub.all_data;
                 setIsComplete(true);
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
                 if (data.badges) setBadges(data.badges || []);
                 if (data.fasciaName) setFasciaName(data.fasciaName);
                 if (data.standNumber) setStandNumber(data.standNumber);
                 if (data.hallNumber) setHallNumber(data.hallNumber);
                 if (data.furnitureOrders) setFurnitureOrders(data.furnitureOrders);
               }
             }
          }).catch(e => console.error("Sync error in form:", e));
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
        formId,
        username: authUsername || localStorage.getItem('username') || authCompanyName,
        authCompanyName,
        companyName: companyName || authCompanyName,
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
    if (badges.length >= 6) { 
      alert("Only 6 badges allowed per login. Please make a request for more badges through mail at abhishek.tresubmedia@gmail.com"); 
      return; 
    }
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
      <div className="section-title">
        <h3 className="highlight-yellow" style={{ fontSize: '15px' }}>Company Profile</h3>
      </div>
      
      <div style={{ fontSize: '12px', color: '#475569', marginBottom: '20px', lineHeight: '1.6' }}>
        <p style={{ marginBottom: '10px' }}>Each contracted booth in the exhibition is entitled to a free insertion of 100 words in the <strong>SHOW E-DIRECTORY</strong> describing the company, company&apos;s products / services without picture. Exhibitors are encouraged to use their full 100 words but should not exceed this limit. <strong>Excess text will be edited without further consultation with the exhibitor.</strong></p>
        <p><strong><u>Please note:</u> Your adherence to the specified deadline is imperative to guarantee inclusion into the SHOW E-DIRECTORY.</strong></p>
        <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginTop: '5px' }}>
          <li>Complete all sections.</li>
          <li>Please type using upper and lower cases throughout</li>
          <li>The text should be presented in one paragraph</li>
        </ul>
      </div>

      <div className="form-row">
        <label>Name of Exhibiting Company</label>
        <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="gray-input" required />
        <span style={{ fontSize: '11px', color: '#64748b' }}>(As it will appear in the directory) in ENGLISH</span>
      </div>
      
      <div className="form-row-grid mt-20">
        <div className="form-row"><label>Name of Contact Person</label><input type="text" value={contactPerson} onChange={e => setContactPerson(e.target.value)} className="gray-input" required /></div>
        <div className="form-row"><label>Address</label><input type="text" value={address} onChange={e => setAddress(e.target.value)} className="gray-input" required /></div>
      </div>
      
      <div className="form-row-grid">
        <div className="form-row"><label>Country</label><input type="text" value={country} onChange={e => setCountry(e.target.value)} className="gray-input" required /></div>
        <div className="form-row"><label>Tel</label><input type="text" value={tel} onChange={e => setTel(e.target.value)} className="gray-input" /></div>
        <div className="form-row"><label>Fax</label><input type="text" value={fax} onChange={e => setFax(e.target.value)} className="gray-input" /></div>
      </div>
      
      <div className="form-row-grid">
        <div className="form-row"><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="gray-input" required /></div>
        <div className="form-row"><label>Website</label><input type="text" value={website} onChange={e => setWebsite(e.target.value)} className="gray-input" /></div>
      </div>
      
      <div className="form-row" style={{ maxWidth: '400px' }}>
        <label>Mobile Number</label>
        <input type="tel" value={mobile} onChange={e => setMobile(e.target.value)} className="gray-input" required />
      </div>
      
      <div className="form-row mt-20">
        <label>Description Type words to be inserted in the SHOW DIRECTORY</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} className="gray-input" rows="5" required></textarea>
        <span style={{ fontSize: '11px', color: '#64748b' }}>(ENGLISH VERSION, 100 words only)</span>
      </div>

      <div className="form-row mt-20">
        <label>Company Logo</label>
        <div className="logo-upload-box" style={{ background: '#f8fafc', padding: '15px', border: '1px dashed #cbd5e1', borderRadius: '4px' }}>
          <input type="file" accept=".png,.jpg,.jpeg" onChange={handleLogoUpload} />
          {logoPreview && <img src={logoPreview} style={{maxHeight:'80px', marginTop: '10px'}} alt="Logo" />}
        </div>
        <span style={{ fontSize: '11px', color: '#64748b' }}>Allowed file types .png, .jpg, .jpeg Max file size 2 MB.</span>
      </div>

      <div className="section-title mt-40">
        <h3 className="highlight-yellow" style={{ fontSize: '15px' }}>Product Index</h3>
      </div>
      
      <div style={{ fontSize: '12px', color: '#475569', marginBottom: '20px', lineHeight: '1.6' }}>
        <p style={{ marginBottom: '10px' }}>Information provided here will be used to compile the product indices in the SHOW E-DIRECTORY. These indices will assist trade visitors to identify your company&apos;s products / services.</p>
        <p style={{ marginBottom: '10px' }}>Please select the product categories under which your company should be listed in the <strong>SHOW E-DIRECTORY</strong>. If any of your products do not fall under these categories, kindly specify on the &quot;Others&quot; Column provided. Please note that a new heading for these products will not be guaranteed.</p>
        <p style={{ marginBottom: '10px' }}>As an additional service to exhibitor, the Organiser&apos;s will allow <strong>FREE</strong> listing in more than one Product Category.</p>
        <p><strong><u>Please note:</u> Your adherence to the specified deadline is imperative to guarantee inclusion into the SHOW E-DIRECTORY.</strong></p>
      </div>

      <div className="form-row">
        <label>Please select as appropriate (or type &quot;other | category&quot;)</label>
        <input type="text" value={productCategory || ''} onChange={e => setProductCategory(e.target.value)} className="gray-input" placeholder="e.g. other | Media" required />
      </div>

      <div className="form-actions-footer mt-40">
        <button type="submit" className="btn-save">{isComplete ? "Update Form" : "Save Changes"}</button>
      </div>
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
          <div className="badge-action-row mt-10">
            <button className="btn-green" onClick={() => setIsAddingBadge(true)} disabled={badges.length >= 6}>+ Add Badge</button>
          </div>
          {badges.length >= 6 && (
            <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '10px' }}>
              Badge limit reached. For more badges, please email <a href="mailto:abhishek.tresubmedia@gmail.com" style={{ color: '#ef4444', fontWeight: 'bold' }}>abhishek.tresubmedia@gmail.com</a>
            </p>
          )}
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
          <div className="form-row"><label>Mobile Number</label><input type="tel" className="gray-input" value={newBadge.mobile} onChange={e => setNewBadge({...newBadge, mobile: e.target.value})} required /></div>
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
        <span style={{ fontSize: '14px', fontWeight: 'bold', background: '#fef08a', padding: '5px 15px', color: '#000', textTransform: 'uppercase' }}>
          THIS FORM APPLIES TO SHELL SCHEME BOOTH EXHIBITORS ONLY
        </span>
      </div>

      <div style={{ marginBottom: '25px' }}>
        <h3 style={{ fontSize: '16px', color: '#0f172a', marginBottom: '15px' }}>Fascia Name Details</h3>
        <p style={{ fontSize: '13px', color: '#334155', fontWeight: 'bold', margin: '0 0 5px 0' }}>Company Name and Stand Number to appear on our BOOTH FASCIA as:</p>
        <p style={{ fontSize: '13px', background: '#fef08a', display: 'inline-block', padding: '2px 5px', fontWeight: 'bold', color: '#000', margin: '0' }}>(Maximum 40 characters including spaces.)</p>
      </div>

      <div className="form-row">
        <label>Company Name</label>
        <input 
          type="text" 
          value={fasciaName} 
          onChange={e => setFasciaName(e.target.value.substring(0,40).toUpperCase())} 
          className="gray-input uppercase-input" 
          placeholder="RENEWABLE MIRROR" 
          required 
        />
        <span style={{ fontSize: '11px', color: '#64748b' }}>(Capital Letters only)</span>
      </div>

      <div className="form-row-grid mt-20" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="form-row">
          <label>Stand Number</label>
          <input type="text" value={standNumber} onChange={e => setStandNumber(e.target.value)} className="gray-input" required />
        </div>
        <div className="form-row">
          <label>Hall Number</label>
          <input type="text" value={hallNumber} onChange={e => setHallNumber(e.target.value)} className="gray-input" required />
        </div>
        <div className="form-row">
          <label>Number Of Sides Open</label>
          <input type="number" value={productCategory || ''} onChange={e => setProductCategory(e.target.value)} className="gray-input" min="1" max="4" required />
        </div>
      </div>

      <div style={{ marginTop: '30px', fontSize: '12px', color: '#475569', lineHeight: '1.6' }}>
        <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
          <li>Only one company name as per the contract signed is allowed on each exhibiting stand, unless organisers grant written approval. This is normally based on booth sizes of 9m&sup2; and above.</li>
          <li>No alteration / modification on the fascia name board provided by the official booth contractor is permitted.</li>
          <li><strong style={{ background: '#fef08a', padding: '2px 5px', color: '#000' }}>Fascia name once submitted in the online manual form will be charged on site @ INR 2,000/- each change in fascia.</strong></li>
        </ul>
      </div>

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
      <p style={{ fontSize: '13px', color: '#475569', marginBottom: '20px' }}>Please use this Form to order your furnishing needs. The STANDARD SHELL SCHEME package stand includes one Information Counter (T6), Two Chairs (C3) and one Waste Paper Basket. <strong style={{ textTransform: 'uppercase' }}>Order only your additional requirements</strong></p>
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

      <div style={{ marginTop: '30px', padding: '20px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px' }}>Payment Details</h4>
        <ol style={{ paddingLeft: '20px', fontSize: '13px', color: '#334155', lineHeight: '1.8' }}>
          <li>Payment in favour of <strong>Tresub Media Private Limited</strong>, payable at Noida, U.P.</li>
          <li>Terms: 50% in advance + 50% before the event.</li>
          <li>Subject to terms & conditions in the License to Use Agreement.</li>
          <li>Subject to Uttar Pradesh jurisdiction.</li>
          <li><strong>Bank:</strong> ICICI Bank Ltd., Branch – Greater Noida-Gaur City 2, Gautam Buddha Nagar, Noida, U.P. – 201009. <strong>A/C No:</strong> 739105000628. <strong>IFSC:</strong> ICIC0007391.</li>
        </ol>
        <p style={{ marginTop: '15px', fontSize: '13px', color: '#0f172a', fontWeight: '500' }}>
          <i className="fas fa-info-circle" style={{ color: '#0ea5e9', marginRight: '8px' }}></i>
          After making the payment, please drop a mail with the confirmation to: <a href="mailto:accounts@tresubmedia.com" style={{ color: '#0ea5e9', textDecoration: 'underline' }}>accounts@tresubmedia.com</a>
        </p>
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
      <p style={{ fontSize: '13px', color: '#475569', marginBottom: '10px' }}>This form must be completed and returned by every exhibitor. If service is not required, please endorse &apos;NOT APPLICABLE&apos; and return/email to the address above.</p>
      <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#84cc16', marginBottom: '20px' }}>PLEASE TYPE/WRITE IN BLOCK LETTERS</p>
      <div className="form-row-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <div className="form-row"><label>Company Name</label><input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="gray-input uppercase-input" required /></div>
        <div className="form-row"><label>Date</label><input type="date" value={dateField} onChange={e => setDateField(e.target.value)} className="gray-input" /></div>
        <div className="form-row"><label>Booth No</label><input type="text" value={standNumber} onChange={e => setStandNumber(e.target.value)} className="gray-input" /></div>
        <div className="form-row"><label>Fax</label><input type="text" value={fax} onChange={e => setFax(e.target.value)} className="gray-input" /></div>
        <div className="form-row"><label>Address</label><input type="text" value={address} onChange={e => setAddress(e.target.value)} className="gray-input" /></div>
        <div className="form-row"><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="gray-input" /></div>
        <div className="form-row"><label>Tel</label><input type="tel" value={tel} onChange={e => setTel(e.target.value)} className="gray-input" /></div>
        <div className="form-row"><label>Authorized by (Signature)</label><input type="text" placeholder="Type name to sign" className="gray-input" /></div>
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
              <span className="badge badge-deadline">Deadline: 28 Apr 2026</span>
            </div>
          </div>
        </div>
      </div>

      <main className="form-detail-content">
        <div className="container">
          <div className="responsive-header-grid" style={{ 
            display: (formId === 'F03' && isAddingBadge) || (!companyName && !contactPerson && !standNumber && !hallNumber) ? 'none' : 'flex', 
            flexWrap: 'wrap', 
            gap: '20px', 
            marginBottom: '20px' 
          }}>
            
            {/* Left Box: Company detail */}
            {(companyName || contactPerson || address || mobile) && (
              <div className="header-box" style={{ flex: '1 1 500px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '20px' }}>
                <h3 style={{ fontSize: '14px', marginBottom: '15px', color: '#1e293b' }}>Company detail</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px', fontSize: '13px', lineHeight: '1.4' }}>
                  <strong style={{ color: '#000' }}>Company name</strong><span style={{ color: '#475569' }}>{companyName || '-'}</span>
                  <strong style={{ color: '#000' }}>Contact Person</strong><span style={{ color: '#475569' }}>{contactPerson || '-'}</span>
                  <strong style={{ color: '#000' }}>Email</strong><span style={{ color: '#475569' }}>{email || '-'}</span>
                  <strong style={{ color: '#000' }}>Mobile no.</strong><span style={{ color: '#475569' }}>{mobile || '-'}</span>
                  <strong style={{ color: '#000' }}>Address</strong><span style={{ color: '#475569' }}>{address || '-'}</span>
                  <strong style={{ color: '#000' }}>GST Number</strong><span style={{ color: '#475569' }}>{gstNumber || '-'}</span>
                </div>
              </div>
            )}

            {/* Right Box: Exhibitor Stand Detail */}
            {(standNumber || hallNumber || standType) && (
              <div className="header-box" style={{ flex: '1 1 350px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '20px' }}>
                <h3 style={{ fontSize: '14px', marginBottom: '15px', color: '#1e293b' }}>Exhibitor Stand Detail</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(80px,auto) 1fr minmax(70px,auto) 1fr', gap: '10px 15px', fontSize: '13px', lineHeight: '1.4' }}>
                  <strong style={{ color: '#000' }}>Stand no.</strong><span style={{ color: '#475569' }}>{standNumber || '-'}</span>
                  <strong style={{ color: '#000' }}>Hall no</strong><span style={{ color: '#475569' }}>{hallNumber || '-'}</span>
                  
                  <strong style={{ color: '#000' }}>Stand type</strong><span style={{ color: '#475569' }}>{standType || '-'}</span>
                  <strong style={{ color: '#000' }}>Stand size</strong><span style={{ color: '#475569' }}>{standSize || '-'}</span>

                  <strong style={{ color: '#000' }}>Open side</strong><span style={{ color: '#475569' }}>{openSide || '-'}</span>
                  <span></span><span></span>
                </div>
              </div>
            )}

          </div>

          {formId === 'F01' ? renderF01Form() : null}
          {formId === 'F02' ? renderF02Form() : null}
          {formId === 'F03' ? (isAddingBadge ? renderF03AddBadge() : renderF03List()) : null}
          {formId === 'F04' ? renderF04Form() : null}
          {formId === 'F05' ? renderF06Form() : null}
          {formId === 'F06' ? renderF07Form() : null}
        </div>
      </main>

      <footer className="dashboard-footer">
        <p>Copyright © PowerPax India 2026.</p>
      </footer>
    </div>
  );
}
