import { FC, useState, ChangeEvent } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import { Investor, Broker, BondType } from "../types";
import { Page } from "../App";

type AdminTab = "dashboard" | "investors" | "brokers" | "system-config" | "audit-logs";
interface Props { navigate: (page: Page) => void; }

const BAR_SHADES = ["#1d4ed8", "#3b82f6", "#93c5fd"];

const generateMonthYears = (): string[] => {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const now = new Date();
  const result: string[] = [];
  let year = 2024, month = 0;
  while (year < now.getFullYear() || (year === now.getFullYear() && month <= now.getMonth())) {
    result.push(`${months[month]} ${year}`);
    month++;
    if (month === 12) { month = 0; year++; }
  }
  return result;
};

const MONTH_YEARS = generateMonthYears();

// ── Chart Tooltip ─────────────────────────────────────────────────────────────
const ChartTooltip: FC<any> = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-xs shadow-sm">
      <p className="font-bold text-gray-900 mb-1">{d.brokerName}</p>
      <p className="text-gray-500">Total Sales: <span className="font-semibold text-gray-900">RWF {d.totalSales.toLocaleString()}</span></p>
      <p className="text-gray-500">Bonds Sold: <span className="font-semibold text-gray-900">{d.bondsSold}</span></p>
    </div>
  );
};

