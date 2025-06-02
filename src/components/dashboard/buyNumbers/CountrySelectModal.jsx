import React, { useState } from "react";
import CountryFlag from "react-country-flag";
import { FiSearch } from "react-icons/fi";

// Example country data (expand as needed)
const countries = [
  { name: "Germany", code: "+49", value: "DE" },
  { name: "Kenya", code: "+254", value: "KE" },
  { name: "Nigeria", code: "+234", value: "NG" },
  { name: "South Africa", code: "+27", value: "ZA" },
  { name: "Georgia", code: "+995", value: "GE" },
  { name: "United Kingdom", code: "+44", value: "GB" },
  { name: "Algeria", code: "+213", value: "DZ" },
  { name: "Andorra", code: "+376", value: "AD" },
  { name: "United States", code: "+1", value: "US" },
  { name: "Canada", code: "+1", value: "CA" },
  { name: "France", code: "+33", value: "FR" },
  { name: "Italy", code: "+39", value: "IT" },
  { name: "Spain", code: "+34", value: "ES" },
  { name: "Brazil", code: "+55", value: "BR" },
  { name: "India", code: "+91", value: "IN" },
  { name: "China", code: "+86", value: "CN" },
  { name: "Japan", code: "+81", value: "JP" },
  { name: "Russia", code: "+7", value: "RU" },
  { name: "Australia", code: "+61", value: "AU" },
  { name: "Mexico", code: "+52", value: "MX" },
  { name: "Turkey", code: "+90", value: "TR" },
  { name: "Egypt", code: "+20", value: "EG" },
  { name: "Saudi Arabia", code: "+966", value: "SA" },
  { name: "Argentina", code: "+54", value: "AR" },
  { name: "South Korea", code: "+82", value: "KR" },
  { name: "Sweden", code: "+46", value: "SE" },
  { name: "Norway", code: "+47", value: "NO" },
  { name: "Finland", code: "+358", value: "FI" },
  { name: "Denmark", code: "+45", value: "DK" },
  { name: "Netherlands", code: "+31", value: "NL" },
  { name: "Belgium", code: "+32", value: "BE" },
  { name: "Switzerland", code: "+41", value: "CH" },
  { name: "Austria", code: "+43", value: "AT" },
  { name: "Poland", code: "+48", value: "PL" },
  { name: "Portugal", code: "+351", value: "PT" },
  { name: "Greece", code: "+30", value: "GR" },
  { name: "Romania", code: "+40", value: "RO" },
  { name: "Czech Republic", code: "+420", value: "CZ" },
  { name: "Hungary", code: "+36", value: "HU" },
  { name: "Ireland", code: "+353", value: "IE" },
  { name: "Israel", code: "+972", value: "IL" },
  { name: "Singapore", code: "+65", value: "SG" },
  { name: "Malaysia", code: "+60", value: "MY" },
  { name: "Indonesia", code: "+62", value: "ID" },
  { name: "Thailand", code: "+66", value: "TH" },
  { name: "Philippines", code: "+63", value: "PH" },
  { name: "Pakistan", code: "+92", value: "PK" },
  { name: "Bangladesh", code: "+880", value: "BD" },
  { name: "Vietnam", code: "+84", value: "VN" },
  { name: "Ukraine", code: "+380", value: "UA" },
  { name: "Morocco", code: "+212", value: "MA" },
  { name: "Ghana", code: "+233", value: "GH" },
  { name: "Ivory Coast", code: "+225", value: "CI" },
  { name: "Cameroon", code: "+237", value: "CM" },
  { name: "Ethiopia", code: "+251", value: "ET" },
  { name: "Tanzania", code: "+255", value: "TZ" },
  { name: "Uganda", code: "+256", value: "UG" },
  { name: "Zimbabwe", code: "+263", value: "ZW" },
  { name: "Senegal", code: "+221", value: "SN" },
  { name: "Angola", code: "+244", value: "AO" },
  { name: "Mozambique", code: "+258", value: "MZ" },
  { name: "Sudan", code: "+249", value: "SD" },
  { name: "Libya", code: "+218", value: "LY" },
  { name: "Tunisia", code: "+216", value: "TN" },
  { name: "Qatar", code: "+974", value: "QA" },
  { name: "United Arab Emirates", code: "+971", value: "AE" },
  { name: "Kuwait", code: "+965", value: "KW" },
  { name: "Oman", code: "+968", value: "OM" },
  { name: "Bahrain", code: "+973", value: "BH" },
  { name: "Jordan", code: "+962", value: "JO" },
  { name: "Lebanon", code: "+961", value: "LB" },
  { name: "Syria", code: "+963", value: "SY" },
  { name: "Iraq", code: "+964", value: "IQ" },
  { name: "Afghanistan", code: "+93", value: "AF" },
  { name: "Nepal", code: "+977", value: "NP" },
  { name: "Sri Lanka", code: "+94", value: "LK" },
  { name: "New Zealand", code: "+64", value: "NZ" },
  { name: "Chile", code: "+56", value: "CL" },
  { name: "Colombia", code: "+57", value: "CO" },
  { name: "Peru", code: "+51", value: "PE" },
  { name: "Venezuela", code: "+58", value: "VE" },
  { name: "Ecuador", code: "+593", value: "EC" },
  { name: "Bolivia", code: "+591", value: "BO" },
  { name: "Paraguay", code: "+595", value: "PY" },
  { name: "Uruguay", code: "+598", value: "UY" },
  { name: "Costa Rica", code: "+506", value: "CR" },
  { name: "Panama", code: "+507", value: "PA" },
  { name: "Guatemala", code: "+502", value: "GT" },
  { name: "Honduras", code: "+504", value: "HN" },
  { name: "El Salvador", code: "+503", value: "SV" },
  { name: "Nicaragua", code: "+505", value: "NI" },
  { name: "Jamaica", code: "+1-876", value: "JM" },
  { name: "Trinidad and Tobago", code: "+1-868", value: "TT" },
  { name: "Barbados", code: "+1-246", value: "BB" },
  { name: "Bahamas", code: "+1-242", value: "BS" },
  { name: "Dominican Republic", code: "+1-809", value: "DO" },
  { name: "Haiti", code: "+509", value: "HT" },
  { name: "Cuba", code: "+53", value: "CU" },
  { name: "Puerto Rico", code: "+1-787", value: "PR" },
  { name: "Greenland", code: "+299", value: "GL" },
  { name: "Iceland", code: "+354", value: "IS" },
  { name: "Luxembourg", code: "+352", value: "LU" },
  { name: "Liechtenstein", code: "+423", value: "LI" },
  { name: "Monaco", code: "+377", value: "MC" },
  { name: "San Marino", code: "+378", value: "SM" },
  { name: "Vatican City", code: "+39-06", value: "VA" },
  { name: "Estonia", code: "+372", value: "EE" },
  { name: "Latvia", code: "+371", value: "LV" },
  { name: "Lithuania", code: "+370", value: "LT" },
  { name: "Slovakia", code: "+421", value: "SK" },
  { name: "Slovenia", code: "+386", value: "SI" },
  { name: "Croatia", code: "+385", value: "HR" },
  { name: "Serbia", code: "+381", value: "RS" },
  { name: "Montenegro", code: "+382", value: "ME" },
  { name: "Bosnia and Herzegovina", code: "+387", value: "BA" },
  { name: "Macedonia", code: "+389", value: "MK" },
  { name: "Moldova", code: "+373", value: "MD" },
  { name: "Belarus", code: "+375", value: "BY" },
  { name: "Kazakhstan", code: "+7", value: "KZ" },
  { name: "Uzbekistan", code: "+998", value: "UZ" },
  { name: "Turkmenistan", code: "+993", value: "TM" },
  { name: "Kyrgyzstan", code: "+996", value: "KG" },
  { name: "Tajikistan", code: "+992", value: "TJ" },
  { name: "Armenia", code: "+374", value: "AM" },
  { name: "Azerbaijan", code: "+994", value: "AZ" },
  { name: "Mongolia", code: "+976", value: "MN" },
  { name: "Cambodia", code: "+855", value: "KH" },
  { name: "Laos", code: "+856", value: "LA" },
  { name: "Myanmar", code: "+95", value: "MM" },
  { name: "Brunei", code: "+673", value: "BN" },
  { name: "Timor-Leste", code: "+670", value: "TL" },
  { name: "Maldives", code: "+960", value: "MV" },
  { name: "Fiji", code: "+679", value: "FJ" },
  { name: "Papua New Guinea", code: "+675", value: "PG" },
  { name: "Samoa", code: "+685", value: "WS" },
  { name: "Tonga", code: "+676", value: "TO" },
  { name: "Vanuatu", code: "+678", value: "VU" },
  { name: "Solomon Islands", code: "+677", value: "SB" },
  { name: "Kiribati", code: "+686", value: "KI" },
  { name: "Marshall Islands", code: "+692", value: "MH" },
  { name: "Micronesia", code: "+691", value: "FM" },
  { name: "Palau", code: "+680", value: "PW" },
];

