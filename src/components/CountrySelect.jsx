import React from 'react'
import Select from 'react-select'

const countries = [
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
  control: (provided) => ({
    ...provided,
    height: '46px',
    borderColor: '#e5e7eb',
    '&:hover': {
      borderColor: '#e5e7eb'
    }
  }),
  option: (provided) => ({
    ...provided,
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px'
  })
}

const CustomOption = ({ data, ...props }) => (
  <div {...props} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer">
    <img
      src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${data.code}.svg`}
      alt={data.label}
      className="w-6 h-4 object-cover"
    />
    {data.label}
  </div>
)

const CountrySelect = ({ value, onChange, placeholder = "Select Country", className = "w-full" }) => {
  return (
    <Select
      options={countries}
      value={countries.find(option => option.value === value)}
      onChange={(selectedOption) => {
        onChange({
          target: {
            name: 'country',
            value: selectedOption.value
          }
        })
      }}
      styles={customStyles}
      components={{
        Option: CustomOption
      }}
      placeholder={placeholder}
      className={className}
    />
  )
}

export default CountrySelect 