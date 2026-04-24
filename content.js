chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'fillForm') {
    fillFormWithData(request.data);
    sendResponse({ success: true });
  }
  return true;
});

// Parse address into components
function parseAddress(address) {
  if (!address) return { number: '', street: '', suite: '' };

  // Match patterns like "123 Main St" or "1234 Elm Street"
  const match = address.match(/^(\d+)\s+(.+)$/);
  if (match) {
    const number = match[1];
    const street = match[2];
    // Generate random suite number (100-999)
    const suiteNum = Math.floor(Math.random() * 900) + 100;
    return {
      number: number,
      street: street,
      suite: `Suite ${suiteNum}`
    };
  }

  // If no number found, return full address as street
  return {
    number: '',
    street: address,
    suite: `Suite ${Math.floor(Math.random() * 900) + 100}`
  };
}

function fillFormWithData(data) {
  // Parse address if available
  const addrParts = data.address ? parseAddress(data.address) : null;

  const mappings = {
    // Name fields
    'name': `${data.name} ${data.surname}`,
    'firstname': data.name,
    'firstname': data.name,
    'fname': data.name,
    'last-name': data.surname,
    'lastname': data.surname,
    'lname': data.surname,
    'surname': data.surname,
    'family-name': data.surname,
    'full-name': `${data.name} ${data.surname}`,
    
    // Email
    'email': data.email,
    'e-mail': data.email,
    'mail': data.email,
    
    // Phone
    'phone': data.phone_number,
    'tel': data.phone_number,
    'telephone': data.phone_number,
    'mobile': data.phone_number,
    'cell': data.phone_number,
    'phone_number': data.phone_number,
    
    // Full Address Line 1
    'address': data.address,
    'address1': data.address,
    'addressline1': data.address,
    'street': data.address,
    'streetaddress': data.address,
    'street-address': data.address,
    'street_address': data.address,
    'addr': data.address,
    'alamat': data.address,
    'alamat1': data.address,
    'line1': data.address,

    // Street Number (house number)
    'streetnumber': addrParts?.number || '',
    'street-number': addrParts?.number || '',
    'housenumber': addrParts?.number || '',
    'house-number': addrParts?.number || '',
    'buildingnumber': addrParts?.number || '',
    'building-number': addrParts?.number || '',
    'nomorrumah': addrParts?.number || '',
    'nomor-rumah': addrParts?.number || '',

    // Street Name (without number)
    'streetname': addrParts?.street || data.address,
    'street-name': addrParts?.street || data.address,
    'road': addrParts?.street || data.address,
    'jalan': addrParts?.street || data.address,
    'namajalan': addrParts?.street || data.address,

    // Address Line 2 (Suite/Apartment/Unit)
    'address2': addrParts?.suite || '',
    'addressline2': addrParts?.suite || '',
    'streetaddress2': addrParts?.suite || '',
    'street-address-2': addrParts?.suite || '',
    'line2': addrParts?.suite || '',
    'alamat2': addrParts?.suite || '',
    'apt': addrParts?.suite || '',
    'apartment': addrParts?.suite || '',
    'suite': addrParts?.suite || '',
    'unit': addrParts?.suite || '',
    'building': addrParts?.suite || '',
    'floor': addrParts?.suite || '',
    'secondary': addrParts?.suite || '',

    // City
    'city': data.city,
    'town': data.city,
    'locality': data.city,
    'suburb': data.city,
    'kota': data.city,
    'kecamatan': data.city,
    
    // State
    'state': data.state,
    'province': data.state,
    'region': data.state,
    'provinsi': data.state,
    'propinsi': data.state,
    'negara-bagian': data.state,
    
    // Zip/Postal code
    'zip': data.zip_code,
    'zipcode': data.zip_code,
    'postal': data.zip_code,
    'postal-code': data.zip_code,
    'postcode': data.zip_code,
    'postalcode': data.zip_code,
    'kodepos': data.zip_code,
    'kode-pos': data.zip_code,
    
    // Country
    'country': data.country,
    'negara': data.country,
    
    // Username
    'username': data.username,
    'user': data.username,
    'login': data.username,
    
    // Password
    'password': data.password,
    'pass': data.password,
    'pwd': data.password,

    // Credit Card
    'card': data.cardNumber,
    'cardnumber': data.cardNumber,
    'card-number': data.cardNumber,
    'ccnum': data.cardNumber,
    'cc-number': data.cardNumber,
    'ccnumber': data.cardNumber,
    'cc': data.cardNumber,
    'creditcard': data.cardNumber,
    'credit-card': data.cardNumber,
    'nomorkartu': data.cardNumber,
    'nomor-kartu': data.cardNumber,

    // Card Expiry
    'expiry': data.cardExpiry,
    'exp': data.cardExpiry,
    'expiration': data.cardExpiry,
    'expirationdate': data.cardExpiry,
    'exp-date': data.cardExpiry,
    'cardexpiry': data.cardExpiry,
    'card-expiry': data.cardExpiry,
    'expmonth': data.cardExpiry,
    'expyear': data.cardExpiry,
    'valid-thru': data.cardExpiry,
    'validthru': data.cardExpiry,
    'masa-berlaku': data.cardExpiry,
    'masaberlaku': data.cardExpiry,

    // CVC/CVV
    'cvc': data.cardCvc,
    'cvv': data.cardCvc,
    'cvc2': data.cardCvc,
    'cvv2': data.cardCvc,
    'cardcvc': data.cardCvc,
    'cardcvv': data.cardCvc,
    'csc': data.cardCvc,
    'securitycode': data.cardCvc,
    'security-code': data.cardCvc,
    'kodekeamanan': data.cardCvc,
    'kode-keamanan': data.cardCvc
  };

  // Get all input fields
  const inputs = document.querySelectorAll('input, textarea, select');
  
  inputs.forEach(input => {
    const name = (input.name || '').toLowerCase().replace(/[_\-\[\]]/g, '');
    const id = (input.id || '').toLowerCase().replace(/[_\-\[\]]/g, '');
    const placeholder = (input.placeholder || '').toLowerCase();
    const autocomplete = (input.autocomplete || '').toLowerCase();
    const ariaLabel = (input.getAttribute('aria-label') || '').toLowerCase();
    
    // Check all possible identifiers
    const identifiers = [name, id, placeholder, autocomplete, ariaLabel];

    // Sort mappings by key length (descending) to match specific patterns first
    const sortedMappings = Object.entries(mappings).sort((a, b) => b[0].length - a[0].length);

    for (const identifier of identifiers) {
      for (const [key, value] of sortedMappings) {
        if (identifier.includes(key)) {
          setInputValue(input, value);
          return;
        }
      }
    }
    
    // Special handling for gender/select fields
    if (input.tagName === 'SELECT' && (name.includes('gender') || id.includes('gender'))) {
      const genderValue = data.gender.toLowerCase();
      for (const option of input.options) {
        if (option.value.toLowerCase() === genderValue || 
            option.text.toLowerCase() === genderValue) {
          input.value = option.value;
          input.dispatchEvent(new Event('change', { bubbles: true }));
          break;
        }
      }
    }
  });
}

function setInputValue(input, value) {
  if (value === undefined || value === null) return;
  
  input.value = value;
  
  // Trigger events to ensure form recognizes the change
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
  input.dispatchEvent(new Event('blur', { bubbles: true }));
  
  // Some frameworks need these
  input.dispatchEvent(new Event('keyup', { bubbles: true }));
}
