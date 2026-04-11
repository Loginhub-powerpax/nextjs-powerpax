(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,26849,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n={formatUrl:function(){return s},formatWithValidation:function(){return d},urlObjectKeys:function(){return l}};for(var a in n)Object.defineProperty(r,a,{enumerable:!0,get:n[a]});let i=e.r(85879)._(e.r(62940)),o=/https?|ftp|gopher|file/;function s(e){let{auth:t,hostname:r}=e,n=e.protocol||"",a=e.pathname||"",s=e.hash||"",l=e.query||"",d=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?d=t+e.host:r&&(d=t+(~r.indexOf(":")?`[${r}]`:r),e.port&&(d+=":"+e.port)),l&&"object"==typeof l&&(l=String(i.urlQueryToSearchParams(l)));let c=e.search||l&&`?${l}`||"";return n&&!n.endsWith(":")&&(n+=":"),e.slashes||(!n||o.test(n))&&!1!==d?(d="//"+(d||""),a&&"/"!==a[0]&&(a="/"+a)):d||(d=""),s&&"#"!==s[0]&&(s="#"+s),c&&"?"!==c[0]&&(c="?"+c),a=a.replace(/[?#]/g,encodeURIComponent),c=c.replace("#","%23"),`${n}${d}${a}${c}${s}`}let l=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function d(e){return s(e)}},1310,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"useMergedRef",{enumerable:!0,get:function(){return a}});let n=e.r(2801);function a(e,t){let r=(0,n.useRef)(null),a=(0,n.useRef)(null);return(0,n.useCallback)(n=>{if(null===n){let e=r.current;e&&(r.current=null,e());let t=a.current;t&&(a.current=null,t())}else e&&(r.current=i(e,n)),t&&(a.current=i(t,n))},[e,t])}function i(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let r=e(t);return"function"==typeof r?r:()=>e(null)}}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},20771,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"isLocalURL",{enumerable:!0,get:function(){return i}});let n=e.r(81353),a=e.r(54705);function i(e){if(!(0,n.isAbsoluteUrl)(e))return!0;try{let t=(0,n.getLocationOrigin)(),r=new URL(e,t);return r.origin===t&&(0,a.hasBasePath)(r.pathname)}catch(e){return!1}}},39585,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"errorOnce",{enumerable:!0,get:function(){return n}});let n=e=>{}},20219,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n={default:function(){return g},useLinkStatus:function(){return b}};for(var a in n)Object.defineProperty(r,a,{enumerable:!0,get:n[a]});let i=e.r(85879),o=e.r(38627),s=i._(e.r(2801)),l=e.r(26849),d=e.r(14156),c=e.r(1310),p=e.r(81353),u=e.r(60952);e.r(69453);let f=e.r(39525),x=e.r(80868),h=e.r(20771),m=e.r(52047);function g(t){var r,n;let a,i,g,[b,v]=(0,s.useOptimistic)(x.IDLE_LINK_STATUS),j=(0,s.useRef)(null),{href:w,as:_,children:S,prefetch:C=null,passHref:N,replace:P,shallow:k,scroll:T,onClick:E,onMouseEnter:R,onTouchStart:O,legacyBehavior:I=!1,onNavigate:A,transitionTypes:L,ref:D,unstable_dynamicOnHover:z,...M}=t;a=S,I&&("string"==typeof a||"number"==typeof a)&&(a=(0,o.jsx)("a",{children:a}));let U=s.default.useContext(d.AppRouterContext),B=!1!==C,F=!1!==C?null===(n=C)||"auto"===n?m.FetchStrategy.PPR:m.FetchStrategy.Full:m.FetchStrategy.PPR,$="string"==typeof(r=_||w)?r:(0,l.formatUrl)(r);if(I){if(a?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});i=s.default.Children.only(a)}let W=I?i&&"object"==typeof i&&i.ref:D,V=s.default.useCallback(e=>(null!==U&&(j.current=(0,x.mountLinkInstance)(e,$,U,F,B,v)),()=>{j.current&&((0,x.unmountLinkForCurrentNavigation)(j.current),j.current=null),(0,x.unmountPrefetchableInstance)(e)}),[B,$,U,F,v]),K={ref:(0,c.useMergedRef)(V,W),onClick(t){I||"function"!=typeof E||E(t),I&&i.props&&"function"==typeof i.props.onClick&&i.props.onClick(t),!U||t.defaultPrevented||function(t,r,n,a,i,o,l){if("u">typeof window){let d,{nodeName:c}=t.currentTarget;if("A"===c.toUpperCase()&&((d=t.currentTarget.getAttribute("target"))&&"_self"!==d||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,h.isLocalURL)(r)){a&&(t.preventDefault(),location.replace(r));return}if(t.preventDefault(),o){let e=!1;if(o({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:p}=e.r(273);s.default.startTransition(()=>{p(r,a?"replace":"push",!1===i?f.ScrollBehavior.NoScroll:f.ScrollBehavior.Default,n.current,l)})}}(t,$,j,P,T,A,L)},onMouseEnter(e){I||"function"!=typeof R||R(e),I&&i.props&&"function"==typeof i.props.onMouseEnter&&i.props.onMouseEnter(e),U&&B&&(0,x.onNavigationIntent)(e.currentTarget,!0===z)},onTouchStart:function(e){I||"function"!=typeof O||O(e),I&&i.props&&"function"==typeof i.props.onTouchStart&&i.props.onTouchStart(e),U&&B&&(0,x.onNavigationIntent)(e.currentTarget,!0===z)}};return(0,p.isAbsoluteUrl)($)?K.href=$:I&&!N&&("a"!==i.type||"href"in i.props)||(K.href=(0,u.addBasePath)($)),g=I?s.default.cloneElement(i,K):(0,o.jsx)("a",{...M,...K,children:a}),(0,o.jsx)(y.Provider,{value:b,children:g})}e.r(39585);let y=(0,s.createContext)(x.IDLE_LINK_STATUS),b=()=>(0,s.useContext)(y);("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},32797,e=>{"use strict";var t=e.i(38627),r=e.i(2801),n=e.i(20219);e.s(["default",0,function(){let[e,a]=(0,r.useState)([]),[i,o]=(0,r.useState)(!1),[s,l]=(0,r.useState)(""),[d,c]=(0,r.useState)(!1),[p,u]=(0,r.useState)(null),[f,x]=(0,r.useState)(null),h=async()=>{c(!0),x(null);try{let e=await fetch("/api/submissions");if(!e.ok)throw Error("Failed to fetch data");let t=await e.json();if(!t.success)throw Error(t.error);a(t.data||[])}catch(e){console.error("Fetch error:",e),x(e.message)}finally{c(!1)}};if(!i)return(0,t.jsxs)("div",{className:"login-wrapper",children:[(0,t.jsx)("div",{className:"bg-overlay"}),(0,t.jsxs)("div",{className:"login-card",style:{maxWidth:"400px"},children:[(0,t.jsxs)("div",{className:"card-header",children:[(0,t.jsx)("h1",{children:"Admin Login"}),(0,t.jsx)("p",{className:"subtitle",children:"Secure Backend Access"})]}),(0,t.jsxs)("form",{onSubmit:e=>{e.preventDefault(),"powerpax-admin"===s?(o(!0),h()):alert("Invalid Admin Password")},className:"login-form",children:[(0,t.jsxs)("div",{className:"form-group",children:[(0,t.jsx)("label",{children:"Master Password"}),(0,t.jsxs)("div",{className:"input-container",children:[(0,t.jsx)("i",{className:"fas fa-lock"}),(0,t.jsx)("input",{type:"password",value:s,onChange:e=>l(e.target.value),placeholder:"Enter admin password",required:!0})]}),(0,t.jsx)("p",{className:"note",style:{marginTop:"10px"},children:"Default: powerpax-admin"})]}),(0,t.jsx)("button",{type:"submit",className:"btn-login",children:"Unlock Console"})]})]})]});let m=e.reduce((e,t)=>{let r=(t.username||"Unknown").trim();return e[r]||(e[r]=[]),e[r].push(t),e},{});return(0,t.jsxs)("div",{className:"dashboard-container",style:{maxWidth:"1200px",margin:"0 auto",padding:"20px"},children:[(0,t.jsxs)("header",{className:"dashboard-header",style:{marginBottom:"30px"},children:[(0,t.jsxs)("div",{className:"header-left",children:[(0,t.jsx)(n.default,{href:"/dashboard",className:"note",style:{textDecoration:"none"},children:"← Back to Portal"}),(0,t.jsx)("h2",{style:{marginTop:"10px"},children:"PowerPax India | Submission Backend"})]}),(0,t.jsx)("div",{className:"header-right",children:(0,t.jsxs)("button",{onClick:h,className:"btn-save",style:{padding:"8px 15px",fontSize:"12px"},children:[(0,t.jsx)("i",{className:"fas fa-sync"})," Refresh Data"]})})]}),f&&(0,t.jsxs)("div",{style:{background:"#ffeeee",color:"#cc0000",padding:"15px",borderRadius:"8px",marginBottom:"20px",border:"1px solid #ffcccc"},children:[(0,t.jsx)("strong",{children:"Connection Error:"})," ",f]}),(0,t.jsx)("main",{children:(0,t.jsx)("div",{className:"card",children:(0,t.jsx)("div",{style:{overflowX:"auto"},children:(0,t.jsxs)("table",{style:{width:"100%",borderCollapse:"collapse",fontSize:"14px"},children:[(0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{style:{borderBottom:"2px solid #eee",textAlign:"left"},children:[(0,t.jsx)("th",{style:{padding:"12px"},children:"Latest Update"}),(0,t.jsx)("th",{style:{padding:"12px"},children:"Company"}),(0,t.jsx)("th",{style:{padding:"12px"},children:"Forms Filled"}),(0,t.jsx)("th",{style:{padding:"12px"},children:"Contact Info"}),(0,t.jsx)("th",{style:{padding:"12px"},children:"Action"})]})}),(0,t.jsx)("tbody",{children:d?(0,t.jsx)("tr",{children:(0,t.jsx)("td",{colSpan:"5",style:{padding:"40px",textAlign:"center"},children:"Loading company profiles..."})}):0===Object.keys(m).length?(0,t.jsx)("tr",{children:(0,t.jsx)("td",{colSpan:"5",style:{padding:"40px",textAlign:"center"},children:"No submissions found."})}):Object.keys(m).map(e=>{let r=m[e],n=r[0],a=r.map(e=>e.form_id);return(0,t.jsxs)("tr",{style:{borderBottom:"1px solid #f9f9f9"},children:[(0,t.jsx)("td",{style:{padding:"12px",whiteSpace:"nowrap"},children:new Date(n.created_at).toLocaleString()}),(0,t.jsxs)("td",{style:{padding:"12px"},children:[(0,t.jsx)("div",{style:{fontWeight:"bold",color:"#1a1a1a"},children:n.auth_company_name||n.company_name||n.username}),(0,t.jsxs)("div",{style:{fontSize:"11px",color:"#64748b"},children:["User: ",n.username]})]}),(0,t.jsx)("td",{style:{padding:"12px"},children:(0,t.jsx)("div",{style:{display:"flex",gap:"4px",flexWrap:"wrap"},children:["F01","F02","F03","F04","F05","F06"].map(e=>(0,t.jsx)("span",{style:{width:"28px",height:"20px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"9px",borderRadius:"3px",fontWeight:"bold",background:a.includes(e)?"#22c55e":"#e2e8f0",color:a.includes(e)?"#fff":"#94a3b8"},children:e},e))})}),(0,t.jsxs)("td",{style:{padding:"12px",fontSize:"12px"},children:[(0,t.jsx)("div",{children:n.email||"-"}),(0,t.jsx)("div",{children:n.mobile||"-"})]}),(0,t.jsx)("td",{style:{padding:"12px"},children:(0,t.jsx)("button",{onClick:()=>u(r),className:"btn-save",style:{padding:"5px 12px",fontSize:"11px",background:"#333"},children:"View Details"})})]},e)})})]})})})}),p&&(0,t.jsx)("div",{style:{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.5)",zIndex:1e3,display:"flex",alignItems:"center",justifyContent:"center",padding:"40px"},children:(0,t.jsxs)("div",{className:"card",style:{width:"100%",maxWidth:"900px",maxHeight:"85vh",overflowY:"auto",position:"relative"},children:[(0,t.jsx)("button",{onClick:()=>u(null),style:{position:"absolute",top:"15px",right:"15px",border:"none",background:"none",cursor:"pointer",fontSize:"20px"},children:"×"}),(0,t.jsxs)("div",{className:"modal-content",style:{maxWidth:"800px",width:"90%"},children:[(0,t.jsx)("h2",{style:{marginTop:0,marginBottom:"5px"},children:p[0].auth_company_name||p[0].company_name}),(0,t.jsxs)("p",{className:"note",children:[Object.keys(p.reduce((e,t)=>({...e,[t.form_id]:!0}),{})).length," Forms filled"]}),Object.values(p.reduce((e,t)=>((!e[t.form_id]||new Date(t.created_at)>new Date(e[t.form_id].created_at))&&(e[t.form_id]=t),e),{})).sort((e,t)=>e.form_id.localeCompare(t.form_id)).map(e=>(0,t.jsxs)("div",{style:{marginTop:"20px",border:"1px solid #e2e8f0",background:"#f8fafc",padding:"20px",borderRadius:"8px"},children:[(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[(0,t.jsxs)("div",{style:{display:"flex",gap:"10px",alignItems:"center"},children:[(0,t.jsx)("span",{className:"badge-status-lbl",style:{background:"#dcfce7",color:"#16a34a",padding:"4px 8px",borderRadius:"4px",fontSize:"12px"},children:e.form_id}),(0,t.jsx)("h3",{style:{fontSize:"16px",margin:0,color:"#334155"},children:e.form_title})]}),(0,t.jsx)("span",{style:{fontSize:"12px",color:"#64748b"},children:new Date(e.created_at).toLocaleString()})]}),(0,t.jsx)("hr",{style:{margin:"15px 0",border:"0",borderTop:"1px solid #e2e8f0"}}),(0,t.jsx)("div",{className:"summary-list",style:{marginTop:"0"},children:Object.entries(e.all_data).map(([r,n])=>{if(["companyName","formId","username","authCompanyName","timestamp","id","terms","urn","status"].includes(r)||!n)return null;if("logoPreview"===r)return(0,t.jsxs)("div",{className:"summary-row",children:[(0,t.jsx)("strong",{children:"Company Logo"}),(0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"5px"},children:[(0,t.jsx)("img",{src:n,alt:"Exhibitor Logo",style:{maxHeight:"100px",border:"1px solid #ddd",padding:"5px",background:"#fff"}}),(0,t.jsx)("a",{href:n,download:`logo_${e.auth_company_name||"exhibitor"}.png`,style:{fontSize:"12px",color:"#84cc16",textDecoration:"underline"},children:"Download Image"})]})]},r);if("badges"===r&&Array.isArray(n))return 0===n.length?null:(0,t.jsxs)("div",{className:"summary-row",style:{flexDirection:"column",alignItems:"flex-start"},children:[(0,t.jsxs)("strong",{children:["Employee Badges (",n.length,")"]}),(0,t.jsx)("div",{style:{width:"100%",background:"#fff",padding:"10px",borderRadius:"4px",marginTop:"10px",fontSize:"12px",border:"1px solid #e2e8f0"},children:n.map((e,r)=>(0,t.jsxs)("div",{style:{marginBottom:"5px"},children:["• ",e.firstName," ",e.lastName," (",e.type,") - ",e.mobile]},r))})]},r);if("furnitureOrders"===r&&"object"==typeof n){let e=Object.entries(n).filter(([e,t])=>t.qty>0);return 0===e.length?null:(0,t.jsxs)("div",{className:"summary-row",style:{flexDirection:"column",alignItems:"flex-start"},children:[(0,t.jsx)("strong",{children:"Additional Furniture"}),(0,t.jsx)("div",{style:{width:"100%",background:"#fff",padding:"10px",borderRadius:"4px",marginTop:"10px",fontSize:"12px",border:"1px solid #e2e8f0"},children:e.map(([e,r])=>(0,t.jsxs)("div",{children:["• ",e,": ",r.qty," units"]},e))})]},r)}return n&&"object"!=typeof n?(0,t.jsxs)("div",{className:"summary-row",style:{padding:"8px 0"},children:[(0,t.jsx)("strong",{style:{textTransform:"capitalize"},children:r.replace(/([A-Z])/g," $1")}),(0,t.jsx)("span",{children:n})]},r):null})})]},e.id)),(0,t.jsxs)("div",{className:"mt-40",style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[(0,t.jsxs)("button",{className:"btn-save",onClick:()=>(e=>{if(!e||0===e.length)return;let t=e.reduce((e,t)=>({...e,...t.all_data}),{}),r=e.sort((e,t)=>new Date(t.created_at)-new Date(e.created_at))[0],n=(e=>{let{auth_company_name:t,company_name:r,contactPerson:n,address:a,city:i,state:o,pincode:s,standNumber:l="[Stall No.]",created_at:d}=e,c=t||r||"Exhibitor Company",p=`${i||""}, ${o||""}, ${s||""}`.trim()||"[City, State, PIN]",u=new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"});return`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Participation Letter - ${c}</title>
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
            <strong>Date:</strong> ${u}
          </div>

          <div class="exhibitor-info">
            ${n||"[Exhibitor Name]"}<br>
            ${c}<br>
            ${a||"[Address Line 1]"}<br>
            ${p}
          </div>

          <div class="subject-main">TO WHOM IT MAY CONCERN</div>

          <div class="ref-line">
            Ref: Letter of Participation in <strong>PowerPax India Renewable Energy Expo – Varanasi Edition 2026</strong>
          </div>

          <div class="letter-body">
            <p>
              This is to certify that <strong>${c}</strong> is participating in the <strong>PowerPax India Renewable Energy Expo – Varanasi Edition 2026</strong> being organised by <strong>Renewable Mirror (Tresub Media Pvt. Ltd.)</strong> at <strong>Deendayal Hastkala Sankul (Trade Centre), Bada Lalpur, Chandmari, Varanasi, Uttar Pradesh – 221002</strong> from <strong>2nd – 3rd May 2026</strong> and have been allotted <strong>Stand No. ${l}</strong>.
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
  `})({...t,auth_company_name:r.auth_company_name,company_name:r.company_name,created_at:r.created_at}),a=document.createElement("iframe");a.style.display="none",document.body.appendChild(a);let i=a.contentWindow||a.contentDocument,o=i.document||i;o.open(),o.write(n),o.close(),a.onload=()=>{a.contentWindow.print(),setTimeout(()=>document.body.removeChild(a),1e3)}})(p),style:{background:"#1e40af",padding:"10px 20px",display:"flex",gap:"8px",alignItems:"center"},children:[(0,t.jsx)("i",{className:"fas fa-file-pdf"})," Generate Participation Letter"]}),(0,t.jsx)("button",{className:"btn-gray",onClick:()=>u(null),children:"Close View"})]})]})]})}),(0,t.jsx)("footer",{className:"dashboard-footer",style:{marginTop:"40px"},children:(0,t.jsx)("p",{children:"Copyright © PowerPax India 2026 | Admin Console"})})]})}],32797)}]);