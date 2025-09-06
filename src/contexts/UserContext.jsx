import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchUserProfile } from "../services/userService"; // Use fetchUserProfile
import { triggerRentalCronjob } from "../services/rentalService";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    // Always fetch from API on mount/reload
    fetchUserProfile()
      .then(data => {
        if (cancelled) return;
        const userData = {
          name: (data?.first_name && data?.last_name)
            ? `${data.first_name} ${data.last_name}`
            : (data?.fullName || 'User'),
          email: data?.email || '',
          avatar: data?.profile_image
            ? data.profile_image
            : (data?.avatar || '/icons/female.svg'),
          stage: data?.stage || { name: 'Level 1' },
          percentage: typeof data?.percentage === 'number' ? data.percentage : 0,
          ...data,
        };
        setUser(userData);
        
        // Trigger rental cronjob after successful profile fetch
        if (data?.userID || data?.ID) {
          triggerRentalCronjob(data.userID || data.ID);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setUser({
          name: 'User',
          email: '',
          avatar: '/icons/female.svg',
          stage: { name: 'Level 1' },
          percentage: 0,
        });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  // Only render children after loading is false (prevents null context)
  // --- FIX: Don't block rendering on login page ---
  // Instead, always render children, and let consumers handle loading state.
  // Remove: if (loading) return null;

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
