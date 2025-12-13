import { useState } from "react";
import { Calendar, MoreHorizontal, ChevronDown } from "lucide-react";

const MarketingScreen = () => {
  // 1. Mock Data matching your "Marketing" image
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
      roi: "+0%",
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
        return "bg-green-100 text-green-700"; // Green badge
      case "Paused":
        return "bg-yellow-100 text-yellow-700"; // Yellow badge
      case "Ended":
        return "bg-gray-500 text-white"; // Dark Grey/Black badge based on image
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* --- Page Title --- */}
      <h1 className="text-2xl font-bold text-gray-800">Marketing Campaigns</h1>

      {/* --- Top Controls Bar --- */}
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        {/* Time Period Toggles */}
        <div className="flex p-1 bg-gray-100 rounded-lg">
          <button className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-md text-sm font-medium shadow-sm">
            Last 30 Days
          </button>
          <button className="px-4 py-1.5 text-gray-600 hover:text-gray-900 text-sm font-medium">
            Last Quarter
          </button>
          <button className="px-4 py-1.5 text-gray-600 hover:text-gray-900 text-sm font-medium">
            Year to Date
          </button>
        </div>

        {/* Date Dropdown */}
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span>Last 1 Month</span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Card 1: Active Campaigns */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <p className="text-sm font-semibold text-gray-500">
            Active Campaigns
          </p>
          <h2 className="mt-2 text-3xl font-bold text-gray-800">2</h2>
        </div>

        {/* Card 2: Total Spend */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <p className="text-sm font-semibold text-gray-500">
            Total Spend (YTD)
          </p>
          <h2 className="mt-2 text-3xl font-bold text-gray-800">$11,000</h2>
        </div>

        {/* Card 3: ROI */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <p className="text-sm font-semibold text-gray-500">Average ROI</p>
          <h2 className="mt-2 text-3xl font-bold text-green-600">+102%</h2>
        </div>
      </div>

      {/* --- Main Content: Filters & Table --- */}
      <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
        {/* --- Filters Section --- */}
        <div className="flex flex-col justify-between gap-6 mb-8 xl:flex-row">
          {/* Campaign Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Campaign Status
            </label>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                All
              </button>
              <button className="px-4 py-1.5 text-gray-600 hover:bg-gray-50 rounded-full text-sm font-medium">
                Active
              </button>
              <button className="px-4 py-1.5 text-gray-600 hover:bg-gray-50 rounded-full text-sm font-medium">
                Paused
              </button>
              <button className="px-4 py-1.5 text-gray-600 hover:bg-gray-50 rounded-full text-sm font-medium">
                Ended
              </button>
            </div>
          </div>

          {/* Channel Filter */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Channel
            </label>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                All
              </button>
              <button className="px-4 py-1.5 text-gray-600 hover:bg-gray-50 rounded-full text-sm font-medium">
                Email
              </button>
              <button className="px-4 py-1.5 text-gray-600 hover:bg-gray-50 rounded-full text-sm font-medium">
                Social
              </button>
              <button className="px-4 py-1.5 text-gray-600 hover:bg-gray-50 rounded-full text-sm font-medium">
                PPC
              </button>
            </div>
          </div>

          {/* Date Range Picker */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Date Range
            </label>
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Calendar className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Start Date"
                  className="pl-10 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm w-32 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <span className="text-gray-400">-</span>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Calendar className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="End Date"
                  className="pl-10 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm w-32 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- Campaigns Table --- */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-sm font-semibold text-gray-600 bg-gray-50">
              <tr>
                <th className="w-10 px-4 py-3">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-4 py-3">Campaign Name</th>
                <th className="px-4 py-3">Channel</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Start Date</th>
                <th className="px-4 py-3">End Date</th>
                <th className="px-4 py-3">Budget</th>
                <th className="px-4 py-3">Spent</th>
                <th className="px-4 py-3">ROI</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {campaign.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {campaign.channel}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-semibold ${getStatusColor(
                        campaign.status
                      )}`}
                    >
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {campaign.startDate}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {campaign.endDate}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {campaign.budget}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{campaign.spent}</td>
                  <td className="px-4 py-3 font-bold text-green-600">
                    {campaign.roi}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
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
