import React, { useState } from "react";
import { Autocomplete } from "@react-google-maps/api";
import "./AddressSearch.scss";

const AddressSearch = ({ onAddressChange, errors }) => {
  const [autocomplete, setAutocomplete] = useState(null);

  const handleLoad = (autoC) => {
    setAutocomplete(autoC);
  };

  const handlePlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      const components = place.address_components;

      const parsedAddress = {
        street: "",
        postcode: "",
        city: "",
        country: "",
      };

      components.forEach((component) => {
        const types = component.types;
        if (types.includes("route")) {
          parsedAddress.street = component.long_name;
        }
        if (types.includes("street_number")) {
          parsedAddress.street = `${component.long_name} ${parsedAddress.street}`;
        }
        if (types.includes("postal_code")) {
          parsedAddress.postcode = component.long_name;
        }
        if (types.includes("locality")) {
          parsedAddress.city = component.long_name;
        }
        if (types.includes("postal_town") && !parsedAddress.city) {
          parsedAddress.city = component.long_name;
        }
        if (
          types.includes("administrative_area_level_2") &&
          !parsedAddress.city
        ) {
          parsedAddress.city = component.long_name;
        }
        if (types.includes("country")) {
          parsedAddress.country = component.long_name;
        }
      });
      onAddressChange(parsedAddress);
    }
  };

  return (
    <div className="address">
      <label className="address__label">
        <h5 className="address__name">Search Address:</h5>
        <Autocomplete onLoad={handleLoad} onPlaceChanged={handlePlaceChanged}>
          <input
            type="text"
            className={`address__input ${
              errors?.address ? "address__input--error" : ""
            }`}
            placeholder="Search for your address"
          />
        </Autocomplete>
      </label>
      {errors?.address && <p className="address__error">{errors.address}</p>}
    </div>
  );
};

export default AddressSearch;
