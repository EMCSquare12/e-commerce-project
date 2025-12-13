import { useState } from "react";
import { Save } from "lucide-react";

const SettingsScreen = () => {
  // 1. State for Tabs
  const [activeTab, setActiveTab] = useState("General");

  // 2. State for Form Fields (Pre-filled to match image)
  const [settings, setSettings] = useState({
    siteName: "e-commerce",
    siteUrl: "https://www.e-commerce.com",
    supportEmail: "support@e-commerce.com",
    currency: "USD",
    timezone: "UTC",
    language: "English",
    maintenanceMode: false,
  });

  const tabs = [
    "General",
    "Account",
    "Notifications",
    "Store Details",
    "Payment Gateways",
    "Shipping",
    "Taxes",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const toggleMaintenance = () => {
    setSettings((prev) => ({
      ...prev,
      maintenanceMode: !prev.maintenanceMode,
    }));
  };

  return (
    <div className="space-y-6">
      {/* --- Page Title --- */}
      <h1 className="text-2xl font-bold text-gray-800">Settings</h1>

      {/* --- Main Content Card --- */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
        {/* --- Tabs Header --- */}
        <div className="px-6 border-b border-gray-200">
          <div className="flex space-x-8 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* --- Tab Content (General) --- */}
        <div className="p-6">
          {activeTab === "General" && (
            <div className="max-w-4xl space-y-6">
              {/* Site Name */}
              <div className="grid grid-cols-1 gap-1">
                <label className="text-sm font-semibold text-gray-700">
                  Site Name
                </label>
                <input
                  type="text"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Site URL */}
              <div className="grid grid-cols-1 gap-1">
                <label className="text-sm font-semibold text-gray-700">
                  Site URL{" "}
                  <span className="ml-1 font-normal text-gray-400">
                    https://www.e-commerce.com
                  </span>
                </label>
                {/* Visual only input for display matching image style */}
                <div className="w-full px-3 py-2 text-gray-500 border border-gray-200 rounded-lg cursor-not-allowed bg-gray-50">
                  {settings.siteUrl}
                </div>
              </div>

              {/* Contact Email */}
              <div className="grid grid-cols-1 gap-1">
                <label className="text-sm font-semibold text-gray-700">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="supportEmail"
                  value={settings.supportEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Dropdowns Row */}
              <div className="grid grid-cols-1 gap-6">
                {/* Currency */}
                <div className="grid grid-cols-1 gap-1">
                  <label className="text-sm font-semibold text-gray-700">
                    Default Currency
                  </label>
                  <select
                    name="currency"
                    value={settings.currency}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-gray-900 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>

                {/* Timezone */}
                <div className="grid grid-cols-1 gap-1">
                  <label className="text-sm font-semibold text-gray-700">
                    Timezone
                  </label>
                  <select
                    name="timezone"
                    value={settings.timezone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-gray-900 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">EST</option>
                    <option value="PST">PST</option>
                  </select>
                </div>

                {/* Language */}
                <div className="grid grid-cols-1 gap-1">
                  <label className="text-sm font-semibold text-gray-700">
                    Language
                  </label>
                  <select
                    name="language"
                    value={settings.language}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-gray-900 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                  </select>
                </div>
              </div>

              {/* Maintenance Mode Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <label className="text-sm font-semibold text-gray-700">
                  Maintenance Mode
                </label>
                <button
                  onClick={toggleMaintenance}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    settings.maintenanceMode ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.maintenanceMode
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-500">
                  {settings.maintenanceMode ? "On" : "Off"}
                </span>
              </div>

              {/* Save Button */}
              <div className="pt-4">
                <button className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Placeholders for other tabs */}
          {activeTab !== "General" && (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <p>{activeTab} settings content goes here...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