// ── Dashboard Tab ─────────────────────────────────────────────────────────────
const DashboardTab: FC<{ onNavigate: (tab: AdminTab) => void }> = ({ onNavigate }) => {
  const { investors, brokers, investments, adminMonthlyBrokerData, bondTypes } = useAuth();
  const [month, setMonth] = useState(MONTH_YEARS[MONTH_YEARS.length - 1]);
  const totalInvested = investments.reduce((s, i) => s + i.amountInvested, 0);
  const chartData = adminMonthlyBrokerData[month] ?? [];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Investors",       value: investors.length,                        tab: "investors"     as AdminTab },
          { label: "Total Brokers",         value: brokers.length,                          tab: "brokers"       as AdminTab },
          { label: "Total Bond Types",      value: bondTypes.length,                        tab: "system-config" as AdminTab },
          { label: "Total Amount Invested", value: `RWF ${totalInvested.toLocaleString()}`, tab: null },
        ].map((s) => (
          <button
            key={s.label}
            onClick={() => s.tab && onNavigate(s.tab)}
            className={`bg-white rounded-xl border border-gray-200 shadow-sm text-left transition-all overflow-hidden ${s.tab ? "hover:shadow-md cursor-pointer" : "cursor-default"}`}
          >
            <div className={`h-1 w-full ${s.tab ? "bg-blue-600" : "bg-gold"}`} />
            <div className="p-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{s.label}</p>
              <p className="text-3xl font-bold text-gold">{s.value}</p>
              {s.tab && <p className="text-xs text-gray-400 mt-2">Click to view →</p>}
            </div>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Top Brokers by Period</p>
          <select
            value={month} onChange={(e) => setMonth(e.target.value)}
            className="border border-gray-200 rounded-md px-3 py-1.5 text-xs text-gray-700 outline-none focus:border-blue-500 bg-white"
          >
            {MONTH_YEARS.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }} barSize={48}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="brokerName" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false}
              tickFormatter={(v) => v === 0 ? "0" : `${(v / 1000000).toFixed(1)}M`} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f9fafb" }} />
            <Bar dataKey="totalSales" radius={[4, 4, 0, 0]}>
              {chartData.map((_, i) => <Cell key={i} fill={BAR_SHADES[i % BAR_SHADES.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ── Investor Detail ───────────────────────────────────────────────────────────
const InvestorDetail: FC<{ investor: Investor; onBack: () => void }> = ({ investor, onBack }) => {
  const { getUserInvestments, getUserReceipts } = useAuth();
  const invList = getUserInvestments(investor.id);
  const receiptList = getUserReceipts(investor.id);

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 mb-6 transition-colors">
        ← All Investors
      </button>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="bg-slate-900 px-6 py-5">
          <h2 className="text-lg font-bold text-white">{investor.fullName}</h2>
          <p className="text-sm text-white/40 mt-0.5">{investor.email}</p>
        </div>
        <div className="grid grid-cols-2 divide-x divide-gray-100">
          <div className="px-6 py-4 text-sm">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">National ID</p>
            <p className="font-mono font-semibold text-gray-900">{investor.nationalId}</p>
          </div>
          <div className="px-6 py-4 text-sm">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Payout Account</p>
            <p className="font-mono font-semibold text-gray-900">{investor.payoutAccount}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-sm font-bold text-gray-900">Bonds ({invList.length})</h3>
          </div>
          {invList.length === 0 ? (
            <p className="px-5 py-8 text-xs text-gray-400 text-center">No investments</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {invList.map((inv) => (
                <div key={inv.id} className="px-5 py-3 text-xs">
                  <p className="font-semibold text-gray-900">{inv.bondName}</p>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-500">{inv.brokerCompanyName}</span>
                    <span className="font-bold text-gold">RWF {inv.amountInvested.toLocaleString()}</span>
                  </div>
                  <p className="text-gray-400 mt-0.5">{inv.purchaseDate}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-sm font-bold text-gray-900">Receipts ({receiptList.length})</h3>
          </div>
          {receiptList.length === 0 ? (
            <p className="px-5 py-8 text-xs text-gray-400 text-center">No receipts</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {receiptList.map((r) => (
                <div key={r.id} className="px-5 py-3 text-xs">
                  <div className="flex justify-between">
                    <span className="font-mono text-gray-400">{r.id}</span>
                    <span className="font-bold text-gold">RWF {r.totalPaid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-600">{r.brokerCompanyName}</span>
                    <span className="text-gray-400">{r.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Investors Tab ─────────────────────────────────────────────────────────────
const InvestorsTab: FC = () => {
  const { investors, getUserInvestments } = useAuth();
  const [selected, setSelected] = useState<Investor | null>(null);

  if (selected) return <InvestorDetail investor={selected} onBack={() => setSelected(null)} />;

  return (
    <div>
      {/* Count card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="h-1 w-full bg-blue-600" />
        <div className="p-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Total Registered Investors</p>
          <p className="text-3xl font-bold text-gold">{investors.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Name", "Email", "National ID", "Bonds", ""].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {investors.map((inv) => {
              const count = getUserInvestments(inv.id).length;
              return (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-semibold text-gray-900">{inv.fullName}</td>
                  <td className="px-5 py-3 text-gray-500">{inv.email}</td>
                  <td className="px-5 py-3 font-mono text-xs text-gray-500">{inv.nationalId}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                      {count} bond{count !== 1 ? "s" : ""}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button onClick={() => setSelected(inv)} className="text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                      View →
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── Broker Review Modal ───────────────────────────────────────────────────────
interface BrokerReviewModalProps {
  broker: Broker;
  onClose: () => void;
  onApprove: () => void;
  onReject: (reason: string) => void;
}

const BrokerReviewModal: FC<BrokerReviewModalProps> = ({ broker, onClose, onApprove, onReject }) => {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonErr, setReasonErr] = useState("");

  const handleReject = () => {
    if (!reason.trim()) { setReasonErr("A rejection reason is required."); return; }
    onReject(reason.trim());
    onClose();
  };

  const previewCert = () => {
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(
        `<!DOCTYPE html><html><head><title>${broker.rdbCertificateName}</title>` +
        `<style>body{font-family:system-ui,sans-serif;padding:2rem;max-width:640px;margin:0 auto;color:#1f2937}` +
        `.badge{display:inline-block;background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe;padding:2px 10px;border-radius:4px;font-size:12px;margin-bottom:1rem}` +
        `.card{border:1px solid #e5e7eb;border-radius:8px;padding:1.5rem;margin-top:1rem}</style></head>` +
        `<body><p class="badge">BNR Bond Market — Document Preview</p>` +
        `<h2 style="margin:0 0 4px">${broker.rdbCertificateName ?? "RDB Certificate"}</h2>` +
        `<div class="card"><p><strong>Company:</strong> ${broker.companyName}</p>` +
        `<p><strong>Email:</strong> ${broker.email}</p>` +
        `<p style="color:#6b7280;margin-top:1rem">[Mock document — actual certificate content would be displayed here in production]</p>` +
        `</div></body></html>`
      );
      w.document.close();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-lg overflow-hidden">
        <div className="bg-slate-900 px-6 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-bold text-white">Broker Review</h2>
            <p className="text-xs text-white/40 mt-0.5">{broker.companyName}</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl leading-none transition-colors">×</button>
        </div>

        <div className="p-6 space-y-4">
          {/* Company details grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: "Company Name",   value: broker.companyName },
              { label: "Email",          value: broker.email },
              { label: "Contact Phone",  value: broker.contactPhone },
              { label: "Account Name",   value: broker.collectionAccountName },
              { label: "Account Number", value: broker.collectionAccountNumber },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-lg px-4 py-3">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                <p className="font-semibold text-gray-900 break-all">{value}</p>
              </div>
            ))}

            {/* Certificate */}
            <div className="bg-gray-50 rounded-lg px-4 py-3">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">RDB Certificate</p>
              {broker.rdbCertificateName ? (
                <button
                  onClick={previewCert}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline text-left break-all"
                >
                  {broker.rdbCertificateName} ↗
                </button>
              ) : (
                <p className="text-sm font-semibold text-red-500">Not submitted</p>
              )}
            </div>
          </div>

          {/* Rejection reason */}
          {rejecting && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => { setReason(e.target.value); setReasonErr(""); }}
                rows={3}
                placeholder="Explain why this broker application is being rejected..."
                className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all resize-none"
              />
              {reasonErr && <p className="text-xs text-red-600">{reasonErr}</p>}
            </div>
          )}
        </div>

        <div className="flex gap-3 px-6 pb-6">
          {!rejecting ? (
            <>
              <button onClick={onClose} className="flex-1 border border-gray-200 rounded-md text-gray-700 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={() => setRejecting(true)} className="flex-1 border border-red-200 text-red-600 rounded-md py-2.5 text-sm font-semibold hover:bg-red-50 transition-colors">
                Reject
              </button>
              <button
                onClick={() => { onApprove(); onClose(); }}
                disabled={!broker.rdbCertificateName}
                title={!broker.rdbCertificateName ? "Certificate required before approval" : ""}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-md py-2.5 text-sm font-semibold transition-colors"
              >
                Approve
              </button>
            </>
          ) : (
            <>
              <button onClick={() => { setRejecting(false); setReason(""); setReasonErr(""); }}
                className="flex-1 border border-gray-200 rounded-md text-gray-700 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors">
                ← Back
              </button>
              <button onClick={handleReject} className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-md py-2.5 text-sm font-semibold transition-colors">
                Confirm Rejection
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Brokers Tab ───────────────────────────────────────────────────────────────
const BrokersTab: FC = () => {
  const { brokers, investments, getBrokerListings, verifyBroker, suspendBroker } = useAuth();
  const [reviewBroker, setReviewBroker] = useState<Broker | null>(null);
  const pending = brokers.filter((b) => b.status === "PENDING");
  const active  = brokers.filter((b) => b.status !== "PENDING");

  const brokerTotals = (broker: Broker) => ({
    amount: investments.filter((i) => i.brokerCompanyName === broker.companyName).reduce((s, i) => s + i.amountInvested, 0),
    listings: getBrokerListings(broker.id).length,
  });

  const statusStyle: Record<string, string> = {
    APPROVED:  "text-green-700 bg-green-50 border-green-200",
    PENDING:   "text-yellow-700 bg-yellow-50 border-yellow-200",
    SUSPENDED: "text-red-700 bg-red-50 border-red-200",
  };

  return (
    <div className="space-y-8">
      {/* Count card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="h-1 w-full bg-blue-600" />
        <div className="p-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Total Registered Brokers</p>
          <p className="text-3xl font-bold text-gold">{brokers.length}</p>
        </div>
      </div>

      {/* Pending */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Pending Approval</h2>
          <span className="text-xs text-gray-400">{pending.length} application{pending.length !== 1 ? "s" : ""}</span>
        </div>
        {pending.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-400">
            No pending applications.
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map((b) => (
              <div key={b.id} className="bg-white rounded-xl border border-yellow-200 shadow-sm overflow-hidden">
                <div className="bg-yellow-50 border-b border-yellow-100 px-6 py-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-yellow-700 uppercase tracking-wider">Pending Review</span>
                  {b.rdbCertificateName ? (
                    <span className="flex items-center gap-1.5 text-xs text-green-700 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                      Certificate submitted
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                      No certificate submitted
                    </span>
                  )}
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-bold text-gray-900">{b.companyName}</p>
                    <p className="text-sm text-gray-500">{b.email} · {b.contactPhone}</p>
                  </div>
                  <button
                    onClick={() => setReviewBroker(b)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-xs font-semibold rounded-md transition-colors ml-6 flex-shrink-0"
                  >
                    Review →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All brokers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">All Brokers</h2>
          <span className="text-xs text-gray-400">{active.length} registered</span>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Company", "Contact", "Listings", "Total Invested", "Status", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {active.map((b) => {
                const t = brokerTotals(b);
                return (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">{b.companyName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{b.email}</p>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-500">{b.contactPhone}</td>
                    <td className="px-5 py-4 text-gray-600">{t.listings}</td>
                    <td className="px-5 py-4 font-bold text-gold">RWF {t.amount.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-block text-xs font-semibold px-2 py-0.5 border rounded-md ${statusStyle[b.status] ?? ""}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {b.status === "APPROVED" && (
                        <button onClick={() => suspendBroker(b.id)} className="text-xs text-gray-400 hover:text-red-600 font-medium transition-colors">Suspend</button>
                      )}
                      {b.status === "SUSPENDED" && (
                        <button onClick={() => verifyBroker(b.id)} className="text-xs text-gray-400 hover:text-green-700 font-medium transition-colors">Reinstate</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {reviewBroker && (
        <BrokerReviewModal
          broker={reviewBroker}
          onClose={() => setReviewBroker(null)}
          onApprove={() => verifyBroker(reviewBroker.id)}
          onReject={(reason) => suspendBroker(reviewBroker.id, reason)}
        />
      )}
    </div>
  );
};

// ── Bond Modal (add / edit) ───────────────────────────────────────────────────
interface BondFormData { name: string; durationYears: string; couponRate: string; minInvestment: string; }

const BondModal: FC<{
  title: string;
  initial?: BondFormData;
  onClose: () => void;
  onSubmit: (d: BondFormData) => void;
}> = ({ title, initial, onClose, onSubmit }) => {
  const [form, setForm] = useState<BondFormData>(initial ?? { name: "", durationYears: "", couponRate: "", minInvestment: "" });
  const [err, setErr] = useState("");

  const set = (k: keyof BondFormData) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = () => {
    if (!form.name.trim()) { setErr("Bond name is required."); return; }
    if (!form.durationYears || isNaN(Number(form.durationYears)) || Number(form.durationYears) < 1) { setErr("Enter a valid duration."); return; }
    if (!form.couponRate || isNaN(Number(form.couponRate)) || Number(form.couponRate) <= 0) { setErr("Enter a valid coupon rate."); return; }
    if (!form.minInvestment || isNaN(Number(form.minInvestment)) || Number(form.minInvestment) < 1) { setErr("Enter a valid minimum investment."); return; }
    onSubmit(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-slate-900 px-6 py-5 flex justify-between items-center">
          <h2 className="text-sm font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl leading-none transition-colors">×</button>
        </div>
        <div className="p-6 space-y-4">
          {([
            { key: "name"          as const, label: "Bond Name",            ph: "e.g. 7-Year Treasury Bond", type: "text"   },
            { key: "durationYears" as const, label: "Duration (Years)",      ph: "e.g. 7",                    type: "number" },
            { key: "couponRate"    as const, label: "Coupon Rate (%)",       ph: "e.g. 8.5",                  type: "number" },
            { key: "minInvestment" as const, label: "Min. Investment (RWF)", ph: "e.g. 100000",               type: "number" },
          ]).map(({ key, label, ph, type }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
              <input
                type={type} value={form[key]} onChange={set(key)} placeholder={ph}
                className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
              />
            </div>
          ))}
          {err && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-md px-3 py-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
              <p className="text-xs text-red-600">{err}</p>
            </div>
          )}
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 border border-gray-200 rounded-md text-gray-700 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={submit} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2.5 text-sm font-semibold transition-colors">Save Bond</button>
        </div>
      </div>
    </div>
  );
};

// ── System Config Tab ─────────────────────────────────────────────────────────
const SystemConfigTab: FC = () => {
  const { bondTypes, toggleBondActive, updateBondType, addBondType } = useAuth();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<BondType | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Bond Configuration</h2>
          <p className="text-sm text-gray-400 mt-0.5">Manage available bond types for brokers and investors</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-semibold rounded-md transition-colors"
        >
          + New Bond Type
        </button>
      </div>

      <div className="space-y-3">
        {bondTypes.map((bond) => (
          <div
            key={bond.id}
            className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${bond.isActive ? "border-gray-200" : "border-gray-200 opacity-70"}`}
          >
            <div className="flex items-stretch">
              <div className={`px-6 py-5 flex flex-col items-center justify-center text-center w-28 flex-shrink-0 ${bond.isActive ? "bg-slate-900" : "bg-gray-400"}`}>
                <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1">Rate</p>
                <p className="text-xl font-bold text-gold">{bond.couponRate}%</p>
                <p className="text-xs text-white/40 mt-0.5">p.a.</p>
              </div>
              <div className="flex-1 px-6 py-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{bond.name}</h3>
                    {bond.isActive ? (
                      <span className="text-xs font-semibold bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-md">Active</span>
                    ) : (
                      <span className="text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200 px-2 py-0.5 rounded-md">Inactive</span>
                    )}
                  </div>
                  <div className="flex items-center gap-5 text-xs text-gray-500">
                    <span><span className="text-gray-400">Duration: </span><span className="font-semibold text-gray-900">{bond.durationYears} yrs</span></span>
                    <span><span className="text-gray-400">Min: </span><span className="font-semibold text-gray-900">RWF {bond.minInvestment.toLocaleString()}</span></span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-6">
                  <button
                    onClick={() => setEditing(bond)}
                    className="border border-gray-200 text-gray-600 px-3 py-1.5 text-xs font-medium rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleBondActive(bond.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      bond.isActive
                        ? "border border-red-200 text-red-600 hover:bg-red-50"
                        : "border border-green-200 text-green-700 hover:bg-green-50"
                    }`}
                  >
                    {bond.isActive ? "Disable" : "Enable"}
                  </button>
                </div>
              </div>
            </div>
            {!bond.isActive && (
              <div className="bg-gray-50 border-t border-gray-200 px-6 py-2.5">
                <p className="text-xs text-gray-400">
                  Bond is inactive — not visible to investors or brokers. Brokers with existing listings will see an "Inactive" notice.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {showAdd && (
        <BondModal
          title="Add New Bond Type"
          onClose={() => setShowAdd(false)}
          onSubmit={(d) => addBondType({
            name: d.name,
            durationYears: Number(d.durationYears),
            couponRate: Number(d.couponRate),
            minInvestment: Number(d.minInvestment),
          })}
        />
      )}
      {editing && (
        <BondModal
          title="Edit Bond Type"
          initial={{
            name: editing.name,
            durationYears: editing.durationYears.toString(),
            couponRate: editing.couponRate.toString(),
            minInvestment: editing.minInvestment.toString(),
          }}
          onClose={() => setEditing(null)}
          onSubmit={(d) => updateBondType(editing.id, {
            name: d.name,
            durationYears: Number(d.durationYears),
            couponRate: Number(d.couponRate),
            minInvestment: Number(d.minInvestment),
          })}
        />
      )}
    </div>
  );
};

// ── Audit Logs Tab ────────────────────────────────────────────────────────────
const AuditLogsTab: FC = () => {
  const { auditLogs } = useAuth();
  const logs = [...auditLogs].reverse();

  const actionColor: Record<string, string> = {
    BROKER_APPROVED:  "bg-green-50 text-green-700 border-green-200",
    BROKER_REJECTED:  "bg-red-50 text-red-700 border-red-200",
    BROKER_SUSPENDED: "bg-red-50 text-red-700 border-red-200",
    BOND_ADDED:       "bg-blue-50 text-blue-700 border-blue-200",
    BOND_UPDATED:     "bg-blue-50 text-blue-700 border-blue-200",
    BOND_ENABLED:     "bg-green-50 text-green-700 border-green-200",
    BOND_DISABLED:    "bg-gray-100 text-gray-600 border-gray-200",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Audit Logs</h2>
        <span className="text-xs text-gray-400">{logs.length} entries</span>
      </div>
      {logs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-sm text-gray-400">
          No audit log entries yet. Admin actions will appear here.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Timestamp", "Action", "Details", "Performed By"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-mono text-xs text-gray-400 whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-block text-xs font-semibold px-2 py-0.5 border rounded-md ${actionColor[log.action] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-600 text-xs">{log.details}</td>
                  <td className="px-5 py-3 text-gray-700 font-medium text-xs">{log.performedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ── Main AdminDashboardPage ───────────────────────────────────────────────────
const AdminDashboardPage: FC<Props> = ({ navigate }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-sm">Access restricted to administrators.</p>
      </div>
    );
  }

  const tabs: { key: AdminTab; label: string }[] = [
    { key: "dashboard",     label: "Dashboard" },
    { key: "investors",     label: "Investors" },
    { key: "brokers",       label: "Brokers" },
    { key: "system-config", label: "System Config" },
    { key: "audit-logs",    label: "Audit Logs" },
  ];

  const tabLabel = tabs.find((t) => t.key === activeTab)?.label ?? "";

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-slate-900 fixed h-screen flex flex-col">
        <div className="px-5 py-6 border-b border-white/10">
          <p className="text-xs font-semibold tracking-widest text-white/40 uppercase">BNR Bond Market</p>
          <p className="text-sm font-bold text-white mt-1">Admin</p>
        </div>
        <nav className="py-4 flex-1">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`w-full text-left px-5 py-2.5 text-sm transition-colors ${
                activeTab === t.key
                  ? "border-l-2 border-gold bg-white/5 font-semibold text-white"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}>
              {t.label}
            </button>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-xs text-white/30 truncate mb-2">{(user as any).fullName}</p>
          <button
            onClick={() => { logout(); navigate("home"); }}
            className="w-full text-left text-sm text-white/40 hover:text-white transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="ml-56 flex-1">
        <header className="bg-slate-800 px-8 py-4 sticky top-0 z-40">
          <h1 className="text-lg font-bold text-white">{tabLabel}</h1>
        </header>
        <main className="px-8 py-8">
          {activeTab === "dashboard"     && <DashboardTab onNavigate={setActiveTab} />}
          {activeTab === "investors"     && <InvestorsTab />}
          {activeTab === "brokers"       && <BrokersTab />}
          {activeTab === "system-config" && <SystemConfigTab />}
          {activeTab === "audit-logs"    && <AuditLogsTab />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