const CountrySelectModal = ({ open, onClose, onSelect }) => {
  const [search, setSearch] = useState("");

  if (!open) return null;

  const filtered = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.includes(search)
  );

  // Split into pairs for 2-column grid
  const rows = [];
  for (let i = 0; i < filtered.length; i += 2) {
    rows.push(filtered.slice(i, i + 2));
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-3xl mx-2 p-0 overflow-hidden shadow-lg relative">
        {/* Title */}
        <div className="px-6 py-6 bg-bgLayout border-b border-border-grey">
          <h2 className="text-lg font-semibold">Choose Country</h2>
        </div>
        {/* Search */}
        <div className="px-6 py-6 pb-8 ">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search for countries"
              className="w-full font-semibold border-b border-border-grey pl-10 pr-4 py-2.5 focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        {/* Country List */}
        <div className="px-6 pb-2 max-h-[340px] overflow-y-auto">
          <div className="grid md:grid-cols-2 gap-y-4 gap-x-8">
            {rows.map((pair, idx) => (
              <React.Fragment key={idx}>
                {pair.map((country, j) => (
                  <button
                    key={country.name + country.code}
                    className="flex items-center gap-3 py-1 px-2 rounded-lg hover:bg-[#F7F7F7] transition w-full text-left"
                    onClick={() => {
                      onSelect(country);
                      onClose();
                    }}
                  >
                    <CountryFlag
                      countryCode={country.value}
                      svg
                      className="w-6 h-6"
                      style={{ borderRadius: "4px" }}
                    />
                    <span className="font-medium">{country.name} ({country.code})</span>
                  </button>
                ))}
                {pair.length === 1 && <div />} {/* for even grid */}
              </React.Fragment>
            ))}
          </div>
        </div>
        {/* Footer */}
        <div className="flex justify-end border-t border-border-grey px-6 py-4 bg-bgLayout border-b-2 rounded-b-xl border-b-[#FFDE59]">
          <button
            className="border border-quinary text-quinary rounded-full px-6 py-2 font-semibold hover:bg-quinary hover:text-white transition"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CountrySelectModal;