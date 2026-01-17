import { useState } from "react";
import {
  Calendar,
  MoreHorizontal,
  ChevronDown,
  Megaphone,
  TrendingUp,
  DollarSign,
  Filter,
} from "lucide-react";

const MarketingScreen = () => {
  //Mock Data
  const campaigns = [
    {
      id: 1,
      name: "Summer Sale Email",
      channel: "Email",
      status: "Active",
      startDate: "2023-06-01",
      endDate: "2023-08-31",
      budget: "$5,000",
      spent: "$2,500",
      roi: "+120%",
    },
    {
      id: 2,
      name: "Social Media Push",
      channel: "Social",
      status: "Active",
      startDate: "2023-07-01",
      endDate: "2023-09-30",
      budget: "$10,000",
      spent: "$4,500",
      roi: "+90%",
    },
    {
      id: 3,
      name: "Google Ads Q4",
      channel: "PPC",
      status: "Paused",
      startDate: "2023-10-01",
      endDate: "2023-12-31",
      budget: "$15,000",
      spent: "$1,000",
      roi: "0%",
    },
    {
      id: 4,
      name: "Spring Clearance",
      channel: "Email",
      status: "Ended",
      startDate: "2023-03-01",
      endDate: "2023-05-31",
      budget: "$3,000",
      spent: "$3,000",
      roi: "+200%",
    },
  ];

  // Helper for status badge styling
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Paused":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Ended":
        return "bg-slate-100 text-slate-600 border-slate-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="pb-24 space-y-6 md:pb-8">
      {/* --- Page Title & Controls --- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          Marketing Campaigns
        </h1>

        {/* Date Dropdown */}
        <button className="flex items-center justify-between w-full gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg sm:w-auto hover:bg-gray-50">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>Last 30 Days</span>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Active Campaigns */}
        <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">
                Active Campaigns
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-800">2</h2>
            </div>
            <div className="p-2 rounded-lg bg-blue-50">
              <Megaphone className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Total Spend */}
        <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">
                Total Spend (YTD)
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-800">
                $11,000
              </h2>
            </div>
            <div className="p-2 rounded-lg bg-rose-50">
              <DollarSign className="w-5 h-5 text-rose-600" />
            </div>
          </div>
        </div>

        {/* ROI */}
        <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">
                Average ROI
              </p>
              <h2 className="flex items-center gap-1 mt-1 text-2xl font-bold text-emerald-600">
                <TrendingUp className="w-5 h-5" /> +102%
              </h2>
            </div>
            <div className="p-2 rounded-lg bg-emerald-50">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
        {/* --- Filters Header --- */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Status Filter (Scrollable on mobile) */}
            <div className="space-y-2">
              <label className="flex items-center gap-1 text-xs font-bold text-gray-500 uppercase">
                <Filter className="w-3 h-3" /> Status
              </label>
              <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-hide">
                <button className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-sm font-medium whitespace-nowrap">
                  All
                </button>
                <button className="px-4 py-1.5 text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-full text-sm font-medium whitespace-nowrap">
                  Active
                </button>
                <button className="px-4 py-1.5 text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-full text-sm font-medium whitespace-nowrap">
                  Paused
                </button>
                <button className="px-4 py-1.5 text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-full text-sm font-medium whitespace-nowrap">
                  Ended
                </button>
              </div>
            </div>

            {/* Channel Filter (Scrollable on mobile) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Channel
              </label>
              <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-hide">
                <button className="px-4 py-1.5 bg-amber-100 text-amber-800 border border-amber-200 rounded-full text-sm font-medium whitespace-nowrap">
                  All Channels
                </button>
                <button className="px-4 py-1.5 text-gray-600 hover:bg-gray-50 rounded-full text-sm font-medium whitespace-nowrap">
                  Email
                </button>
                <button className="px-4 py-1.5 text-gray-600 hover:bg-gray-50 rounded-full text-sm font-medium whitespace-nowrap">
                  Social
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- Mobile Card List View --- */}
        <div className="p-4 space-y-4 md:hidden bg-gray-50">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-slate-800">{campaign.name}</h3>
                  <span className="text-xs text-gray-500">
                    {campaign.channel}
                  </span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(campaign.status)}`}
                >
                  {campaign.status}
                </span>
              </div>

              <div className="grid grid-cols-2 mb-3 text-sm gap-y-2 gap-x-4">
                <div>
                  <p className="text-xs text-gray-400">Budget</p>
                  <p className="font-medium text-slate-700">
                    {campaign.budget}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Spent</p>
                  <p className="font-medium text-slate-700">{campaign.spent}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">ROI</p>
                  <p
                    className={`font-bold ${campaign.roi.includes("+") ? "text-emerald-600" : "text-gray-600"}`}
                  >
                    {campaign.roi}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Ends</p>
                  <p className="font-medium text-slate-700">
                    {campaign.endDate}
                  </p>
                </div>
              </div>

              <button className="w-full py-2 mt-1 text-sm font-medium text-center text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* --- Desktop Table View --- */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left">
            <thead className="text-xs font-bold text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3">Campaign Name</th>
                <th className="px-6 py-3">Channel</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Duration</th>
                <th className="px-6 py-3">Budget / Spent</th>
                <th className="px-6 py-3">ROI</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {campaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-semibold text-slate-800">
                    {campaign.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {campaign.channel}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(campaign.status)}`}
                    >
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    <div>Start: {campaign.startDate}</div>
                    <div>End: {campaign.endDate}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">
                      {campaign.budget}
                    </div>
                    <div className="text-xs text-gray-500">
                      Spent: {campaign.spent}
                    </div>
                  </td>
                  <td
                    className={`px-6 py-4 font-bold ${campaign.roi.includes("+") ? "text-emerald-600" : "text-gray-600"}`}
                  >
                    {campaign.roi}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 transition-colors rounded-md hover:text-slate-600 hover:bg-gray-100">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MarketingScreen;
