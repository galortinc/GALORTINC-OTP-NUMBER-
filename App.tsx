import { useState } from "react";
import {
  Activity, ArrowDownToLine, ArrowUpRight, Bell, Cable, CheckCircle2,
  ChevronDown, CircleHelp, CreditCard, Gauge, LayoutDashboard, LifeBuoy,
  LockKeyhole, Menu, MessageSquareText, Settings, ShieldCheck, Smartphone,
  Wallet, X
} from "lucide-react";
import { supabase } from "./lib/supabase";

type Tab = "Overview" | "Verification requests" | "Wallet" | "API integration" | "Settings";

const nav: { label: Tab; icon: typeof Gauge }[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Verification requests", icon: MessageSquareText },
  { label: "Wallet", icon: Wallet },
  { label: "API integration", icon: Cable },
  { label: "Settings", icon: Settings }
];

function App() {
  const [tab, setTab] = useState<Tab>("Overview");
  const [mobileNav, setMobileNav] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [notice, setNotice] = useState("Demo workspace — connect your backend before using live services.");
  const [businessName, setBusinessName] = useState("Your business");

  const connected = Boolean(supabase);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><ShieldCheck size={22} /></div>
          <div><strong>GALORTINC</strong><span>OTP NUMBERS</span></div>
          <button className="icon-btn close-nav" onClick={() => setMobileNav(false)} aria-label="Close menu"><X /></button>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        <div className="workspace"><div className="workspace-avatar">G</div><div><b>{businessName}</b><small>Business account</small></div><ChevronDown size={16} /></div>
        <nav>
          {nav.map(({ label, icon: Icon }) => (
            <button key={label} className={`nav-link ${tab === label ? "active" : ""}`} onClick={() => { setTab(label); setMobileNav(false); }}>
              <Icon size={18} /><span>{label}</span>{label === "API integration" && <span className="new-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="secure-card"><LockKeyhole size={17}/><div><b>Secure workspace</b><small>Keep provider keys on the server</small></div></div>
          <button className="nav-link" onClick={() => setShowHelp(!showHelp)}><LifeBuoy size={18}/>Help & support</button>
          {showHelp && <p className="help-copy">For setup help, contact your project administrator. Do not share API keys in support messages.</p>}
          <div className="profile"><div className="profile-avatar">U</div><div><b>Workspace user</b><small>Administrator</small></div><Bell size={17}/></div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="icon-btn menu-btn" onClick={() => setMobileNav(true)} aria-label="Open menu"><Menu /></button>
          <div className="crumb">Workspace <span>/</span> <b>{tab}</b></div>
          <div className="top-actions"><span className={`connection ${connected ? "ok" : ""}`}><i />{connected ? "Supabase configured" : "Demo mode"}</span><button className="icon-btn" aria-label="Notifications"><Bell size={19}/></button></div>
        </header>

        <div className="content">
          <div className="notice"><Activity size={17}/><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Dismiss notice"><X size={15}/></button></div>
          {tab === "Overview" && <Overview onGo={setTab} />}
          {tab === "Verification requests" && <Requests />}
          {tab === "Wallet" && <WalletPage />}
          {tab === "API integration" && <ApiPage />}
          {tab === "Settings" && <SettingsPage name={businessName} setName={setBusinessName} />}
          <footer>© 2026 GALORTINC OTP Numbers <span>Built for authorized, business-owned verification workflows.</span></footer>
        </div>
      </main>
    </div>
  );
}

function PageTitle({ eyebrow, title, desc, action }: { eyebrow: string; title: string; desc: string; action?: React.ReactNode }) {
  return <div className="page-title"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{desc}</p></div>{action}</div>;
}

function Overview({ onGo }: { onGo: (tab: Tab) => void }) {
  return <>
    <PageTitle eyebrow="YOUR BUSINESS AT A GLANCE" title="Overview" desc="Manage your authorized verification workflow from one place." action={<button className="primary-btn" onClick={() => onGo("API integration")}><Cable size={17}/> Configure API</button>} />
    <div className="stats">
      <Stat icon={Smartphone} label="Active requests" value="0" foot="No live requests in demo" />
      <Stat icon={CheckCircle2} label="Completed today" value="0" foot="Updates appear after backend setup" />
      <Stat icon={Wallet} label="Wallet balance" value="₦0.00" foot="Demo balance only" />
      <Stat icon={Activity} label="Service status" value="Not connected" foot="Provider integration disabled" />
    </div>
    <div className="grid-two">
      <section className="panel"><div className="panel-head"><div><h2>Getting started</h2><p>Complete these steps to prepare your workspace.</p></div><span className="pill">3 steps</span></div>
        <div className="steps">
          <Step n="01" title="Connect Supabase" desc="Set your project URL and public anon key." done={false}/>
          <Step n="02" title="Configure your provider" desc="Add provider credentials securely as server-side secrets." done={false}/>
          <Step n="03" title="Test your business workflow" desc="Use a test environment and numbers you control." done={false}/>
        </div>
        <button className="text-btn" onClick={() => onGo("API integration")}>Open API integration <ArrowUpRight size={16}/></button>
      </section>
      <section className="panel activity-panel"><div className="panel-head"><div><h2>Recent activity</h2><p>Your latest workspace events.</p></div><span className="muted">Just now</span></div>
        <div className="empty-state"><div className="empty-icon"><Activity size={22}/></div><b>No activity yet</b><p>Events will appear here after you connect and test your backend.</p></div>
      </section>
    </div>
    <div className="info-strip"><ShieldCheck size={20}/><div><b>Use verification only for services your business owns or is authorized to operate.</b><p>This starter does not provide third-party account verification or bypass another platform’s security controls.</p></div></div>
  </>;
}

function Stat({ icon: Icon, label, value, foot }: { icon: typeof Gauge; label: string; value: string; foot: string }) {
  return <div className="stat-card"><div className="stat-top"><span>{label}</span><div className="stat-icon"><Icon size={18}/></div></div><strong>{value}</strong><small>{foot}</small></div>;
}
function Step({ n, title, desc, done }: { n: string; title: string; desc: string; done: boolean }) {
  return <div className="step"><div className={`step-number ${done ? "done" : ""}`}>{done ? <CheckCircle2 size={17}/> : n}</div><div><b>{title}</b><p>{desc}</p></div><span className="step-status">{done ? "Done" : "Pending"}</span></div>;
}

function Requests() {
  return <><PageTitle eyebrow="MESSAGE WORKFLOW" title="Verification requests" desc="View requests generated by your own authorized business applications."/>
    <section className="panel"><div className="panel-head"><div><h2>All requests</h2><p>Demo view — connect a backend to load real records.</p></div><span className="pill">0 records</span></div>
      <div className="table-wrap"><table><thead><tr><th>REQUEST ID</th><th>BUSINESS SERVICE</th><th>STATUS</th><th>CREATED</th></tr></thead><tbody><tr><td colSpan={4} className="table-empty">No requests to display yet.</td></tr></tbody></table></div>
    </section></>;
}
function WalletPage() {
  return <><PageTitle eyebrow="BILLING" title="Wallet" desc="Wallet interface placeholder. Connect a payment provider and server-side verification before accepting payments."/>
    <div className="wallet-card"><div><span>DEMO WALLET BALANCE</span><h2>₦0.00</h2><p>Not a real balance. Payments are not enabled in this starter.</p></div><div className="wallet-symbol"><Wallet size={30}/></div></div>
    <section className="panel"><div className="panel-head"><div><h2>Transactions</h2><p>Deposits and adjustments will appear here after secure payment setup.</p></div></div><div className="empty-state compact"><div className="empty-icon"><CreditCard size={21}/></div><b>No transactions yet</b></div></section>
  </>;
}
function ApiPage() {
  const [provider, setProvider] = useState("Custom SMS provider");
  const [baseUrl, setBaseUrl] = useState("");
  const [environment, setEnvironment] = useState("Sandbox / test");
  const [saved, setSaved] = useState(false);
  return <><PageTitle eyebrow="DEVELOPER SETTINGS" title="API integration" desc="A dedicated place to configure your authorized SMS provider through a secure backend."/>
    <div className="integration-banner"><div className="integration-icon"><Cable size={23}/></div><div><b>Provider connection is currently disabled</b><p>This interface is a setup placeholder. Live requests will remain unavailable until a backend adapter is implemented and tested.</p></div><span className="status-badge">Not connected</span></div>
    <div className="grid-two api-grid">
      <section className="panel"><div className="panel-head"><div><h2>Provider configuration</h2><p>Enter non-secret configuration details here.</p></div></div>
        <label>Provider type<select value={provider} onChange={e => setProvider(e.target.value)}><option>Custom SMS provider</option><option>5SIM (only if authorized for your use case)</option><option>Other approved provider</option></select></label>
        <label>API base URL <input value={baseUrl} onChange={e => {setBaseUrl(e.target.value); setSaved(false);}} placeholder="https://api.your-approved-provider.com"/></label>
        <label>Environment<select value={environment} onChange={e => setEnvironment(e.target.value)}><option>Sandbox / test</option><option>Production (after approval)</option></select></label>
        <div className="key-warning"><LockKeyhole size={18}/><div><b>Do not enter your secret API key here.</b><p>Store it as a Supabase Edge Function secret, such as <code>SMS_PROVIDER_API_KEY</code>. Never put it in React code, .env browser variables, GitHub, or this chat.</p></div></div>
        <button className="primary-btn full" onClick={() => setSaved(true)}>Save draft configuration</button>
        {saved && <p className="success-note"><CheckCircle2 size={16}/> Draft saved in this page only. It is not yet stored on a server.</p>}
      </section>
      <section className="panel"><div className="panel-head"><div><h2>Backend connection checklist</h2><p>What needs to be built before live integration.</p></div></div>
        <div className="check-list">
          {["Create a Supabase Edge Function as a server-side proxy","Store provider credentials in Supabase project secrets","Implement the provider's documented endpoints and response mapping","Validate authorization and ownership for every request","Add rate limits, audit logs, and safe error handling","Test using sandbox credentials and business-controlled numbers"].map((item,i)=><div className="check-row" key={item}><span>{i+1}</span>{item}</div>)}
        </div>
        <div className="docs-box"><b>Provider documentation</b><p>Use the official API documentation supplied by your provider. Do not guess endpoint paths or request formats.</p><a href="https://supabase.com/docs/guides/functions/secrets" target="_blank" rel="noreferrer">Supabase Edge Function secrets guide <ArrowUpRight size={14}/></a></div>
      </section>
    </div>
    <section className="panel code-panel"><div className="panel-head"><div><h2>Integration architecture</h2><p>Recommended request flow.</p></div><span className="pill">Server-side only</span></div>
      <div className="architecture"><div><Smartphone/><b>Website</b><small>React frontend</small></div><ArrowUpRight/><div><LockKeyhole/><b>Supabase Edge Function</b><small>Checks permissions; reads secret</small></div><ArrowUpRight/><div><Cable/><b>Approved provider</b><small>Official documented API</small></div></div>
    </section>
  </>;
}
function SettingsPage({ name, setName }: { name: string; setName: (v:string)=>void }) {
  const [saved, setSaved] = useState(false);
  return <><PageTitle eyebrow="WORKSPACE" title="Settings" desc="Basic details for your business workspace."/>
    <section className="panel settings-panel"><h2>Business profile</h2><label>Business display name<input value={name} onChange={e => {setName(e.target.value);setSaved(false);}}/></label><label>Default currency<input value="NGN — Nigerian Naira (₦)" readOnly/></label><label>Purpose<textarea readOnly value="Verification messages for business-owned services and applications, with user consent."/></label><button className="primary-btn" onClick={()=>setSaved(true)}>Save changes</button>{saved && <p className="success-note"><CheckCircle2 size={16}/> Updated in this browser session.</p>}</section>
  </>;
}
export default App;