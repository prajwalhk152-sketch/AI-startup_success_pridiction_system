import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Rocket, Menu, Search, Bell, User, Home, BarChart3, Target,
  FileText, Bookmark, Settings, HelpCircle, LogOut, Shield,
  DollarSign, TrendingUp, Users, Trophy, Building2, LineChart,
  PieChart, AlertTriangle, ChevronRight, CheckCircle2
} from "lucide-react";
import {
  LineChart as RLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart as RPieChart, Pie, Cell, Label
} from "recharts";
import "./style.css";

const successTrend = [
  { month: "Jan", value: 32 }, { month: "Feb", value: 42 },
  { month: "Mar", value: 39 }, { month: "Apr", value: 58 },
  { month: "May", value: 64 }, { month: "Jun", value: 80 }
];

const industryData = [
  { name: "FinTech", value: 28, color: "#6d35ff" },
  { name: "HealthTech", value: 22, color: "#22c55e" },
  { name: "AI/ML", value: 18, color: "#14b8a6" },
  { name: "EdTech", value: 12, color: "#f59e0b" },
  { name: "E-commerce", value: 10, color: "#60a5fa" },
  { name: "Others", value: 10, color: "#94a3b8" }
];

const startups = [
  { name: "TechNova AI", field: "AI / Machine Learning", amount: "$2.3M", tag: "High Potential" },
  { name: "GreenGrid Energy", field: "CleanTech", amount: "$1.8M", tag: "High Potential" },
  { name: "FinEdge Solutions", field: "FinTech", amount: "$3.2M", tag: "Medium Potential" },
  { name: "EduVerse Platform", field: "EdTech", amount: "$1.2M", tag: "High Potential" }
];

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "analysis", label: "Analysis", icon: BarChart3 },
  { id: "predict", label: "Predict", icon: Target },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "saved", label: "Saved", icon: Bookmark },
  { id: "profile", label: "Profile", icon: User }
];

