import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  AlertTriangle,
  Activity,
  BarChart3,
  BrainCircuit,
  Building2,
  Calculator,
  CheckCircle2,
  ClipboardList,
  Database,
  Download,
  DollarSign,
  FileText,
  GitCompare,
  Home,
  Landmark,
  LineChart,
  LogIn,
  LogOut,
  Mail,
  Save,
  Settings,
  Shield,
  SlidersHorizontal,
  Target,
  TrendingUp,
  Users
} from "lucide-react";
import projectLogo from "./assets/project-logo.png";
import "./startup-flow.css";

const configuredApiBase = import.meta.env.VITE_API_BASE_URL;
const API_BASE = configuredApiBase
  ? configuredApiBase.replace(/\/$/, "").replace(/^(?!https?:\/\/)/, "https://")
  : window.location.origin;

const industryCatalog = [
  { label: "AI", value: 0, model_value: 0, market: 95000000, growth: 35, model: "SaaS", competition: "High", capital: "Medium", trend: "Fast adoption, strong enterprise demand, and intense competition." },
  { label: "AgriTech", value: 1, model_value: 1, market: 56000000, growth: 22, model: "Marketplace", competition: "Medium", capital: "Medium", trend: "Growing demand for yield improvement, climate resilience, and supply-chain efficiency." },
  { label: "CleanTech", value: 2, model_value: 2, market: 78000000, growth: 27, model: "B2B", competition: "Medium", capital: "High", trend: "Policy support is strong, but sales cycles and infrastructure costs are higher." },
  { label: "Cybersecurity", value: 3, model_value: 3, market: 82000000, growth: 31, model: "SaaS", competition: "High", capital: "Medium", trend: "Demand remains resilient because security is a board-level priority." },
  { label: "E-Commerce", value: 4, model_value: 4, market: 70000000, growth: 20, model: "Marketplace", competition: "High", capital: "Medium", trend: "Large market, but margins, retention, and acquisition cost decide survival." },
  { label: "EdTech", value: 5, model_value: 5, market: 62000000, growth: 24, model: "B2C", competition: "High", capital: "Low", trend: "Demand is steady, but willingness to pay and completion outcomes matter." },
  { label: "FinTech", value: 6, model_value: 6, market: 85000000, growth: 30, model: "B2B", competition: "High", capital: "Medium", trend: "Revenue potential is strong, with regulation and trust as major gates." },
  { label: "FoodTech", value: 7, model_value: 7, market: 52000000, growth: 18, model: "B2C", competition: "High", capital: "Medium", trend: "Operational efficiency and repeat purchase behavior matter more than hype." },
  { label: "HealthTech", value: 8, model_value: 8, market: 90000000, growth: 28, model: "B2B", competition: "Medium", capital: "High", trend: "High value market with long trust, compliance, and clinical adoption cycles." },
  { label: "Logistics", value: 9, model_value: 9, market: 76000000, growth: 23, model: "B2B", competition: "Medium", capital: "High", trend: "Efficiency, route density, and enterprise contracts drive outcomes." },
  { label: "BioTech", value: 10, model_value: 8, market: 88000000, growth: 26, model: "B2B", competition: "Medium", capital: "High", trend: "Scientific defensibility is powerful, but timelines and funding needs are long." },
  { label: "DeepTech", value: 11, model_value: 0, market: 74000000, growth: 25, model: "B2B", competition: "Medium", capital: "High", trend: "Strong defensibility when IP is real, but commercialization is slower." },
  { label: "SaaS", value: 12, model_value: 0, market: 92000000, growth: 29, model: "SaaS", competition: "High", capital: "Low", trend: "Recurring revenue can scale well, but churn and sales efficiency are critical." },
  { label: "PropTech", value: 13, model_value: 4, market: 68000000, growth: 19, model: "Marketplace", competition: "Medium", capital: "Medium", trend: "Adoption depends on real estate cycles, partnerships, and transaction trust." },
  { label: "LegalTech", value: 14, model_value: 0, market: 46000000, growth: 18, model: "SaaS", competition: "Medium", capital: "Low", trend: "Automation demand is rising, but professional workflow adoption can be slow." },
  { label: "HRTech", value: 15, model_value: 0, market: 54000000, growth: 20, model: "SaaS", competition: "High", capital: "Low", trend: "Budgets follow hiring cycles, so retention and clear ROI are important." },
  { label: "InsurTech", value: 16, model_value: 6, market: 64000000, growth: 21, model: "B2B", competition: "Medium", capital: "Medium", trend: "Distribution and underwriting partnerships are usually the hardest parts." },
  { label: "WealthTech", value: 17, model_value: 6, market: 60000000, growth: 22, model: "B2C", competition: "High", capital: "Medium", trend: "Trust, compliance, and low acquisition cost determine scalability." },
  { label: "Gaming", value: 18, model_value: 4, market: 72000000, growth: 24, model: "B2C", competition: "High", capital: "Medium", trend: "Hit risk is high, but strong retention and community can unlock rapid growth." },
  { label: "MediaTech", value: 19, model_value: 4, market: 50000000, growth: 17, model: "B2C", competition: "High", capital: "Low", trend: "Audience growth is possible, but monetization and differentiation are hard." },
  { label: "TravelTech", value: 20, model_value: 4, market: 66000000, growth: 21, model: "Marketplace", competition: "High", capital: "Medium", trend: "Demand rebounds quickly, but seasonality and supplier access matter." },
  { label: "Mobility", value: 21, model_value: 9, market: 80000000, growth: 24, model: "B2B", competition: "Medium", capital: "High", trend: "Fleet economics, regulation, and utilization decide real viability." },
  { label: "EV", value: 22, model_value: 2, market: 87000000, growth: 32, model: "B2B", competition: "Medium", capital: "High", trend: "Demand is strong, but hardware, charging, and supply-chain execution are tough." },
  { label: "Real Estate", value: 23, model_value: 4, market: 70000000, growth: 16, model: "Marketplace", competition: "Medium", capital: "High", trend: "Asset-heavy models need disciplined capital use and local market knowledge." },
  { label: "ManufacturingTech", value: 24, model_value: 9, market: 69000000, growth: 20, model: "B2B", competition: "Medium", capital: "High", trend: "Industrial adoption is slower, but ROI can be strong when automation saves cost." },
  { label: "Creator Economy", value: 25, model_value: 4, market: 48000000, growth: 19, model: "B2C", competition: "High", capital: "Low", trend: "Distribution is cheap, but platform dependence and retention are major risks." }
];

const fallbackMetadata = {
  industries: industryCatalog,
  business_models: [
    { label: "B2B (Business-to-Business)", short_label: "B2B", value: 0, meaning: "Selling products or services to other businesses." },
    { label: "B2C (Business-to-Consumer)", short_label: "B2C", value: 1, meaning: "Selling directly to individual customers." },
    { label: "Marketplace (Buyer-Seller Platform)", short_label: "Marketplace", value: 2, meaning: "Connecting buyers and sellers on one platform." },
    { label: "SaaS (Software as a Service)", short_label: "SaaS", value: 3, meaning: "Subscription software delivered online." }
  ],
  competition_levels: [
    { label: "High", value: 0 },
    { label: "Low", value: 1 },
    { label: "Medium", value: 2 }
  ]
};

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "predict", label: "Predict", icon: Target },
  { id: "ai", label: "AI", icon: BrainCircuit },
  { id: "compare", label: "Compare", icon: GitCompare },
  { id: "analytics", label: "Analytics", icon: Activity },
  { id: "tools", label: "Tools", icon: SlidersHorizontal },
  { id: "market", label: "Market", icon: BarChart3 },
  { id: "funding", label: "Funding", icon: DollarSign },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "metrics", label: "Model", icon: Shield },
  { id: "admin", label: "Admin", icon: Database },
  { id: "saved", label: "Saved", icon: Save },
  { id: "settings", label: "Settings", icon: Settings }
];

const roleModeConfig = {
  founder: {
    label: "Founder View",
    startPage: "predict",
    nav: ["home", "predict", "ai", "tools", "market", "funding", "reports", "saved", "settings"],
    actions: [
      { id: "predict", icon: Target, title: "Run Prediction", text: "Enter startup details and get success, risk, funding, and growth results." },
      { id: "ai", icon: BrainCircuit, title: "Improve Startup", text: "Use AI analysis to understand what to fix before raising funds." },
      { id: "funding", icon: DollarSign, title: "Funding Plan", text: "Find suggested funding stage, gap, and matched funders." },
      { id: "reports", icon: FileText, title: "Save Report", text: "Export or save a final founder-ready startup report." }
    ]
  },
  investor: {
    label: "Investor View",
    startPage: "analytics",
    nav: ["home", "analytics", "compare", "predict", "tools", "market", "funding", "reports", "saved", "settings"],
    actions: [
      { id: "analytics", icon: Activity, title: "Portfolio Analytics", text: "Review success rates, funding patterns, and risk mix across startups." },
      { id: "compare", icon: GitCompare, title: "Compare Deals", text: "Compare saved or recent startups before making an investment decision." },
      { id: "tools", icon: SlidersHorizontal, title: "Risk Tools", text: "Check valuation, risk plan, founder readiness, and investment decision." },
      { id: "saved", icon: Save, title: "Review Saved", text: "Open prior reports and revisit investment candidates." }
    ]
  },
  admin: {
    label: "Admin View",
    startPage: "admin",
    nav: ["home", "admin", "metrics", "analytics", "predict", "reports", "saved", "settings"],
    actions: [
      { id: "admin", icon: Database, title: "Dataset Console", text: "Inspect startup records and run CSV batch predictions." },
      { id: "metrics", icon: Shield, title: "Model Metrics", text: "Review accuracy, recall, feature importance, and confusion matrix." },
      { id: "analytics", icon: Activity, title: "System Analytics", text: "Check aggregate funding, success, growth, and risk distributions." },
      { id: "settings", icon: Settings, title: "Backup Settings", text: "Manage refresh, export format, backup, restore, and reset controls." }
    ]
  }
};

function configForRole(roleMode) {
  return roleModeConfig[roleMode] || roleModeConfig.founder;
}

function navItemsForRole(roleMode) {
  const allowed = new Set(configForRole(roleMode).nav);
  return navItems.filter((item) => allowed.has(item.id));
}

const projectObjectives = [
  { icon: CheckCircle2, title: "Predict Success Probability", text: "Estimate how likely the startup is to succeed using funding, revenue, market, team, and founder data." },
  { icon: Landmark, title: "Recommend Funding Stage", text: "Suggest Bootstrapping, Seed Funding, Series A, or Venture Capital based on startup strength." },
  { icon: BarChart3, title: "Analyze Market Opportunity", text: "Measure demand, opportunity size, customer growth, and market attractiveness." },
  { icon: Users, title: "Evaluate Competitors", text: "Review competition level, startup advantage, and estimated competitive pressure." },
  { icon: TrendingUp, title: "Forecast Growth Potential", text: "Project future growth from revenue, market size, customers, and business model signals." }
];

const businessIntelligenceFeatures = [
  { icon: Target, title: "Evaluate Startup Viability", text: "Score business strength from funding, revenue, team size, market size, founder experience, and customer growth." },
  { icon: CheckCircle2, title: "Estimate Success Chances", text: "Use machine learning to convert startup inputs into a clear success probability for founders and investors." },
  { icon: Users, title: "Understand Competition", text: "Compare market pressure, competitor count, and competitive advantage before deciding whether to scale." },
  { icon: Landmark, title: "Identify Funding Requirements", text: "Recommend funding stage, investment requirement, and capital gap for the startup's current traction level." },
  { icon: TrendingUp, title: "Predict Future Growth", text: "Forecast revenue growth, user growth, market expansion, and the likely business growth path." }
];

const fundingCompanies = [
  { name: "Y Combinator", stage: "Pre-seed / Seed", focus: "AI, SaaS, FinTech, Consumer", ticket: 500000 },
  { name: "Sequoia Capital", stage: "Seed to Growth", focus: "AI, Enterprise, Consumer, FinTech", ticket: 2000000 },
  { name: "Accel", stage: "Seed / Series A", focus: "SaaS, FinTech, E-Commerce, AI", ticket: 1200000 },
  { name: "Andreessen Horowitz", stage: "Seed to Growth", focus: "AI, Crypto, Bio, Enterprise", ticket: 2500000 },
  { name: "Lightspeed Venture Partners", stage: "Seed / Series A", focus: "Enterprise, Consumer, HealthTech", ticket: 1500000 },
  { name: "Tiger Global Management", stage: "Growth / Series B+", focus: "FinTech, SaaS, Internet, AI", ticket: 5000000 },
  { name: "SoftBank Vision Fund", stage: "Growth Capital", focus: "AI, Logistics, Robotics, Marketplaces", ticket: 10000000 },
  { name: "Bessemer Venture Partners", stage: "Seed to Series B", focus: "Cloud, SaaS, Cybersecurity, HealthTech", ticket: 1800000 },
  { name: "General Catalyst", stage: "Seed to Growth", focus: "AI, HealthTech, FinTech, Enterprise", ticket: 2200000 },
  { name: "Matrix Partners", stage: "Seed / Series A", focus: "B2B, Consumer, FinTech, SaaS", ticket: 1000000 },
  { name: "Kalaari Capital", stage: "Seed / Series A", focus: "India, Consumer, SaaS, FinTech", ticket: 800000 },
  { name: "Blume Ventures", stage: "Seed / Pre-Series A", focus: "India, DeepTech, SaaS, Consumer", ticket: 650000 },
  { name: "Peak XV Partners", stage: "Seed to Growth", focus: "India, SEA, AI, FinTech, SaaS", ticket: 2000000 },
  { name: "Nexus Venture Partners", stage: "Seed / Series A", focus: "Enterprise, SaaS, AI, Consumer", ticket: 1200000 },
  { name: "500 Global", stage: "Pre-seed / Seed", focus: "FinTech, SaaS, Consumer, Marketplaces", ticket: 250000 },
  { name: "Khosla Ventures", stage: "Seed to Growth", focus: "AI, Climate, Health, DeepTech", ticket: 1800000 },
  { name: "Founders Fund", stage: "Seed to Growth", focus: "AI, Aerospace, Defense, FinTech", ticket: 2500000 },
  { name: "Greylock Partners", stage: "Seed / Series A", focus: "Enterprise, AI, Consumer, Security", ticket: 1500000 },
  { name: "Kleiner Perkins", stage: "Seed / Series A", focus: "AI, Enterprise, Consumer, HealthTech", ticket: 1300000 },
  { name: "NEA", stage: "Seed to Growth", focus: "Healthcare, AI, Enterprise, Consumer", ticket: 2200000 },
  { name: "Insight Partners", stage: "Series A to Growth", focus: "SaaS, Scaleups, Cybersecurity, AI", ticket: 4500000 },
  { name: "Battery Ventures", stage: "Seed to Growth", focus: "B2B Software, Cloud, Industrial Tech", ticket: 1700000 },
  { name: "Index Ventures", stage: "Seed to Growth", focus: "FinTech, SaaS, AI, Consumer", ticket: 2000000 },
  { name: "GV", stage: "Seed to Growth", focus: "AI, Life Sciences, Cloud, Consumer", ticket: 1800000 },
  { name: "Intel Capital", stage: "Series A to Growth", focus: "Semiconductors, AI, Edge, Cloud", ticket: 2500000 },
  { name: "Salesforce Ventures", stage: "Series A to Growth", focus: "Enterprise SaaS, AI, CRM, Cloud", ticket: 2200000 },
  { name: "Antler", stage: "Pre-seed / Seed", focus: "Founder-led startups, AI, SaaS, Consumer", ticket: 200000 },
  { name: "Techstars", stage: "Pre-seed / Accelerator", focus: "Early-stage startups across sectors", ticket: 120000 },
  { name: "Entrepreneur First", stage: "Pre-seed", focus: "DeepTech, AI, Founder teams", ticket: 150000 },
  { name: "Indian Angel Network", stage: "Angel / Seed", focus: "India, HealthTech, FinTech, Consumer", ticket: 300000 },
  { name: "LetsVenture", stage: "Angel / Seed", focus: "India, SaaS, Consumer, FinTech", ticket: 250000 },
  { name: "Mumbai Angels", stage: "Angel / Seed", focus: "India, Early-stage, Consumer, SaaS", ticket: 200000 },
  { name: "3one4 Capital", stage: "Seed / Series A", focus: "India, SaaS, FinTech, DeepTech", ticket: 700000 },
  { name: "Stellaris Venture Partners", stage: "Seed / Series A", focus: "India, B2B SaaS, Consumer, AI", ticket: 900000 },
  { name: "Chiratae Ventures", stage: "Seed to Series B", focus: "India, HealthTech, FinTech, Consumer", ticket: 1000000 },
  { name: "Orios Venture Partners", stage: "Seed / Series A", focus: "India, Consumer, SaaS, FinTech", ticket: 650000 },
  { name: "Elevation Capital", stage: "Seed to Growth", focus: "India, Consumer, FinTech, SaaS", ticket: 1300000 },
  { name: "Avaana Capital", stage: "Seed / Series A", focus: "ClimateTech, AgriTech, Sustainability", ticket: 900000 },
  { name: "Omnivore", stage: "Seed / Series A", focus: "AgriTech, FoodTech, Climate", ticket: 700000 },
  { name: "Unicorn India Ventures", stage: "Seed / Pre-Series A", focus: "India, DeepTech, SaaS, Consumer", ticket: 500000 },
  { name: "WaterBridge Ventures", stage: "Seed / Series A", focus: "India, SaaS, Consumer, AI, FinTech", ticket: 850000 },
  { name: "Prime Venture Partners", stage: "Seed / Series A", focus: "India, FinTech, SaaS, Consumer, Healthcare", ticket: 1000000 },
  { name: "Together Fund", stage: "Seed / Series A", focus: "India, SaaS, AI, Developer Tools, Enterprise", ticket: 900000 },
  { name: "Arkam Ventures", stage: "Seed / Series A", focus: "India, Consumer, FinTech, HealthTech, Education", ticket: 750000 },
  { name: "Jungle Ventures", stage: "Series A to Growth", focus: "SEA, India, Consumer, SaaS, FinTech", ticket: 1800000 },
  { name: "Beenext", stage: "Seed / Series A", focus: "India, SEA, FinTech, Marketplaces, SaaS", ticket: 650000 },
  { name: "Rocketship.vc", stage: "Seed to Series B", focus: "AI, Marketplaces, FinTech, SaaS, Consumer", ticket: 1500000 },
  { name: "QED Investors", stage: "Seed to Growth", focus: "FinTech, InsurTech, WealthTech, Credit", ticket: 2500000 },
  { name: "Ribbit Capital", stage: "Seed to Growth", focus: "FinTech, Crypto, Insurance, WealthTech", ticket: 3000000 },
  { name: "Fin Capital", stage: "Seed to Series B", focus: "FinTech, WealthTech, InsurTech, Enterprise", ticket: 1600000 },
  { name: "Flourish Ventures", stage: "Seed to Growth", focus: "FinTech, Financial Health, Consumer, Emerging Markets", ticket: 1200000 },
  { name: "HealthQuad", stage: "Series A / Growth", focus: "India, HealthTech, Healthcare, Life Sciences", ticket: 1500000 },
  { name: "Eight Roads Ventures", stage: "Series A to Growth", focus: "Healthcare, SaaS, Consumer, FinTech", ticket: 2200000 },
  { name: "F-Prime Capital", stage: "Seed to Growth", focus: "Healthcare, BioTech, FinTech, Enterprise", ticket: 1800000 },
  { name: "OrbiMed", stage: "Series A to Growth", focus: "BioTech, Healthcare, Life Sciences, Medical Devices", ticket: 3500000 },
  { name: "SOSV", stage: "Pre-seed / Seed", focus: "BioTech, Climate, FoodTech, Hardware, DeepTech", ticket: 250000 },
  { name: "IndieBio", stage: "Accelerator / Seed", focus: "BioTech, Life Sciences, FoodTech, Climate", ticket: 300000 },
  { name: "Plug and Play Ventures", stage: "Accelerator / Seed", focus: "FinTech, HealthTech, Mobility, Supply Chain, AI", ticket: 200000 },
  { name: "MassChallenge", stage: "Accelerator", focus: "Early-stage startups across sectors", ticket: 100000 },
  { name: "Alchemist Accelerator", stage: "Accelerator / Seed", focus: "Enterprise, SaaS, B2B Software, AI", ticket: 120000 },
  { name: "Village Global", stage: "Pre-seed / Seed", focus: "AI, SaaS, Consumer, Enterprise", ticket: 300000 },
  { name: "Initialized Capital", stage: "Seed / Series A", focus: "SaaS, Developer Tools, Consumer, FinTech", ticket: 1000000 },
  { name: "First Round Capital", stage: "Pre-seed / Seed", focus: "SaaS, Consumer, Healthcare, FinTech", ticket: 700000 },
  { name: "Forerunner Ventures", stage: "Seed to Growth", focus: "Consumer, E-Commerce, Marketplaces, Creator Economy", ticket: 1800000 },
  { name: "Lerer Hippeau", stage: "Seed / Series A", focus: "Consumer, MediaTech, E-Commerce, Enterprise", ticket: 900000 },
  { name: "Cowboy Ventures", stage: "Seed / Series A", focus: "Consumer, SaaS, FinTech, AI", ticket: 900000 },
  { name: "Maveron", stage: "Seed / Series A", focus: "Consumer, EdTech, HealthTech, E-Commerce", ticket: 1200000 },
  { name: "Reach Capital", stage: "Seed / Series A", focus: "EdTech, Future of Work, Consumer, SaaS", ticket: 900000 },
  { name: "Learn Capital", stage: "Seed to Growth", focus: "EdTech, Education, Workforce, Consumer", ticket: 1400000 },
  { name: "GSV Ventures", stage: "Series A to Growth", focus: "EdTech, Future of Work, AI, Education", ticket: 1800000 },
  { name: "Energy Impact Partners", stage: "Series A to Growth", focus: "CleanTech, Energy, Climate, Mobility", ticket: 2500000 },
  { name: "Breakthrough Energy Ventures", stage: "Seed to Growth", focus: "Climate, CleanTech, Energy, ManufacturingTech", ticket: 3000000 },
  { name: "Lowercarbon Capital", stage: "Seed to Growth", focus: "Climate, CleanTech, FoodTech, AgriTech", ticket: 1800000 },
  { name: "Congruent Ventures", stage: "Seed / Series A", focus: "Climate, Energy, Mobility, ManufacturingTech", ticket: 1200000 },
  { name: "Autotech Ventures", stage: "Seed to Growth", focus: "Mobility, Logistics, EV, Transportation", ticket: 1600000 },
  { name: "Maniv Mobility", stage: "Seed / Series A", focus: "Mobility, EV, Logistics, Transportation", ticket: 1000000 },
  { name: "Prologis Ventures", stage: "Series A to Growth", focus: "Logistics, Supply Chain, Real Estate, Industrial Tech", ticket: 2000000 },
  { name: "Construct Capital", stage: "Seed / Series A", focus: "ManufacturingTech, Logistics, Supply Chain, Automation", ticket: 1200000 },
  { name: "Homebrew", stage: "Seed", focus: "SaaS, FinTech, Marketplaces, Consumer", ticket: 600000 },
  { name: "Haystack", stage: "Pre-seed / Seed", focus: "SaaS, AI, Consumer, Marketplaces", ticket: 350000 },
  { name: "Uncork Capital", stage: "Seed / Series A", focus: "SaaS, Enterprise, Consumer, Marketplaces", ticket: 900000 },
  { name: "M12", stage: "Series A to Growth", focus: "Enterprise, AI, Cybersecurity, Cloud", ticket: 2500000 },
  { name: "YL Ventures", stage: "Seed / Series A", focus: "Cybersecurity, Enterprise, Cloud, AI", ticket: 1200000 },
  { name: "Forgepoint Capital", stage: "Series A to Growth", focus: "Cybersecurity, Privacy, Infrastructure, Enterprise", ticket: 2500000 },
  { name: "Ten Eleven Ventures", stage: "Seed to Growth", focus: "Cybersecurity, Cloud Security, Enterprise", ticket: 2000000 },
  { name: "NFX", stage: "Seed / Series A", focus: "Marketplaces, Gaming, FinTech, AI, Consumer", ticket: 1000000 },
  { name: "BITKRAFT Ventures", stage: "Seed to Growth", focus: "Gaming, Esports, MediaTech, Creator Economy", ticket: 1500000 },
  { name: "Play Ventures", stage: "Seed / Series A", focus: "Gaming, Consumer, Creator Economy", ticket: 900000 },
  { name: "Makers Fund", stage: "Seed to Growth", focus: "Gaming, Interactive Media, Consumer", ticket: 1800000 },
  { name: "MaC Venture Capital", stage: "Seed / Series A", focus: "MediaTech, Consumer, Creator Economy, SaaS", ticket: 900000 },
  { name: "Human Ventures", stage: "Pre-seed / Seed", focus: "Consumer, MediaTech, HealthTech, Future of Work", ticket: 400000 },
  { name: "MetaProp", stage: "Seed / Series A", focus: "PropTech, Real Estate, Construction, SaaS", ticket: 800000 },
  { name: "Fifth Wall", stage: "Seed to Growth", focus: "PropTech, Real Estate, Climate, Retail", ticket: 2500000 },
  { name: "Camber Creek", stage: "Seed to Growth", focus: "PropTech, Real Estate, ConstructionTech", ticket: 1500000 },
  { name: "Travel Capitalist Ventures", stage: "Seed / Series A", focus: "TravelTech, Marketplaces, Consumer, Mobility", ticket: 700000 },
  { name: "JetBlue Ventures", stage: "Seed to Series B", focus: "TravelTech, Mobility, Logistics, Sustainability", ticket: 1200000 },
  { name: "LegalTech Fund", stage: "Seed / Series A", focus: "LegalTech, SaaS, Enterprise, Compliance", ticket: 900000 },
  { name: "Work-Bench", stage: "Seed / Series A", focus: "Enterprise, HRTech, SaaS, B2B Software", ticket: 1000000 },
  { name: "Notation Capital", stage: "Pre-seed / Seed", focus: "SaaS, Developer Tools, Enterprise, AI", ticket: 300000 }
];

