import React, { useState, useEffect } from "react";
import UserAvatar from "../../common/UserAvatar";
import Toast from "../../common/Toast";
import ProfileForm from "../../common/ProfileForm";
import PasswordForm from "../../common/PasswordForm";
import { fetchUserProfile, editUserProfile, changeUserPassword } from "../../../services/userService";
import { fetchUserDetails } from "../../../controllers/userController";

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
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    accountId: "",
    profile_image: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [notificationPrefs, setNotificationPrefs] = useState([
    { push: false, email: true, sms: false },
    { push: false, email: true, sms: false },
    { push: true, email: true, sms: true },
  ]);

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  useEffect(() => {
    fetchUserProfile().then((data) => {
      setProfile({
        firstName: data?.first_name || "",
        lastName: data?.last_name || "",
        email: data?.email || "",
        phone: data?.phone_number || "",
        gender: data?.gender || "",
        accountId: data?.ID || "",
        profile_image: data?.profile_image || ""
      });
    });
  }, []);

  const handleProfileSubmit = async (values) => {
    setProfileLoading(true);
    setToast({ show: false, message: '', type: 'info' });
    const payload = {
      first_name: values.firstName,
      last_name: values.lastName,
      email: values.email,
      phone_number: values.phone,
      gender: values.gender,
    };
    const result = await editUserProfile(payload);
    if (result.success) {
      await fetchUserDetails();
      setToast({ show: true, message: 'Profile updated successfully!', type: 'success' });
      setProfile(values);
    } else {
      setToast({ show: true, message: result.message || 'Failed to update profile.', type: 'error' });
    }
    setProfileLoading(false);
  };

  const handlePasswordSubmit = async (values) => {
    setPasswordLoading(true);
    setToast({ show: false, message: '', type: 'info' });
    const result = await changeUserPassword(values);
    if (result.success) {
      setToast({ show: true, message: 'Password changed successfully!', type: 'success' });
    } else {
      setToast({ show: true, message: result.message || 'Failed to change password.', type: 'error' });
    }
    setPasswordLoading(false);
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
        className={`inline-block w-2 h-2 md:w-5 md:h-5 transform bg-white rounded-full  transition-transform duration-200
          ${enabled ? "translate-x-4" : "translate-x-1"}`}
      />
      <span className="sr-only">{label}</span>
    </button>
  );

  return (
    <div className="mt-6">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
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
        <div className="flex-1 bg-white p-6 md:p-10">
          {/* Profile */}
          {activeTab === "profile" && (
            <>
              <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div className="relative">
                  <UserAvatar src={profile.profile_image} />
                  <button
                    className="absolute bottom-2 -right-2  text-white rounded-full p-"
                    title="Change Avatar"
                  >
                    <img src="/icons/camera.svg" alt="Change" className="w-7 h-7" />
                  </button>
                </div>
              </div>
              <ProfileForm
                initialValues={profile}
                onSubmit={handleProfileSubmit}
                loading={profileLoading}
              />
            </>
          )}

          {/* Password */}
          {activeTab === "password" && (
            <PasswordForm
              onSubmit={handlePasswordSubmit}
              loading={passwordLoading}
            />
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
                 Save Profile
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
