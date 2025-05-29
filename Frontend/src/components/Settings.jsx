
import {  FaUpload } from 'react-icons/fa';
import { Switch } from '@headlessui/react';
import { useState } from 'react';

const TABS = ['Profile', 'Security', 'Preferences'];

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [darkMode, setDarkMode] = useState(false);
  const [form, setForm] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: '',
    avatar: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, avatar: URL.createObjectURL(file) }));
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Profile':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={form.avatar || 'https://via.placeholder.com/100'}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover border"
              />
              <label className="cursor-pointer text-sm font-medium text-indigo-600 flex items-center gap-2">
                <FaUpload />
                Upload Avatar
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleInputChange}
                className="w-full border px-4 py-2 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleInputChange}
                className="w-full border px-4 py-2 rounded-lg"
              />
            </div>
          </div>
        );
      case 'Security':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleInputChange}
                className="w-full border px-4 py-2 rounded-lg"
              />
            </div>
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
              Update Password
            </button>
          </div>
        );
      case 'Preferences':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Dark Mode</span>
              <Switch
                checked={darkMode}
                onChange={setDarkMode}
                className={`${
                  darkMode ? 'bg-indigo-600' : 'bg-gray-300'
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span
                  className={`${
                    darkMode ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
      <div className="flex gap-4 border-b pb-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-medium pb-2 ${
              activeTab === tab
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        {renderTabContent()}
        {activeTab === 'Profile' && (
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
};

export default Settings;
