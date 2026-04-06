"use client";

import { use, useState, useEffect } from 'react';
import Link from 'next/link';

const formTitles = {
  'F01': 'Show Directory (Company Profile & Product Index)',
  'F02': 'Directory Map Board Lettering',
  'F03': 'Exhibitor Name Badges',
  'F04': 'Fascia Name',
  'F05': 'Insurance Coverage Public Liability Refunds'
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

  // F08 fields
  const [fasciaName, setFasciaName] = useState("");
  const [standNumber, setStandNumber] = useState("");
  const [hallNumber, setHallNumber] = useState("");
  const [sidesOpen, setSidesOpen] = useState("");

  const [logoPreview, setLogoPreview] = useState(null);

  // F07 fields
  const [badges, setBadges] = useState([]);
  const [isAddingBadge, setIsAddingBadge] = useState(false);
  const [newBadge, setNewBadge] = useState({
    type: 'Exhibitor',
    title: 'Mr.',
    firstName: '',
    lastName: '',
    mobile: '',
    altMobile: '',
    email: '',
    altEmail: '',
    companyName: '',
    designation: '',
    dob: '',
    idProofType: 'Aadhar Card',
    idProofNumber: '',
    emergencyContact: '',
    emergencyNumber: '',
    emergencyRelation: '',
    terms: false
  });

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
          
          if (data.fasciaName) setFasciaName(data.fasciaName);
          if (data.standNumber) setStandNumber(data.standNumber);
          if (data.hallNumber) setHallNumber(data.hallNumber);
          if (data.sidesOpen) setSidesOpen(data.sidesOpen);
          if (data.logoPreview) setLogoPreview(data.logoPreview);

          if (data.badges) setBadges(data.badges);
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
        formId,
        companyName: companyName || authCompanyName,
        contactPerson, address, country, tel, fax, email, website, mobile, description, productCategory,
        fasciaName, standNumber, hallNumber, sidesOpen, logoPreview,
        badges,
        timestamp: Date.now()
      };
      
      parsed[formId] = payload;
      localStorage.setItem('submittedForms', JSON.stringify(parsed));
    }

    try {
      await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch(err) {
      console.error("API dispatch failed:", err);
    }
    
    alert(`Successfully saved and submitted form ${formId}!`);
  };

  const handleSaveBadge = (e) => {
    e.preventDefault();
    if (badges.length >= 6) {
      alert("Only 6 badges allowed per login. Please make a request for more badges.");
      return;
    }
    
    if (!newBadge.terms) {
      alert("Please accept the terms and conditions");
      return;
    }
    
    // Push new badge
    const badgeToPush = { ...newBadge, urn: `URN${Math.floor(Math.random() * 10000)}`, status: 'Pending' };
    const updatedBadges = [...badges, badgeToPush];
    setBadges(updatedBadges);
    setIsAddingBadge(false);
    
    // Automatically save form state to localStorage
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

      // Webhook dispatch specifically for updating badges
      try {
        fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(F03Data)
        });
      } catch(err) {
        console.error("API dispatch failed:", err);
      }
    }
    
    // Reset add badge form
    setNewBadge({
      type: 'Exhibitor', title: 'Mr.', firstName: '', lastName: '', mobile: '', altMobile: '', email: '',
      altEmail: '', companyName: authCompanyName, designation: '', dob: '', idProofType: 'Aadhar Card',
      idProofNumber: '', emergencyContact: '', emergencyNumber: '', emergencyRelation: '', terms: false
    });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size exceeds 2 MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderF07List = () => (
    <div className="badge-container-card mt-20">
      <div className="badge-status-bar">
        <div>Total Badges Used : {badges.length}/6</div>
        <div>Status <span className="badge-status-lbl">In Draft</span></div>
      </div>
      
      <div className="badge-header-info">
        <div className="badge-info-text">
          <h4>No. of Badges Alloted : - 5 Exhibitor & 1 Service badges (Total 6 Badges)</h4>
          <p>You can apply for any number of service or employee badge, but total number of badges should not more than total alloted badge (i.e. 6 Badges).</p>
        </div>
        <div className="badge-action-btns">
          <button className="btn-green" onClick={() => alert("Requesting extra badges...")}><i className="fas fa-plus"></i> Request For Extra Badge</button>
          <div className="badge-action-row mt-10">
            <button className="btn-green" onClick={() => alert("Excel Import")}>Invite By Excel</button>
            <button className="btn-green" onClick={() => alert("Invite link")}>+ Invite</button>
            <button 
              className="btn-green" 
              onClick={() => setIsAddingBadge(true)}
              disabled={badges.length >= 6}
            >
              + Add Badge
            </button>
          </div>
        </div>
      </div>

      <div className="search-container">
        <h4><i className="fas fa-search"></i> Search Employees</h4>
        <p style={{fontSize: '12px', color: '#666'}}>Search by Name, Company, Email, or Mobile</p>
        <div className="search-input-group">
          <input type="text" placeholder="Enter name, company, email, or mobile number..." className="gray-input" />
          <button className="btn-green"><i className="fas fa-search"></i> Search</button>
          <button className="btn-gray"><i className="fas fa-times"></i> Clear</button>
        </div>
      </div>

      <div className="badge-table-wrapper">
        <table className="badge-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Type</th>
              <th>URN</th>
              <th>Name</th>
              <th>Company Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {badges.length === 0 ? (
              <tr><td colSpan="9" style={{textAlign: "center", padding: "20px"}}>No badges added yet.</td></tr>
            ) : badges.map((badge, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{badge.type}</td>
                <td>{badge.urn}</td>
                <td>{badge.firstName} {badge.lastName}</td>
                <td>{badge.companyName}</td>
                <td>{badge.email}</td>
                <td>{badge.mobile}</td>
                <td><span className="badge-status-pill">{badge.status}</span></td>
                <td><i className="fas fa-bars" style={{color: '#22c55e', cursor: 'pointer'}}></i></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-block">
        <div>Showing {badges.length} out of {badges.length}</div>
        <div><button className="page-btn">1</button></div>
      </div>

      <div className="badge-status-bar">
        <div>Total Badges Used : {badges.length}/6</div>
        <div>Status <span className="badge-status-lbl">In Draft</span></div>
      </div>
    </div>
  );

  const renderF07AddBadge = () => (
    <form className="card mt-20" onSubmit={handleSaveBadge} style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ background: '#f8fafc', padding: '15px 20px', borderBottom: '1px solid #e2e8f0' }}>
        <h3 style={{ margin: 0, fontSize: '16px' }}>Badge</h3>
      </div>
      
      <div style={{ padding: '30px' }}>
        <div className="form-row">
          <label>Select Badge Type <span className="text-danger">*</span></label>
          <div style={{ display: 'flex', gap: '20px' }}>
            <label style={{ fontWeight: 'normal' }}>
              <input type="radio" checked={newBadge.type === 'Exhibitor'} onChange={() => setNewBadge({...newBadge, type: 'Exhibitor'})} /> Exhibitor Badge
            </label>
            <label style={{ fontWeight: 'normal' }}>
              <input type="radio" checked={newBadge.type === 'Service'} onChange={() => setNewBadge({...newBadge, type: 'Service'})} /> Service Badge
            </label>
          </div>
        </div>

        <div className="form-row-grid" style={{ gridTemplateColumns: '100px 1fr 1fr' }}>
          <div className="form-row">
            <label>Title</label>
            <select className="gray-input" value={newBadge.title} onChange={e => setNewBadge({...newBadge, title: e.target.value})}>
              <option>Mr.</option>
              <option>Ms.</option>
              <option>Mrs.</option>
            </select>
          </div>
          <div className="form-row">
            <label>First Name <span className="text-danger">*</span></label>
            <input type="text" className="gray-input" value={newBadge.firstName} onChange={e => setNewBadge({...newBadge, firstName: e.target.value})} required />
          </div>
          <div className="form-row">
            <label>Last Name <span className="text-danger">*</span></label>
            <input type="text" className="gray-input" value={newBadge.lastName} onChange={e => setNewBadge({...newBadge, lastName: e.target.value})} required />
          </div>
        </div>

        <div className="form-row-grid">
          <div className="form-row">
            <label>Mobile No. <span className="text-danger">*</span></label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <select className="gray-input" style={{ width: '80px' }}><option>+91</option></select>
              <input type="tel" className="gray-input" value={newBadge.mobile} onChange={e => setNewBadge({...newBadge, mobile: e.target.value})} required />
            </div>
          </div>
          <div className="form-row">
            <label>Alternate Mobile No.</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <select className="gray-input" style={{ width: '80px' }}><option>+91</option></select>
              <input type="tel" className="gray-input" value={newBadge.altMobile} onChange={e => setNewBadge({...newBadge, altMobile: e.target.value})} />
            </div>
          </div>
        </div>

        <div className="form-row-grid">
          <div className="form-row">
            <label>Email Id <span className="text-danger">*</span></label>
            <input type="email" className="gray-input" value={newBadge.email} onChange={e => setNewBadge({...newBadge, email: e.target.value})} required />
          </div>
          <div className="form-row">
            <label>Alternate Email Id</label>
            <input type="email" className="gray-input" value={newBadge.altEmail} onChange={e => setNewBadge({...newBadge, altEmail: e.target.value})} />
          </div>
        </div>

        <div className="form-row-grid">
          <div className="form-row">
            <label>Company Name <span className="text-danger">*</span></label>
            <input type="text" className="gray-input" value={newBadge.companyName} onChange={e => setNewBadge({...newBadge, companyName: e.target.value})} required />
          </div>
          <div className="form-row">
            <label>Designation <span className="text-danger">*</span></label>
            <input type="text" className="gray-input" value={newBadge.designation} onChange={e => setNewBadge({...newBadge, designation: e.target.value})} required />
          </div>
        </div>

        <div className="form-row-grid">
          <div className="form-row">
            <label>Date Of Birth</label>
            <input type="date" className="gray-input" value={newBadge.dob} onChange={e => setNewBadge({...newBadge, dob: e.target.value})} />
          </div>
          <div className="form-row">
            <label>Identity Proof Type</label>
            <select className="gray-input" value={newBadge.idProofType} onChange={e => setNewBadge({...newBadge, idProofType: e.target.value})}>
              <option>Aadhar Card</option>
              <option>PAN Card</option>
              <option>Driving License</option>
            </select>
          </div>
        </div>

        <div className="form-row-grid">
          <div className="form-row">
            <label>Identity Proof Number</label>
            <input type="text" className="gray-input" value={newBadge.idProofNumber} onChange={e => setNewBadge({...newBadge, idProofNumber: e.target.value})} />
          </div>
          <div className="form-row">
            <label>Profile Image</label>
            <div className="logo-upload-box" style={{ marginTop: 0 }}>
               <div style={{ padding: '20px', background: '#f8fafc', border: '1px dashed #ccc', textAlign: 'center', cursor: 'pointer' }}>
                   <i className="fas fa-camera" style={{ fontSize: '24px', color: '#999' }}></i>
                   <p style={{ fontSize: '11px', color: '#666', marginTop: '10px' }}>Click to upload profile photo</p>
               </div>
            </div>
          </div>
        </div>

        <div className="section-title mt-40">
          <h3 style={{ fontSize: '15px' }}>Emergency Contact Detail</h3>
          <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid #e2e8f0' }}/>
        </div>

        <div className="form-row-grid">
          <div className="form-row">
            <label>Contact Person</label>
            <input type="text" className="gray-input" value={newBadge.emergencyContact} onChange={e => setNewBadge({...newBadge, emergencyContact: e.target.value})} />
          </div>
          <div className="form-row">
            <label>Contact Number</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <select className="gray-input" style={{ width: '80px' }}><option>+91</option></select>
              <input type="tel" className="gray-input" value={newBadge.emergencyNumber} onChange={e => setNewBadge({...newBadge, emergencyNumber: e.target.value})} />
            </div>
          </div>
        </div>

        <div className="form-row">
          <label>Relation With Contact Person</label>
          <input type="text" className="gray-input" value={newBadge.emergencyRelation} onChange={e => setNewBadge({...newBadge, emergencyRelation: e.target.value})} />
        </div>

        <div className="terms-section mt-40">
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '12px', fontWeight: 'normal', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={newBadge.terms} 
              onChange={e => setNewBadge({...newBadge, terms: e.target.checked})} 
              style={{ marginTop: '3px' }}
            />
            <span>I accept the Terms and Conditions and Privacy Policy</span>
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px' }}>
          <button type="submit" className="btn-green">Save</button>
          <button type="button" className="btn-gray" onClick={() => setIsAddingBadge(false)}>Cancel</button>
        </div>
      </div>
    </form>
  );

  const renderF08Form = () => (
    <form className="form-work-area card mt-20" onSubmit={handleSubmit}>
      <div className="section-title text-center" style={{ textAlign: 'center', marginBottom: '30px' }}>
        <span className="highlight-yellow" style={{ fontSize: '13px' }}>THIS FORM APPLIES TO SHELL SCHEME BOOTH EXHIBITORS ONLY</span>
      </div>

      <div className="section-title">
        <h3>Fascia Name Details</h3>
        <p className="profile-instruction mt-10" style={{ fontSize: '13px' }}>
          <strong>Company Name and Stand Number to appear on our BOOTH FASCIA as:</strong><br/>
          <span className="highlight-yellow">(maximum 40 characters including spaces)</span>
        </p>
      </div>
      
      <div className="form-row">
        <label>Company Name</label>
        <input 
          type="text" 
          value={fasciaName} 
          onChange={e => setFasciaName(e.target.value)} 
          className="gray-input uppercase-input" 
          maxLength="40"
          required 
        />
        <p className="note" style={{ fontStyle: 'italic' }}>(Capital Letters Only)</p>
      </div>

      <div className="form-row-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="form-row">
          <label>Stand Number</label>
          <input type="text" value={standNumber} onChange={e => setStandNumber(e.target.value)} className="gray-input" required />
        </div>
        <div className="form-row">
          <label>Hall Number</label>
          <input type="text" value={hallNumber} onChange={e => setHallNumber(e.target.value)} className="gray-input" required />
        </div>
        <div className="form-row">
          <label>Number of Sides Open</label>
          <input type="text" value={sidesOpen} onChange={e => setSidesOpen(e.target.value)} className="gray-input" required />
        </div>
      </div>

      <div className="mt-20">
        <ul className="profile-bullet" style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
          <li>Only one company name as per the contract signed is allowed on each exhibiting stand, unless organisers grant written approval. This is normally based on booth size of 9m² and above.</li>
          <li>No alteration / modification on the fascia name board provided by the official booth contractor is permitted.</li>
          <li><span className="highlight-yellow">Fascia name once submitted in the online manual form will be charged on-site @ INR 3,000/- each change in fascia.</span></li>
        </ul>
      </div>

      <div className="form-actions-footer mt-40" style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
        <button type="submit" className="btn-save">
          {isComplete ? "Update Form" : "Save Changes"}
        </button>
      </div>
    </form>
  );

  const renderF01Form = () => (
    <form className="form-work-area card mt-20" onSubmit={handleSubmit}>
      <div className="section-title">
        <h3>Company Profile</h3>
        <p className="profile-instruction">
          Each contracted booth in the exhibition is entitled to a free insertion of 100 words in the <strong>SHOW E-DIRECTORY</strong> describing the company, company&apos;s products/services without picture. Exhibitors are encouraged to use their full 100 words but should not exceed this limit. <strong>Excess text will be edited without further consultation with the exhibitor.</strong>
        </p>
        <br/>
        <p className="profile-instruction">
          <strong>Please note: Your adherence to the specified deadline is imperative to guarantee inclusion into the SHOW E-DIRECTORY.</strong>
        </p>
        <ul className="profile-bullet" style={{ listStyleType: 'disc' }}>
          <li>Complete all sections.</li>
          <li>Please type using upper and lower cases throughout</li>
          <li>The text should be presented in one paragraph</li>
        </ul>
      </div>
      
      <div className="form-row">
        <label>Name of Exhibiting Company</label>
        <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="gray-input" required />
        <p className="note">(As it will appear in the directory) in ENGLISH</p>
      </div>

      <div className="form-row-grid">
        <div className="form-row">
          <label>Name of Contact Person</label>
          <input type="text" value={contactPerson} onChange={e => setContactPerson(e.target.value)} className="gray-input" required />
        </div>
        <div className="form-row">
          <label>Address</label>
          <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="gray-input" required />
        </div>
      </div>

      <div className="form-row-grid">
        <div className="form-row">
          <label>Country</label>
          <input type="text" value={country} onChange={e => setCountry(e.target.value)} className="gray-input" required />
        </div>
        <div className="form-row">
          <label>Tel</label>
          <input type="text" value={tel} onChange={e => setTel(e.target.value)} className="gray-input" />
        </div>
        <div className="form-row">
          <label>Fax</label>
          <input type="text" value={fax} onChange={e => setFax(e.target.value)} className="gray-input" />
        </div>
      </div>

      <div className="form-row-grid">
        <div className="form-row">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="gray-input" required />
        </div>
        <div className="form-row">
          <label>Website</label>
          <input type="text" value={website} onChange={e => setWebsite(e.target.value)} className="gray-input" />
        </div>
      </div>

      <div className="form-row" style={{ maxWidth: '400px' }}>
        <label>Mobile Number</label>
        <input type="tel" value={mobile} onChange={e => setMobile(e.target.value)} className="gray-input" required />
      </div>

      <div className="form-row mt-20">
        <label>Description Type words to be inserted in the SHOW DIRECTORY</label>
        <textarea 
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="gray-input"
          rows="5"
          required
        ></textarea>
        <p className="note">(ENGLISH VERSION, 100 words only)</p>
      </div>

      <div className="section-title mt-40">
        <h3 style={{ fontSize: '13px', marginBottom: '10px' }}>Company Logo</h3>
      </div>
      
      <div className="logo-upload-box">
        <div className="logo-preview-placeholder">
          {logoPreview ? (
            <div style={{ padding: '10px', border: '1px solid #ddd', display: 'inline-block', background: '#fff' }}>
               <img src={logoPreview} alt="Logo" style={{ maxHeight: '100px', maxWidth: '300px', display: 'block', objectFit: 'contain' }} />
               <div style={{ marginTop: '10px', textAlign: 'center' }}>
                 <label className="upload-btn" style={{ cursor: 'pointer', display: 'inline-block', color: '#666', border: '1px solid #ddd', padding: '4px 10px', borderRadius: '4px', textDecoration: 'none' }}>
                   Change Logo
                   <input type="file" accept=".png,.jpg,.jpeg" style={{ display: 'none' }} onChange={handleLogoUpload} />
                 </label>
               </div>
            </div>
          ) : (
            <div style={{ padding: '20px', background: '#e5e5e5', border: '1px solid #ddd', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ padding: '10px 20px', background: '#dcdcdc', color: '#666', fontWeight: 'bold' }}>Logo Preview Block</div>
                <label className="upload-btn" style={{ cursor: 'pointer', display: 'inline-block' }}>
                   Upload Image
                   <input type="file" accept=".png,.jpg,.jpeg" style={{ display: 'none' }} onChange={handleLogoUpload} />
                </label>
            </div>
          )}
        </div>
        <p className="note mt-10">Allowed file types .png, .jpg, .jpeg Max file size 2 MB.</p>
      </div>



      <div className="form-actions-footer mt-40" style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
        <button type="submit" className="btn-save">
          {isComplete ? "Update Form" : "Save Changes"}
        </button>
      </div>
    </form>
  );

  const renderF03Form = () => (
    <form className="form-work-area card mt-20" onSubmit={handleSubmit}>
      <div className="section-title">
        <h3>Directory Map Board Details</h3>
        <p className="profile-instruction mt-10">
          <strong>Please mention below the exact spelling of your Company Name and Booth Number to appear on <u>DIRECTORY MAP BOARD</u></strong>
        </p>
      </div>
      
      <div className="form-row mt-20">
        <label>COMPANY NAME</label>
        <input 
          type="text" 
          value={companyName} 
          onChange={e => setCompanyName(e.target.value)} 
          className="gray-input uppercase-input" 
          maxLength="35"
          required 
        />
        <p className="note" style={{ color: '#000', marginTop: '10px' }}>(Capital Letters only, Maximum 35 alphabets including spaces)</p>
      </div>

      <div className="form-row-grid mt-20" style={{ gridTemplateColumns: '1fr 1fr', maxWidth: '600px' }}>
        <div className="form-row">
          <label>Booth Number</label>
          <input type="text" value={standNumber} onChange={e => setStandNumber(e.target.value)} className="gray-input" required />
        </div>
        <div className="form-row">
          <label>Hall Number</label>
          <input type="text" value={hallNumber} onChange={e => setHallNumber(e.target.value)} className="gray-input" required />
        </div>
      </div>

      <div className="mt-20">
        <p className="profile-instruction" style={{ lineHeight: '1.6' }}>
          <u><strong>Note:</strong></u> DIRECTORY MAP BOARD will be located on site and it contains essential information for visitors, i.e. exhibition floor plan and list of exhibitors by company name and booth number.
        </p>
      </div>

      <div className="form-actions-footer mt-40" style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
        <button type="submit" className="btn-save">
          {isComplete ? "Update Form" : "Save Changes"}
        </button>
      </div>
    </form>
  );

  return (
    <div className="form-detail-wrapper">
      <header className="dashboard-header thin">
        <div className="header-left">
          <span>Welcome, <strong>{authCompanyName}</strong></span>
        </div>
        <div className="header-right">
          <i className="fas fa-user-circle"></i>
        </div>
      </header>

      <div className="form-header-bar">
        <div className="container">
          <div className="header-bar-content">
            <Link href="/dashboard" className="back-btn"><i className="fas fa-chevron-left"></i></Link>
            <h1>{formId} - {formTitle}</h1>
            <div className="header-badges">
              {isComplete ? <span className="badge status-complete">Complete</span> : <span className="badge status-pending">Pending</span>}
              <span className="badge badge-deadline">Deadline: 25 Apr 2026</span>
            </div>
          </div>
        </div>
      </div>

      <main className="form-detail-content">
        <div className="container">
          
          <div className="wide-info-card" style={{ display: formId === 'F03' && isAddingBadge ? 'none' : 'block' }}>
            <h3>Company detail</h3>
            <div className="summary-list">
              {formId === 'F02' ? (
                <>
                  <div className="summary-row"><strong>Company Name</strong><span style={{ textTransform: 'uppercase' }}>{companyName}</span></div>
                  <div className="summary-row"><strong>Booth Number</strong><span>{standNumber}</span></div>
                  <div className="summary-row"><strong>Hall Number</strong><span>{hallNumber}</span></div>
                </>
              ) : formId === 'F04' ? (
                <>
                  <div className="summary-row"><strong>Fascia Name</strong><span style={{ textTransform: 'uppercase' }}>{fasciaName}</span></div>
                  <div className="summary-row"><strong>Stand Number</strong><span>{standNumber}</span></div>
                  <div className="summary-row"><strong>Hall Number</strong><span>{hallNumber}</span></div>
                  <div className="summary-row"><strong>Sides Open</strong><span>{sidesOpen}</span></div>
                </>
              ) : (
                <>
                  <div className="summary-row"><strong>Company name</strong><span>{companyName}</span></div>
                  <div className="summary-row"><strong>Contact Person</strong><span>{contactPerson}</span></div>
                  <div className="summary-row"><strong>Email</strong><span>{email}</span></div>
                  <div className="summary-row"><strong>Mobile no.</strong><span>{mobile}</span></div>
                  <div className="summary-row"><strong>Address</strong><span>{address}</span></div>
                  <div className="summary-row"><strong>GST Number</strong><span>-</span></div>
                </>
              )}
            </div>
          </div>

          {formId === 'F03' ? (isAddingBadge ? renderF07AddBadge() : renderF07List()) : null}
          {formId === 'F02' ? renderF03Form() : null}
          {formId === 'F04' ? renderF08Form() : null}
          {formId === 'F01' ? renderF01Form() : null}

          <div className="contact-queries-footer card mt-20" style={{ display: formId === 'F03' && isAddingBadge ? 'none' : 'block' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '16px' }}>For any questions or queries, please contact</h3>
            <div className="summary-list">
              <div className="summary-row"><strong>Contact Person</strong><span>Subhas Chandra</span></div>
              <div className="summary-row"><strong>Company name</strong><span>Tresub media pvt ltd</span></div>
              <div className="summary-row"><strong>Mobile no</strong><span>+91 9899072636</span></div>
              <div className="summary-row"><strong>Email</strong><span>neha@electricalmirror.net</span></div>
              <div className="summary-row"><strong>Alternative Email</strong><span>-</span></div>
              <div className="summary-row"><strong>Address</strong><span>Gaur City Mall, 14th Floor, (Office No. 14130, 14130-A), Sector-04, Greater Noida-201301, Uttar Pradesh, India</span></div>
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
