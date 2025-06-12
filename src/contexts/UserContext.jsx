import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchUserProfile } from "../services/userService"; // Use fetchUserProfile

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile()
      .then(data => {
        setUser({
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
        });
      })
      .catch(() => {
        setUser({
          name: 'User',
          email: '',
          avatar: '/icons/female.svg',
          stage: { name: 'Level 1' },
          percentage: 0,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  // Only render children after loading is false (prevents null context)
  if (loading) return null;

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
