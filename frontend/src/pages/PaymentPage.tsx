import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Page, AppState } from "../App";
import { BondType, BrokerBondListing, Receipt } from "../types";

interface Props {
  navigate: (page: Page, extra?: Partial<AppState>) => void;
  bond: BondType;
  brokerListing: BrokerBondListing;
}

type PaymentMethod = "bank" | "mtn";
const BANKS = ["Bank of Kigali", "Equity Bank", "I&M Bank"];

const SuccessView: React.FC<{ receipt: Receipt; onDone: () => void }> = ({ receipt, onDone }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-full max-w-md overflow-hidden">
      {/* Success header */}
      <div className="bg-slate-900 px-10 py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-green-500/20 border border-green-400/30 flex items-center justify-center mx-auto mb-4">
          <span className="text-green-400 text-xl font-bold">✓</span>
        </div>
        <h1 className="text-xl font-bold text-white">Payment Successful</h1>
        <p className="text-sm text-white/40 mt-1">Your bond investment has been processed.</p>
      </div>

      {/* Receipt details */}
      <div className="divide-y divide-gray-100 text-sm">
        <div className="flex justify-between px-6 py-3.5">
          <span className="text-gray-500">Receipt ID</span>
          <span className="font-mono text-xs text-gray-700">{receipt.id}</span>
        </div>
        <div className="flex justify-between px-6 py-3.5">
          <span className="text-gray-500">Investor</span>
          <span className="font-medium text-gray-900">{receipt.investorName}</span>
        </div>
        <div className="flex justify-between px-6 py-3.5">
          <span className="text-gray-500">Broker</span>
          <span className="font-medium text-gray-900">{receipt.brokerCompanyName}</span>
        </div>
        {receipt.collectionAccountName && (
          <div className="flex justify-between px-6 py-3.5">
            <span className="text-gray-500">Account Name</span>
            <span className="font-medium text-gray-900">{receipt.collectionAccountName}</span>
          </div>
        )}
        {receipt.collectionAccountNumber && (
          <div className="flex justify-between px-6 py-3.5">
            <span className="text-gray-500">Account Number</span>
            <span className="font-mono text-gray-900">{receipt.collectionAccountNumber}</span>
          </div>
        )}
        <div className="flex justify-between px-6 py-3.5">
          <span className="text-gray-500">Total Paid</span>
          <span className="font-bold text-gold">RWF {receipt.totalPaid.toLocaleString()}</span>
        </div>
        <div className="flex justify-between px-6 py-3.5">
          <span className="text-gray-500">Date</span>
          <span className="text-gray-900">{receipt.date}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 space-y-2">
        <button
          onClick={() => {
            const lines = [
              "BNR BOND MARKET — INVESTMENT RECEIPT",
              "=====================================",
              `Receipt ID:   ${receipt.id}`,
              `Date:         ${receipt.date}`,
              `Investor:     ${receipt.investorName}`,
              `Broker:       ${receipt.brokerCompanyName}`,
              ...(receipt.collectionAccountName  ? [`Acct Name:    ${receipt.collectionAccountName}`]  : []),
              ...(receipt.collectionAccountNumber ? [`Acct Number:  ${receipt.collectionAccountNumber}`] : []),
              `Total Paid:   RWF ${receipt.totalPaid.toLocaleString()}`,
            ].join("\n");
            const blob = new Blob([lines], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = `receipt-${receipt.id}.txt`; a.click();
            URL.revokeObjectURL(url);
          }}
          className="w-full border border-gray-200 text-gray-700 py-2.5 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
        >
          Download Receipt
        </button>
        <button
          onClick={onDone}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 text-sm font-semibold rounded-md transition-colors"
        >
          View My Portfolio
        </button>
      </div>
    </div>
  </div>
);

const PaymentPage: React.FC<Props> = ({ navigate, bond, brokerListing }) => {
  const { user, addInvestment, addReceipt, brokers } = useAuth();

  const broker = brokers.find((b) => b.id === brokerListing.brokerId);
  const collectionAccountName   = broker?.collectionAccountName   ?? brokerListing.brokerCompanyName;
  const collectionAccountNumber = broker?.collectionAccountNumber ?? "—";

  const [amount, setAmount] = useState(bond.minInvestment.toString());
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bank");
  const [selectedBank, setSelectedBank] = useState(BANKS[0]);
  const [acctName, setAcctName] = useState("");
  const [acctNumber, setAcctNumber] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  if (!user || user.role !== "INVESTOR") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Sign in to complete your investment.</p>
          <button onClick={() => navigate("login/investor")} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-semibold rounded-md">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (receipt) {
    return <SuccessView receipt={receipt} onDone={() => navigate("investor/dashboard")} />;
  }

  const numAmount = Number(amount);
  const isAmountValid = !isNaN(numAmount) && numAmount >= bond.minInvestment;
  const totalDue = isAmountValid ? numAmount + brokerListing.brokerFee : 0;

  const handlePay = () => {
    if (!isAmountValid) { setError(`Minimum investment is RWF ${bond.minInvestment.toLocaleString()}.`); return; }
    if (!acctName.trim()) { setError("Please enter your account name."); return; }
    if (!acctNumber.trim()) { setError("Please enter your account number."); return; }
    setError("");
    setProcessing(true);

    setTimeout(() => {
      const investment = addInvestment({
        investorId: (user as any).id,
        bondName: bond.name,
        amountInvested: numAmount,
        interestRate: bond.couponRate,
        durationYears: bond.durationYears,
        bondNumber: `BOND-${Date.now()}`,
        purchaseDate: new Date().toISOString().split("T")[0],
        brokerCompanyName: brokerListing.brokerCompanyName,
        nextPayoutDate: new Date(Date.now() + bond.durationYears * 365 * 86400000).toISOString().split("T")[0],
        expectedInterestAmount: Math.round((numAmount * bond.couponRate * bond.durationYears) / 100),
      });

      const newReceipt = addReceipt({
        investmentId: investment.id,
        investorName: (user as any).fullName,
        brokerCompanyName: brokerListing.brokerCompanyName,
        totalPaid: totalDue,
        date: new Date().toISOString().split("T")[0],
        collectionAccountName,
        collectionAccountNumber,
      });

      setProcessing(false);
      setReceipt(newReceipt);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-slate-900">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate("investor/dashboard")} className="text-sm text-white/40 hover:text-white transition-colors">
            ← Return to Home
          </button>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-sm font-medium text-white/60">{bond.name}</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complete Investment</h1>
          <p className="text-sm text-gray-400 mt-1">{bond.name} via {brokerListing.brokerCompanyName}</p>
        </div>

        {/* Bond details */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-slate-900 px-6 py-4">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">Bond Details</p>
          </div>
          <div className="grid grid-cols-3 divide-x divide-gray-100 text-sm">
            <div className="px-6 py-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Coupon Rate</p>
              <p className="font-bold text-gray-900">{bond.couponRate}%</p>
            </div>
            <div className="px-6 py-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Duration</p>
              <p className="font-bold text-gray-900">{bond.durationYears} years</p>
            </div>
            <div className="px-6 py-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Min. Investment</p>
              <p className="font-bold text-gray-900">RWF {bond.minInvestment.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Broker collection account */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-blue-50 border-b border-blue-100 px-6 py-4">
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-widest">Transfer Funds To</p>
          </div>
          <div className="px-6 py-4 space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Broker</span>
              <span className="font-semibold text-gray-900">{brokerListing.brokerCompanyName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Account Name</span>
              <span className="font-semibold text-gray-900">{collectionAccountName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Account Number</span>
              <span className="font-mono font-semibold text-gray-900">{collectionAccountNumber}</span>
            </div>
          </div>
          <div className="px-6 pb-4">
            <p className="text-xs text-gray-400">
              After payment, funds are credited to the broker's registered collection account held at BNR.
            </p>
          </div>
        </div>

        {/* Payment method */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-slate-900 px-6 py-4">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">Payment Method</p>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="flex gap-3">
              {(["bank", "mtn"] as PaymentMethod[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={`flex-1 border rounded-md py-2.5 text-sm font-semibold transition-colors ${
                    paymentMethod === m
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-200 text-gray-600 hover:border-blue-400"
                  }`}
                >
                  {m === "bank" ? "Bank Transfer" : "MTN Mobile Money"}
                </button>
              ))}
            </div>

            {paymentMethod === "bank" && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Select Bank</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all bg-white"
                >
                  {BANKS.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {paymentMethod === "bank" ? "Account Name" : "Mobile Money Name"}
              </label>
              <input
                value={acctName} onChange={(e) => setAcctName(e.target.value)}
                placeholder={paymentMethod === "bank" ? "Your full name on account" : "Name on MoMo account"}
                className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {paymentMethod === "bank" ? "Account Number" : "Mobile Number"}
              </label>
              <input
                value={acctNumber} onChange={(e) => setAcctNumber(e.target.value)}
                placeholder={paymentMethod === "bank" ? "1234567890" : "+250 78X XXX XXX"}
                className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Investment amount + math */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-slate-900 px-6 py-4">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">Investment Amount</p>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Base Investment (min. RWF {bond.minInvestment.toLocaleString()})
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={bond.minInvestment}
                className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
              />
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Base Investment</span>
                <span>RWF {isAmountValid ? numAmount.toLocaleString() : "—"}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Broker Fee</span>
                <span>RWF {brokerListing.brokerFee.toLocaleString()}</span>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-900">Total Amount Due</span>
              <span className="text-xl font-bold text-gold">RWF {isAmountValid ? totalDue.toLocaleString() : "—"}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-md px-4 py-3">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          onClick={handlePay}
          disabled={processing}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3.5 text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing…
            </>
          ) : "Pay Now"}
        </button>
      </main>
    </div>
  );
};

export default PaymentPage;
