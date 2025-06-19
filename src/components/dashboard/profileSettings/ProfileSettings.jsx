import React, { useState, useEffect } from "react";
import InputField from "../../common/InputField";
import { Button } from "../../common/Button";
import { fetchUserProfile } from "../../../services/userService"; // Add this import
import UserAvatar from "../../common/UserAvatar";

const TABS = [
  {
    label: "Profile Settings",
    icon: "/icons/user.svg",
    key: "profile",
  },
  {
    label: "Password",
    icon: "/icons/lock.svg",
    key: "password",
  },
  // {
  //   label: "Notification",
  //   icon: "/icons/bell-bold.svg",
  //   key: "notification",
  // },
];

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  // Profile form state
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    accountId: "",
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [notificationPrefs, setNotificationPrefs] = useState([
    { push: false, email: true, sms: false },
    { push: false, email: true, sms: false },
    { push: true, email: true, sms: true },
  ]);

  useEffect(() => {
    fetchUserProfile().then((data) => {
      setForm({
        firstName: data?.first_name || "",
        lastName: data?.last_name || "",
        email: data?.email || "",
        phone: data?.phone_number || "",
        gender: data?.gender || "",
        accountId: data?.ID || "",
      });
    });
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (groupIdx, type) => {
    setNotificationPrefs((prev) =>
      prev.map((group, idx) =>
        idx === groupIdx ? { ...group, [type]: !group[type] } : group
      )
    );
  };

  const NotificationToggle = ({ enabled, onChange, label }) => (
    <button
      type="button"
      onClick={onChange}
      className={`w-7 h-4 md:w-10 md:h-6 flex items-center rounded-full transition-colors duration-200 focus:outline-none
        ${enabled ? "bg-quaternary" : "bg-gray-300"}`}
      aria-pressed={enabled}
    >
      <span
        className={`inline-block w-2 h-2 md:w-5 md:h-5 transform bg-white rounded-full shadow transition-transform duration-200
          ${enabled ? "translate-x-4" : "translate-x-1"}`}
      />
      <span className="sr-only">{label}</span>
    </button>
  );

  return (
    <div className="mt-6">
      <div className="w-full px-4 md:px-10 text-2xl font-semibold mb-8">Account Settings</div>
      
      {/* Mobile Tab Bar */}
      <div className="block lg:hidden w-full mb-6 sm:mb-0 px-2">
        <div className="flex justify-between items-center px-0 sm:px-7  overflow-hidden">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex justify-between gap-1 items-center py-2 px-1 font-semibold text-sm transition
                ${activeTab === tab.key
                  ? "bg-[#FFF6F2] text-quaternary border-b-2 border-quaternary"
                  : "text-tertiary bg-transparent"
                }`}
            >
              <span
                className={`w-5 h-5 mb-1 mx-auto transition-colors ${
                  activeTab === tab.key ? "bg-quaternary" : "bg-tertiary"
                }`}
                style={{
                  WebkitMask: `url(${tab.icon}) center center / contain no-repeat`,
                  mask: `url(${tab.icon}) center center / contain no-repeat`,
                  display: "inline-block"
                }}
              />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 p-4 md:p-10">
        {/* Left: Tabs (Desktop only) */}
        <div className="w-full md:w-1/4 hidden lg:block">
          <div className="bg-white rounded-xl shadow p-0">
            <ul>
              {TABS.map((tab, idx) => (
                <li
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold cursor-pointer select-none
                    ${
                      activeTab === tab.key
                        ? "bg-[#FFF6F2] border-r-4 border-quaternary text-quaternary"
                        : "text-tertiary"
                    }
                    ${idx === 0 ? "rounded-t-xl" : ""}
                    ${idx === TABS.length - 1 ? "rounded-b-xl" : ""}
                  `}
                >
                  <span
                    className={`w-5 h-5 transition-colors ${
                      activeTab === tab.key ? "bg-quaternary" : "bg-tertiary"
                    }`}
                    style={{
                      WebkitMask: `url(${tab.icon}) center center / contain no-repeat`,
                      mask: `url(${tab.icon}) center center / contain no-repeat`,
                      display: "inline-block"
                    }}
                  />
                  {tab.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Right: Content */}
        <div className="flex-1 bg-white rounded-2xl shadow p-6 md:p-10">
          {/* Profile */}
          {activeTab === "profile" && (
            <>
              {/* Avatar Section */}
              <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div className="relative">
                  <UserAvatar/>
                  <button
                    className="absolute bottom-2 -right-2  text-white rounded-full p-"
                    title="Change Avatar"
                  >
                    <img src="/icons/camera.svg" alt="Change" className="w-7 h-7" />
                  </button>
                </div>
              {/* <div className="md:w-1/2 flex flex-col justify-center items-center gap-4">
                  <div className="flex gap-2 mt-4">
                    <Button variant="primary" size="sm" shape="rounded">
                      Upload New
                    </Button>
                    <Button variant="danger" size="sm" shape="rounded">
                      Delete Avatar
                    </Button>
                  </div>
                  <div className="text-sm text-tertiary mt-2">
                    Allowed JPG or PNG. Max size of 800K
                  </div>
                </div> */}
              </div>

              {/* Personal Details */}
              <div>
                <h2 className="text-xl font-semibold mb-1">Personal Details</h2>
                <p className="text-tertiary mb-6 text-sm">
                  To change your personal detail, edit and save from here
                </p>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 font-medium">First Name</label>
                      <InputField
                        name="firstName"
                        value={form.firstName}
                        onChange={handleProfileChange}
                        className="py-4 px-4 bg-bgLayout"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-medium">Last Name</label>
                      <InputField
                        name="lastName"
                        value={form.lastName}
                        onChange={handleProfileChange}
                        className="py-4 px-4 bg-bgLayout"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-medium">Email Address</label>
                      <InputField
                        name="email"
                        value={form.email}
                        onChange={handleProfileChange}
                        className="py-4 px-4 bg-bgLayout"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-medium">Phone Number</label>
                      <InputField
                        name="phone"
                        value={form.phone}
                        onChange={handleProfileChange}
                        className="py-4 px-4 bg-bgLayout"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="">
                      <label className="block mb-2 font-medium">Gender</label>
                      <div className="flex justify-between gap-4">
                        <label className="flex items-center gap-2 border border-secondary rounded-lg py-4 px-6 bg-bgLayout w-full">
                          <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={form.gender === "male"}
                            onChange={handleProfileChange}
                            className="accent-quaternary"
                          />
                          Male
                        </label>
                        <label className="flex items-center gap-2 border border-secondary rounded-lg py-4 px-6 bg-bgLayout w-full">
                          <input
                            type="radio"
                            name="gender"
                            value="female"
                            checked={form.gender === "female"}
                            onChange={handleProfileChange}
                            className="accent-quaternary"
                          />
                          Female
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block mb-2 font-medium">Account ID</label>
                      <input
                        type="text"
                        value={form.accountId}
                        disabled
                        className="w-full border border-secondary rounded-lg px-4 py-3 bg-secondary-light text-tertiary"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    variant="quinary"
                    size="lg"
                    shape="rounded"
                    className="mt-6"
                  >
                    Save Settings
                  </Button>
                </form>
              </div>
            </>
          )}

          {/* Password */}
          {activeTab === "password" && (
            <>
              <h2 className="text-xl font-semibold mb-1">Change Password</h2>
              <p className="text-tertiary mb-6 text-sm">
                To change your password please confirm here
              </p>
              <form className="space-y-6 ">
                <div>
                  <label className="block mb-2 font-medium">Current Password</label>
                  <InputField
                    name="current"
                    type="password"
                    value={passwordForm.current}
                    onChange={handlePasswordChange}
                    className="py-3 px-4 bg-bgLayout"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">New Password</label>
                  <InputField
                    name="new"
                    type="password"
                    value={passwordForm.new}
                    onChange={handlePasswordChange}
                    className="py-3 px-4 bg-bgLayout"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Confirm Password</label>
                  <InputField
                    name="confirm"
                    type="password"
                    value={passwordForm.confirm}
                    onChange={handlePasswordChange}
                    className="py-3 px-4 bg-bgLayout"
                  />
                </div>
                <Button
                  type="submit"
                  variant="quinary"
                  size="lg"
                  shape="rounded"
                  className="mt-6"
                >
                  Change Password
                </Button>
              </form>
            </>
          )}
          {/* Notification */}
          {activeTab === "notification" && (
            <div className="max-w-5xl">
              <h2 className="text-xl font-semibold mb-1">Notifications</h2>
              <p className="text-tertiary mb-6 text-sm">
                We may still you important notifications outside your notification settings.
              </p>
              <form className="space-y-8">
                {[0, 1, 2].map((groupIdx) => (
                  <div key={groupIdx} className="border-b border-secondary pb-6 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-center">
                    <div className="pr-3 sm:pr-8">
                    <h3 className="font-semibold mb-1">Reminders</h3>
                    <p className="text-tertiary text-sm mb-4">
                      These are notifications to remind you of updates you might have missed.
                    </p>
                    </div>
                    <div className="flex flex-col flex-wrap gap-6">
                      {["Push", "Email", "SMS"].map((type, idx) => (
                        <div key={type} className="flex items-center gap-1 md:gap-6">
                          <NotificationToggle
                            enabled={notificationPrefs[groupIdx][type.toLowerCase()]}
                            onChange={() => handleToggle(groupIdx, type.toLowerCase())}
                            label={type}
                          />
                          <span className="font-medium text-sm md:text-base">{type}</span>
                        </div>
                      ))}
                    </div>
                    </div>
                  </div>
                ))}
                <Button
                  type="submit"
                  variant="quinary"
                  size="lg"
                  shape="rounded"
                  className="mt-6"
                >
                  Save Settings
                </Button>
              </form>
            </div>
            )}
          </div>
        </div>
      </div>
    
  );
};

export default ProfileSettings;