const funderStatuses = ["Open for pitch request", "Reviewing new startups", "Accepting warm intros", "Looking for traction", "Sector-focused this week"];

const funderIndustryAliases = {
  AI: ["AI", "Enterprise", "Cloud", "DeepTech"],
  AgriTech: ["AgriTech", "Climate", "Sustainability", "DeepTech"],
  CleanTech: ["Climate", "CleanTech", "Sustainability", "Energy"],
  Cybersecurity: ["Cybersecurity", "Security", "Cloud", "Enterprise"],
  "E-Commerce": ["E-Commerce", "Consumer", "Marketplaces", "Internet"],
  EdTech: ["EdTech", "Education", "Consumer", "SaaS"],
  FinTech: ["FinTech", "Finance", "Consumer", "B2B"],
  FoodTech: ["FoodTech", "Consumer", "Climate", "AgriTech"],
  HealthTech: ["HealthTech", "Healthcare", "Health", "Life Sciences", "Bio"],
  Logistics: ["Logistics", "Industrial Tech", "Cloud", "B2B"],
  BioTech: ["Bio", "Life Sciences", "Healthcare", "DeepTech"],
  DeepTech: ["DeepTech", "AI", "Industrial Tech", "Semiconductors", "Climate"],
  SaaS: ["SaaS", "Cloud", "Enterprise", "B2B Software"],
  PropTech: ["Real Estate", "Marketplaces", "Consumer", "SaaS"],
  LegalTech: ["SaaS", "Enterprise", "B2B Software", "AI"],
  HRTech: ["SaaS", "Enterprise", "B2B Software", "Consumer"],
  InsurTech: ["FinTech", "Insurance", "Enterprise", "B2B"],
  WealthTech: ["FinTech", "Consumer", "Finance", "AI"],
  Gaming: ["Consumer", "Internet", "AI"],
  MediaTech: ["Consumer", "Internet", "AI"],
  TravelTech: ["Consumer", "Marketplaces", "Internet"],
  Mobility: ["Logistics", "Industrial Tech", "Climate", "AI"],
  EV: ["Climate", "Energy", "Industrial Tech", "DeepTech"],
  "Real Estate": ["Real Estate", "Marketplaces", "Consumer"],
  ManufacturingTech: ["Industrial Tech", "B2B Software", "Cloud", "DeepTech"],
  "Creator Economy": ["Consumer", "Internet", "Marketplaces", "AI"]
};

const initialForm = {
  startup_name: "",
  startup_description: "",
  industry: 0,
  funding_amount: 250000,
  team_size: 12,
  revenue: 180000,
  market_size: 30000000,
  founder_experience: 3,
  business_model: 0,
  competition_level: 2,
  customer_growth: 22
};

const currencyFormats = {
  USD: { symbol: "$" },
  INR: { symbol: "₹" },
  EUR: { symbol: "€" }
};

const accentThemes = {
  purple: { label: "Purple", accent: "#6d35ff", accentDark: "#172554", water: "#38bdf8" },
  blue: { label: "Blue", accent: "#2563eb", accentDark: "#1e3a8a", water: "#7dd3fc" },
  green: { label: "Green", accent: "#16a34a", accentDark: "#14532d", water: "#86efac" },
  cyan: { label: "Cyan", accent: "#0891b2", accentDark: "#164e63", water: "#67e8f9" }
};

const chartColors = {
  blue: "#2563eb",
  blueSoft: "#60a5fa",
  purple: "#6d35ff",
  purpleSoft: "#6d35ff",
  grid: "#e8ecf6",
  success: "#16a34a",
  warning: "#f97316",
  danger: "#ef4444"
};

const riskColors = {
  low: chartColors.success,
  medium: chartColors.warning,
  high: chartColors.danger
};

function riskColorFor(label = "") {
  const normalized = String(label).toLowerCase();
  if (normalized.includes("low")) return riskColors.low;
  if (normalized.includes("medium")) return riskColors.medium;
  if (normalized.includes("high")) return riskColors.high;
  return chartColors.warning;
}

function riskToneFor(label = "") {
  const normalized = String(label).toLowerCase();
  if (normalized.includes("low")) return "green";
  if (normalized.includes("medium")) return "orange";
  if (normalized.includes("high")) return "red";
  return "orange";
}

const defaultPreferences = {
  themeMode: "light",
  accentColor: "purple",
  defaultStartPage: "home",
  currency: "USD",
  predictionSensitivity: "balanced",
  autoSaveReports: false,
  showAdvancedMetrics: true,
  chartStyle: "water",
  dataRefresh: "manual",
  exportFormat: "pdf",
  notifyFunding: true,
  notifyRisk: true,
  notifySavedReports: true,
  roleMode: "founder"
};

let activeCurrency = defaultPreferences.currency;

function money(value) {
  const number = Number(value || 0);
  const sign = number < 0 ? "-" : "";
  const absolute = Math.abs(number);
  const symbol = currencyFormats[activeCurrency]?.symbol || "$";
  if (absolute >= 1000000000) return `${sign}${symbol}${(absolute / 1000000000).toFixed(2)}B`;
  if (absolute >= 1000000) return `${sign}${symbol}${(absolute / 1000000).toFixed(2)}M`;
  if (absolute >= 1000) return `${sign}${symbol}${Math.round(absolute / 1000)}K`;
  return `${sign}${symbol}${absolute}`;
}

function compactNumber(value) {
  const number = Number(value || 0);
  if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M`;
  if (number >= 1000) return `${Math.round(number / 1000)}K`;
  return `${Math.round(number)}`;
}

async function getJson(path) {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) throw new Error(`Request failed: ${path}`);
  return response.json();
}

async function postJson(path, body) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Request failed: ${path}`);
  return data;
}

function labelFor(options, value) {
  return options?.find((item) => Number(item.value) === Number(value))?.label || value;
}

function optionFor(options, value) {
  return options?.find((item) => Number(item.value) === Number(value));
}

function industryBenchmark(metadata, value) {
  const remote = optionFor(metadata.industries, value);
  const local = industryCatalog.find((item) => Number(item.value) === Number(value) || item.label === remote?.label);
  return { ...(local || industryCatalog[0]), ...(remote || {}) };
}

function modelReadyForm(form, metadata) {
  const industry = industryBenchmark(metadata, form.industry);
  return {
    ...form,
    industry: Number(industry.model_value ?? form.industry)
  };
}

function valueForLabel(options, label, fallback = 0) {
  const cleanLabel = String(label).toLowerCase();
  const match = options?.find((item) => (
    String(item.label).toLowerCase() === cleanLabel
    || String(item.short_label || "").toLowerCase() === cleanLabel
    || String(item.label).toLowerCase().startsWith(`${cleanLabel} `)
    || String(item.label).toLowerCase().startsWith(`${cleanLabel}(`)
  ));
  return match ? Number(match.value) : fallback;
}

function businessModelName(metadata, value, style = "long") {
  const option = optionFor(metadata.business_models, value);
  if (!option) return value;
  return style === "short" ? (option.short_label || option.label) : option.label;
}

function normalizeBusinessModels(models = []) {
  const fallbackByValue = new Map(fallbackMetadata.business_models.map((item) => [Number(item.value), item]));
  const source = Array.isArray(models) && models.length ? models : fallbackMetadata.business_models;
  return source.map((item) => {
    const fallback = fallbackByValue.get(Number(item.value));
    if (!fallback) return item;
    return { ...fallback, ...item, label: fallback.label, short_label: fallback.short_label, meaning: fallback.meaning };
  });
}

function normalizeUsername(username) {
  return String(username || "").trim().toLowerCase();
}

