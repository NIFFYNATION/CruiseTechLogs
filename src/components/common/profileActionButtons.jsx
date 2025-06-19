import React from 'react';

const ProfileActions = ({onEditProfile, onLogout}) => {
    return (
        <div className="flex  border-[#C7C7C7] bg-background/50  text-[#777777] font-semibold">
            <button
                className="flex-1 flex items-center justify-center gap-2 text-gray-600 hover:text-primary border-r-2 border-[#C7C7C7] mx-2"
                onClick={onEditProfile}
            >
                <img src="/icons/edit-bold.svg" alt="Edit Profile" />
                Edit Profile
            </button>
            <button
                className="flex-1 flex items-center justify-center gap-2 text-gray-600 hover:text-danger py-4"
                onClick={onLogout}
            >
                <span
                    className="w-5 h-5 inline-block bg-gray-600"
                    style={{
                        WebkitMask: `url(/icons/logout.svg) center center / contain no-repeat`,
                        mask: `url(/icons/logout.svg) center center / contain no-repeat`,
                    }}
                    aria-label="Logout"
                />
                 Logout
            </button>
        </div>
    );
};

export default ProfileActions;