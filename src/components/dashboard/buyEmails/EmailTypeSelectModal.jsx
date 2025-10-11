import React, { useState, useEffect } from "react";
import { fetchEmailTypes } from "../../../services/emailService";
import CustomModal from "../../common/CustomModal";
import { FiMail } from "react-icons/fi";

const EmailTypeSelectModal = ({ isOpen, onClose, onSelect }) => {
  const [emailTypes, setEmailTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchEmailTypes()
        .then((response) => {
          if (response.status === "success" && Array.isArray(response.data)) {
            setEmailTypes(response.data);
            setError(null);
          } else {
            setEmailTypes([]);
            setError(response.message || "Failed to load email types");
          }
        })
        .catch((err) => {
          setEmailTypes([]);
          setError(err.message || "Failed to load email types");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen]);

  const handleRetry = () => {
    setLoading(true);
    fetchEmailTypes()
      .then((response) => {
        if (response.status === "success" && Array.isArray(response.data)) {
          setEmailTypes(response.data);
          setError(null);
        } else {
          setEmailTypes([]);
          setError(response.message || "Failed to load email types");
        }
      })
      .catch((err) => {
        setEmailTypes([]);
        setError(err.message || "Failed to load email types");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderEmailTypesList = () => {
    if (loading) {
      return null; // CustomModal handles loading state
    }
    
    if (error) {
      return (
        <div className="text-center py-8">
          <p className="text-red-500 font-medium mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }
    
    if (emailTypes.length === 0) {
      return null; // CustomModal handles empty state
    }
    
    return emailTypes.map((type) => ({
      name: type.name,
      value: type.id,
      icon: (
        <img 
          src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${type.id}&size=90`}
          alt={type.id || type.id}
          className="w-5 h-5"
          onError={(e) => {
            e.target.src = "/icons/mail.svg";
          }}
        />
      ),
      onClick: () => onSelect(type)
    }));
  };

  return (
    <CustomModal
      open={isOpen}
      onClose={onClose}
      title="Select Email Type"
      headerIcon={<FiMail className="text-primary text-xl" />}
      loading={loading}
      emptyMessage="No email types available"
      list={!loading && !error ? renderEmailTypesList() : []}
      className="max-w-md"
    >
      {error && renderEmailTypesList()}
    </CustomModal>
  );
};

export default EmailTypeSelectModal;