function readAccounts() {
  try {
    const raw = localStorage.getItem("startup-user-accounts");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAccounts(accounts) {
  localStorage.setItem("startup-user-accounts", JSON.stringify(accounts));
}

function storageKeyForUser(username) {
  return `startup-saved-reports:${normalizeUsername(username)}`;
}

function readSavedReports(username) {
  if (!username) return [];

  try {
    const raw = localStorage.getItem(storageKeyForUser(username));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeSavedReports(username, reports) {
  if (!username) return;
  localStorage.setItem(storageKeyForUser(username), JSON.stringify(reports));
}

function readPreferences() {
  try {
    const raw = localStorage.getItem("startup-settings");
    return { ...defaultPreferences, ...(raw ? JSON.parse(raw) : {}) };
  } catch {
    return defaultPreferences;
  }
}

function writePreferences(preferences) {
  localStorage.setItem("startup-settings", JSON.stringify(preferences));
}

function readPredictionHistory(username) {
  if (!username) return [];
  try {
    const raw = localStorage.getItem(`startup-prediction-history:${normalizeUsername(username)}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writePredictionHistory(username, history) {
  if (!username) return;
  localStorage.setItem(`startup-prediction-history:${normalizeUsername(username)}`, JSON.stringify(history));
}

function readAllSavedReports() {
  const accounts = readAccounts();
  return Object.values(accounts).flatMap((account) => readSavedReports(account.displayName || "")).sort((a, b) => new Date(b.savedAt || 0) - new Date(a.savedAt || 0));
}

function readInvestmentOffers() {
  try {
    const raw = localStorage.getItem("startup-investment-offers");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeInvestmentOffers(offers) {
  localStorage.setItem("startup-investment-offers", JSON.stringify(offers));
}

function offerHistoryFor(offer) {
  const storedHistory = Array.isArray(offer.history) ? offer.history.filter((item) => item?.at) : [];
  const createdAt = offer.createdAt || offer.updatedAt || new Date().toISOString();
  const baseHistory = storedHistory.length ? storedHistory : [{
    status: "Pending",
    label: "Offer sent",
    at: createdAt,
    note: offer.note || `${offer.investor || "Investor"} offered ${money(offer.amount)} for ${offer.equity || 0}% equity.`
  }];

  if (offer.status && offer.status !== "Pending") {
    const statusAt = offer.updatedAt || createdAt;
    const hasStatusEvent = baseHistory.some((item) => item.status === offer.status && item.at === statusAt);
    if (!hasStatusEvent) {
      return [...baseHistory, {
        status: offer.status,
        label: offer.status,
        at: statusAt,
        note: offer.status === "Counter Offered"
          ? `Counter terms: ${money(offer.amount)} for ${offer.equity || 0}% equity.`
          : `Founder marked this offer as ${offer.status.toLowerCase()}.`
      }];
    }
  }

  return baseHistory;
}

function offersForRole(offers, currentUser, roleMode) {
  const userId = normalizeUsername(currentUser);
  if (roleMode === "admin") return offers;
  if (roleMode === "investor") {
    return offers.filter((offer) => normalizeUsername(offer.investor) === userId);
  }
  return offers.filter((offer) => {
    const target = normalizeUsername(offer.targetFounder);
    return target === userId || target === "founder";
  });
}

function offerNotificationsFor(offers, currentUser, roleMode) {
  return offersForRole(offers, currentUser, roleMode)
    .map((offer) => {
      const history = offerHistoryFor(offer);
      const latest = history[history.length - 1] || {};
      const status = offer.status || "Pending";
      const actor = roleMode === "investor" ? (offer.targetFounder || "Founder") : (offer.investor || "Investor");
      const message = status === "Pending"
        ? `${actor} sent ${money(offer.amount)} for ${offer.equity || 0}% equity in ${offer.startupName}.`
        : `${offer.startupName} is now ${status}: ${money(offer.amount)} for ${offer.equity || 0}% equity.`;
      return {
        id: `${offer.id}-${latest.at || offer.createdAt || status}`,
        title: roleMode === "admin" ? `${status} offer` : status,
        message,
        at: latest.at || offer.updatedAt || offer.createdAt,
        status
      };
    })
    .sort((a, b) => new Date(b.at || 0) - new Date(a.at || 0))
    .slice(0, 8);
}

function numberFromText(value, fallback = 0) {
  const match = String(value ?? "").match(/-?\d+(\.\d+)?/);
  return match ? Number(match[0]) : fallback;
}

function investorMatchProfile(startup) {
  const success = numberFromText(startup.success, startup.report?.analysis?.success?.probability || 50);
  const riskText = String(startup.risk || startup.report?.analysis?.risk?.category || "").toLowerCase();
  const riskScore = riskText.includes("low") ? 30 : riskText.includes("medium") ? 20 : riskText.includes("high") ? 6 : 14;
  const fundingText = String(startup.funding || startup.report?.analysis?.funding?.stage || "").toLowerCase();
  const fundingScore = fundingText.includes("seed") ? 13 : fundingText.includes("series") ? 15 : fundingText.includes("venture") ? 12 : fundingText.includes("bootstrap") ? 8 : 9;
  const analysisScore = startup.report ? 12 : startup.source === "Recent prediction" ? 8 : 5;
  const ask = Number(startup.ask || 0);
  const askScore = ask > 0 && ask <= 1200000 ? 8 : ask > 1200000 ? 4 : 6;
  const score = Math.round(clamp(success * 0.42 + riskScore + fundingScore + analysisScore + askScore, 18, 98));
  const label = score >= 80 ? "Strong investor match" : score >= 62 ? "Good match" : score >= 45 ? "Watchlist candidate" : "Needs diligence";
  const reasons = [
    `${Math.round(success)}% success signal`,
    riskText.includes("low") ? "low risk" : riskText.includes("medium") ? "medium risk to review" : riskText.includes("high") ? "high risk warning" : "risk data limited",
    startup.report ? "saved founder analysis available" : "basic dataset signals"
  ];

  return { score, label, reasons };
}

function createSavedReport(username, form, analysis, metadata) {
  const industryName = labelFor(metadata.industries, form.industry);
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    username,
    savedAt: new Date().toISOString(),
    startupName: form.startup_name || "Untitled startup",
    industryName,
    description: form.startup_description || form.inferred_about || `${industryName} startup analysis`,
    understanding: form.startup_understanding || understandStartup(form, metadata),
    form,
    analysis
  };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeMetadata(data = {}) {
  const remoteIndustries = Array.isArray(data.industries) ? data.industries : [];
  const industryMap = new Map();
  [...industryCatalog, ...remoteIndustries].forEach((item) => {
    if (!item || item.value === undefined) return;
    const local = industryCatalog.find((catalogItem) => Number(catalogItem.value) === Number(item.value) || catalogItem.label === item.label);
    industryMap.set(Number(item.value), { ...(local || {}), ...item });
  });

  return {
    ...fallbackMetadata,
    ...data,
    industries: Array.from(industryMap.values()).sort((a, b) => Number(a.value) - Number(b.value)),
    business_models: normalizeBusinessModels(data.business_models),
    competition_levels: Array.isArray(data.competition_levels) && data.competition_levels.length ? data.competition_levels : fallbackMetadata.competition_levels
  };
}

function startupUnderstandingRules() {
  return [
    { industry: "FinTech", words: ["payment", "finance", "bank", "loan", "credit", "invest", "wallet", "insurance", "upi", "lending", "wealth"], market: 85000000, growth: 30, model: "B2B" },
    { industry: "HealthTech", words: ["health", "doctor", "hospital", "clinic", "patient", "medical", "medicine", "diagnosis", "therapy", "care"], market: 90000000, growth: 28, model: "B2B" },
    { industry: "EdTech", words: ["education", "student", "school", "college", "learn", "course", "teacher", "exam", "tutor", "training"], market: 62000000, growth: 24, model: "B2C" },
    { industry: "AgriTech", words: ["farm", "crop", "agri", "soil", "farmer", "harvest", "irrigation", "seed", "disease"], market: 56000000, growth: 22, model: "Marketplace" },
    { industry: "CleanTech", words: ["climate", "solar", "energy", "carbon", "green", "recycle", "sustain", "emission", "renewable"], market: 78000000, growth: 27, model: "B2B" },
    { industry: "Cybersecurity", words: ["security", "cyber", "fraud", "threat", "privacy", "authentication", "malware", "firewall"], market: 82000000, growth: 31, model: "SaaS" },
    { industry: "E-Commerce", words: ["shop", "commerce", "retail", "store", "delivery", "marketplace", "seller", "brand"], market: 70000000, growth: 20, model: "Marketplace" },
    { industry: "FoodTech", words: ["food", "restaurant", "meal", "kitchen", "grocery", "nutrition", "recipe"], market: 52000000, growth: 18, model: "B2C" },
    { industry: "Logistics", words: ["logistics", "supply", "shipping", "fleet", "transport", "warehouse", "route"], market: 76000000, growth: 23, model: "B2B" },
    { industry: "BioTech", words: ["biotech", "biology", "genomics", "drug", "therapy", "lab", "clinical", "vaccine"], market: 88000000, growth: 26, model: "B2B" },
    { industry: "DeepTech", words: ["deeptech", "hardware", "semiconductor", "robotics", "quantum", "sensor", "iot"], market: 74000000, growth: 25, model: "B2B" },
    { industry: "SaaS", words: ["saas", "subscription", "workflow", "crm", "platform", "dashboard", "automation", "software"], market: 92000000, growth: 29, model: "SaaS" },
    { industry: "PropTech", words: ["property", "real estate", "rent", "tenant", "broker", "mortgage", "housing"], market: 68000000, growth: 19, model: "Marketplace" },
    { industry: "LegalTech", words: ["legal", "law", "contract", "compliance", "lawyer", "document", "agreement"], market: 46000000, growth: 18, model: "SaaS" },
    { industry: "HRTech", words: ["hr", "hiring", "recruit", "employee", "payroll", "talent", "workforce"], market: 54000000, growth: 20, model: "SaaS" },
    { industry: "InsurTech", words: ["insurance", "claim", "underwriting", "policy", "premium"], market: 64000000, growth: 21, model: "B2B" },
    { industry: "WealthTech", words: ["wealth", "portfolio", "trading", "investment", "advisor", "mutual fund"], market: 60000000, growth: 22, model: "B2C" },
    { industry: "Gaming", words: ["game", "gaming", "esports", "player", "studio"], market: 72000000, growth: 24, model: "B2C" },
    { industry: "MediaTech", words: ["media", "content", "creator", "video", "streaming", "podcast"], market: 50000000, growth: 17, model: "B2C" },
    { industry: "TravelTech", words: ["travel", "hotel", "booking", "tourism", "trip", "flight"], market: 66000000, growth: 21, model: "Marketplace" },
    { industry: "Mobility", words: ["mobility", "fleet", "transportation", "ride", "vehicle"], market: 80000000, growth: 24, model: "B2B" },
    { industry: "EV", words: ["ev", "electric vehicle", "battery", "charging", "charger"], market: 87000000, growth: 32, model: "B2B" },
    { industry: "ManufacturingTech", words: ["manufacturing", "factory", "industrial", "automation", "machine"], market: 69000000, growth: 20, model: "B2B" },
    { industry: "Creator Economy", words: ["creator", "influencer", "community", "newsletter", "monetization"], market: 48000000, growth: 19, model: "B2C" },
    { industry: "AI", words: ["ai", "machine learning", "ml", "automation", "predict", "analytics", "data", "model", "chatbot"], market: 95000000, growth: 35, model: "SaaS" }
  ];
}

function understandStartup(form, metadata) {
  const text = `${form.startup_name || ""} ${form.startup_description || ""}`.toLowerCase();
  const rules = startupUnderstandingRules();
  const scored = rules
    .map((rule) => {
      const matches = rule.words.filter((word) => text.includes(word));
      return { ...rule, matches, score: matches.length };
    })
    .sort((a, b) => b.score - a.score || b.growth - a.growth);
  const selectedIndustry = industryBenchmark(metadata, form.industry);
  const best = scored[0]?.score > 0 ? scored[0] : {
    industry: selectedIndustry.label,
    words: [],
    matches: [],
    score: 0,
    market: selectedIndustry.market,
    growth: selectedIndustry.growth,
    model: businessModelName(metadata, form.business_model, "short")
  };
  const detectedIndustry = metadata.industries.find((item) => item.label === best.industry) || selectedIndustry;
  const hasEnterprise = ["business", "company", "enterprise", "b2b", "saas", "team", "operations"].some((word) => text.includes(word));
  const hasConsumer = ["user", "consumer", "customer", "student", "patient", "people", "shopper"].some((word) => text.includes(word));
  const hasMarketplace = ["marketplace", "buyers", "sellers", "vendors", "two-sided"].some((word) => text.includes(word));
  const hasSubscription = ["subscription", "monthly", "saas", "recurring"].some((word) => text.includes(word));
  const detectedBusinessModel = hasSubscription ? "SaaS" : hasMarketplace ? "Marketplace" : hasEnterprise ? "B2B" : hasConsumer ? "B2C" : best.model;
  const businessModel = businessModelName(metadata, form.business_model, "short") || detectedBusinessModel;
  const businessModelValue = Number(form.business_model || valueForLabel(metadata.business_models, detectedBusinessModel, 0));
  const customerSegment = hasEnterprise ? "businesses and enterprise teams" : hasConsumer ? "individual consumers or end users" : "target customers in the selected market";
  const confidence = clamp(42 + best.score * 16 + (text.length > 80 ? 10 : 0), 42, 96);

  return {
    industry: best.industry,
    industryValue: Number(detectedIndustry.value ?? form.industry),
    modelValue: businessModelValue,
    businessModel,
    customerSegment,
    confidence: Math.round(confidence),
    keywords: best.matches.slice(0, 8),
    summary: `${form.startup_name || "This startup"} appears to be a ${businessModel} ${best.industry} company serving ${customerSegment}.`
  };
}

function inferStartupDetails(form, metadata) {
  const text = `${form.startup_name} ${form.startup_description}`.toLowerCase();
  const understanding = understandStartup(form, metadata);
  const selectedIndustry = industryBenchmark(metadata, understanding.industryValue);
  const industrySignal = { ...selectedIndustry, market: selectedIndustry.market, growth: selectedIndustry.growth };
  const hasEnterprise = ["business", "company", "enterprise", "b2b", "saas"].some((word) => text.includes(word));
  const hasConsumer = ["user", "consumer", "customer", "student", "patient", "people"].some((word) => text.includes(word));
  const hasManyCompetitors = ["crowded", "many competitors", "competitive", "red ocean"].some((word) => text.includes(word));
  const hasUnique = ["unique", "patent", "first", "new", "innovative", "differentiated"].some((word) => text.includes(word));

  return {
    ...form,
    industry: understanding.industryValue,
    business_model: Number(form.business_model || 0),
    market_size: Math.max(Number(form.market_size || 0), Number(industrySignal.market || selectedIndustry.market || 0)),
    customer_growth: Math.max(Number(form.customer_growth || 0), Number(industrySignal.growth || selectedIndustry.growth || 0)),
    competition_level: hasManyCompetitors ? 0 : hasUnique ? 1 : Number(form.competition_level || 2),
    funding_amount: Number(form.funding_amount || 0),
    team_size: Number(form.team_size || 1),
    revenue: Number(form.revenue || 0),
    founder_experience: Number(form.founder_experience || 0),
    startup_understanding: understanding,
    inferred_about: `${understanding.industry} startup using ${businessModelName(metadata, form.business_model)} model`
  };
}

function rotatedFundingCompanies(seed = Date.now()) {
  const offset = Math.abs(Math.floor(seed / 1000)) % fundingCompanies.length;
  return fundingCompanies
    .map((funder, index) => ({
      ...funder,
      status: funderStatuses[(offset + index) % funderStatuses.length],
      matchScore: 68 + ((offset * 7 + index * 11) % 29)
    }))
    .slice(offset)
    .concat(
      fundingCompanies
        .map((funder, index) => ({
          ...funder,
          status: funderStatuses[(offset + index) % funderStatuses.length],
          matchScore: 68 + ((offset * 7 + index * 11) % 29)
        }))
        .slice(0, offset)
    )
    .slice(0, 6);
}

function matchedFundingCompanies(form, metadata, seed = Date.now()) {
  const selectedIndustry = industryBenchmark(metadata, form.industry);
  const industryLabel = selectedIndustry.label;
  const aliases = funderIndustryAliases[industryLabel] || [industryLabel];
  const aliasTerms = [industryLabel, ...aliases].map((item) => String(item).toLowerCase());
  const requestedAmount = Number(form.funding_amount || 0);
  const offset = Math.abs(Math.floor(seed / 1000)) % fundingCompanies.length;

  const rankedFunders = fundingCompanies
    .map((funder, index) => {
      const focus = funder.focus.toLowerCase();
      const directMatch = focus.includes(industryLabel.toLowerCase());
      const aliasMatches = aliasTerms.filter((term) => focus.includes(term));
      const broadMatch = ["sector", "across sectors", "early-stage startups"].some((term) => focus.includes(term));
      const ticketGap = Math.abs(Number(funder.ticket || 0) - Math.max(requestedAmount, 1));
      const ticketScore = requestedAmount > 0 ? Math.max(0, 18 - Math.round(ticketGap / requestedAmount * 10)) : 8;
      const sectorScore = directMatch ? 52 : Math.min(aliasMatches.length * 16, 42);
      const broadScore = broadMatch ? 12 : 0;
      const refreshScore = ((offset + index * 17) % 19) - 6;
      const matchScore = Math.min(99, Math.max(45, 48 + sectorScore + broadScore + ticketScore + refreshScore));
      const matchedFocus = directMatch
        ? industryLabel
        : aliasMatches[0]
          ? aliases.find((alias) => alias.toLowerCase() === aliasMatches[0]) || industryLabel
          : broadMatch
            ? "sector-agnostic early-stage"
            : "adjacent sector";

      return {
        ...funder,
        status: matchScore >= 88 ? `Strong ${industryLabel} fit` : funderStatuses[(offset + index) % funderStatuses.length],
        matchScore,
        matchReason: `${matchedFocus} focus for ${industryLabel}`
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore || a.ticket - b.ticket);

  const strongMatches = rankedFunders.filter((funder) => funder.matchScore >= 70);
  const candidatePool = (strongMatches.length >= 12 ? strongMatches : rankedFunders).slice(0, 24);
  const rotation = offset % candidatePool.length;
  const rotatedPool = candidatePool.slice(rotation).concat(candidatePool.slice(0, rotation));
  const selected = rotatedPool.slice(0, 6);

  if (selected.length < 6) {
    return selected.concat(rankedFunders.filter((funder) => !selected.some((item) => item.name === funder.name)).slice(0, 6 - selected.length));
  }

  return selected;
}

function marketProjectionData(form, analysis) {
  const currentYear = new Date().getFullYear();
  const marketSize = Number(form.market_size || 0);
  const revenue = Number(form.revenue || 0);
  const funding = Number(form.funding_amount || 0);
  const customerGrowth = Number(form.customer_growth || 0);
  const competition = Number(form.competition_level || 2);
  const marketScore = Number(analysis?.market?.score || 55);
  const successProbability = Number(analysis?.success?.probability || 45);
  const riskScore = Number(analysis?.risk?.score || 55);
  const healthScore = successProbability + marketScore * 0.45 + customerGrowth * 0.35 - riskScore * 0.55 - (competition === 0 ? 14 : competition === 2 ? 5 : 0);
  const yearlyRate = clamp((healthScore - 45) / 100, -0.22, 0.36);
  const costBase = Math.max(60000, funding * 0.18 + revenue * 0.62 + (competition === 0 ? 95000 : competition === 2 ? 55000 : 30000));
  const startingConsumers = Math.max(1200, Math.round((revenue || 100000) / 35));

  return Array.from({ length: 6 }, (_, index) => {
    const year = currentYear + index;
    const marketCap = Math.max(0, marketSize * Math.pow(1 + yearlyRate, index));
    const consumers = Math.max(0, startingConsumers * Math.pow(1 + yearlyRate * 0.82, index));
    const projectedRevenue = Math.max(0, revenue * Math.pow(1 + yearlyRate * 1.2, index));
    const projectedCost = costBase * Math.pow(1 + Math.max(yearlyRate * 0.45, 0.02), index);
    const profitLoss = projectedRevenue - projectedCost;
    const growth = Math.round(yearlyRate * 100 + index * (yearlyRate > 0 ? 1.5 : -1.2));

    return {
      year: String(year),
      marketCap: Math.round(marketCap),
      consumers: Math.round(consumers),
      growth,
      profitLoss: Math.round(profitLoss),
      status: profitLoss >= 0 ? "Profit" : "Loss"
    };
  });
}

function fallbackPrediction(form) {
  const revenue = Number(form.revenue || 0);
  const funding = Number(form.funding_amount || 0);
  const marketSize = Number(form.market_size || 0);
  const teamSize = Number(form.team_size || 1);
  const founderExperience = Number(form.founder_experience || 0);
  const customerGrowth = Number(form.customer_growth || 0);
  const competition = Number(form.competition_level || 2);
  const benchmark = industryBenchmark(fallbackMetadata, form.industry);
  const capitalPenalty = benchmark.capital === "High" ? 5 : benchmark.capital === "Medium" ? 2 : 0;
  const sectorBoost = clamp((Number(benchmark.growth || 20) - 18) * 0.45, -3, 8);

  const score = clamp(
    24
      + Math.min(revenue / 18000, 22)
      + Math.min(funding / 50000, 14)
      + Math.min(marketSize / 2500000, 18)
      + Math.min(teamSize * 1.3, 14)
      + Math.min(founderExperience * 2.8, 14)
      + Math.min(customerGrowth * 0.45, 12)
      + (competition === 1 ? 8 : competition === 2 ? 2 : -8)
      + sectorBoost
      - capitalPenalty,
    8,
    96
  );

  return { success_probability: Math.round(score), fallback: true };
}

function analyzeStartup(form, metadata, predictionResult, sensitivity = "balanced") {
  const rawProbability = Number(predictionResult?.success_probability ?? 0);
  const sensitivityOffset = sensitivity === "conservative" ? -6 : sensitivity === "aggressive" ? 6 : 0;
  const probability = Math.round(clamp(rawProbability + sensitivityOffset, 0, 100));
  const funding = Number(form.funding_amount || 0);
  const revenue = Number(form.revenue || 0);
  const marketSize = Number(form.market_size || 0);
  const customerGrowth = Number(form.customer_growth || 0);
  const teamSize = Number(form.team_size || 1);
  const founderExperience = Number(form.founder_experience || 0);
  const competition = Number(form.competition_level || 2);
  const benchmark = industryBenchmark(metadata, form.industry);
  const benchmarkGrowth = Number(benchmark.growth || 20);
  const benchmarkMarket = Number(benchmark.market || 50000000);
  const capitalPenalty = benchmark.capital === "High" ? 8 : benchmark.capital === "Medium" ? 3 : 0;
  const competitionPenalty = benchmark.competition === "High" ? 7 : benchmark.competition === "Medium" ? 3 : 0;
  const sectorMomentum = clamp((benchmarkGrowth - 18) * 0.7, -4, 12);
  const marketReality = clamp((benchmarkMarket / 1000000 - 50) * 0.22, -6, 10);

  const profileScore = Math.round(clamp(
    probability * 0.45
    + Math.min(revenue / 20000, 25)
    + Math.min(founderExperience * 3, 18)
    + Math.min(teamSize, 12)
    - capitalPenalty,
    0,
    100
  ));

  const marketScore = Math.round(clamp(
    Math.min(marketSize / 1000000, 65)
      + customerGrowth
      + sectorMomentum
      + marketReality
      + (competition === 1 ? 10 : competition === 2 ? 3 : -8)
      - (benchmark.competition === "High" ? 4 : 0),
    10,
    100
  ));

  const riskScore = Math.round(clamp(
    100 - probability
      + (competition === 0 ? 16 : competition === 2 ? 8 : 2)
      + capitalPenalty
      + competitionPenalty
      - sectorMomentum
      - Math.min(customerGrowth / 2, 20),
    5,
    95
  ));

  const fundingStage = funding < 100000
    ? "Bootstrapping"
    : funding < 350000
      ? "Seed Funding"
      : funding < 900000
        ? "Series A"
        : "Venture Capital";

  const recommendedNeed = fundingStage === "Bootstrapping"
    ? 75000
    : fundingStage === "Seed Funding"
      ? 300000
      : fundingStage === "Series A"
        ? 1000000
        : 2500000;
  const sectorFundingMultiplier = benchmark.capital === "High" ? 1.45 : benchmark.capital === "Medium" ? 1.15 : 0.9;
  const sectorRecommendedNeed = Math.round(recommendedNeed * sectorFundingMultiplier);

  const competitorCount = Math.round((competition === 0 ? 25 : competition === 1 ? 5 : 12) + (benchmark.competition === "High" ? 8 : benchmark.competition === "Medium" ? 3 : 0));
  const competitionLabel = labelFor(metadata.competition_levels, competition);
  const growthPercent = Math.round(clamp((probability >= 75 ? 35 : probability >= 55 ? 22 : 10) + benchmarkGrowth * 0.35 - capitalPenalty * 0.35, 8, 55));
  const projectedRevenue = Math.round(revenue * (1 + growthPercent / 100));

  return {
    success: {
      probability,
      label: probability >= 75 ? "Strong success chance" : probability >= 55 ? "Moderate success chance" : "Needs improvement",
      note: probability >= 75
        ? "The startup looks attractive based on business signals."
        : probability >= 55
          ? "The startup has potential but needs careful validation."
          : "The startup needs stronger traction before serious investment."
    },
    funding: {
      stage: fundingStage,
      requirement: sectorRecommendedNeed,
      gap: Math.max(0, sectorRecommendedNeed - funding),
      note: fundingStage === "Bootstrapping"
        ? "Keep costs low and validate demand before raising larger capital."
        : `Recommended next path is ${fundingStage}. ${benchmark.label} usually has ${String(benchmark.capital).toLowerCase()} capital intensity.`
    },
    market: {
      score: marketScore,
      demand: marketScore >= 75 ? "High demand" : marketScore >= 50 ? "Medium demand" : "Low demand",
      opportunity: marketSize >= 80000000 ? "Very large opportunity" : marketSize >= 30000000 ? "Good opportunity" : "Niche opportunity",
      note: `${benchmark.label} benchmark growth is about ${benchmarkGrowth}%. ${benchmark.trend}`
    },
    competitor: {
      level: competitionLabel,
      count: competitorCount,
      advantage: competition === 1 ? "Strong advantage" : competition === 2 ? "Good differentiation needed" : "High pressure",
      note: competition === 0
        ? `The ${benchmark.label} market is crowded, so positioning and differentiation are critical.`
        : `Competition pressure is ${String(benchmark.competition).toLowerCase()} for ${benchmark.label}; execution quality still matters.`
    },
    growth: {
      forecast: probability >= 75 ? "High Growth" : probability >= 55 ? "Moderate Growth" : "Low Growth",
      growthPercent,
      projectedRevenue,
      note: `${benchmark.label} sector momentum supports about ${growthPercent}% projected growth if execution remains strong.`
    },
    risk: {
      score: riskScore,
      category: riskScore <= 35 ? "Low Risk" : riskScore <= 60 ? "Medium Risk" : "High Risk",
      note: riskScore <= 35
        ? "Risk is acceptable for investor review."
        : riskScore <= 60
          ? "Monitor revenue conversion, competition, and capital use."
          : "High risk: improve traction before raising or investing more."
    },
    profileScore,
    explainability: predictionResult?.explainability || null
  };
}

function buildAiNarrative(form, analysis, metadata) {
  if (!analysis) return null;

  const industry = labelFor(metadata.industries, form.industry);
  const benchmark = industryBenchmark(metadata, form.industry);
  const businessModel = labelFor(metadata.business_models, form.business_model);
  const name = form.startup_name || "This startup";
  const growthTone = analysis.growth.growthPercent >= 40
    ? "strong acceleration"
    : analysis.growth.growthPercent >= 25
      ? "steady growth"
      : "slow but improvable growth";
  const investmentTone = analysis.success.probability >= 70 && analysis.risk.score <= 45
    ? "ready for serious investor conversations"
    : analysis.success.probability >= 50
      ? "promising, but should strengthen traction before larger funding"
      : "not yet ready for aggressive fundraising";

  return {
    headline: `${name} looks like a ${businessModel} ${industry} startup with ${growthTone}.`,
    growth: `The company can grow from current revenue of ${money(form.revenue)} to about ${money(analysis.growth.projectedRevenue)} if it maintains customer growth near ${form.customer_growth}%. ${benchmark.label} benchmark growth is about ${benchmark.growth}%, so future growth depends on converting sector demand into repeat customers.`,
    market: `Market opportunity is classified as ${analysis.market.opportunity.toLowerCase()} with an estimated market size of ${money(form.market_size)}. In real-world ${benchmark.label}, ${benchmark.trend}`,
    funding: `For funding, the system recommends ${analysis.funding.stage}. The estimated funding gap is ${money(analysis.funding.gap)}, so the startup should request capital only after showing clear use of funds for product, sales, hiring, or market expansion.`,
    competition: `Competition is ${String(analysis.competitor.level).toLowerCase()} with around ${analysis.competitor.count} similar competitors. The main advantage area is: ${analysis.competitor.advantage}.`,
    risk: `Risk is currently ${analysis.risk.category.toLowerCase()} with a ${analysis.risk.score}/100 risk score. Overall, the startup is ${investmentTone}.`,
    action: analysis.success.probability >= 70
      ? "Next action: prepare investor pitch, show traction metrics, and request funding from matching investors."
      : analysis.success.probability >= 50
        ? "Next action: improve revenue consistency, validate customer demand, and reduce market or competition risk."
        : "Next action: focus on product validation, early customers, and a stronger business model before fundraising."
  };
}

function fallbackExplainability(form, analysis, metadata) {
  const benchmark = industryBenchmark(metadata, form.industry);
  const factors = [
    {
      label: "Revenue traction",
      importance: 21,
      direction: Number(form.revenue) >= 250000 ? "positive" : "negative",
      detail: `${money(form.revenue)} revenue is ${Number(form.revenue) >= 250000 ? "strong" : "still early"} for investor review.`
    },
    {
      label: "Customer growth",
      importance: 18,
      direction: Number(form.customer_growth) >= benchmark.growth ? "positive" : "negative",
      detail: `${form.customer_growth}% customer growth compared with ${benchmark.growth}% ${benchmark.label} benchmark.`
    },
    {
      label: "Market size",
      importance: 16,
      direction: Number(form.market_size) >= 50000000 ? "positive" : "negative",
      detail: `${money(form.market_size)} addressable market shapes the upside.`
    },
    {
      label: "Competition pressure",
      importance: 14,
      direction: Number(form.competition_level) === 1 ? "positive" : Number(form.competition_level) === 0 ? "negative" : "neutral",
      detail: `${analysis?.competitor?.level || "Competition"} affects defensibility and sales cost.`
    },
    {
      label: "Founder experience",
      importance: 12,
      direction: Number(form.founder_experience) >= 4 ? "positive" : "negative",
      detail: `${form.founder_experience} years of experience influences execution confidence.`
    },
    {
      label: "Funding strength",
      importance: 10,
      direction: Number(form.funding_amount) >= analysis?.funding?.requirement * 0.4 ? "positive" : "negative",
      detail: `${money(form.funding_amount)} funding leaves a ${money(analysis?.funding?.gap || 0)} gap.`
    }
  ];

  return {
    summary: "These drivers explain the score using business rules when API model explainability is unavailable.",
    confidence: analysis?.success?.probability >= 75 ? "High" : analysis?.success?.probability >= 50 ? "Medium" : "Low",
    top_factors: factors
  };
}

function buildRecommendations(form, analysis, metadata) {
  if (!analysis) return [];
  const benchmark = industryBenchmark(metadata, form.industry);
  const recommendations = [];

  if (analysis.funding.gap > 0) {
    recommendations.push(`Close the ${money(analysis.funding.gap)} funding gap with milestone-based capital for product, sales, and hiring.`);
  }
  if (Number(form.customer_growth) < Number(benchmark.growth || 20)) {
    recommendations.push(`Increase customer growth toward the ${benchmark.growth}% ${benchmark.label} benchmark before pitching growth investors.`);
  }
  if (analysis.risk.score > 60) {
    recommendations.push("Reduce risk by proving repeat revenue, lowering burn, and documenting customer retention.");
  }
  if (Number(form.competition_level) === 0) {
    recommendations.push("Create clearer differentiation because high competition is reducing the success outlook.");
  }
  if (Number(form.revenue) < 250000) {
    recommendations.push("Build stronger revenue traction before asking for a larger round.");
  }
  if (!recommendations.length) {
    recommendations.push("Prepare investor materials now: traction metrics, customer proof, use of funds, and growth plan.");
  }

  return recommendations.slice(0, 5);
}

function validateStartupInputs(form, metadata) {
  const warnings = [];
  const benchmark = industryBenchmark(metadata, form.industry);
  if (Number(form.revenue) > 0 && Number(form.team_size) <= 2 && Number(form.revenue) > 1000000) warnings.push("Revenue is very high for a tiny team. Recheck team size or revenue.");
  if (Number(form.market_size) < Number(form.revenue)) warnings.push("Market size is lower than revenue. Market size should usually be larger.");
  if (Number(form.funding_amount) > Number(form.market_size) * 0.5) warnings.push("Funding is very large compared with market size.");
  if (Number(form.customer_growth) > 100) warnings.push("Customer growth above 100% is possible, but should be justified in the report.");
  if (Number(form.founder_experience) < 1) warnings.push("Founder experience is low. Add advisors or domain experts to improve confidence.");
  if (benchmark.capital === "High" && Number(form.funding_amount) < 150000) warnings.push(`${benchmark.label} is usually capital intensive. Current funding may be low for this sector.`);
  return warnings;
}

function industryBenchmarkRows(form, analysis, metadata) {
  const benchmark = industryBenchmark(metadata, form.industry);
  return [
    { metric: "Sector", your_startup: labelFor(metadata.industries, form.industry), benchmark: benchmark.label },
    { metric: "Growth", your_startup: `${form.customer_growth}%`, benchmark: `${benchmark.growth}%` },
    { metric: "Market Size", your_startup: money(form.market_size), benchmark: money(benchmark.market) },
    { metric: "Capital Intensity", your_startup: analysis.funding.stage, benchmark: benchmark.capital },
    { metric: "Competition", your_startup: analysis.competitor.level, benchmark: benchmark.competition },
    { metric: "Success Outlook", your_startup: `${analysis.success.probability}%`, benchmark: analysis.success.probability >= 65 ? "Above target" : "Needs improvement" }
  ];
}

function riskHeatmapItems(form, analysis, metadata) {
  const benchmark = industryBenchmark(metadata, form.industry);
  const items = [
    { label: "Market Risk", score: clamp(100 - analysis.market.score, 5, 95) },
    { label: "Financial Risk", score: clamp(analysis.funding.gap / Math.max(analysis.funding.requirement, 1) * 100, 5, 95) },
    { label: "Team Risk", score: clamp(70 - Number(form.team_size) * 3 - Number(form.founder_experience) * 5, 5, 95) },
    { label: "Competition Risk", score: Number(form.competition_level) === 0 ? 82 : Number(form.competition_level) === 2 ? 52 : 24 },
    { label: "Execution Risk", score: clamp(analysis.risk.score + (benchmark.capital === "High" ? 8 : 0), 5, 95) }
  ];
  return items.map((item) => ({
    ...item,
    score: Math.round(item.score),
    level: item.score >= 70 ? "High" : item.score >= 40 ? "Medium" : "Low"
  }));
}

function financialProjectionRows(form, analysis) {
  const revenue = Number(form.revenue || 0);
  const funding = Number(form.funding_amount || 0);
  const growthRate = Number(analysis.growth.growthPercent || 12) / 100;
  return [1, 2, 3].map((year) => {
    const projectedRevenue = Math.round(revenue * Math.pow(1 + growthRate, year));
    const operatingCost = Math.round((funding * 0.28) + projectedRevenue * (0.58 - Math.min(year * 0.06, 0.15)));
    const profitLoss = projectedRevenue - operatingCost;
    return { year: `Year ${year}`, revenue: projectedRevenue, cost: operatingCost, profit_loss: profitLoss, margin: `${Math.round((profitLoss / Math.max(projectedRevenue, 1)) * 100)}%` };
  });
}

function fundingChecklistItems(form, analysis) {
  return [
    { item: "Clear startup problem and solution", done: Boolean(form.startup_description && form.startup_description.length > 40) },
    { item: "Revenue traction available", done: Number(form.revenue) >= 100000 },
    { item: "Customer growth meets investor signal", done: Number(form.customer_growth) >= 20 },
    { item: "Funding gap is explainable", done: analysis.funding.gap <= analysis.funding.requirement },
    { item: "Risk score acceptable", done: analysis.risk.score <= 60 },
    { item: "Team can execute next milestone", done: Number(form.team_size) >= 5 },
    { item: "Founder has domain experience", done: Number(form.founder_experience) >= 2 }
  ];
}

function csvRowsToForms(csvText, metadata) {
  const lines = String(csvText || "").trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((item) => item.trim().toLowerCase());
  return lines.slice(1).map((line, index) => {
    const values = line.split(",").map((item) => item.trim());
    const row = Object.fromEntries(headers.map((header, i) => [header, values[i] || ""]));
    return inferStartupDetails({
      ...initialForm,
      startup_name: row.startup_name || row.name || `CSV Startup ${index + 1}`,
      startup_description: row.startup_description || row.description || "",
      industry: valueForLabel(metadata.industries, row.industry || row.industry_name, Number(row.industry || 0)),
      funding_amount: Number(row.funding_amount || row.funding || initialForm.funding_amount),
      team_size: Number(row.team_size || initialForm.team_size),
      revenue: Number(row.revenue || initialForm.revenue),
      market_size: Number(row.market_size || initialForm.market_size),
      founder_experience: Number(row.founder_experience || initialForm.founder_experience),
      business_model: valueForLabel(metadata.business_models, row.business_model, Number(row.business_model || 0)),
      competition_level: valueForLabel(metadata.competition_levels, row.competition_level || row.competition, Number(row.competition_level || 2)),
      customer_growth: Number(row.customer_growth || initialForm.customer_growth)
    }, metadata);
  });
}

function answerStartupQuestion(question, form, analysis, metadata) {
  const cleanQuestion = String(question || "").trim();
  if (!cleanQuestion) return "Ask me about success score, funding, risk, growth, market, competition, valuation, pitch, or how to improve the startup.";

  const text = cleanQuestion.toLowerCase();
  const benchmark = industryBenchmark(metadata, form.industry);
  const narrative = buildAiNarrative(form, analysis, metadata);
  const recommendations = buildRecommendations(form, analysis, metadata);
  const riskPlan = riskImprovementPlan(form, analysis, metadata);
  const valuation = valuationEstimate(form, analysis, metadata);
  const readiness = founderReadinessScore(form, analysis);
  const decision = investmentDecision(analysis);
  const name = form.startup_name || "this startup";

  if (text.includes("score") || text.includes("success") || text.includes("probability")) {
    return `${name} has a ${analysis.success.probability}% success probability, which means: ${analysis.success.label}. Main reason: ${analysis.success.note} To improve it, focus on ${recommendations[0]}`;
  }

  if (text.includes("fund") || text.includes("investor") || text.includes("raise")) {
    return `Funding recommendation: ${analysis.funding.stage}. Estimated funding requirement is ${money(analysis.funding.requirement)}, with a current gap of ${money(analysis.funding.gap)}. Investor decision signal: ${decision.label}. ${decision.note}`;
  }

  if (text.includes("risk") || text.includes("danger") || text.includes("fail")) {
    return `${name} is currently ${analysis.risk.category} with a ${analysis.risk.score}/100 risk score. Best risk reduction steps: ${riskPlan.join(" ")}`;
  }

  if (text.includes("growth") || text.includes("revenue") || text.includes("scale")) {
    return `${analysis.growth.forecast}: projected growth is ${analysis.growth.growthPercent}%, taking revenue from ${money(form.revenue)} to about ${money(analysis.growth.projectedRevenue)}. ${narrative.growth}`;
  }

  if (text.includes("market") || text.includes("demand") || text.includes("customer")) {
    return `Market result: ${analysis.market.demand}, ${analysis.market.opportunity.toLowerCase()}. ${benchmark.label} benchmark growth is ${benchmark.growth}%. ${benchmark.trend}`;
  }

  if (text.includes("compet") || text.includes("rival")) {
    return `Competition is ${String(analysis.competitor.level).toLowerCase()}, with around ${analysis.competitor.count} estimated competitors. Current advantage signal: ${analysis.competitor.advantage}. ${analysis.competitor.note}`;
  }

  if (text.includes("valuation") || text.includes("value") || text.includes("worth")) {
    return `Estimated valuation range is ${money(valuation.low)} to ${money(valuation.high)}, with a midpoint of ${money(valuation.midpoint)}. The estimate uses revenue, funding, growth, sector intensity, and risk.`;
  }

  if (text.includes("pitch") || text.includes("deck") || text.includes("email")) {
    return `Pitch angle: lead with ${analysis.success.probability}% success probability, ${analysis.market.demand.toLowerCase()}, ${analysis.growth.forecast.toLowerCase()}, and a clear funding gap of ${money(analysis.funding.gap)}. Recommended action: ${narrative.action}`;
  }

  if (text.includes("founder") || text.includes("team") || text.includes("readiness")) {
    return `Founder readiness is ${readiness.score}/100: ${readiness.label}. Team size is ${form.team_size}, founder experience is ${form.founder_experience} years, and current revenue is ${money(form.revenue)}.`;
  }

  if (text.includes("improve") || text.includes("next") || text.includes("action") || text.includes("recommend")) {
    return `Recommended priorities: ${recommendations.join(" ")}`;
  }

  return `${narrative.headline} Quick answer: ${narrative.action} You can also ask specifically about funding, risk, growth, market, competition, valuation, pitch, or improvement.`;
}

function founderReadinessScore(form, analysis) {
  const descriptionQuality = Math.min(String(form.startup_description || "").trim().length / 3, 18);
  const score = clamp(
    Math.min(Number(form.founder_experience || 0) * 6, 24)
      + Math.min(Number(form.team_size || 0) * 1.5, 18)
      + Math.min(Number(form.revenue || 0) / 25000, 20)
      + Math.min(Number(form.customer_growth || 0) * 0.45, 16)
      + descriptionQuality
      + (analysis?.risk?.score <= 45 ? 8 : analysis?.risk?.score <= 60 ? 4 : 0),
    0,
    100
  );

  return {
    score: Math.round(score),
    label: score >= 78 ? "Investor ready founder profile" : score >= 55 ? "Promising founder profile" : "Founder profile needs strengthening"
  };
}

function investmentDecision(analysis) {
  if (!analysis) return { label: "Run Prediction", tone: "blue", note: "Submit startup details to generate a decision." };
  const probability = analysis.success.probability;
  const risk = analysis.risk.score;
  const market = analysis.market.score;

  if (probability >= 76 && risk <= 42 && market >= 68) {
    return { label: "Invest Now", tone: "green", note: "Strong success probability, acceptable risk, and attractive market signal." };
  }
  if (probability >= 58 && risk <= 62) {
    return { label: "Monitor", tone: "blue", note: "Good potential, but needs milestone tracking before a larger commitment." };
  }
  if (probability >= 42) {
    return { label: "Needs Validation", tone: "orange", note: "Improve traction, positioning, and evidence before investor outreach." };
  }
  return { label: "Avoid", tone: "red", note: "Risk and weak traction are too high for investment right now." };
}

function valuationEstimate(form, analysis, metadata) {
  if (!analysis) return null;
  const benchmark = industryBenchmark(metadata, form.industry);
  const revenue = Number(form.revenue || 0);
  const funding = Number(form.funding_amount || 0);
  const growth = Number(analysis.growth.growthPercent || 0);
  const riskDiscount = analysis.risk.score > 65 ? 0.72 : analysis.risk.score > 45 ? 0.88 : 1.05;
  const sectorMultiplier = benchmark.capital === "High" ? 5.4 : benchmark.capital === "Medium" ? 4.6 : 3.8;
  const growthPremium = 1 + Math.min(growth, 55) / 100;
  const base = Math.max(revenue * sectorMultiplier * growthPremium * riskDiscount, funding * 2.2, 150000);
  const low = Math.round(base * 0.75);
  const high = Math.round(base * 1.35);

  return {
    low,
    high,
    midpoint: Math.round((low + high) / 2),
    multiple: Number((sectorMultiplier * growthPremium * riskDiscount).toFixed(1)),
    note: `${benchmark.label} capital intensity and ${analysis.risk.category.toLowerCase()} shape this valuation band.`
  };
}

function buildPitchDeckSections(form, analysis, metadata) {
  if (!analysis) return [];
  const industry = labelFor(metadata.industries, form.industry);
  const valuation = valuationEstimate(form, analysis, metadata);
  return [
    { title: "Problem", text: form.startup_description || `${industry} customers need a better, faster, and more reliable solution.` },
    { title: "Solution", text: `${form.startup_name || "The startup"} offers a ${labelFor(metadata.business_models, form.business_model)} model for the ${industry} market.` },
    { title: "Market", text: `${money(form.market_size)} market opportunity with ${analysis.market.demand.toLowerCase()} and ${form.customer_growth}% customer growth.` },
    { title: "Traction", text: `${money(form.revenue)} revenue, ${form.team_size} team members, and ${analysis.success.probability}% predicted success probability.` },
    { title: "Competition", text: `${analysis.competitor.count} estimated competitors. Current advantage: ${analysis.competitor.advantage}.` },
    { title: "Funding Ask", text: `Recommended stage is ${analysis.funding.stage}. Funding gap is ${money(analysis.funding.gap)}.` },
    { title: "Valuation", text: `Estimated pre-money valuation band: ${money(valuation.low)} to ${money(valuation.high)}.` },
    { title: "Risk Plan", text: `${analysis.risk.category}: ${analysis.risk.note}` }
  ];
}

function riskImprovementPlan(form, analysis, metadata) {
  if (!analysis) return [];
  const benchmark = industryBenchmark(metadata, form.industry);
  const plan = [];
  if (analysis.risk.score > 60) plan.push("Reduce burn and prove repeat revenue before raising a large round.");
  if (Number(form.customer_growth) < Number(benchmark.growth || 20)) plan.push(`Move customer growth closer to the ${benchmark.growth}% ${benchmark.label} benchmark.`);
  if (Number(form.competition_level) === 0) plan.push("Create a sharper positioning statement against the highest-pressure competitors.");
  if (analysis.funding.gap > 0) plan.push(`Break the ${money(analysis.funding.gap)} funding gap into milestone-based asks.`);
  if (Number(form.founder_experience) < 4) plan.push("Add advisors or senior operators to strengthen founder readiness.");
  return (plan.length ? plan : ["Maintain low risk by tracking retention, margin, and capital efficiency monthly."]).slice(0, 5);
}

function buildInvestorEmail(form, analysis, metadata, funder) {
  if (!analysis || !funder) return "";
  const industry = labelFor(metadata.industries, form.industry);
  return `Subject: ${form.startup_name || "Startup"} - ${industry} ${analysis.funding.stage} opportunity

Hi ${funder.name} team,

I am reaching out about ${form.startup_name || "our startup"}, a ${industry} company using a ${labelFor(metadata.business_models, form.business_model)} model.

Current traction:
- Revenue: ${money(form.revenue)}
- Customer growth: ${form.customer_growth}%
- Market size: ${money(form.market_size)}
- Predicted success probability: ${analysis.success.probability}%
- Risk category: ${analysis.risk.category}

We are preparing for ${analysis.funding.stage}, with an estimated funding gap of ${money(analysis.funding.gap)}. Your focus on ${funder.focus} looks relevant for this opportunity.

Could we share a short deck for review?

Regards,
${form.startup_name || "Founder"}`;
}

function reportHtml(form, analysis, metadata, recommendations) {
  const narrative = buildAiNarrative(form, analysis, metadata);
  const explanation = analysis.explainability || fallbackExplainability(form, analysis, metadata);
  const understanding = form.startup_understanding || understandStartup(form, metadata);
  const rows = explanation.top_factors.map((factor) => (
    `<tr><td>${factor.label}</td><td>${factor.importance}%</td><td>${factor.direction}</td><td>${factor.detail}</td></tr>`
  )).join("");
  const actions = recommendations.map((item) => `<li>${item}</li>`).join("");
  const keywords = understanding.keywords.map((keyword) => `<span>${keyword}</span>`).join("");

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${form.startup_name || "Startup"} Report</title>
  <style>
    body { font-family: Arial, sans-serif; color: #07123b; margin: 32px; line-height: 1.5; }
    h1, h2 { color: #172554; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 20px 0; }
    .card { border: 1px solid #d6e0f2; border-radius: 8px; padding: 14px; background: #f8fbff; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    td, th { border: 1px solid #d6e0f2; padding: 9px; text-align: left; }
    @media print { button { display: none; } body { margin: 18mm; } }
  </style>
</head>
<body>
  <button onclick="window.print()">Save as PDF</button>
  <h1>${form.startup_name || "Startup"} Analysis Report</h1>
  <p>${form.startup_description || form.inferred_about || "Startup success prediction report."}</p>
  <h2>Startup Understanding</h2>
  <p>${understanding.summary}</p>
  <div class="grid">
    <div class="card"><strong>Detected Industry</strong><br>${understanding.industry}</div>
    <div class="card"><strong>Business Model</strong><br>${understanding.businessModel}</div>
    <div class="card"><strong>Customer Segment</strong><br>${understanding.customerSegment}</div>
    <div class="card"><strong>Understanding Confidence</strong><br>${understanding.confidence}%</div>
  </div>
  <p>${keywords ? `Matched words: ${keywords}` : "Matched words: description was general, so the selected industry was used."}</p>
  <div class="grid">
    <div class="card"><strong>Success</strong><br>${analysis.success.probability}%</div>
    <div class="card"><strong>Funding Stage</strong><br>${analysis.funding.stage}</div>
    <div class="card"><strong>Risk</strong><br>${analysis.risk.category}</div>
    <div class="card"><strong>Market</strong><br>${analysis.market.demand}</div>
    <div class="card"><strong>Growth</strong><br>${analysis.growth.forecast}</div>
    <div class="card"><strong>Funding Gap</strong><br>${money(analysis.funding.gap)}</div>
  </div>
  <h2>AI Narrative</h2>
  <p>${narrative.headline}</p>
  <p>${narrative.market}</p>
  <p>${narrative.funding}</p>
  <h2>Model Explainability</h2>
  <p>${explanation.summary}</p>
  <table><thead><tr><th>Factor</th><th>Importance</th><th>Direction</th><th>Reason</th></tr></thead><tbody>${rows}</tbody></table>
  <h2>Recommended Actions</h2>
  <ul>${actions}</ul>
</body>
</html>`;
}

function reportData(form, analysis, metadata) {
  const recommendations = buildRecommendations(form, analysis, metadata);
  const understanding = form.startup_understanding || understandStartup(form, metadata);
  return {
    startup: form.startup_name || "Startup",
    description: form.startup_description || form.inferred_about || "",
    industry: labelFor(metadata.industries, form.industry),
    business_model: labelFor(metadata.business_models, form.business_model),
    success_probability: analysis.success.probability,
    funding_stage: analysis.funding.stage,
    funding_gap: analysis.funding.gap,
    market_demand: analysis.market.demand,
    growth_forecast: analysis.growth.forecast,
    risk_category: analysis.risk.category,
    risk_score: analysis.risk.score,
    understanding_confidence: understanding.confidence,
    recommendations
  };
}

function downloadReport(form, analysis, metadata, exportFormat = "pdf") {
  const recommendations = buildRecommendations(form, analysis, metadata);
  const data = reportData(form, analysis, metadata);
  const baseName = (form.startup_name || "startup-report").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  let content = reportHtml(form, analysis, metadata, recommendations);
  let type = "text/html";
  let extension = "pdf-ready-report.html";

  if (exportFormat === "json") {
    content = JSON.stringify(data, null, 2);
    type = "application/json";
    extension = "report.json";
  }

  if (exportFormat === "csv") {
    const header = Object.keys(data).filter((key) => key !== "recommendations");
    const values = header.map((key) => `"${String(data[key] ?? "").replace(/"/g, '""')}"`);
    content = `${header.join(",")}\n${values.join(",")}\n`;
    type = "text/csv";
    extension = "report.csv";
  }

  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${baseName}-${extension}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function Header({ currentUser, onLogout, roleMode, onRoleModeChange, notifications = [] }) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="app-header">
      <div className="brand">
        <img src={projectLogo} alt="AI Startup Success Prediction System logo" />
        <div>
          <strong>AI Startup Success Prediction System</strong>
          <span>{"Startup Details -> AI Analysis -> Prediction -> Investor Reports"}</span>
        </div>
      </div>
      <div className="account">
        <span>{currentUser?.charAt(0).toUpperCase() || "U"}</span>
        <strong>{currentUser || "User"}</strong>
        <label className="role-select">
          <span>Role</span>
          <select value={roleMode} onChange={(event) => onRoleModeChange(event.target.value)}>
            <option value="founder">Founder</option>
            <option value="investor">Investor</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <div className="notification-wrap">
          <button className="notification-button" type="button" onClick={() => setShowNotifications((current) => !current)} title="Notifications">
            <Mail size={17} />
            {notifications.length > 0 && <span>{notifications.length}</span>}
          </button>
          {showNotifications && (
            <div className="notification-menu">
              <div>
                <strong>Notifications</strong>
                <small>{notifications.length ? "Latest offer activity" : "No offer activity yet"}</small>
              </div>
              {notifications.length === 0 ? (
                <p>No new investor or founder offer updates.</p>
              ) : notifications.map((item) => (
                <article className="notification-item" key={item.id}>
                  <span>{item.title}</span>
                  <p>{item.message}</p>
                  <small>{item.at ? new Date(item.at).toLocaleString() : "Just now"}</small>
                </article>
              ))}
            </div>
          )}
        </div>
        <button className="icon-text-button" type="button" onClick={onLogout} title="Logout">
          <LogOut size={17} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

function LoginScreen({ onLogin, onSignup }) {
  const [mode, setMode] = useState("login");
  const [selectedRole, setSelectedRole] = useState("founder");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const submitAccount = (event) => {
    event.preventDefault();
    const cleanName = username.trim();
    if (mode === "forgot") {
      if (!cleanName || !newPassword.trim()) {
        setMessage("Enter your username and a new password.");
        return;
      }
      const accounts = readAccounts();
      const accountId = normalizeUsername(cleanName);
      const account = accounts[accountId];
      if (!account) {
        setMessage("No account found with this username.");
        return;
      }
      if (newPassword.trim().length < 4) {
        setMessage("Use at least 4 characters for the new password.");
        return;
      }
      accounts[accountId] = { ...account, password: newPassword, passwordResetAt: new Date().toISOString() };
      writeAccounts(accounts);
      setPassword("");
      setNewPassword("");
      setMode("login");
      setMessage("Password updated. Login with your new password.");
      return;
    }

    if (!cleanName || !password.trim()) {
      setMessage("Enter both username and password.");
      return;
    }

    const result = mode === "login"
      ? onLogin(cleanName, password, selectedRole)
      : onSignup(cleanName, password, selectedRole);

    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    setMessage(result.message);
  };

  return (
    <main className="login-page">
      <section className="login-panel">
        <img src={projectLogo} alt="AI Startup Success Prediction System logo" />
        <div>
          <h1>AI Startup Success Prediction System</h1>
          <p>{mode === "forgot" ? "Reset your local account password using your username." : "Select a role, then login or create an account to open the right workspace."}</p>
        </div>

        {mode !== "forgot" && <div className="login-role-grid">
          {Object.entries(roleModeConfig).map(([role, config]) => (
            <button className={selectedRole === role ? "active" : ""} type="button" key={role} onClick={() => setSelectedRole(role)}>
              <strong>{config.label}</strong>
              <span>{roleModeInsight(role).text}</span>
            </button>
          ))}
        </div>}

        <div className="auth-toggle">
          <button className={mode === "login" ? "active" : ""} type="button" onClick={() => { setMode("login"); setMessage(""); }}>Login</button>
          <button className={mode === "signup" ? "active" : ""} type="button" onClick={() => { setMode("signup"); setMessage(""); }}>Sign Up</button>
          <button className={mode === "forgot" ? "active" : ""} type="button" onClick={() => { setMode("forgot"); setMessage(""); }}>Forgot Password</button>
        </div>

        <form onSubmit={submitAccount}>
          <label>
            User name
            <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Enter your name" />
          </label>
          {mode !== "forgot" ? <label>
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter password" />
          </label> : <label>
            New Password
            <input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="Enter new password" />
          </label>}
          {message && <p className="auth-message">{message}</p>}
          <button className="primary-button" type="submit">
            {mode === "login" ? <LogIn size={18} /> : <Save size={18} />}
            {mode === "login" ? "Login" : mode === "forgot" ? "Update Password" : "Create Account"}
          </button>
        </form>
      </section>
    </main>
  );
}

function StatCard({ icon: Icon, label, value, tone = "blue" }) {
  return (
    <article className={`stat-card ${tone}`}>
      <Icon size={20} />
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function ResultCard({ icon: Icon, title, value, note, tone }) {
  return (
    <article className={`result-card ${tone}`}>
      <div>
        <Icon size={22} />
        <h3>{title}</h3>
      </div>
      <strong>{value}</strong>
      <p>{note}</p>
    </article>
  );
}

function ObjectiveGrid() {
  return (
    <section className="objective-grid">
      {projectObjectives.map((item) => {
        const Icon = item.icon;
        return (
          <article className="objective-card" key={item.title}>
            <Icon size={21} />
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        );
      })}
    </section>
  );
}

function BusinessIntelligenceGrid() {
  return (
    <section className="challenge-section">
      <div className="section-heading">
        <BrainCircuit size={24} />
        <div>
          <h2>Business Intelligence for Startup Decisions</h2>
          <p>This AI system helps founders and investors make informed decisions using machine learning, predictive analytics, and business intelligence.</p>
        </div>
      </div>

      <div className="challenge-grid">
        {businessIntelligenceFeatures.map((item) => {
          const Icon = item.icon;
          return (
            <article className="challenge-card" key={item.title}>
              <Icon size={21} />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function StartupForm({ form, setForm, metadata, onPredict, loading, roleMode = "founder" }) {
  const selectedIndustry = industryBenchmark(metadata, form.industry);
  const selectedBusinessModel = optionFor(metadata.business_models, form.business_model);
  const warnings = validateStartupInputs(form, metadata);
  const investorReview = roleMode === "investor";
  const canEdit = (field) => !investorReview || ["funding_amount", "revenue"].includes(field);
  const update = (field, value) => {
    if (!canEdit(field)) return;
    const textFields = ["startup_name", "startup_description", "inferred_about"];
    setForm((current) => ({
      ...current,
      [field]: textFields.includes(field) ? value : Number(value)
    }));
  };

  return (
    <form className={`startup-form ${investorReview ? "investor-review-form" : ""}`} onSubmit={onPredict}>
      <div className="form-heading">
        <Target size={24} />
        <div>
          <h2>{investorReview ? "Investor Prediction Review" : "Enter Startup Details"}</h2>
          <p>{investorReview ? "Review the startup analysis by changing only funding and revenue assumptions." : "First explain what your startup is about. The system predicts the category, then analyzes everything."}</p>
        </div>
      </div>

      {investorReview && (
        <section className="readonly-note wide-field">
          <Shield size={18} />
          <p>Investor mode locks founder and business details. Edit funding amount and revenue to test investment scenarios.</p>
        </section>
      )}

      <label className="wide-field">
        What is your startup about?
        <textarea
          value={form.startup_description}
          onChange={(event) => update("startup_description", event.target.value)}
          disabled={!canEdit("startup_description")}
          placeholder="Example: An AI platform that predicts crop disease for farmers and recommends treatment using phone photos."
        />
      </label>

      <label>
        Startup Name
        <input value={form.startup_name} onChange={(event) => update("startup_name", event.target.value)} disabled={!canEdit("startup_name")} placeholder="Example: FinPulse AI" required />
      </label>

      <label>
        Industry
        <select value={form.industry} onChange={(event) => update("industry", event.target.value)} disabled={!canEdit("industry")}>
          {metadata.industries.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
        <small className="industry-hint">
          {selectedIndustry.trend} Growth benchmark: {selectedIndustry.growth}%. Capital intensity: {selectedIndustry.capital}.
        </small>
      </label>

      <label>
        Funding Amount
        <input type="number" min="0" value={form.funding_amount} onChange={(event) => update("funding_amount", event.target.value)} />
      </label>

      <label>
        Team Size
        <input type="number" min="1" value={form.team_size} onChange={(event) => update("team_size", event.target.value)} disabled={!canEdit("team_size")} />
      </label>

      <label>
        Revenue
        <input type="number" min="0" value={form.revenue} onChange={(event) => update("revenue", event.target.value)} />
      </label>

      <label>
        Market Size
        <input type="number" min="0" value={form.market_size} onChange={(event) => update("market_size", event.target.value)} disabled={!canEdit("market_size")} />
      </label>

      <label>
        Competitors
        <select value={form.competition_level} onChange={(event) => update("competition_level", event.target.value)} disabled={!canEdit("competition_level")}>
          {metadata.competition_levels.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
      </label>

      <label>
        Founder Experience
        <input type="number" min="0" value={form.founder_experience} onChange={(event) => update("founder_experience", event.target.value)} disabled={!canEdit("founder_experience")} />
      </label>

      <label>
        Business Model
        <select value={form.business_model} onChange={(event) => update("business_model", event.target.value)} disabled={!canEdit("business_model")}>
          {metadata.business_models.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
        {selectedBusinessModel?.meaning && <small className="industry-hint">{selectedBusinessModel.meaning}</small>}
      </label>

      <label>
        Customer Growth %
        <input type="number" min="0" value={form.customer_growth} onChange={(event) => update("customer_growth", event.target.value)} disabled={!canEdit("customer_growth")} />
      </label>

      {warnings.length > 0 && (
        <section className="validation-box wide-field">
          <strong>Input Validation</strong>
          {warnings.map((warning) => <p key={warning}>{warning}</p>)}
        </section>
      )}

      <button className="primary-button" type="submit" disabled={loading}>
        {loading ? "Analyzing..." : investorReview ? "Run Investor Scenario Analysis" : "Predict What It Is & Analyze"}
      </button>
    </form>
  );
}

function FunderList({ funders, requests, onRequestFunds, industryName }) {
  return (
    <section className="funder-list">
      <div className="section-heading">
        <Users size={22} />
        <div>
          <h3>Best Funders for {industryName}</h3>
          <p>Investors are ranked by industry focus, related-sector fit, funding ticket size, and startup stage.</p>
        </div>
      </div>

      <div className="funder-grid">
        {funders.map((funder) => (
          <article className="funder-card" key={funder.name}>
            <div>
              <strong>{funder.name}</strong>
              <span>{funder.status}</span>
            </div>
            <p>{funder.focus}</p>
            <p className="match-reason">{funder.matchReason}</p>
            <dl>
              <div>
                <dt>Stage</dt>
                <dd>{funder.stage}</dd>
              </div>
              <div>
                <dt>Ticket</dt>
                <dd>{money(funder.ticket)}</dd>
              </div>
              <div>
                <dt>Match</dt>
                <dd>{funder.matchScore}%</dd>
              </div>
            </dl>
            <button className={requests[funder.name] ? "request-button sent" : "request-button"} type="button" onClick={() => onRequestFunds(funder)}>
              {requests[funder.name] ? "Request Sent" : "Request Funds"}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function MarketGrowthChart({ form, analysis, chartStyle = "water" }) {
  const data = marketProjectionData(form, analysis);
  const latest = data[data.length - 1];
  const isProfit = latest.profitLoss >= 0;
  const topOpacity = chartStyle === "area" ? 0.54 : chartStyle === "water" ? 0.3 : 0;
  const bottomOpacity = chartStyle === "area" ? 0.14 : chartStyle === "water" ? 0.04 : 0;

  return (
    <section className="market-chart-panel">
      <div className="section-heading">
        <BarChart3 size={22} />
        <div>
          <h3>Market Cap, Consumers & Profit/Loss Growth</h3>
          <p>Realistic projection from revenue, cost pressure, customer growth, competition, risk, and success score.</p>
        </div>
      </div>

      <div className="market-metrics">
        <StatCard icon={DollarSign} label="Future Market Cap" value={money(latest.marketCap)} tone="blue" />
        <StatCard icon={Users} label="Future Consumers" value={compactNumber(latest.consumers)} tone="green" />
        <StatCard icon={isProfit ? TrendingUp : AlertTriangle} label={isProfit ? "Projected Profit" : "Projected Loss"} value={money(latest.profitLoss)} tone={isProfit ? "green" : "red"} />
      </div>

      <div className="chart-box">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data} margin={{ top: 12, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="marketCapFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.blue} stopOpacity={topOpacity} />
                <stop offset="95%" stopColor={chartColors.blue} stopOpacity={bottomOpacity} />
              </linearGradient>
              <linearGradient id="consumerFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.purple} stopOpacity={topOpacity} />
                <stop offset="95%" stopColor={chartColors.purple} stopOpacity={bottomOpacity} />
              </linearGradient>
              <linearGradient id="profitFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isProfit ? chartColors.success : chartColors.danger} stopOpacity={topOpacity} />
                <stop offset="95%" stopColor={isProfit ? chartColors.success : chartColors.danger} stopOpacity={bottomOpacity} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={chartColors.grid} strokeDasharray="4 4" />
            <XAxis dataKey="year" tickLine={false} axisLine={false} />
            <YAxis yAxisId="money" tickFormatter={money} tickLine={false} axisLine={false} width={72} />
            <YAxis yAxisId="growth" orientation="right" tickFormatter={(value) => `${value}%`} tickLine={false} axisLine={false} width={48} />
            <Tooltip
              formatter={(value, name) => {
                if (name === "marketCap") return [money(value), "Market Cap"];
                if (name === "consumers") return [compactNumber(value), "Consumers"];
                if (name === "profitLoss") return [money(value), value >= 0 ? "Profit" : "Loss"];
                return [`${value}%`, "Growth Rate"];
              }}
              labelFormatter={(label) => `Year ${label}`}
            />
            <Area yAxisId="money" type="monotone" dataKey="marketCap" stroke={chartColors.blue} fill="url(#marketCapFill)" strokeWidth={3} />
            <Area yAxisId="money" type="monotone" dataKey="consumers" stroke={chartColors.purple} fill="url(#consumerFill)" strokeWidth={3} />
            <Area yAxisId="money" type="monotone" dataKey="profitLoss" stroke={isProfit ? chartColors.success : chartColors.danger} fill="url(#profitFill)" strokeWidth={3} />
            <Line yAxisId="growth" type="monotone" dataKey="growth" stroke={chartColors.purpleSoft} strokeWidth={3} dot={{ r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function InvestorScenarioGraph({ form, metadata, sensitivity = "balanced" }) {
  const baseFunding = Math.max(Number(form.funding_amount || 0), 1);
  const baseRevenue = Math.max(Number(form.revenue || 0), 1);
  const scenarioData = [0.6, 0.8, 1, 1.2, 1.5].map((multiplier) => {
    const scenarioForm = {
      ...form,
      funding_amount: Math.round(baseFunding * multiplier),
      revenue: Math.round(baseRevenue * multiplier)
    };
    const scenarioAnalysis = analyzeStartup(scenarioForm, metadata, fallbackPrediction(scenarioForm), sensitivity);
    const valuation = valuationEstimate(scenarioForm, scenarioAnalysis, metadata);
    return {
      scenario: `${Math.round(multiplier * 100)}%`,
      success: scenarioAnalysis.success.probability,
      risk: scenarioAnalysis.risk.score,
      valuation: valuation?.midpoint || 0,
      funding: scenarioForm.funding_amount,
      revenue: scenarioForm.revenue
    };
  });

  return (
    <section className="market-chart-panel investor-scenario-graph">
      <div className="section-heading">
        <LineChart size={22} />
        <div>
          <h3>Investor Funding & Revenue Scenario Graph</h3>
          <p>Shows how success, risk, and valuation move when only funding and revenue assumptions change.</p>
        </div>
      </div>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={scenarioData} margin={{ top: 12, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="investorSuccessFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.success} stopOpacity={0.28} />
                <stop offset="95%" stopColor={chartColors.success} stopOpacity={0.04} />
              </linearGradient>
              <linearGradient id="investorRiskFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.danger} stopOpacity={0.22} />
                <stop offset="95%" stopColor={chartColors.danger} stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={chartColors.grid} strokeDasharray="4 4" />
            <XAxis dataKey="scenario" tickLine={false} axisLine={false} />
            <YAxis yAxisId="score" tickFormatter={(value) => `${value}%`} tickLine={false} axisLine={false} width={48} />
            <YAxis yAxisId="money" orientation="right" tickFormatter={money} tickLine={false} axisLine={false} width={76} />
            <Tooltip
              formatter={(value, name) => {
                if (name === "success") return [`${value}%`, "Success Probability"];
                if (name === "risk") return [`${value}/100`, "Risk Score"];
                if (name === "valuation") return [money(value), "Valuation"];
                if (name === "funding") return [money(value), "Funding"];
                if (name === "revenue") return [money(value), "Revenue"];
                return [value, name];
              }}
              labelFormatter={(label) => `Funding & revenue at ${label} of current values`}
            />
            <Area yAxisId="score" type="monotone" dataKey="success" stroke={chartColors.success} fill="url(#investorSuccessFill)" strokeWidth={3} dot={{ r: 4 }} />
            <Area yAxisId="score" type="monotone" dataKey="risk" stroke={chartColors.danger} fill="url(#investorRiskFill)" strokeWidth={3} dot={{ r: 4 }} />
            <Line yAxisId="money" type="monotone" dataKey="valuation" stroke={chartColors.purple} strokeWidth={3} dot={{ r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function ExplainabilityPanel({ form, analysis, metadata }) {
  if (!analysis) return null;
  const explanation = analysis.explainability || fallbackExplainability(form, analysis, metadata);

  return (
    <section className="insight-block">
      <div className="section-heading">
        <BrainCircuit size={22} />
        <div>
          <h3>Model Explainability</h3>
          <p>{explanation.summary} Confidence level: {explanation.confidence}.</p>
        </div>
      </div>
      <div className="explainability-list">
        {explanation.top_factors.map((factor) => (
          <article className={`explainability-item ${factor.direction}`} key={factor.label}>
            <div>
              <strong>{factor.label}</strong>
              <span>{factor.importance}% importance</span>
            </div>
            <p>{factor.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function RecommendationsPanel({ form, analysis, metadata }) {
  if (!analysis) return null;
  const recommendations = buildRecommendations(form, analysis, metadata);

  return (
    <section className="insight-block">
      <div className="section-heading">
        <Target size={22} />
        <div>
          <h3>AI Recommendations</h3>
          <p>Next actions generated from risk, growth, funding gap, competition, and market benchmarks.</p>
        </div>
      </div>
      <div className="recommendation-list">
        {recommendations.map((item, index) => (
          <article key={item}>
            <span>{index + 1}</span>
            <p>{item}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function StartupUnderstandingPanel({ form, metadata }) {
  const understanding = form.startup_understanding || understandStartup(form, metadata);

  return (
    <section className="insight-block">
      <div className="section-heading">
        <BrainCircuit size={22} />
        <div>
          <h3>Startup Understanding</h3>
          <p>The system reads the startup description before generating prediction and reports.</p>
        </div>
      </div>
      <div className="understanding-grid">
        <article>
          <span>Detected Industry</span>
          <strong>{understanding.industry}</strong>
        </article>
        <article>
          <span>Business Model</span>
          <strong>{understanding.businessModel}</strong>
        </article>
        <article>
          <span>Customer Segment</span>
          <strong>{understanding.customerSegment}</strong>
        </article>
        <article>
          <span>Confidence</span>
          <strong>{understanding.confidence}%</strong>
        </article>
      </div>
      <p className="understanding-summary">{understanding.summary}</p>
      {understanding.keywords.length > 0 && (
        <div className="keyword-list">
          {understanding.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}
        </div>
      )}
    </section>
  );
}

function ComparisonPage({ currentReport, savedReports, onOpenReport }) {
  const reports = currentReport ? [currentReport, ...savedReports.filter((report) => report.id !== currentReport.id)] : savedReports;
  const selected = reports.slice(0, 3);

  return (
    <InsightPage title="Startup Comparison" icon={GitCompare}>
      <p>Compare up to three recent or saved startups by success, funding need, market strength, growth, and risk.</p>
      {selected.length === 0 ? (
        <section className="empty-mini">
          <GitCompare size={26} />
          <p>Save a few reports first, then this page becomes a side-by-side decision board.</p>
        </section>
      ) : (
        <section className="comparison-grid">
          {selected.map((report) => (
            <article className="comparison-card" key={report.id}>
              <span>{report.industryName}</span>
              <h3>{report.startupName}</h3>
              <dl>
                <div><dt>Success</dt><dd>{report.analysis.success.probability}%</dd></div>
                <div><dt>Risk</dt><dd>{report.analysis.risk.category}</dd></div>
                <div><dt>Funding Gap</dt><dd>{money(report.analysis.funding.gap)}</dd></div>
                <div><dt>Market</dt><dd>{report.analysis.market.demand}</dd></div>
                <div><dt>Growth</dt><dd>{report.analysis.growth.forecast}</dd></div>
              </dl>
              <button className="secondary-button" type="button" onClick={() => onOpenReport(report)}>Open Report</button>
            </article>
          ))}
        </section>
      )}
    </InsightPage>
  );
}

function AnalyticsDashboard({ analytics, summary, chartStyle = "water" }) {
  const industryData = analytics?.industry_performance || [];
  const riskData = summary?.risk_distribution
    ? Object.entries(summary.risk_distribution).map(([name, value]) => ({ name, value }))
    : [];
  const topOpacity = chartStyle === "area" ? 0.58 : chartStyle === "water" ? 0.4 : 0;
  const bottomOpacity = chartStyle === "area" ? 0.16 : chartStyle === "water" ? 0.05 : 0;

  return (
    <InsightPage title="Dashboard Analytics" icon={Activity}>
      <p>Portfolio-level charts for industry success, average funding, risk distribution, high-risk startups, and growth leaders.</p>
      <div className="analytics-grid">
        <section className="analytics-card wide">
          <h3>Industry Success Rate</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={industryData.slice(0, 12)}>
              <defs>
                <linearGradient id="successWaterShade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors.blue} stopOpacity={topOpacity} />
                  <stop offset="95%" stopColor={chartColors.blue} stopOpacity={bottomOpacity} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={chartColors.grid} strokeDasharray="4 4" />
              <XAxis dataKey="industry_name" tickLine={false} axisLine={false} />
              <YAxis tickFormatter={(value) => `${value}%`} tickLine={false} axisLine={false} />
              <Tooltip formatter={(value) => [`${value}%`, "Success Rate"]} />
              <Area type="monotone" dataKey="success_rate" stroke={chartColors.blue} strokeWidth={3} fill="url(#successWaterShade)" dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </section>

        <section className="analytics-card">
          <h3>Average Funding</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={industryData.slice(0, 8)}>
              <defs>
                <linearGradient id="fundingWaterShade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors.purple} stopOpacity={topOpacity} />
                  <stop offset="95%" stopColor={chartColors.purple} stopOpacity={bottomOpacity} />
                </linearGradient>
              </defs>
              <XAxis dataKey="industry_name" tickLine={false} axisLine={false} />
              <YAxis tickFormatter={money} tickLine={false} axisLine={false} width={72} />
              <Tooltip formatter={(value) => [money(value), "Avg Funding"]} />
              <Area type="monotone" dataKey="avg_funding" stroke={chartColors.purple} strokeWidth={3} fill="url(#fundingWaterShade)" dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </section>

        <section className="analytics-card">
          <h3>Risk Mix</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={riskData} dataKey="value" nameKey="name" outerRadius={86} label>
                {riskData.map((entry) => <Cell key={entry.name} fill={riskColorFor(entry.name)} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </section>
      </div>

      <div className="table-grid">
        <DataTable title="Top Growth Startups" rows={analytics?.top_growth_startups || []} columns={["startup_name", "industry_name", "growth_score", "growth_forecast", "revenue"]} />
        <DataTable title="Highest Risk Startups" rows={analytics?.high_risk_startups || []} columns={["startup_name", "industry_name", "risk_score", "risk_category", "funding_amount"]} />
      </div>
    </InsightPage>
  );
}

function DataTable({ title, rows, columns }) {
  return (
    <section className="data-table-card">
      <h3>{title}</h3>
      <div className="data-table-wrap">
        <table>
          <thead>
            <tr>{columns.map((column) => <th key={column}>{column.replace(/_/g, " ")}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${title}-${index}`}>
                {columns.map((column) => (
                  <td key={column}>{column.includes("funding") || column === "revenue" || column === "cost" || column.includes("profit") ? money(row[column]) : row[column]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ModelMetricsPage({ metrics, chartStyle = "water" }) {
  const featureData = metrics?.feature_importance || [];
  const report = metrics?.classification_report || {};
  const positive = report["1"] || report[1] || {};
  const negative = report["0"] || report[0] || {};
  const matrix = metrics?.confusion_matrix || [[0, 0], [0, 0]];
  const topOpacity = chartStyle === "area" ? 0.58 : chartStyle === "water" ? 0.4 : 0;
  const bottomOpacity = chartStyle === "area" ? 0.16 : chartStyle === "water" ? 0.05 : 0;
  const correctlyRejected = matrix?.[0]?.[0] ?? 0;
  const falseAlarm = matrix?.[0]?.[1] ?? 0;
  const missedSuccess = matrix?.[1]?.[0] ?? 0;
  const correctlyApproved = matrix?.[1]?.[1] ?? 0;

  return (
    <InsightPage title="Model Accuracy" icon={Shield}>
      <p>Evaluation summary from the processed startup dataset and trained Random Forest classifier.</p>
      <section className="stats-grid compact">
        <StatCard icon={Activity} label="Accuracy" value={metrics ? `${metrics.accuracy}%` : "--"} tone="green" />
        <StatCard icon={FileText} label="Dataset Rows" value={metrics?.dataset_rows ?? "--"} tone="blue" />
        <StatCard icon={Target} label="Test Rows" value={metrics?.test_rows ?? "--"} tone="violet" />
        <StatCard icon={CheckCircle2} label="Success Recall" value={positive.recall !== undefined ? `${Math.round(positive.recall * 100)}%` : "--"} tone="green" />
      </section>

      <div className="analytics-grid">
        <section className="analytics-card wide">
          <h3>Feature Importance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={featureData}>
              <defs>
                <linearGradient id="importanceWaterShade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors.purple} stopOpacity={topOpacity} />
                  <stop offset="95%" stopColor={chartColors.purple} stopOpacity={bottomOpacity} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={chartColors.grid} strokeDasharray="4 4" />
              <XAxis dataKey="feature" tickLine={false} axisLine={false} />
              <YAxis tickFormatter={(value) => `${value}%`} tickLine={false} axisLine={false} />
              <Tooltip formatter={(value) => [`${value}%`, "Importance"]} />
              <Area type="monotone" dataKey="importance" stroke={chartColors.purple} strokeWidth={3} fill="url(#importanceWaterShade)" dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </section>
        <section className="analytics-card">
          <h3>Prediction Check</h3>
          <p>This shows how many test startups the model judged correctly or incorrectly.</p>
          <div className="matrix friendly-matrix">
            <article className="good">
              <span>Correctly rejected</span>
              <strong>{correctlyRejected}</strong>
              <p>Actually failed, predicted failed.</p>
            </article>
            <article className="warn">
              <span>False alarm</span>
              <strong>{falseAlarm}</strong>
              <p>Actually failed, predicted success.</p>
            </article>
            <article className="warn">
              <span>Missed success</span>
              <strong>{missedSuccess}</strong>
              <p>Actually succeeded, predicted failed.</p>
            </article>
            <article className="good">
              <span>Correctly approved</span>
              <strong>{correctlyApproved}</strong>
              <p>Actually succeeded, predicted success.</p>
            </article>
          </div>
          <p>Simple meaning: green boxes are correct predictions. Warning boxes are mistakes the model made during testing.</p>
        </section>
        <section className="analytics-card">
          <h3>Class Quality</h3>
          <p>Failed startup precision: {negative.precision !== undefined ? `${Math.round(negative.precision * 100)}%` : "--"}</p>
          <p>Successful startup precision: {positive.precision !== undefined ? `${Math.round(positive.precision * 100)}%` : "--"}</p>
          <p>Successful startup F1: {positive["f1-score"] !== undefined ? `${Math.round(positive["f1-score"] * 100)}%` : "--"}</p>
        </section>
      </div>
    </InsightPage>
  );
}

function PitchDeckPanel({ form, analysis, metadata }) {
  const sections = buildPitchDeckSections(form, analysis, metadata);
  return (
    <section className="insight-block">
      <div className="section-heading">
        <ClipboardList size={22} />
        <div>
          <h3>Pitch Deck Generator</h3>
          <p>Auto-created outline for founder or investor presentations.</p>
        </div>
      </div>
      <div className="deck-grid">
        {sections.map((section, index) => (
          <article className="deck-card" key={section.title}>
            <span>Slide {index + 1}</span>
            <h4>{section.title}</h4>
            <p>{section.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function WhatIfSimulator({ form, metadata }) {
  const [scenario, setScenario] = useState(form);

  useEffect(() => {
    setScenario(form);
  }, [form]);

  const update = (field, value) => {
    setScenario((current) => ({ ...current, [field]: Number(value) }));
  };
  const scenarioAnalysis = analyzeStartup(scenario, metadata, fallbackPrediction(scenario));
  const decision = investmentDecision(scenarioAnalysis);
  const valuation = valuationEstimate(scenario, scenarioAnalysis, metadata);

  return (
    <section className="insight-block">
      <div className="section-heading">
        <SlidersHorizontal size={22} />
        <div>
          <h3>What-If Simulator</h3>
          <p>Change key inputs and instantly see how the startup outlook changes.</p>
        </div>
      </div>
      <div className="simulator-grid">
        <label>
          Revenue
          <input type="number" min="0" value={scenario.revenue} onChange={(event) => update("revenue", event.target.value)} />
        </label>
        <label>
          Funding
          <input type="number" min="0" value={scenario.funding_amount} onChange={(event) => update("funding_amount", event.target.value)} />
        </label>
        <label>
          Team Size
          <input type="number" min="1" value={scenario.team_size} onChange={(event) => update("team_size", event.target.value)} />
        </label>
        <label>
          Customer Growth %
          <input type="number" min="0" value={scenario.customer_growth} onChange={(event) => update("customer_growth", event.target.value)} />
        </label>
      </div>
      <div className="result-grid tool-results">
        <ResultCard icon={Target} title="Simulated Success" value={`${scenarioAnalysis.success.probability}%`} note={scenarioAnalysis.success.note} tone="green" />
        <ResultCard icon={Shield} title="Decision" value={decision.label} note={decision.note} tone={decision.tone} />
        <ResultCard icon={Calculator} title="Valuation Estimate" value={money(valuation.midpoint)} note={`${money(valuation.low)} to ${money(valuation.high)} range.`} tone="violet" />
        <ResultCard icon={DollarSign} title="Funding Gap" value={money(scenarioAnalysis.funding.gap)} note={scenarioAnalysis.funding.note} tone="blue" />
      </div>
    </section>
  );
}

function InvestorEmailPanel({ form, analysis, metadata, funders }) {
  const [selectedName, setSelectedName] = useState(funders[0]?.name || "");
  const selectedFunder = funders.find((funder) => funder.name === selectedName) || funders[0];

  useEffect(() => {
    if (!funders.some((funder) => funder.name === selectedName)) {
      setSelectedName(funders[0]?.name || "");
    }
  }, [funders, selectedName]);

  return (
    <section className="insight-block">
      <div className="section-heading">
        <Mail size={22} />
        <div>
          <h3>Investor Email Generator</h3>
          <p>Create a short pitch email for a matched funding company.</p>
        </div>
      </div>
      <label className="tool-select">
        Select investor
        <select value={selectedName} onChange={(event) => setSelectedName(event.target.value)}>
          {funders.map((funder) => <option key={funder.name} value={funder.name}>{funder.name}</option>)}
        </select>
      </label>
      <pre className="email-preview">{buildInvestorEmail(form, analysis, metadata, selectedFunder)}</pre>
    </section>
  );
}

function RiskHeatmapPanel({ form, analysis, metadata }) {
  const items = riskHeatmapItems(form, analysis, metadata);
  return (
    <section className="insight-block">
      <div className="section-heading">
        <AlertTriangle size={22} />
        <div>
          <h3>Risk Heatmap</h3>
          <p>Visual risk split across market, finance, team, competition, and execution.</p>
        </div>
      </div>
      <div className="heatmap-grid">
        {items.map((item) => (
          <article className={`heatmap-item ${item.level.toLowerCase()}`} key={item.label}>
            <span>{item.label}</span>
            <strong>{item.score}/100</strong>
            <p>{item.level} risk</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function FinancialProjectionPanel({ form, analysis }) {
  const rows = financialProjectionRows(form, analysis);
  return (
    <section className="insight-block">
      <div className="section-heading">
        <Calculator size={22} />
        <div>
          <h3>3-Year Financial Projection</h3>
          <p>Estimated revenue, operating cost, profit/loss, and margin.</p>
        </div>
      </div>
      <div className="data-table-wrap">
        <table>
          <thead><tr><th>Year</th><th>Revenue</th><th>Cost</th><th>Profit/Loss</th><th>Margin</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.year}>
                <td>{row.year}</td>
                <td>{money(row.revenue)}</td>
                <td>{money(row.cost)}</td>
                <td>{money(row.profit_loss)}</td>
                <td>{row.margin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function FundingReadinessChecklist({ form, analysis }) {
  const items = fundingChecklistItems(form, analysis);
  const complete = items.filter((item) => item.done).length;
  return (
    <section className="insight-block">
      <div className="section-heading">
        <ClipboardList size={22} />
        <div>
          <h3>Funding Readiness Checklist</h3>
          <p>{complete} of {items.length} investor-readiness checks are complete.</p>
        </div>
      </div>
      <div className="checklist-grid">
        {items.map((item) => (
          <article className={item.done ? "done" : "pending"} key={item.item}>
            <CheckCircle2 size={18} />
            <span>{item.item}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function ToolsPage({ form, analysis, metadata, funders }) {
  if (!analysis) {
    return (
      <InsightPage title="Startup Tools" icon={SlidersHorizontal}>
        <section className="empty-mini">
          <SlidersHorizontal size={26} />
          <p>Run a prediction first to unlock the simulator, pitch deck, valuation, email generator, and risk plan.</p>
        </section>
      </InsightPage>
    );
  }

  const readiness = founderReadinessScore(form, analysis);
  const decision = investmentDecision(analysis);
  const valuation = valuationEstimate(form, analysis, metadata);
  const riskPlan = riskImprovementPlan(form, analysis, metadata);

  return (
    <InsightPage title="Startup Tools" icon={SlidersHorizontal}>
      <p>Extra founder and investor tools generated from the latest startup prediction.</p>
      <div className="result-grid tool-results">
        <ResultCard icon={Users} title="Founder Readiness" value={`${readiness.score}/100`} note={readiness.label} tone="blue" />
        <ResultCard icon={Shield} title="Investment Decision" value={decision.label} note={decision.note} tone={decision.tone} />
        <ResultCard icon={Calculator} title="Valuation Estimate" value={money(valuation.midpoint)} note={`${money(valuation.low)} to ${money(valuation.high)} range. ${valuation.note}`} tone="violet" />
        <ResultCard icon={AlertTriangle} title="Risk Plan" value={`${riskPlan.length} actions`} note={riskPlan[0]} tone="orange" />
      </div>
      <WhatIfSimulator form={form} metadata={metadata} />
      <RiskHeatmapPanel form={form} analysis={analysis} metadata={metadata} />
      <FinancialProjectionPanel form={form} analysis={analysis} />
      <FundingReadinessChecklist form={form} analysis={analysis} />
      <PitchDeckPanel form={form} analysis={analysis} metadata={metadata} />
      <InvestorEmailPanel form={form} analysis={analysis} metadata={metadata} funders={funders} />
      <section className="insight-block">
        <div className="section-heading">
          <AlertTriangle size={22} />
          <div>
            <h3>Risk Improvement Plan</h3>
            <p>Steps to move the startup toward a lower risk category.</p>
          </div>
        </div>
        <div className="recommendation-list">
          {riskPlan.map((item, index) => (
            <article key={item}>
              <span>{index + 1}</span>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>
    </InsightPage>
  );
}

function BatchPredictionPanel({ metadata, onBatchPredictions }) {
  const [batchRows, setBatchRows] = useState([]);
  const [message, setMessage] = useState("Upload CSV with columns like startup_name, industry, funding_amount, team_size, revenue, market_size, founder_experience, business_model, competition_level, customer_growth.");

  const uploadCsv = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const forms = csvRowsToForms(text, metadata);
    const rows = forms.map((startupForm) => {
      const analysis = analyzeStartup(startupForm, metadata, fallbackPrediction(startupForm));
      return {
        startup_name: startupForm.startup_name,
        industry_name: labelFor(metadata.industries, startupForm.industry),
        success_probability: analysis.success.probability,
        funding_stage: analysis.funding.stage,
        risk_category: analysis.risk.category,
        growth_forecast: analysis.growth.forecast,
        funding_gap: analysis.funding.gap,
        form: startupForm,
        analysis
      };
    });
    setBatchRows(rows);
    onBatchPredictions(rows);
    setMessage(rows.length ? `${rows.length} startups predicted from CSV.` : "No valid startup rows found in CSV.");
  };

  return (
    <section className="insight-block">
      <div className="section-heading">
        <Database size={22} />
        <div>
          <h3>CSV Batch Prediction Upload</h3>
          <p>Upload multiple startups and generate batch prediction results locally.</p>
        </div>
      </div>
      <label className="file-upload">
        Upload startup CSV
        <input type="file" accept=".csv,text/csv" onChange={uploadCsv} />
      </label>
      <p className="settings-info-note">{message}</p>
      {batchRows.length > 0 && (
        <DataTable
          title={`Batch Results (${batchRows.length})`}
          rows={batchRows}
          columns={["startup_name", "industry_name", "success_probability", "funding_stage", "risk_category", "growth_forecast", "funding_gap"]}
        />
      )}
    </section>
  );
}

function ModelRetrainingPanel({ startupData, predictionHistory }) {
  const [result, setResult] = useState("");
  const retrainModel = () => {
    const datasetRows = Array.isArray(startupData) ? startupData.length : 0;
    const historyRows = predictionHistory.length;
    const readiness = datasetRows + historyRows >= 50 ? "Ready for retraining" : "Demo retrain complete, but more data is recommended";
    setResult(`${readiness}. Training rows available: ${datasetRows + historyRows}. Last retrain check: ${new Date().toLocaleString()}.`);
  };

  return (
    <section className="insight-block">
      <div className="section-heading">
        <BrainCircuit size={22} />
        <div>
          <h3>Model Retraining Control</h3>
          <p>Admin action to review whether enough new startup data exists for retraining.</p>
        </div>
      </div>
      <button className="secondary-button" type="button" onClick={retrainModel}>Run Retraining Check</button>
      {result && <p className="save-confirmation">{result}</p>}
    </section>
  );
}

function AdminDatasetPage({ startupData, metadata, predictionHistory, onBatchPredictions }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("startup_name");
  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return [...(startupData || [])]
      .filter((row) => !needle || `${row.startup_name} ${row.industry_name} ${row.risk_category} ${row.performance_status}`.toLowerCase().includes(needle))
      .sort((a, b) => {
        const left = a[sortKey];
        const right = b[sortKey];
        if (typeof left === "number" && typeof right === "number") return right - left;
        return String(left || "").localeCompare(String(right || ""));
      })
      .slice(0, 60);
  }, [query, sortKey, startupData]);

  return (
    <InsightPage title="Admin Dataset" icon={Database}>
      <p>Browse stored startups with search and sorting for project review or admin analysis.</p>
      <BatchPredictionPanel metadata={metadata} onBatchPredictions={onBatchPredictions} />
      <ModelRetrainingPanel startupData={startupData} predictionHistory={predictionHistory} />
      <section className="admin-controls">
        <label>
          Search
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, industry, status, risk" />
        </label>
        <label>
          Sort by
          <select value={sortKey} onChange={(event) => setSortKey(event.target.value)}>
            <option value="startup_name">Startup Name</option>
            <option value="success">Success</option>
            <option value="funding_amount">Funding</option>
            <option value="revenue">Revenue</option>
            <option value="risk_score">Risk Score</option>
            <option value="market_score">Market Score</option>
          </select>
        </label>
      </section>
      <DataTable
        title={`Stored Startups (${rows.length})`}
        rows={rows}
        columns={["startup_name", "industry_name", "performance_status", "success", "funding_amount", "revenue", "risk_score", "risk_category", "market_score"]}
      />
      <DataTable
        title={`Prediction History (${predictionHistory.length})`}
        rows={predictionHistory.slice(0, 25)}
        columns={["startup_name", "industry_name", "success_probability", "funding_stage", "risk_category", "created_at"]}
      />
    </InsightPage>
  );
}

function AiChatAssistant({ form, analysis, metadata }) {
  const quickQuestions = [
    "How can I improve my score?",
    "Is this startup ready for funding?",
    "What is the biggest risk?",
    "Give me a pitch angle"
  ];
  const [messages, setMessages] = useState(() => ([
    {
      role: "assistant",
      text: `Ask me anything about ${form.startup_name || "this startup"}: score, risk, funding, growth, market, competitors, valuation, or pitch.`
    }
  ]));
  const [question, setQuestion] = useState("");

  const askAssistant = (nextQuestion) => {
    const cleanQuestion = String(nextQuestion || "").trim();
    if (!cleanQuestion) return;

    const answer = answerStartupQuestion(cleanQuestion, form, analysis, metadata);
    setMessages((current) => [
      ...current,
      { role: "user", text: cleanQuestion },
      { role: "assistant", text: answer }
    ]);
    setQuestion("");
  };

  const submitQuestion = (event) => {
    event.preventDefault();
    askAssistant(question);
  };

  return (
    <section className="ai-chat-card">
      <div className="ai-analysis-heading">
        <BrainCircuit size={24} />
        <div>
          <h3>AI Chat Assistant</h3>
          <p>Ask startup-specific questions based on the latest prediction.</p>
        </div>
      </div>

      <div className="chat-quick-row">
        <label className="chat-question-select">
          <span>Access questions</span>
          <select value="" onChange={(event) => askAssistant(event.target.value)}>
            <option value="" disabled>Select a question</option>
            {quickQuestions.map((item) => (
              <option value={item} key={item}>{item}</option>
            ))}
          </select>
        </label>
        {quickQuestions.map((item) => (
          <button className="chat-chip" type="button" onClick={() => askAssistant(item)} key={item}>{item}</button>
        ))}
      </div>

      <div className="chat-thread">
        {messages.map((message, index) => (
          <article className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>
            <span>{message.role === "assistant" ? "AI Assistant" : "You"}</span>
            <p>{message.text}</p>
          </article>
        ))}
      </div>

      <form className="chat-input-row" onSubmit={submitQuestion}>
        <input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask: What should I improve before fundraising?" />
        <button className="primary-button" type="submit">Ask AI</button>
      </form>
    </section>
  );
}

function AiAnalysisPanel({ form, analysis, metadata }) {
  const [generated, setGenerated] = useState(false);
  const narrative = buildAiNarrative(form, analysis, metadata);

  if (!analysis) {
    return (
      <InsightPage title="AI Analysis" icon={BrainCircuit}>
        <section className="empty-mini">
          <BrainCircuit size={26} />
          <p>Run a startup prediction first. Then AI Analysis will describe the company growth, market opportunity, funding readiness, competition, and risk.</p>
        </section>
      </InsightPage>
    );
  }

  return (
    <InsightPage title="AI Analysis" icon={BrainCircuit}>
      <p>Use this option to generate a simple explanation about the startup growth and investment condition.</p>
      <button className="secondary-button" type="button" onClick={() => setGenerated(true)}>Generate AI Growth Analysis</button>

      {generated && (
        <section className="ai-analysis-card">
          <div className="ai-analysis-heading">
            <BrainCircuit size={24} />
            <div>
              <h3>{narrative.headline}</h3>
              <p>{form.startup_description || "Generated from startup details and prediction results."}</p>
            </div>
          </div>

          <div className="ai-analysis-grid">
            <article><strong>Growth Description</strong><p>{narrative.growth}</p></article>
            <article><strong>Market Opportunity</strong><p>{narrative.market}</p></article>
            <article><strong>Funding Readiness</strong><p>{narrative.funding}</p></article>
            <article><strong>Competitor View</strong><p>{narrative.competition}</p></article>
            <article><strong>Risk Summary</strong><p>{narrative.risk}</p></article>
            <article className="next-action"><strong>Recommended Action</strong><p>{narrative.action}</p></article>
          </div>
        </section>
      )}
      <AiChatAssistant form={form} analysis={analysis} metadata={metadata} />
    </InsightPage>
  );
}

function PredictionPanel({ form, analysis, metadata, error, onSaveReport, savedMessage, exportFormat = "pdf" }) {
  if (error) {
    return <section className="empty-panel error"><AlertTriangle /> {error}</section>;
  }

  if (!analysis) {
    return (
      <section className="empty-panel">
        <LineChart size={34} />
        <h2>{"Startup Details -> AI Analysis -> Prediction"}</h2>
        <p>Submit startup details to see success percentage, funding advice, market report, competitor analysis, growth forecast, and risk assessment.</p>
      </section>
    );
  }

  const readiness = founderReadinessScore(form, analysis);
  const decision = investmentDecision(analysis);
  const valuation = valuationEstimate(form, analysis, metadata);
  const benchmarkRows = industryBenchmarkRows(form, analysis, metadata);

  return (
    <section className="prediction-panel">
      <div className="prediction-hero">
        <div>
          <span>{form.startup_name || "Startup"}</span>
          <h1>{analysis.success.probability}%</h1>
          <p>{analysis.success.label}</p>
        </div>
        <div className="score-ring" style={{ "--score": `${analysis.success.probability}%` }}>
          <strong>{analysis.success.probability}%</strong>
          <small>Success</small>
        </div>
      </div>
      {onSaveReport && (
        <div className="report-save-row">
          <div>
            <strong>Generated report</strong>
            <p>Save this result under your logged-in user name or download a PDF-ready report.</p>
          </div>
          <div className="action-row">
            <button className="secondary-button" type="button" onClick={onSaveReport}>
              <Save size={17} />
              Save Report
            </button>
            <button className="secondary-button" type="button" onClick={() => downloadReport(form, analysis, metadata, exportFormat)}>
              <Download size={17} />
              Download {exportFormat === "pdf" ? "PDF-ready" : exportFormat.toUpperCase()} Report
            </button>
          </div>
        </div>
      )}
      {savedMessage && <p className="save-confirmation">{savedMessage}</p>}

      <StartupUnderstandingPanel form={form} metadata={metadata} />

      <div className="result-grid">
        <ResultCard icon={Target} title="Startup About" value={form.inferred_about || labelFor(fallbackMetadata.industries, form.industry)} note={form.startup_description || "The system inferred startup type from the entered business details."} tone="blue" />
        <ResultCard icon={CheckCircle2} title="Success Prediction" value={`${analysis.success.probability}%`} note={analysis.success.note} tone="green" />
        <ResultCard icon={DollarSign} title="Funding Recommendation" value={analysis.funding.stage} note={`${analysis.funding.note} Funding gap: ${money(analysis.funding.gap)}.`} tone="violet" />
        <ResultCard icon={BarChart3} title="Market Analysis" value={analysis.market.demand} note={`${analysis.market.opportunity}. ${analysis.market.note}`} tone="blue" />
        <ResultCard icon={Users} title="Competitor Analysis" value={analysis.competitor.level} note={`${analysis.competitor.advantage}. ${analysis.competitor.count} estimated competitors.`} tone="orange" />
        <ResultCard icon={TrendingUp} title="Growth Forecast" value={analysis.growth.forecast} note={`${analysis.growth.growthPercent}% projected growth. ${analysis.growth.note}`} tone="green" />
        <ResultCard icon={Shield} title="Risk Assessment" value={analysis.risk.category} note={`${analysis.risk.score}/100 risk score. ${analysis.risk.note}`} tone={riskToneFor(analysis.risk.category)} />
        <ResultCard icon={Users} title="Founder Readiness" value={`${readiness.score}/100`} note={readiness.label} tone="blue" />
        <ResultCard icon={Shield} title="Investment Decision" value={decision.label} note={decision.note} tone={decision.tone} />
        <ResultCard icon={Calculator} title="Valuation Estimate" value={money(valuation.midpoint)} note={`${money(valuation.low)} to ${money(valuation.high)} range. ${valuation.note}`} tone="violet" />
      </div>
      <UiGraphSystem form={form} analysis={analysis} metadata={metadata} />
      <section className="insight-block">
        <div className="section-heading">
          <BarChart3 size={22} />
          <div>
            <h3>Industry Benchmarking</h3>
            <p>Compare current startup signals with the selected sector benchmark.</p>
          </div>
        </div>
        <div className="data-table-wrap">
          <table>
            <thead><tr><th>Metric</th><th>Your Startup</th><th>Benchmark</th></tr></thead>
            <tbody>
              {benchmarkRows.map((row) => (
                <tr key={row.metric}><td>{row.metric}</td><td>{row.your_startup}</td><td>{row.benchmark}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <ExplainabilityPanel form={form} analysis={analysis} metadata={metadata} />
      <RecommendationsPanel form={form} analysis={analysis} metadata={metadata} />
    </section>
  );
}

function UiGraphSystem({ form, analysis, metadata }) {
  const readiness = founderReadinessScore(form, analysis);
  const valuation = valuationEstimate(form, analysis, metadata);
  const fundingGap = Number(analysis.funding.gap || 0);
  const scoreData = [
    { metric: "Success", score: analysis.success.probability, fill: chartColors.success },
    { metric: "Risk", score: analysis.risk.score, fill: riskColorFor(analysis.risk.category) },
    { metric: "Market", score: analysis.market.score, fill: chartColors.blue },
    { metric: "Growth", score: analysis.growth.growthPercent, fill: chartColors.purple },
    { metric: "Readiness", score: readiness.score, fill: chartColors.blueSoft }
  ];
  const moneyData = [
    { metric: "Funding", value: Number(form.funding_amount || 0) },
    { metric: "Revenue", value: Number(form.revenue || 0) },
    { metric: "Gap", value: fundingGap },
    { metric: "Valuation", value: valuation?.midpoint || 0 }
  ];

  return (
    <section className="insight-block graph-system">
      <div className="section-heading">
        <LineChart size={22} />
        <div>
          <h3>Graph System</h3>
          <p>Visual view of the same success, risk, funding, growth, readiness, and valuation data shown in the UI.</p>
        </div>
      </div>
      <div className="graph-system-grid">
        <article className="analytics-card">
          <h3>Prediction Scores</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={scoreData}>
              <defs>
                <linearGradient id="uiScoreFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors.blue} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={chartColors.blue} stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={chartColors.grid} strokeDasharray="4 4" />
              <XAxis dataKey="metric" tickLine={false} axisLine={false} />
              <YAxis tickFormatter={(value) => `${value}%`} tickLine={false} axisLine={false} width={48} />
              <Tooltip formatter={(value) => [`${value}`, "Score"]} />
              <Area type="monotone" dataKey="score" stroke={chartColors.blue} fill="url(#uiScoreFill)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </article>
        <article className="analytics-card">
          <h3>Money Signals</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={moneyData}>
              <defs>
                <linearGradient id="uiMoneyFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors.purple} stopOpacity={0.32} />
                  <stop offset="95%" stopColor={chartColors.purple} stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={chartColors.grid} strokeDasharray="4 4" />
              <XAxis dataKey="metric" tickLine={false} axisLine={false} />
              <YAxis tickFormatter={money} tickLine={false} axisLine={false} width={76} />
              <Tooltip formatter={(value) => [money(value), "Amount"]} />
              <Area type="monotone" dataKey="value" stroke={chartColors.purple} fill="url(#uiMoneyFill)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </article>
      </div>
    </section>
  );
}

function roleModeInsight(roleMode) {
  if (roleMode === "investor") return { title: "Investor View", text: "Focus on investment decision, risk heatmap, valuation, benchmark comparison, and funding readiness before reviewing saved startups." };
  if (roleMode === "admin") return { title: "Admin View", text: "Focus on dataset records, CSV batch prediction, prediction history, retraining checks, backup, and model metrics." };
  return { title: "Founder View", text: "Focus on improving success probability, reducing risk, preparing funding materials, and tracking next startup milestones." };
}

function RoleActions({ roleMode, setActive }) {
  const roleConfig = configForRole(roleMode);
  return (
    <div className="role-action-grid">
      {roleConfig.actions.map((action) => {
        const Icon = action.icon;
        return (
          <button type="button" key={action.id} onClick={() => setActive(action.id)}>
            <Icon size={20} />
            <span>
              <strong>{action.title}</strong>
              <small>{action.text}</small>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function InvestmentOfferForm({ startup, currentUser, onCreateOffer }) {
  const [amount, setAmount] = useState(startup.ask || 250000);
  const [equity, setEquity] = useState(8);
  const [note, setNote] = useState("");

  return (
    <div className="investment-form">
      <label>
        Amount
        <input type="number" min="0" value={amount} onChange={(event) => setAmount(event.target.value)} />
      </label>
      <label>
        Equity %
        <input type="number" min="0" max="100" step="0.1" value={equity} onChange={(event) => setEquity(event.target.value)} />
      </label>
      <label className="wide-field">
        Note
        <input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Terms, milestones, or diligence note" />
      </label>
      <button
        className="primary-button"
        type="button"
        onClick={() => onCreateOffer({
          startupName: startup.name,
          targetFounder: startup.founder || "Founder",
          investor: currentUser,
          amount: Number(amount || 0),
          equity: Number(equity || 0),
          note: note || "Investment interest submitted from investor workspace.",
          status: "Pending"
        })}
      >
        Invest / Request Founder
      </button>
    </div>
  );
}

function InvestorStartupCard({ startup, currentUser, onCreateOffer, onOpenReport }) {
  const match = investorMatchProfile(startup);

  return (
    <article className="role-startup-card">
      <div>
        <span>{startup.source}</span>
        <h3>{startup.name}</h3>
        <p>{startup.description}</p>
      </div>
      <div className={`investor-match-card ${match.score >= 80 ? "strong" : match.score >= 62 ? "good" : match.score >= 45 ? "medium" : "low"}`}>
        <div>
          <span>Investor Match</span>
          <strong>{match.score}%</strong>
        </div>
        <div className="match-meter" aria-label={`Investor match score ${match.score}%`}>
          <span style={{ width: `${match.score}%` }} />
        </div>
        <p>{match.label}</p>
        <ul>
          {match.reasons.map((reason) => <li key={reason}>{reason}</li>)}
        </ul>
      </div>
      <dl>
        <div><dt>Founder</dt><dd>{startup.founder}</dd></div>
        <div><dt>Success</dt><dd>{startup.success}</dd></div>
        <div><dt>Risk</dt><dd>{startup.risk}</dd></div>
        <div><dt>Funding</dt><dd>{startup.funding}</dd></div>
      </dl>
      {startup.report && <button className="secondary-button" type="button" onClick={() => onOpenReport(startup.report)}>Open Analysis</button>}
      <InvestmentOfferForm startup={startup} currentUser={currentUser} onCreateOffer={onCreateOffer} />
    </article>
  );
}

function FounderCounterOffer({ offer, onCounterOffer }) {
  const [amount, setAmount] = useState(offer.amount || 0);
  const [equity, setEquity] = useState(offer.equity || 0);
  const [note, setNote] = useState("");

  return (
    <div className="counter-offer-form">
      <label>
        Counter Amount
        <input type="number" min="0" value={amount} onChange={(event) => setAmount(event.target.value)} />
      </label>
      <label>
        Counter Equity %
        <input type="number" min="0" max="100" step="0.1" value={equity} onChange={(event) => setEquity(event.target.value)} />
      </label>
      <label className="wide-field">
        Counter Note
        <input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Example: Can accept with milestone-based tranche." />
      </label>
      <button className="secondary-button" type="button" onClick={() => onCounterOffer(offer.id, Number(amount || 0), Number(equity || 0), note)}>
        Send Counter Offer
      </button>
    </div>
  );
}

function OfferTimeline({ offer }) {
  const events = offerHistoryFor(offer);

  return (
    <div className="offer-timeline-panel">
      <strong>Offer Timeline</strong>
      <ol className="offer-timeline">
        {events.map((event, index) => (
          <li key={`${offer.id}-${event.status || event.label}-${event.at || index}`}>
            <span>{index + 1}</span>
            <div>
              <strong>{event.label || event.status || "Offer update"}</strong>
              <p>{event.note || "Offer activity updated."}</p>
              <small>{event.at ? new Date(event.at).toLocaleString() : "Just now"}</small>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function FounderOffersPanel({ offers, onUpdateOffer, onCounterOffer }) {
  return (
    <section className="insight-block">
      <div className="section-heading">
        <DollarSign size={22} />
        <div>
          <h3>Investor Requests</h3>
          <p>Investment offers sent to this founder role appear here with amount, equity, investor, and status.</p>
        </div>
      </div>
      {offers.length === 0 ? (
        <section className="empty-mini">
          <DollarSign size={24} />
          <p>No investor requests yet. Save startup reports so investors can review them and send offers.</p>
        </section>
      ) : (
        <div className="offer-grid">
          {offers.map((offer) => (
            <article className="offer-card" key={offer.id}>
              <span>{offer.status}</span>
              <h3>{offer.startupName}</h3>
              <p>{offer.note}</p>
              <dl>
                <div><dt>Investor</dt><dd>{offer.investor}</dd></div>
                <div><dt>Amount</dt><dd>{money(offer.amount)}</dd></div>
                <div><dt>Equity</dt><dd>{offer.equity}%</dd></div>
                <div><dt>Sent</dt><dd>{new Date(offer.createdAt).toLocaleString()}</dd></div>
              </dl>
              <OfferTimeline offer={offer} />
              <div className="offer-actions">
                <button className="secondary-button" type="button" onClick={() => onUpdateOffer(offer.id, "Accepted")}>Accept</button>
                <button className="danger-button" type="button" onClick={() => onUpdateOffer(offer.id, "Declined")}>Decline</button>
              </div>
              <FounderCounterOffer offer={offer} onCounterOffer={onCounterOffer} />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function FounderImprovementPlan({ form, analysis, metadata, setActive }) {
  if (!analysis) {
    return (
      <section className="insight-block">
        <div className="section-heading">
          <ClipboardList size={22} />
          <div>
            <h3>Founder Improvement Plan</h3>
            <p>Run a prediction first to generate readiness score, weak factors, and next actions.</p>
          </div>
        </div>
        <section className="empty-mini">
          <Target size={24} />
          <p>No prediction yet. Open Predict and generate a founder report.</p>
        </section>
      </section>
    );
  }

  const readiness = founderReadinessScore(form, analysis);
  const riskPlan = riskImprovementPlan(form, analysis, metadata);
  const recommendations = buildRecommendations(form, analysis, metadata).slice(0, 5);
  const fundingGap = analysis.funding.gap || 0;

  return (
    <section className="insight-block">
      <div className="section-heading">
        <ClipboardList size={22} />
        <div>
          <h3>Founder Improvement Plan</h3>
          <p>Use this checklist before pitching investors or accepting funding terms.</p>
        </div>
      </div>
      <div className="founder-readiness-grid">
        <ResultCard icon={CheckCircle2} title="Readiness Score" value={`${readiness.score}/100`} note={readiness.label} tone={readiness.score >= 70 ? "green" : "orange"} />
        <ResultCard icon={Shield} title="Risk Level" value={analysis.risk.category} note={`${analysis.risk.score}/100 risk score.`} tone={riskToneFor(analysis.risk.category)} />
        <ResultCard icon={DollarSign} title="Funding Gap" value={money(fundingGap)} note={analysis.funding.note} tone={fundingGap > 0 ? "orange" : "green"} />
      </div>
      <div className="improvement-checklist">
        {[...riskPlan, ...recommendations].slice(0, 7).map((item, index) => (
          <article key={`${item}-${index}`}>
            <span>{index + 1}</span>
            <p>{item}</p>
          </article>
        ))}
      </div>
      <div className="action-row">
        <button className="secondary-button" type="button" onClick={() => setActive("predict")}>Update Prediction</button>
        <button className="secondary-button" type="button" onClick={() => setActive("funding")}>Review Funding</button>
        <button className="secondary-button" type="button" onClick={() => setActive("reports")}>Save Report</button>
      </div>
    </section>
  );
}

function FounderHomePage({ summary, setActive, roleMode, currentUser, investmentOffers, onUpdateOffer, onCounterOffer, form, analysis, metadata }) {
  const founderOffers = investmentOffers.filter((offer) => {
    const target = normalizeUsername(offer.targetFounder);
    return target === normalizeUsername(currentUser) || target === "founder";
  });
  return (
    <main className="page">
      <section className="role-page-heading">
        <div>
          <span>Founder Workspace</span>
          <h1>Build a fundable startup report.</h1>
          <p>Run predictions, improve weak signals, prepare funding materials, and respond to investor offers.</p>
        </div>
        <button className="primary-button hero-start-button" onClick={() => setActive("predict")}>Start Prediction</button>
      </section>
      <section className="stats-grid">
        <StatCard icon={Building2} label="Startups Stored" value={summary?.total_startups ?? "--"} />
        <StatCard icon={CheckCircle2} label="Success Rate" value={summary ? `${summary.success_rate}%` : "--"} tone="green" />
        <StatCard icon={Shield} label="Average Risk" value={summary ? `${summary.avg_risk_score}/100` : "--"} tone="red" />
        <StatCard icon={DollarSign} label="Investor Requests" value={founderOffers.length} tone="violet" />
      </section>
      <section className="insight-block">
        <div className="section-heading">
          <Settings size={22} />
          <div>
            <h3>{roleModeInsight(roleMode).title}</h3>
            <p>{roleModeInsight(roleMode).text}</p>
          </div>
        </div>
        <RoleActions roleMode={roleMode} setActive={setActive} />
      </section>
      <FounderImprovementPlan form={form} analysis={analysis} metadata={metadata} setActive={setActive} />
      <FounderOffersPanel offers={founderOffers} onUpdateOffer={onUpdateOffer} onCounterOffer={onCounterOffer} />
      <ObjectiveGrid />
      <BusinessIntelligenceGrid />
    </main>
  );
}

function InvestorHomePage({ summary, analytics, startupData, savedReports, predictionHistory, setActive, roleMode, currentUser, onCreateOffer, onOpenReport }) {
  const reportStartups = savedReports.map((report) => ({
    name: report.startupName,
    founder: report.username || "Founder",
    description: report.description,
    success: `${report.analysis?.success?.probability ?? "--"}%`,
    risk: report.analysis?.risk?.category || "--",
    funding: report.analysis?.funding?.stage || "--",
    ask: report.analysis?.funding?.gap || 250000,
    source: "Saved founder report",
    report
  }));
  const apiStartups = startupData.slice(0, 8).map((row) => ({
    name: row.startup_name || row.name || "Startup",
    founder: row.founder_name || row.username || "Founder",
    description: `${row.industry_name || row.industry || "Startup"} analysis from dataset.`,
    success: row.success_probability !== undefined ? `${row.success_probability}%` : (row.success !== undefined ? `${row.success}%` : "--"),
    risk: row.risk_category || (row.risk_score !== undefined ? `${row.risk_score}/100` : "--"),
    funding: row.funding_stage || money(row.funding_amount || 0),
    ask: row.funding_amount || 250000,
    source: "Recent startup"
  }));
  const recentHistory = predictionHistory.slice(0, 4).map((row) => ({
    name: row.startup_name,
    founder: currentUser,
    description: `${row.industry_name || "Startup"} recent prediction.`,
    success: `${row.success_probability}%`,
    risk: row.risk_category,
    funding: row.funding_stage,
    ask: 250000,
    source: "Recent prediction"
  }));
  const investorStartups = [...reportStartups, ...apiStartups, ...recentHistory].slice(0, 12);

  return (
    <main className="page">
      <section className="role-page-heading">
        <div>
          <span>Investor Workspace</span>
          <h1>Review startups and send investment offers.</h1>
          <p>See recent startups, saved founder reports, analytics, risk, success probability, funding stage, and offer terms.</p>
        </div>
        <button className="primary-button hero-start-button" onClick={() => setActive("analytics")}>Open Analytics</button>
      </section>
      <section className="stats-grid">
        <StatCard icon={Building2} label="Tracked Startups" value={summary?.total_startups ?? startupData.length} />
        <StatCard icon={CheckCircle2} label="Success Rate" value={summary ? `${summary.success_rate}%` : "--"} tone="green" />
        <StatCard icon={Shield} label="Avg Risk" value={summary ? `${summary.avg_risk_score}/100` : "--"} tone="red" />
        <StatCard icon={TrendingUp} label="Growth Leaders" value={analytics?.top_growth_startups?.length ?? "--"} tone="blue" />
      </section>
      <section className="insight-block">
        <div className="section-heading">
          <Activity size={22} />
          <div>
            <h3>{roleModeInsight(roleMode).title}</h3>
            <p>{roleModeInsight(roleMode).text}</p>
          </div>
        </div>
        <RoleActions roleMode={roleMode} setActive={setActive} />
      </section>
      <section className="insight-block">
        <div className="section-heading">
          <Building2 size={22} />
          <div>
            <h3>Recent Startups & Analysis</h3>
            <p>Review startup signals and send an investment request with amount and equity.</p>
          </div>
        </div>
        {investorStartups.length === 0 ? (
          <section className="empty-mini">
            <Building2 size={24} />
            <p>No startup records yet. Run predictions or load backend data to review investment candidates.</p>
          </section>
        ) : (
          <div className="role-startup-grid">
            {investorStartups.map((startup, index) => (
              <InvestorStartupCard key={`${startup.name}-${index}`} startup={startup} currentUser={currentUser} onCreateOffer={onCreateOffer} onOpenReport={onOpenReport} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function AdminHomePage({ summary, analytics, modelMetrics, startupData, predictionHistory, savedReports, investmentOffers, apiStatus, setActive, roleMode }) {
  return (
    <main className="page">
      <section className="role-page-heading">
        <div>
          <span>Admin Workspace</span>
          <h1>Manage data, model quality, and system health.</h1>
          <p>Use admin mode to inspect dataset records, batch predictions, API status, saved reports, and model metrics.</p>
        </div>
        <button className="primary-button hero-start-button" onClick={() => setActive("admin")}>Open Dataset</button>
      </section>
      <section className="stats-grid">
        <StatCard icon={Database} label="Dataset Rows" value={startupData.length || summary?.total_startups || "--"} tone="blue" />
        <StatCard icon={Activity} label="API Status" value={apiStatus} tone={apiStatus === "Connected" ? "green" : "orange"} />
        <StatCard icon={Shield} label="Model Accuracy" value={modelMetrics ? `${modelMetrics.accuracy}%` : "--"} tone="green" />
        <StatCard icon={DollarSign} label="Investment Offers" value={investmentOffers.length} tone="violet" />
      </section>
      <section className="insight-block">
        <div className="section-heading">
          <Settings size={22} />
          <div>
            <h3>{roleModeInsight(roleMode).title}</h3>
            <p>{roleModeInsight(roleMode).text}</p>
          </div>
        </div>
        <RoleActions roleMode={roleMode} setActive={setActive} />
      </section>
      <div className="table-grid">
        <DataTable title="Recent Prediction History" rows={predictionHistory.slice(0, 8)} columns={["startup_name", "industry_name", "success_probability", "funding_stage", "risk_category", "created_at"]} />
        <DataTable title="Investment Offers" rows={investmentOffers.slice(0, 12)} columns={["startupName", "investor", "targetFounder", "amount", "equity", "status"]} />
      </div>
    </main>
  );
}

function HomePage(props) {
  if (props.roleMode === "investor") return <InvestorHomePage {...props} />;
  if (props.roleMode === "admin") return <AdminHomePage {...props} />;
  return <FounderHomePage {...props} />;
}

function LegacyHomePage({ summary, setActive, roleMode }) {
  const roleInsight = roleModeInsight(roleMode);
  const roleConfig = configForRole(roleMode);
  return (
    <main className="page">
      <section className="home-hero">
        <div>
          <h1>{roleConfig.label}</h1>
          <p>Founders and investors can evaluate viability, estimate success chances, understand competition, identify funding needs, and predict future business growth.</p>
          <button className="primary-button hero-start-button" onClick={() => setActive(roleConfig.startPage)}>
            Open {navItems.find((item) => item.id === roleConfig.startPage)?.label || "Workspace"}
          </button>
        </div>
        <div className="flow-card">
          <div className="decision-card-heading">
            <BrainCircuit size={24} />
            <div>
              <h2>Decision Dashboard</h2>
              <p>Important signals founders and investors need before making a funding or scaling decision.</p>
            </div>
          </div>
          <div className="decision-signal-grid">
            <article>
              <CheckCircle2 size={19} />
              <span>Viability Score</span>
            </article>
            <article>
              <Target size={19} />
              <span>Success Probability</span>
            </article>
            <article>
              <DollarSign size={19} />
              <span>Funding Gap</span>
            </article>
            <article>
              <Users size={19} />
              <span>Competition Pressure</span>
            </article>
            <article>
              <TrendingUp size={19} />
              <span>Growth Forecast</span>
            </article>
            <article>
              <Shield size={19} />
              <span>Risk Level</span>
            </article>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard icon={Building2} label="Startups Stored" value={summary?.total_startups ?? "--"} />
        <StatCard icon={CheckCircle2} label="Success Rate" value={summary ? `${summary.success_rate}%` : "--"} tone="green" />
        <StatCard icon={DollarSign} label="Total Funding" value={summary ? money(summary.total_funding) : "--"} tone="violet" />
        <StatCard icon={Shield} label="Average Risk" value={summary ? `${summary.avg_risk_score}/100` : "--"} tone="red" />
      </section>

      <section className="insight-block">
        <div className="section-heading">
          <Settings size={22} />
          <div>
            <h3>{roleInsight.title}</h3>
            <p>{roleInsight.text}</p>
          </div>
        </div>
        <div className="role-action-grid">
          {roleConfig.actions.map((action) => {
            const Icon = action.icon;
            return (
              <button type="button" key={action.id} onClick={() => setActive(action.id)}>
                <Icon size={20} />
                <span>
                  <strong>{action.title}</strong>
                  <small>{action.text}</small>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <ObjectiveGrid />
      <BusinessIntelligenceGrid />
    </main>
  );
}

function SavedReportsPage({ currentUser, savedReports, onDeleteReport, onOpenReport }) {
  return (
    <InsightPage title="Saved Reports" icon={Save}>
      <p>Saved startup reports for {currentUser}. New generated reports appear here after you save them from the Reports section.</p>

      {savedReports.length === 0 ? (
        <section className="empty-mini">
          <Save size={26} />
          <p>No saved reports yet. Generate a prediction, open Reports, and save the final result.</p>
        </section>
      ) : (
        <section className="saved-report-list">
          {savedReports.map((report) => (
            <article className="saved-report-card" key={report.id}>
              <div>
                <span>{new Date(report.savedAt).toLocaleString()}</span>
                <h3>{report.startupName}</h3>
                <p>{report.description}</p>
              </div>
              <div className="saved-report-metrics">
                <strong>{report.analysis.success.probability}% success</strong>
                <span>{report.analysis.funding.stage}</span>
                <span>{report.analysis.risk.category}</span>
              </div>
              <div className="saved-report-actions">
                <button className="secondary-button" type="button" onClick={() => onOpenReport(report)}>Open</button>
                <button className="danger-button" type="button" onClick={() => onDeleteReport(report.id)}>Delete</button>
              </div>
            </article>
          ))}
        </section>
      )}
    </InsightPage>
  );
}

function InsightPage({ title, icon: Icon, children }) {
  return (
    <main className="page">
      <section className="simple-panel">
        <Icon size={30} />
        <h2>{title}</h2>
        {children}
      </section>
    </main>
  );
}

function SettingsPanel({ preferences, setPreferences, apiStatus, currentUser, savedReports, predictionHistory, onResetAppData, onBackupData, onRestoreData }) {
  const updatePreference = (key, value) => {
    setPreferences((current) => ({ ...current, [key]: value }));
  };
  const roleNavItems = navItemsForRole(preferences.roleMode);

  return (
    <InsightPage title="Settings" icon={Settings}>
      <p>Project owner: Prajwal Kumar</p>
      <p>System goal: AI-powered Startup Success Prediction System.</p>

      <section className="settings-card">
        <div>
          <h3>Appearance</h3>
          <p>Choose how the dashboard should look.</p>
        </div>
        <div className="theme-switch">
          {["light", "dark", "system"].map((mode) => (
            <button className={preferences.themeMode === mode ? "active" : ""} type="button" onClick={() => updatePreference("themeMode", mode)} key={mode}>
              {mode === "system" ? "System" : `${mode[0].toUpperCase()}${mode.slice(1)} Mode`}
            </button>
          ))}
        </div>
      </section>

      <section className="settings-grid">
        <label className="settings-field">
          <span>Accent Color</span>
          <select value={preferences.accentColor} onChange={(event) => updatePreference("accentColor", event.target.value)}>
            {Object.entries(accentThemes).map(([value, item]) => <option value={value} key={value}>{item.label}</option>)}
          </select>
        </label>
        <label className="settings-field">
          <span>Default Start Page</span>
          <select value={preferences.defaultStartPage} onChange={(event) => updatePreference("defaultStartPage", event.target.value)}>
            {roleNavItems.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}
          </select>
        </label>
        <label className="settings-field">
          <span>Currency Format</span>
          <select value={preferences.currency} onChange={(event) => updatePreference("currency", event.target.value)}>
            <option value="USD">USD ($)</option>
            <option value="INR">INR (₹)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </label>
        <label className="settings-field">
          <span>Prediction Sensitivity</span>
          <select value={preferences.predictionSensitivity} onChange={(event) => updatePreference("predictionSensitivity", event.target.value)}>
            <option value="conservative">Conservative</option>
            <option value="balanced">Balanced</option>
            <option value="aggressive">Aggressive</option>
          </select>
        </label>
        <label className="settings-field">
          <span>Chart Style</span>
          <select value={preferences.chartStyle} onChange={(event) => updatePreference("chartStyle", event.target.value)}>
            <option value="line">Line</option>
            <option value="water">Water-shade line</option>
            <option value="area">Area</option>
          </select>
        </label>
        <label className="settings-field">
          <span>Data Refresh</span>
          <select value={preferences.dataRefresh} onChange={(event) => updatePreference("dataRefresh", event.target.value)}>
            <option value="manual">Manual refresh</option>
            <option value="30s">Auto every 30 seconds</option>
            <option value="2m">Auto every 2 minutes</option>
          </select>
        </label>
        <label className="settings-field">
          <span>Export Format</span>
          <select value={preferences.exportFormat} onChange={(event) => updatePreference("exportFormat", event.target.value)}>
            <option value="pdf">PDF-ready report</option>
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
          </select>
        </label>
        <label className="settings-field">
          <span>Role Mode</span>
          <select value={preferences.roleMode} onChange={(event) => {
            const nextRole = event.target.value;
            const nextConfig = configForRole(nextRole);
            setPreferences((current) => ({
              ...current,
              roleMode: nextRole,
              defaultStartPage: nextConfig.nav.includes(current.defaultStartPage) ? current.defaultStartPage : nextConfig.startPage
            }));
          }}>
            <option value="founder">Founder View</option>
            <option value="investor">Investor View</option>
            <option value="admin">Admin View</option>
          </select>
        </label>
      </section>

      <section className="settings-card">
        <div>
          <h3>Automation & Notifications</h3>
          <p>Control saved reports and alert-style messages.</p>
        </div>
        <div className="settings-toggles">
          {[
            ["autoSaveReports", "Auto Save Reports"],
            ["showAdvancedMetrics", "Show Advanced Metrics"],
            ["notifyFunding", "Funding Alerts"],
            ["notifyRisk", "Risk Alerts"],
            ["notifySavedReports", "Saved Report Confirmations"]
          ].map(([key, label]) => (
            <label className="toggle-row" key={key}>
              <input type="checkbox" checked={Boolean(preferences[key])} onChange={(event) => updatePreference(key, event.target.checked)} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="settings-grid">
        <article className="settings-info">
          <h3>API Status</h3>
          <strong className={apiStatus === "Connected" ? "status-good" : "status-warn"}>{apiStatus}</strong>
          <p>Backend health is inferred from the latest data loading attempt.</p>
        </article>
        <article className="settings-info">
          <h3>About Project</h3>
          <p>Owner: Prajwal Kumar</p>
          <p>User: {currentUser}</p>
          <p>Saved reports: {savedReports.length}</p>
          <p>Prediction history: {predictionHistory.length}</p>
          <p>Active role: {preferences.roleMode}</p>
          <p>Model: Random Forest startup success classifier</p>
        </article>
        <article className="settings-info">
          <h3>Backup / Restore Data</h3>
          <p>Export saved reports, prediction history, and preferences, or restore them later.</p>
          <div className="settings-actions">
            <button className="secondary-button" type="button" onClick={onBackupData}>Backup Data</button>
            <label className="restore-button">
              Restore
              <input type="file" accept=".json,application/json" onChange={onRestoreData} />
            </label>
          </div>
        </article>
        <article className="settings-info danger-zone">
          <h3>Reset App Data</h3>
          <p>Clear saved reports, current prediction, and preference choices for this browser.</p>
          <button className="danger-button" type="button" onClick={onResetAppData}>Reset App Data</button>
        </article>
      </section>
    </InsightPage>
  );
}

function BottomNav({ active, setActive, items }) {
  return (
    <nav className="bottom-nav" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button key={item.id} className={active === item.id ? "active" : ""} onClick={() => setActive(item.id)}>
            <Icon size={19} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function NextPageControl({ active, setActive, items }) {
  const currentIndex = Math.max(0, items.findIndex((item) => item.id === active));
  const previousIndex = (currentIndex - 1 + items.length) % items.length;
  const nextIndex = (currentIndex + 1) % items.length;
  const currentItem = items[currentIndex] || items[0];
  const previousItem = items[previousIndex];
  const nextItem = items[nextIndex];
  const PreviousIcon = previousItem.icon;
  const NextIcon = nextItem.icon;

  return (
    <>
      <div className="previous-page-control">
        <button type="button" onClick={() => setActive(previousItem.id)}>
          <PreviousIcon size={17} />
          Previous: {previousItem.label}
        </button>
      </div>
      <div className="next-page-control">
        <span>Step {currentIndex + 1} of {items.length}: {currentItem.label}</span>
        <button type="button" onClick={() => setActive(nextItem.id)}>
          Next: {nextItem.label}
          <NextIcon size={17} />
        </button>
      </div>
    </>
  );
}

function App() {
  const [preferences, setPreferences] = useState(readPreferences);
  activeCurrency = preferences.currency;
  const [active, setActive] = useState(() => readPreferences().defaultStartPage);
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem("startup-current-user") || "");
  const [savedReports, setSavedReports] = useState(() => readSavedReports(localStorage.getItem("startup-current-user") || ""));
  const [predictionHistory, setPredictionHistory] = useState(() => readPredictionHistory(localStorage.getItem("startup-current-user") || ""));
  const [investmentOffers, setInvestmentOffers] = useState(readInvestmentOffers);
  const [savedMessage, setSavedMessage] = useState("");
  const [metadata, setMetadata] = useState(fallbackMetadata);
  const [summary, setSummary] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [modelMetrics, setModelMetrics] = useState(null);
  const [startupData, setStartupData] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [funderSeed, setFunderSeed] = useState(() => Date.now() + Math.floor(Math.random() * 100000));
  const [fundRequests, setFundRequests] = useState({});
  const [apiStatus, setApiStatus] = useState("Checking");

  useEffect(() => {
    const loadAppData = () => {
    getJson("/metadata").then((data) => { setMetadata(normalizeMetadata(data)); setApiStatus("Connected"); }).catch(() => { setMetadata(fallbackMetadata); setApiStatus("Fallback mode"); });
    getJson("/summary").then((data) => { setSummary(data); setApiStatus("Connected"); }).catch(() => setSummary(null));
    getJson("/analytics").then((data) => { setAnalytics(data); setApiStatus("Connected"); }).catch(() => setAnalytics(null));
    getJson("/model-metrics").then((data) => { setModelMetrics(data); setApiStatus("Connected"); }).catch(() => setModelMetrics(null));
    getJson("/startup-data").then((data) => { setStartupData(data); setApiStatus("Connected"); }).catch(() => setStartupData([]));
    };
    loadAppData();

    const refreshMs = preferences.dataRefresh === "30s" ? 30000 : preferences.dataRefresh === "2m" ? 120000 : 0;
    if (!refreshMs) return undefined;
    const refreshTimer = setInterval(loadAppData, refreshMs);
    return () => clearInterval(refreshTimer);
  }, [preferences.dataRefresh]);

  useEffect(() => {
    writePreferences(preferences);
  }, [preferences]);

  useEffect(() => {
    setSavedReports(readSavedReports(currentUser));
    setPredictionHistory(readPredictionHistory(currentUser));
    setSavedMessage("");
  }, [currentUser]);

  const addPredictionHistory = (startupForm, startupAnalysis) => {
    const item = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      startup_name: startupForm.startup_name || "Untitled startup",
      industry_name: labelFor(metadata.industries, startupForm.industry),
      success_probability: startupAnalysis.success.probability,
      funding_stage: startupAnalysis.funding.stage,
      risk_category: startupAnalysis.risk.category,
      created_at: new Date().toLocaleString()
    };
    const nextHistory = [item, ...predictionHistory].slice(0, 100);
    setPredictionHistory(nextHistory);
    writePredictionHistory(currentUser, nextHistory);
  };

  const loginUser = (username, password, roleMode = "founder") => {
    const accountId = normalizeUsername(username);
    const accounts = readAccounts();
    const account = accounts[accountId];

    if (!account) {
      return { ok: false, message: "No account found. Please sign up first." };
    }

    if (account.password !== password) {
      return { ok: false, message: "Incorrect password for this account." };
    }

    const displayName = account.displayName || username.trim();
    const nextConfig = configForRole(roleMode);
    accounts[accountId] = { ...account, roleMode };
    writeAccounts(accounts);
    localStorage.setItem("startup-current-user", displayName);
    setPreferences((current) => ({ ...current, roleMode, defaultStartPage: nextConfig.startPage }));
    setCurrentUser(displayName);
    setActive(nextConfig.startPage);
    return { ok: true, message: `Welcome back, ${displayName}. Opening ${nextConfig.label}.` };
  };

  const signupUser = (username, password, roleMode = "founder") => {
    const displayName = username.trim();
    const accountId = normalizeUsername(displayName);
    const accounts = readAccounts();
    const nextConfig = configForRole(roleMode);

    if (accounts[accountId]) {
      return { ok: false, message: "This username already exists. Login instead." };
    }

    if (password.trim().length < 4) {
      return { ok: false, message: "Use at least 4 characters for the password." };
    }

    accounts[accountId] = {
      displayName,
      password,
      roleMode,
      createdAt: new Date().toISOString()
    };
    writeAccounts(accounts);
    localStorage.setItem("startup-current-user", displayName);
    setPreferences((current) => ({ ...current, roleMode, defaultStartPage: nextConfig.startPage }));
    setCurrentUser(displayName);
    setActive(nextConfig.startPage);
    return { ok: true, message: `Account created for ${displayName}. Opening ${nextConfig.label}.` };
  };

  const logoutUser = () => {
    localStorage.removeItem("startup-current-user");
    setCurrentUser("");
    setAnalysis(null);
    setSavedMessage("");
    setActive(preferences.defaultStartPage);
  };

  const startNewPrediction = () => {
    setForm(initialForm);
    setAnalysis(null);
    setError("");
    setSavedMessage("");
    setFundRequests({});
    setFunderSeed(Date.now() + Math.floor(Math.random() * 100000));
    setActive("predict");
  };

  const refreshFunders = () => {
    setFundRequests({});
    setFunderSeed(Date.now() + Math.floor(Math.random() * 100000));
  };

  const requestFunds = (funder) => {
    setFundRequests((current) => ({
      ...current,
      [funder.name]: {
        startup: form.startup_name || "New startup",
        amount: analysis?.funding?.gap || form.funding_amount || funder.ticket,
        sentAt: new Date().toLocaleString()
      }
    }));
  };

  const runPrediction = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSavedMessage("");
    const preparedForm = inferStartupDetails(form, metadata);
    setForm(preparedForm);
    try {
      const prediction = await postJson("/predict", modelReadyForm(preparedForm, metadata));
      const nextAnalysis = analyzeStartup(preparedForm, metadata, prediction, preferences.predictionSensitivity);
      setAnalysis(nextAnalysis);
      addPredictionHistory(preparedForm, nextAnalysis);
      if (preferences.autoSaveReports) saveReportFromAnalysis(nextAnalysis, "Auto-saved after prediction.", preparedForm);
      setActive("predict");
    } catch (err) {
      const nextAnalysis = analyzeStartup(preparedForm, metadata, fallbackPrediction(preparedForm), preferences.predictionSensitivity);
      setAnalysis(nextAnalysis);
      addPredictionHistory(preparedForm, nextAnalysis);
      if (preferences.autoSaveReports) saveReportFromAnalysis(nextAnalysis, "Auto-saved after fallback prediction.", preparedForm);
      setActive("predict");
      setError("");
    } finally {
      setLoading(false);
    }
  };

  const saveReportFromAnalysis = (reportAnalysis, message = `Saved for ${currentUser}. Open the Saved section to view it anytime.`, reportForm = form) => {
    if (!reportAnalysis) return;
    const report = createSavedReport(currentUser, reportForm, reportAnalysis, metadata);
    const nextReports = [report, ...savedReports];
    setSavedReports(nextReports);
    writeSavedReports(currentUser, nextReports);
    if (preferences.notifySavedReports) setSavedMessage(message);
  };

  const saveCurrentReport = () => {
    saveReportFromAnalysis(analysis);
  };

  const resetAppData = () => {
    localStorage.removeItem(storageKeyForUser(currentUser));
    localStorage.removeItem(`startup-prediction-history:${normalizeUsername(currentUser)}`);
    localStorage.removeItem("startup-settings");
    localStorage.removeItem("startup-theme");
    setPreferences(defaultPreferences);
    setSavedReports([]);
    setPredictionHistory([]);
    setForm(initialForm);
    setAnalysis(null);
    setFundRequests({});
    setSavedMessage("App data reset for this browser.");
    setActive(defaultPreferences.defaultStartPage);
  };

  const addBatchPredictions = (rows) => {
    const historyRows = rows.map((row) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      startup_name: row.startup_name,
      industry_name: row.industry_name,
      success_probability: row.success_probability,
      funding_stage: row.funding_stage,
      risk_category: row.risk_category,
      created_at: new Date().toLocaleString()
    }));
    const nextHistory = [...historyRows, ...predictionHistory].slice(0, 100);
    setPredictionHistory(nextHistory);
    writePredictionHistory(currentUser, nextHistory);
  };

  const backupData = () => {
    const data = { currentUser, preferences, savedReports, predictionHistory, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "startup-system-backup.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const restoreData = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      const nextPreferences = { ...defaultPreferences, ...(data.preferences || {}) };
      const nextReports = Array.isArray(data.savedReports) ? data.savedReports : [];
      const nextHistory = Array.isArray(data.predictionHistory) ? data.predictionHistory : [];
      setPreferences(nextPreferences);
      setSavedReports(nextReports);
      setPredictionHistory(nextHistory);
      writePreferences(nextPreferences);
      writeSavedReports(currentUser, nextReports);
      writePredictionHistory(currentUser, nextHistory);
      setSavedMessage("Backup restored successfully.");
    } catch {
      setSavedMessage("Could not restore backup. Please choose a valid JSON backup file.");
    } finally {
      event.target.value = "";
    }
  };

  const deleteSavedReport = (reportId) => {
    const nextReports = savedReports.filter((report) => report.id !== reportId);
    setSavedReports(nextReports);
    writeSavedReports(currentUser, nextReports);
  };

  const openSavedReport = (report) => {
    setForm(report.form);
    setAnalysis(report.analysis);
    setSavedMessage(`Loaded saved report for ${report.startupName}.`);
    setActive("reports");
  };

  const createInvestmentOffer = (offer) => {
    const createdAt = new Date().toISOString();
    const nextOffer = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt,
      history: [{
        status: offer.status || "Pending",
        label: "Offer sent",
        at: createdAt,
        note: `${offer.investor || "Investor"} offered ${money(offer.amount)} for ${offer.equity || 0}% equity.`
      }],
      ...offer
    };
    const nextOffers = [nextOffer, ...investmentOffers];
    setInvestmentOffers(nextOffers);
    writeInvestmentOffers(nextOffers);
    setSavedMessage(`Investment request sent to ${offer.targetFounder} for ${offer.startupName}.`);
  };

  const updateInvestmentOffer = (offerId, status) => {
    const updatedAt = new Date().toISOString();
    const nextOffers = investmentOffers.map((offer) => offer.id === offerId ? {
      ...offer,
      status,
      updatedAt,
      history: [...offerHistoryFor(offer), {
        status,
        label: status,
        at: updatedAt,
        note: `Founder marked this offer as ${status.toLowerCase()}.`
      }]
    } : offer);
    setInvestmentOffers(nextOffers);
    writeInvestmentOffers(nextOffers);
  };

  const counterInvestmentOffer = (offerId, amount, equity, note) => {
    const updatedAt = new Date().toISOString();
    const nextOffers = investmentOffers.map((offer) => offer.id === offerId ? {
      ...offer,
      amount,
      equity,
      note: note || offer.note,
      status: "Counter Offered",
      updatedAt,
      history: [...offerHistoryFor(offer), {
        status: "Counter Offered",
        label: "Counter offer",
        at: updatedAt,
        note: note || `Founder countered with ${money(amount)} for ${equity || 0}% equity.`
      }]
    } : offer);
    setInvestmentOffers(nextOffers);
    writeInvestmentOffers(nextOffers);
  };

  const changeRoleMode = (nextRole) => {
    const nextConfig = configForRole(nextRole);
    setPreferences((current) => ({
      ...current,
      roleMode: nextRole,
      defaultStartPage: nextConfig.nav.includes(current.defaultStartPage) ? current.defaultStartPage : nextConfig.startPage
    }));
    if (!nextConfig.nav.includes(active)) {
      setActive(nextConfig.startPage);
    }
  };

  const suggestedFunders = useMemo(
    () => matchedFundingCompanies(form, metadata, funderSeed),
    [form, metadata, funderSeed]
  );
  const selectedIndustryName = industryBenchmark(metadata, form.industry).label;
  const currentReport = useMemo(
    () => analysis ? createSavedReport(currentUser, form, analysis, metadata) : null,
    [analysis, currentUser, form, metadata]
  );
  const allSavedReports = useMemo(() => {
    const reports = readAllSavedReports();
    const reportIds = new Set(reports.map((report) => report.id));
    return [...reports, ...savedReports.filter((report) => !reportIds.has(report.id))];
  }, [savedReports, currentUser]);
  const roleNavItems = useMemo(() => navItemsForRole(preferences.roleMode), [preferences.roleMode]);
  const roleConfig = configForRole(preferences.roleMode);
  const offerNotifications = useMemo(
    () => offerNotificationsFor(investmentOffers, currentUser, preferences.roleMode),
    [investmentOffers, currentUser, preferences.roleMode]
  );

  useEffect(() => {
    const allowedPages = new Set(roleConfig.nav);
    if (!allowedPages.has(active)) {
      setActive(roleConfig.startPage);
    }
  }, [active, roleConfig]);

  const content = useMemo(() => {
    if (active === "home") {
      return (
        <HomePage
          summary={summary}
          analytics={analytics}
          modelMetrics={modelMetrics}
          startupData={startupData}
          savedReports={allSavedReports}
          predictionHistory={predictionHistory}
          setActive={setActive}
          roleMode={preferences.roleMode}
          currentUser={currentUser}
          apiStatus={apiStatus}
          investmentOffers={investmentOffers}
          form={form}
          analysis={analysis}
          metadata={metadata}
          onCreateOffer={createInvestmentOffer}
          onUpdateOffer={updateInvestmentOffer}
          onCounterOffer={counterInvestmentOffer}
          onOpenReport={openSavedReport}
        />
      );
    }
    if (active === "predict") {
      const investorReview = preferences.roleMode === "investor";
      return (
        <main className="page prediction-layout">
          <div className="form-stack">
            <div className="role-page-mini">
              <strong>{investorReview ? "Investor Prediction Analysis" : "Founder Prediction Builder"}</strong>
              <p>{investorReview ? "Change only funding and revenue to test how investment assumptions affect success, risk, growth, and valuation." : "Enter full startup details to generate a new founder prediction report."}</p>
            </div>
            <button className="secondary-button" type="button" onClick={startNewPrediction}>{investorReview ? "Reset Scenario" : "Clear / New Prediction"}</button>
            <StartupForm form={form} setForm={setForm} metadata={metadata} onPredict={runPrediction} loading={loading} roleMode={preferences.roleMode} />
          </div>
          <div className="prediction-side-stack">
            <PredictionPanel form={form} analysis={analysis} metadata={metadata} error={error} />
            {investorReview && <InvestorScenarioGraph form={form} metadata={metadata} sensitivity={preferences.predictionSensitivity} />}
          </div>
        </main>
      );
    }
    if (active === "ai") {
      return <AiAnalysisPanel form={form} analysis={analysis} metadata={metadata} />;
    }
    if (active === "compare") {
      return <ComparisonPage currentReport={currentReport} savedReports={savedReports} onOpenReport={openSavedReport} />;
    }
    if (active === "analytics") {
      return <AnalyticsDashboard analytics={analytics} summary={summary} chartStyle={preferences.chartStyle} />;
    }
    if (active === "tools") {
      return <ToolsPage form={form} analysis={analysis} metadata={metadata} funders={suggestedFunders} />;
    }
    if (active === "market") {
      return (
        <InsightPage title="Market Analysis" icon={BarChart3}>
          <p>After prediction, the system explains market demand, customer growth, and opportunity size.</p>
          {analysis && <ResultCard icon={BarChart3} title="Current Market Result" value={analysis.market.demand} note={`${analysis.market.opportunity}. ${analysis.market.note}`} tone="blue" />}
          {analysis ? (
            <MarketGrowthChart form={form} analysis={analysis} chartStyle={preferences.chartStyle} />
          ) : (
            <section className="empty-mini">
              <BarChart3 size={26} />
              <p>Run a startup prediction first to generate market cap, consumer, and future growth charts.</p>
            </section>
          )}
        </InsightPage>
      );
    }
    if (active === "funding") {
      return (
        <InsightPage title="Funding Recommendation" icon={Landmark}>
          <p>The app recommends Bootstrapping, Seed Funding, Series A, or Venture Capital based on traction and startup strength.</p>
          {analysis && <ResultCard icon={DollarSign} title="Current Funding Advice" value={analysis.funding.stage} note={`${analysis.funding.note} Funding gap: ${money(analysis.funding.gap)}.`} tone="violet" />}
          <div className="action-row">
            <button className="secondary-button" type="button" onClick={refreshFunders}>Refresh Funding Companies</button>
            <button className="secondary-button" type="button" onClick={startNewPrediction}>Clear / Start New</button>
          </div>
          <FunderList funders={suggestedFunders} requests={fundRequests} onRequestFunds={requestFunds} industryName={selectedIndustryName} />
        </InsightPage>
      );
    }
    if (active === "reports") {
      return (
        <InsightPage title="Final Result Reports" icon={FileText}>
          <p>Project objective: predict startup success, recommend funding stages, analyze market opportunities, evaluate competitors, and forecast growth potential.</p>
          <ObjectiveGrid />
          {analysis && <PredictionPanel form={form} analysis={analysis} metadata={metadata} onSaveReport={saveCurrentReport} savedMessage={savedMessage} exportFormat={preferences.exportFormat} />}
          {!analysis && (
            <section className="empty-mini">
              <FileText size={26} />
              <p>Run a startup prediction first, then return here to save the generated report under {currentUser}.</p>
            </section>
          )}
        </InsightPage>
      );
    }
    if (active === "saved") {
      return <SavedReportsPage currentUser={currentUser} savedReports={savedReports} onDeleteReport={deleteSavedReport} onOpenReport={openSavedReport} />;
    }
    if (active === "metrics") {
      return preferences.showAdvancedMetrics ? <ModelMetricsPage metrics={modelMetrics} chartStyle={preferences.chartStyle} /> : (
        <InsightPage title="Model Accuracy" icon={Shield}>
          <section className="empty-mini">
            <Shield size={26} />
            <p>Advanced model metrics are hidden in Settings.</p>
          </section>
        </InsightPage>
      );
    }
    if (active === "admin") {
      return <AdminDatasetPage startupData={startupData} metadata={metadata} predictionHistory={predictionHistory} onBatchPredictions={addBatchPredictions} />;
    }
    return <SettingsPanel preferences={preferences} setPreferences={setPreferences} apiStatus={apiStatus} currentUser={currentUser} savedReports={savedReports} predictionHistory={predictionHistory} onResetAppData={resetAppData} onBackupData={backupData} onRestoreData={restoreData} />;
  }, [active, allSavedReports, analysis, analytics, apiStatus, currentReport, currentUser, error, form, fundRequests, investmentOffers, loading, metadata, modelMetrics, predictionHistory, preferences, savedMessage, savedReports, selectedIndustryName, startupData, suggestedFunders, summary]);

  if (!currentUser) {
    return <LoginScreen onLogin={loginUser} onSignup={signupUser} />;
  }

  const effectiveTheme = preferences.themeMode === "system"
    ? (window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : preferences.themeMode;
  const accent = accentThemes[preferences.accentColor] || accentThemes.purple;

  return (
    <div className="app-shell" data-theme={effectiveTheme} data-role={preferences.roleMode} style={{ "--accent": accent.accent, "--accent-dark": accent.accentDark, "--water": accent.water }}>
      <Header currentUser={currentUser} onLogout={logoutUser} roleMode={preferences.roleMode} onRoleModeChange={changeRoleMode} notifications={offerNotifications} />
      {content}
      <NextPageControl active={active} setActive={setActive} items={roleNavItems} />
      <BottomNav active={active} setActive={setActive} items={roleNavItems} />
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
