import React, { useState, useEffect } from 'react';
import InputField from './InputField';
import { Button } from './Button';
import FormSection from './FormSection';

const validate = (values) => {
  const errors = {};
  if (!values.firstName) errors.firstName = 'First name is required';
  if (!values.lastName) errors.lastName = 'Last name is required';
  if (!values.email) errors.email = 'Email is required';
  else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) errors.email = 'Invalid email';
  if (!values.phone) errors.phone = 'Phone number is required';
  if (!values.gender) errors.gender = 'Gender is required';
  return errors;
};

const ProfileForm = ({ initialValues, onSubmit, loading }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      onSubmit(values);
    }
  };

  return (
    <FormSection title="Personal Details" subtitle="To change your personal detail, edit and save from here">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium">First Name</label>
            <InputField
              name="firstName"
              value={values.firstName}
              onChange={handleChange}
              className="py-4 px-4 bg-bgLayout"
              placeholder="First Name"
            />
            {errors.firstName && <div className="text-danger text-xs mt-1">{errors.firstName}</div>}
          </div>
          <div>
            <label className="block mb-2 font-medium">Last Name</label>
            <InputField
              name="lastName"
              value={values.lastName}
              onChange={handleChange}
              className="py-4 px-4 bg-bgLayout"
              placeholder="Last Name"
            />
            {errors.lastName && <div className="text-danger text-xs mt-1">{errors.lastName}</div>}
          </div>
          <div>
            <label className="block mb-2 font-medium">Email Address</label>
            <InputField
              name="email"
              value={values.email}
              onChange={handleChange}
              className="py-4 px-4 bg-bgLayout"
              placeholder="Email"
              type="email"
            />
            {errors.email && <div className="text-danger text-xs mt-1">{errors.email}</div>}
          </div>
          <div>
            <label className="block mb-2 font-medium">Phone Number</label>
            <InputField
              name="phone"
              value={values.phone}
              onChange={handleChange}
              className="py-4 px-4 bg-bgLayout"
              placeholder="Phone Number"
              type="tel"
            />
            {errors.phone && <div className="text-danger text-xs mt-1">{errors.phone}</div>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium">Gender</label>
            <div className="flex justify-between gap-4">
              <label className="flex items-center gap-2 border border-secondary rounded-lg py-4 px-6 bg-bgLayout w-full">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={values.gender === 'male'}
                  onChange={handleChange}
                  className="accent-quaternary"
                />
                Male
              </label>
              <label className="flex items-center gap-2 border border-secondary rounded-lg py-4 px-6 bg-bgLayout w-full">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={values.gender === 'female'}
                  onChange={handleChange}
                  className="accent-quaternary"
                />
                Female
              </label>
            </div>
            {errors.gender && <div className="text-danger text-xs mt-1">{errors.gender}</div>}
          </div>
        </div>
        <Button
          type="submit"
          variant="quinary"
          size="lg"
          shape="rounded"
          className="mt-6"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </Button>
      </form>
    </FormSection>
  );
};

export default ProfileForm; 