function StatCard({ icon: Icon, label, value, change, variant }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${variant}`}><Icon size={22} /></div>
      <p>{label}</p>
      <h3>{value}</h3>
      <span>{change}</span>
    </div>
  );
}

function BottomNav({ active, setActive }) {
  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button key={item.id} onClick={() => setActive(item.id)} className={active === item.id ? "active" : ""}>
            <Icon size={19} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function Header() {
  return (
    <header className="top-header">
      <div className="brand">
        <div className="logo"><Rocket size={27} /></div>
        <div>
          <h2>AI Startup</h2>
          <p>Success Predictor</p>
        </div>
      </div>
      <button className="menu-btn"><Menu /></button>
      <div className="welcome">
        <h2>Welcome back, Alex! 👋</h2>
        <p>AI-powered insights to evaluate, predict and grow your startup.</p>
      </div>
      <div className="search-box">
        <Search size={18} />
        <input placeholder="Search startups, industries, investors..." />
      </div>
      <Bell className="bell" />
      <div className="user-box">
        <div className="avatar">A</div>
        <div>
          <strong>Alex Investor</strong>
          <p>Premium Plan</p>
        </div>
      </div>
    </header>
  );
}

function Dashboard() {
  return (
    <main className="dashboard">
      <section className="stats-grid">
        <StatCard icon={Rocket} label="Total Startups" value="1,248" change="▲ 12.5%" variant="purple" />
        <StatCard icon={CheckCircle2} label="Successful Startups" value="678" change="▲ 8.3%" variant="green" />
        <StatCard icon={TrendingUp} label="Success Rate" value="54.3%" change="▲ 6.7%" variant="violet" />
        <StatCard icon={DollarSign} label="Total Funding" value="$2.45B" change="▲ 15.2%" variant="orange" />
        <StatCard icon={Shield} label="Avg. Risk Score" value="48/100" change="▼ 5.4%" variant="red" />
      </section>

      <section className="grid-main">
        <div className="card chart-card">
          <div className="card-title">
            <h3>Success Rate Over Time</h3>
            <select><option>6 Months</option></select>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <RLineChart data={successTrend}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#6d35ff" strokeWidth={4} dot={{ r: 5 }} />
            </RLineChart>
          </ResponsiveContainer>
        </div>

        <div className="card industry-card">
          <div className="card-title">
            <h3>Startups by Industry</h3>
            <select><option>All Industries</option></select>
          </div>
          <div className="pie-wrap">
            <ResponsiveContainer width="100%" height={210}>
              <RPieChart>
                <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                <Pie
                  data={industryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={82}
                  paddingAngle={2}
                >
                  {industryData.map((item) => <Cell key={item.name} fill={item.color} stroke="#ffffff" strokeWidth={2} />)}
                  <Label value="%" position="center" className="pie-center-label" />
                </Pie>
              </RPieChart>
            </ResponsiveContainer>
            <div className="legend">
              {industryData.map((item) => <p key={item.name}><span style={{ backgroundColor: item.color }}></span>{item.name}<b>{item.value}%</b></p>)}
            </div>
          </div>
        </div>

        <div className="card list-card">
          <div className="card-title"><h3>Top Performing Startups</h3><a>View All</a></div>
          {startups.map((s, i) => (
            <div className="startup-row" key={s.name}>
              <div className="startup-icon">{i + 1}</div>
              <div><strong>{s.name}</strong><p>{s.field}</p></div>
              <span className={s.tag.includes("High") ? "tag green-tag" : "tag orange-tag"}>{s.tag}</span>
              <b>{s.amount}</b>
            </div>
          ))}
        </div>

        <div className="card risk-card">
          <h3>Risk Distribution</h3>
          <div className="risk-circle"><span>1,248</span><p>Total</p></div>
          <div className="risk-legend">
            <p><i className="low"></i>Low Risk <b>35%</b></p>
            <p><i className="mid"></i>Medium Risk <b>45%</b></p>
            <p><i className="high"></i>High Risk <b>20%</b></p>
          </div>
        </div>
      </section>

      <section className="banner">
        <Trophy size={58} />
        <h3>Smart decisions today,<br />successful tomorrow.</h3>
        <p>Leverage AI insights, market analysis, and risk assessment to make data-driven investment decisions.</p>
        <button>Explore Reports →</button>
      </section>
    </main>
  );
}

function PredictPage() {
  const [result, setResult] = useState(null);

  const predict = async () => {
    const sample = {
      industry: 4, funding_amount: 600000, team_size: 30, revenue: 1500000,
      market_size: 60000000, founder_experience: 6, business_model: 0,
      competition_level: 2, customer_growth: 40
    };

    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sample)
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ prediction: "Successful Startup", success_probability: 85 });
    }
  };

  return (
    <main className="page">
      <div className="form-card">
        <h2>Predict Startup Success</h2>
        <p>Enter startup details to predict success probability.</p>
        {["Industry: FinTech", "Funding Amount: $1,500,000", "Team Size: 25", "Revenue: $750,000", "Market Size: $50,000,000", "Founder Experience: 5 Years", "Business Model: SaaS", "Competition Level: Medium"].map((x) => (
          <div className="input-like" key={x}><Building2 size={18} /><span>{x}</span><ChevronRight size={18} /></div>
        ))}
        <button className="primary-btn" onClick={predict}>Predict Now</button>
      </div>

      {result && (
        <div className="result-card">
          <Trophy size={70} />
          <h2>{result.prediction}</h2>
          <p>Great! This startup has high success potential.</p>
          <div className="score-ring">{result.success_probability}%</div>
          <button className="primary-btn">View Full Report</button>
        </div>
      )}
    </main>
  );
}

function AnalysisPage() {
  return (
    <main className="page">
      <div className="card analysis-card">
        <h2>Market Analysis</h2>
        <p>Overall Market Score</p>
        <h1>78<span>/100</span></h1>
        <ResponsiveContainer width="100%" height={190}>
          <RLineChart data={successTrend}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={4} />
          </RLineChart>
        </ResponsiveContainer>
        <div className="mini-grid">
          <StatCard icon={PieChart} label="Market Size" value="$50.2B" change="Large" variant="green" />
          <StatCard icon={TrendingUp} label="Growth Rate" value="12.5%" change="High" variant="purple" />
          <StatCard icon={LineChart} label="Demand" value="8.6/10" change="Strong" variant="orange" />
        </div>
      </div>
    </main>
  );
}

function ReportsPage() {
  const reports = [
    ["Funding Recommendation", "View funding stages and amounts", DollarSign],
    ["Market Analysis Report", "Detailed market insights and trends", PieChart],
    ["Competitor Analysis", "See competitors and market position", Users],
    ["Growth Forecast", "Revenue and user growth predictions", TrendingUp],
    ["Risk Assessment", "Risk score and potential threats", AlertTriangle],
    ["Complete Report", "All insights in one report", FileText]
  ];
  return (
    <main className="page">
      <h2 className="page-title">Reports</h2>
      <div className="report-list">
        {reports.map(([title, desc, Icon]) => (
          <div className="report-item" key={title}>
            <div className="report-icon"><Icon size={22} /></div>
            <div><strong>{title}</strong><p>{desc}</p></div>
            <ChevronRight />
          </div>
        ))}
      </div>
    </main>
  );
}

function ProfilePage() {
  return (
    <main className="page">
      <div className="profile-card">
        <Settings className="settings" />
        <div className="big-avatar">A</div>
        <h2>Alex Investor</h2>
        <p>alex.investor@email.com</p>
        <span>Premium Plan</span>
      </div>
      <div className="report-list">
        {["Saved Startups", "Investment Portfolio", "Notifications", "Settings", "Help & Support", "Logout"].map((x) => (
          <div className="report-item" key={x}>
            <div className="report-icon">{x === "Logout" ? <LogOut /> : x.includes("Help") ? <HelpCircle /> : <Bookmark />}</div>
            <strong>{x}</strong>
            <ChevronRight />
          </div>
        ))}
      </div>
    </main>
  );
}

function App() {
  const [active, setActive] = useState("home");

  const render = () => {
    if (active === "home") return <Dashboard />;
    if (active === "predict") return <PredictPage />;
    if (active === "analysis") return <AnalysisPage />;
    if (active === "reports") return <ReportsPage />;
    if (active === "profile") return <ProfilePage />;
    return <ReportsPage />;
  };

  return (
    <div className="app">
      <Header />
      {render()}
      <BottomNav active={active} setActive={setActive} />
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
