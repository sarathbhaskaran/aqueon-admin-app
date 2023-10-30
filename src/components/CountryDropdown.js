
import React, { useState, useEffect} from 'react';
import { Input } from 'reactstrap';
import axios from 'axios';
import COUNTRIES from '../output-country.json'

function CountryDropdown({ onCountryChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('Choose Country');
  const [filter, setFilter] = useState('');
  const [countries, setCountries] = useState(COUNTRIES);

  useEffect(() => {
    // Fetch the list of countries from the API
    // axios.get('https://restcountries.com/v3.1/all')
    //   .then((response) => {
    //     const countryNames = response.data.map((country) => country.name.common);
    //     setCountries(countryNames);
    //   })
    //   .catch((error) => {
    //     console.error('Error fetching country data:', error);
    //   });
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectCountry = (country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setFilter('');
    onCountryChange(country);

  };

  const handleInputChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="country-dropdown">
      <div className="dropdown-header" onClick={toggleDropdown}>
        <Input
          type="text"
          size="sm"
          placeholder={selectedCountry}
          value={filter}
          onChange={handleInputChange}
          className="input-with-arrow"
        />
      </div>
      {isOpen && (
        <div className="dropdown-content">
          <ul className="dropdown-list">
            {filteredCountries.map((country) => (
              <div className='country-name'>
              <Input type='checkbox' onClick={() => selectCountry(country)}/>
              <li key={country} >
                {country}
              </li>
              </div>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CountryDropdown;




