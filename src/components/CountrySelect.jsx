import React from 'react'
import Select from 'react-select'

export const countries = [
  { value: 'US', label: 'United States', code: 'US' },
  { value: 'GB', label: 'United Kingdom', code: 'GB' },
  { value: 'CA', label: 'Canada', code: 'CA' },
  { value: 'AU', label: 'Australia', code: 'AU' },
  { value: 'NG', label: 'Nigeria', code: 'NG' },
  { value: 'GH', label: 'Ghana', code: 'GH' },
  { value: 'ZA', label: 'South Africa', code: 'ZA' },
  { value: 'KE', label: 'Kenya', code: 'KE' },
  { value: 'IN', label: 'India', code: 'IN' },
  { value: 'CN', label: 'China', code: 'CN' },
  { value: 'JP', label: 'Japan', code: 'JP' },
  { value: 'KR', label: 'South Korea', code: 'KR' },
  { value: 'DE', label: 'Germany', code: 'DE' },
  { value: 'FR', label: 'France', code: 'FR' },
  { value: 'IT', label: 'Italy', code: 'IT' },
  { value: 'ES', label: 'Spain', code: 'ES' },
  { value: 'BR', label: 'Brazil', code: 'BR' },
  { value: 'MX', label: 'Mexico', code: 'MX' },
  { value: 'AR', label: 'Argentina', code: 'AR' },
]

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: '48px',
    padding: '0.25rem 0.75rem',
    backgroundColor: 'var(--color-background)',
    borderColor: state.isFocused ? 'var(--color-primary)' : '#e5e7eb',
    borderRadius: '0.375rem',
    '&:hover': {
      borderColor: 'var(--color-primary)'
    },
    boxShadow: state.isFocused ? '0 0 0 2px var(--color-primary-light)' : 'none',
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: '0',
  }),
  input: (provided) => ({
    ...provided,
    margin: '0',
    padding: '0',
    color: 'var(--color-text-primary)',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'var(--color-tertiary)',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'var(--color-text-primary)',
  }),
  option: (provided, state) => ({
    ...provided,
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    backgroundColor: state.isSelected 
      ? 'var(--color-primary-light)'
      : state.isFocused 
        ? 'var(--color-background-alt)'
        : 'var(--color-background)',
    color: state.isSelected 
      ? 'var(--color-primary)'
      : 'var(--color-text-primary)',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'var(--color-background-alt)',
    }
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: 'var(--color-background)',
    borderRadius: '0.375rem',
    border: '1px solid #e5e7eb',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: state.isFocused ? 'var(--color-primary)' : 'var(--color-tertiary)',
    '&:hover': {
      color: 'var(--color-primary)',
    }
  }),
  indicatorSeparator: () => ({
    display: 'none'
  }),
}

const CustomOption = ({ innerProps, data }) => (
  <div {...innerProps} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer">
    <img
      src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${data.code}.svg`}
      alt={data.label}
      className="w-6 h-4 object-cover"
    />
    {data.label}
  </div>
)

const CountrySelect = ({ value, onChange, placeholder = "Select Country" }) => {
  const selectedCountry = countries.find(option => option.value === value);
  
  return (
    <Select
      options={countries}
      value={selectedCountry}
      onChange={option => onChange(option ? option.value : '')}
      components={{ Option: CustomOption }}
      styles={customStyles}
      placeholder={placeholder}
      className="w-full "
      isClearable={true}
    />
  );
}

export default CountrySelect 