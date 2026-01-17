import { useState } from "react";
import {
  Save,
  Globe,
  Mail,
  DollarSign,
  Clock,
  Languages,
  AlertTriangle,
} from "lucide-react";

const SettingsScreen = () => {
  const [activeTab, setActiveTab] = useState("General");

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
    "Payment",
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
    <div className="max-w-5xl pb-24 mx-auto space-y-6 md:pb-8">
      {/* --- Page Title --- */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
      </div>

      {/* --- Main Content Card --- */}
      <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
        {/* --- Tabs Header (Scrollable) --- */}
        <div className="overflow-x-auto border-b border-gray-200 scrollbar-hide">
          <div className="flex px-4 md:px-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-4 text-sm font-bold whitespace-nowrap border-b-2 transition-all ${
                  activeTab === tab
                    ? "border-amber-500 text-slate-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* --- Tab Content --- */}
        <div className="p-5 md:p-8">
          {activeTab === "General" ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
              {/* Section 1: Site Identity */}
              <div className="space-y-5">
                <h3 className="pb-2 text-sm font-bold tracking-wider text-gray-400 uppercase border-b border-gray-100">
                  Site Identity
                </h3>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {/* Site Name */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">
                      Site Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Globe className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="siteName"
                        value={settings.siteName}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Site URL */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">
                      Site URL
                    </label>
                    <div className="w-full px-3 py-2.5 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed select-none">
                      {settings.siteUrl}
                    </div>
                  </div>

                  {/* Contact Email */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">
                      Contact Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Mail className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="supportEmail"
                        value={settings.supportEmail}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Regional Settings */}
              <div className="space-y-5">
                <h3 className="pb-2 text-sm font-bold tracking-wider text-gray-400 uppercase border-b border-gray-100">
                  Regional Settings
                </h3>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  {/* Currency */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">
                      Currency
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                      </div>
                      <select
                        name="currency"
                        value={settings.currency}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-8 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white appearance-none"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>
                  </div>

                  {/* Timezone */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">
                      Timezone
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Clock className="w-4 h-4 text-gray-400" />
                      </div>
                      <select
                        name="timezone"
                        value={settings.timezone}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-8 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white appearance-none"
                      >
                        <option value="UTC">UTC (GMT+0)</option>
                        <option value="EST">EST (GMT-5)</option>
                        <option value="PST">PST (GMT-8)</option>
                      </select>
                    </div>
                  </div>

                  {/* Language */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">
                      Language
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Languages className="w-4 h-4 text-gray-400" />
                      </div>
                      <select
                        name="language"
                        value={settings.language}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-8 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white appearance-none"
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: System Status */}
              <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${settings.maintenanceMode ? "bg-amber-100 text-amber-600" : "bg-white text-gray-400 border border-gray-200"}`}
                    >
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Maintenance Mode
                      </p>
                      <p className="text-xs text-gray-500">
                        Prevent users from accessing the store.
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={toggleMaintenance}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${
                      settings.maintenanceMode ? "bg-amber-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                        settings.maintenanceMode
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t border-gray-100">
                <button className="flex items-center justify-center w-full gap-2 px-6 py-3 text-sm font-bold text-white transition-all shadow-md bg-slate-900 rounded-xl hover:bg-slate-800 hover:shadow-lg active:scale-95 sm:w-auto">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="p-4 mb-3 rounded-full bg-gray-50">
                <Globe className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                {activeTab} Settings
              </h3>
              <p className="text-gray-500">
                This section is currently under development.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
