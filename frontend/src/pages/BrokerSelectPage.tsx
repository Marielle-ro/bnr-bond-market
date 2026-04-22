import React from "react";
import { useAuth } from "../context/AuthContext";
import { Page, AppState } from "../App";
import { BondType, BrokerBondListing } from "../types";

interface Props {
  navigate: (page: Page, extra?: Partial<AppState>) => void;
  bond: BondType;
}

const BrokerSelectPage: React.FC<Props> = ({ navigate, bond }) => {
  const { brokerBondListings, brokers, user } = useAuth();

  const approvedBrokerIds = new Set(
    brokers.filter((b) => b.status === 'APPROVED').map((b) => b.id)
  );

  const listings = brokerBondListings
    .filter((l) => l.bondTypeId === bond.id && approvedBrokerIds.has(l.brokerId))
    .sort((a, b) => b.quantityAvailable - a.quantityAvailable);

  const handleSelect = (listing: BrokerBondListing) => {
    if (!user || user.role !== "INVESTOR") {
      navigate("login/investor", { selectedBond: bond, selectedBrokerListing: listing });
      return;
    }
    navigate("investor/checkout", { selectedBond: bond, selectedBrokerListing: listing });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-slate-900 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("investor/browse")}
            className="text-sm text-white/40 hover:text-white transition-colors"
          >
            ← Back to Bonds
          </button>
          <div className="h-4 w-px bg-white/10" />
          <div>
            <span className="text-sm font-bold text-white">{bond.name}</span>
            <span className="ml-2 text-sm text-white/40">— Select a Broker</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Bond summary card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
          <div className="bg-slate-900 px-8 py-5">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1">{bond.name}</p>
            <p className="text-3xl font-bold text-gold">{bond.couponRate}% <span className="text-base font-medium text-white/40">p.a.</span></p>
          </div>
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            <div className="px-8 py-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Coupon Rate</p>
              <p className="text-lg font-bold text-gray-900">{bond.couponRate}%</p>
            </div>
            <div className="px-8 py-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Min. Investment</p>
              <p className="text-lg font-bold text-gray-900">RWF {bond.minInvestment.toLocaleString()}</p>
            </div>
            <div className="px-8 py-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Term</p>
              <p className="text-lg font-bold text-gray-900">{bond.durationYears} years</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Available Brokers</h2>
          <span className="text-xs text-gray-400">{listings.length} broker{listings.length !== 1 ? "s" : ""} listed</span>
        </div>

        {listings.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-16 text-center text-gray-400 text-sm">
            No broker listings available for this bond.
          </div>
        ) : (
          <div className="space-y-3">
            {listings.map((listing, idx) => (
              <div
                key={listing.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="flex items-center justify-between p-5">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-gray-900 text-sm">{listing.brokerCompanyName}</h3>
                      {idx === 0 && (
                        <span className="text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-md">
                          Most Available
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-6 text-xs flex-wrap">
                      <div>
                        <span className="text-gray-400">Units Left </span>
                        <span className="font-semibold text-gray-900">{listing.quantityAvailable}</span>
                        <span className="text-gray-300"> / {listing.initialQuantity}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Broker Fee </span>
                        <span className="font-semibold text-gray-900">RWF {listing.brokerFee.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Rate </span>
                        <span className="font-semibold text-blue-600">{listing.couponRate}%</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Phone </span>
                        <span className="text-gray-700 font-medium">{listing.contactPhone}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSelect(listing)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-sm font-semibold rounded-md transition-colors ml-6 flex-shrink-0"
                  >
                    Select Broker →
                  </button>
                </div>
                {/* Availability progress bar */}
                <div className="h-1 bg-gray-100">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${Math.round((listing.quantityAvailable / listing.initialQuantity) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BrokerSelectPage;
