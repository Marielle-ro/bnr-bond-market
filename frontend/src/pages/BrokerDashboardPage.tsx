import { FC, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { BondType } from "../types";
import { Page } from "../App";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const ChartTooltip: FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-xs shadow-sm">
      <p className="font-bold text-gray-900 mb-1">{label}</p>
      <p className="text-gray-500">Total Sales: <span className="font-semibold text-gray-900">RWF {d.totalSales.toLocaleString()}</span></p>
      <p className="text-gray-500">Bonds Sold: <span className="font-semibold text-gray-900">{d.bondCount}</span></p>
    </div>
  );
};

type Tab = "listings" | "receipts";
interface Props { navigate: (page: Page) => void; }

// ── Add Listing Modal ─────────────────────────────────────────────────────────
interface AddListingModalProps {
  brokerId: string;
  brokerCompanyName: string;
  contactPhone: string;
  bondTypes: BondType[];
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const AddListingModal: FC<AddListingModalProps> = ({ brokerId, brokerCompanyName, contactPhone, bondTypes, onClose, onSubmit }) => {
  const [bondId, setBondId] = useState(bondTypes[0]?.id ?? "");
  const [fee, setFee] = useState("5000");
  const [qty, setQty] = useState("50");
  const [err, setErr] = useState("");

  const submit = () => {
    const bond = bondTypes.find((b) => b.id === bondId);
    if (!bond) { setErr("Select a bond."); return; }
    const f = Number(fee); const q = Number(qty);
    if (isNaN(f) || f < 0) { setErr("Enter a valid fee."); return; }
    if (isNaN(q) || q < 1) { setErr("Enter a valid quantity."); return; }
    onSubmit({ brokerId, bondTypeId: bond.id, brokerCompanyName, bondName: bond.name, durationYears: bond.durationYears, couponRate: bond.couponRate, minInvestment: bond.minInvestment, brokerFee: f, initialQuantity: q, quantityAvailable: q, contactPhone });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-slate-900 px-6 py-5 flex justify-between items-center">
          <h2 className="text-sm font-bold text-white">Add Bond Listing</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl leading-none transition-colors">×</button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Bond Type</label>
            <select value={bondId} onChange={(e) => setBondId(e.target.value)}
              className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all bg-white">
              {bondTypes.map((b) => <option key={b.id} value={b.id}>{b.name} — {b.couponRate}% / {b.durationYears}yr</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Broker Fee (RWF)</label>
            <input type="number" value={fee} onChange={(e) => setFee(e.target.value)} min="0"
              className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Initial Quantity</label>
            <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} min="1"
              className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all" />
          </div>
          {err && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-md px-3 py-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
              <p className="text-xs text-red-600">{err}</p>
            </div>
          )}
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 border border-gray-200 rounded-md text-gray-700 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={submit} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2.5 text-sm font-semibold transition-colors">Add Listing</button>
        </div>
      </div>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const BrokerDashboardPage: FC<Props> = ({ navigate }) => {
  const { user, bondTypes, investments, getBrokerListings, getBrokerReceipts, addBrokerListing, updateBrokerFee, logout } = useAuth();
  const activeBondTypes = bondTypes.filter((b) => b.isActive);
  const [tab, setTab] = useState<Tab>("listings");
  const [showModal, setShowModal] = useState(false);
  const [editingFeeId, setEditingFeeId] = useState<string | null>(null);
  const [editFeeVal, setEditFeeVal] = useState("");
  const [chartYear, setChartYear] = useState(new Date().getFullYear());

  if (!user || user.role !== "BROKER") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-sm">Access restricted to brokers.</p>
      </div>
    );
  }

  const broker = user as any;
  const listings = getBrokerListings(broker.id);
  const receipts = getBrokerReceipts(broker.id);
  const brokerInvestments = investments.filter((inv) => inv.brokerCompanyName === broker.companyName);
  const totalInvested = brokerInvestments.reduce((s, i) => s + i.amountInvested, 0);

  const now = new Date();
  const allYears = [...new Set([now.getFullYear(), ...brokerInvestments.map((inv) => parseInt(inv.purchaseDate.split("-")[0]))])].filter((y) => !isNaN(y)).sort();
  const maxMonthIdx = chartYear === now.getFullYear() ? now.getMonth() : 11;
  const chartData = MONTHS.slice(0, maxMonthIdx + 1).map((m, idx) => {
    const key = `${chartYear}-${String(idx + 1).padStart(2, "0")}`;
    const monthInvs = brokerInvestments.filter((inv) => inv.purchaseDate.startsWith(key));
    return { month: m, totalSales: monthInvs.reduce((s, i) => s + i.amountInvested, 0), bondCount: monthInvs.length };
  });

  const statusColor: Record<string, string> = {
    APPROVED:  "text-green-400 bg-green-500/10 border-green-500/30",
    PENDING:   "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
    SUSPENDED: "text-red-400 bg-red-500/10 border-red-500/30",
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-slate-900 fixed h-screen flex flex-col">
        <div className="px-5 py-6 border-b border-white/10">
          <p className="text-xs font-semibold tracking-widest text-white/40 uppercase">BNR Bond Market</p>
          <p className="text-sm font-bold text-white mt-1 truncate">{broker.companyName}</p>
        </div>
        <nav className="py-4 flex-1">
          {(["listings", "receipts"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`w-full text-left px-5 py-2.5 text-sm transition-colors ${
                tab === t
                  ? "border-l-2 border-gold bg-white/5 font-semibold text-white"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}>
              {t === "listings" ? "My Listings" : "Client Receipts"}
            </button>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-xs text-white/30 truncate mb-2">{broker.email}</p>
          <button
            onClick={() => { logout(); navigate("home"); }}
            className="w-full text-left text-sm text-white/40 hover:text-white transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="ml-56 flex-1">
        {/* Topbar */}
        <header className="bg-slate-800 px-8 py-4 flex items-center justify-between sticky top-0 z-40">
          <h1 className="text-lg font-bold text-white">
            {tab === "listings" ? "My Bond Listings" : "Client Receipts"}
          </h1>
          <span className={`text-xs font-semibold px-2.5 py-1 border rounded-md ${statusColor[broker.status] ?? ""}`}>
            {broker.status}
          </span>
        </header>

        <main className="px-8 py-8 space-y-6">
          {/* ── Listings Tab ── */}
          {tab === "listings" && (
            <>
              {/* Portfolio stat card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-slate-900 px-8 py-5">
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Total Amount Invested via Your Brokerage</p>
                  <p className="text-4xl font-bold text-gold">
                    {totalInvested > 0 ? `RWF ${totalInvested.toLocaleString()}` : "RWF 0"}
                  </p>
                </div>
                <div className="px-8 py-4 bg-white border-t border-gray-100 flex items-center justify-between">
                  <p className="text-sm text-gray-400">{brokerInvestments.length} total investment{brokerInvestments.length !== 1 ? "s" : ""}</p>
                  {brokerInvestments.length > 0 && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Active
                    </span>
                  )}
                </div>
              </div>

              {/* Line chart */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Monthly Sales</p>
                  <select
                    value={chartYear}
                    onChange={(e) => setChartYear(Number(e.target.value))}
                    className="border border-gray-200 rounded-md px-3 py-1.5 text-xs text-gray-700 outline-none focus:border-blue-500 bg-white"
                  >
                    {allYears.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false}
                      tickFormatter={(v) => v === 0 ? "0" : `${(v / 1000000).toFixed(1)}M`} />
                    <Tooltip content={<ChartTooltip />} />
                    <Line
                      type="monotone" dataKey="totalSales" stroke="#2563eb" strokeWidth={2.5}
                      dot={{ fill: "#2563eb", r: 3 }} activeDot={{ r: 5, fill: "#1d4ed8" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Listings table */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                  <h2 className="text-sm font-bold text-gray-900">Listings</h2>
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 text-xs font-semibold rounded-md transition-colors"
                  >
                    + Add Listing
                  </button>
                </div>
                {listings.length === 0 ? (
                  <p className="px-6 py-10 text-sm text-gray-400 text-center">No listings yet.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        {["Bond Name", "Rate", "Min Inv.", "Initial", "Left", "Broker Fee", ""].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {listings.map((l) => (
                        <tr key={l.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">{l.bondName}</span>
                              {!bondTypes.find((b) => b.id === l.bondTypeId)?.isActive && (
                                <span className="text-xs font-semibold bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-md">Bond Inactive</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 font-semibold text-blue-600">{l.couponRate}%</td>
                          <td className="px-4 py-3 text-gray-600">RWF {l.minInvestment.toLocaleString()}</td>
                          <td className="px-4 py-3 text-gray-500">{l.initialQuantity}</td>
                          <td className="px-4 py-3 font-semibold text-gray-900">{l.quantityAvailable}</td>
                          <td className="px-4 py-3">
                            {editingFeeId === l.id ? (
                              <div className="flex items-center gap-2">
                                <input type="number" value={editFeeVal} onChange={(e) => setEditFeeVal(e.target.value)} autoFocus
                                  className="w-24 border border-gray-200 rounded px-2 py-1 text-xs outline-none focus:border-blue-500" />
                                <button onClick={() => { updateBrokerFee(l.id, Number(editFeeVal)); setEditingFeeId(null); }}
                                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition-colors">Save</button>
                                <button onClick={() => setEditingFeeId(null)} className="text-xs text-gray-400 hover:text-gray-700">×</button>
                              </div>
                            ) : (
                              <span className="text-gray-700 font-medium">RWF {l.brokerFee.toLocaleString()}</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {editingFeeId !== l.id && (
                              <button onClick={() => { setEditingFeeId(l.id); setEditFeeVal(l.brokerFee.toString()); }}
                                className="text-xs text-blue-600 hover:text-blue-800 font-semibold">Edit Fee</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}

          {/* ── Receipts Tab ── */}
          {tab === "receipts" && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-sm font-bold text-gray-900">Client Receipts</h2>
                <p className="text-xs text-gray-400 mt-0.5">{receipts.length} total receipt{receipts.length !== 1 ? "s" : ""}</p>
              </div>
              {receipts.length === 0 ? (
                <p className="px-6 py-10 text-sm text-gray-400 text-center">No receipts yet.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {["Receipt ID", "Investor", "Total Paid", "Date"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {receipts.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs text-gray-500">{r.id}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900">{r.investorName}</td>
                        <td className="px-4 py-3 font-bold text-gold">RWF {r.totalPaid.toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-500">{r.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </main>
      </div>

      {showModal && (
        <AddListingModal
          brokerId={broker.id}
          brokerCompanyName={broker.companyName}
          contactPhone={broker.contactPhone}
          bondTypes={activeBondTypes}
          onClose={() => setShowModal(false)}
          onSubmit={addBrokerListing}
        />
      )}
    </div>
  );
};

export default BrokerDashboardPage;
