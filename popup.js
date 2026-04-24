document.addEventListener('DOMContentLoaded', function() {
  const apiKeyInput = document.getElementById('apiKey');
  const regionSelect = document.getElementById('region');
  const saveKeyBtn = document.getElementById('saveKey');
  const fillFormBtn = document.getElementById('fillForm');
  const enableCardCheckbox = document.getElementById('enableCard');
  const binPrefixInput = document.getElementById('binPrefix');
  const generateCardBtn = document.getElementById('generateCard');
  const statusDiv = document.getElementById('status');

  // Load saved settings
  chrome.storage.sync.get(['apiKey', 'region', 'binPrefix', 'enableCard'], function(result) {
    if (result.apiKey) {
      apiKeyInput.value = result.apiKey;
    }
    if (result.region) {
      regionSelect.value = result.region;
    }
    if (result.binPrefix) {
      binPrefixInput.value = result.binPrefix;
    }
    if (result.enableCard !== undefined) {
      enableCardCheckbox.checked = result.enableCard;
    }
  });

  // Save card settings when changed
  binPrefixInput.addEventListener('input', function() {
    chrome.storage.sync.set({ binPrefix: binPrefixInput.value });
  });
  enableCardCheckbox.addEventListener('change', function() {
    chrome.storage.sync.set({ enableCard: enableCardCheckbox.checked });
  });

  // Save region when changed
  regionSelect.addEventListener('change', function() {
    chrome.storage.sync.set({ region: regionSelect.value });
  });

  // Save API key
  saveKeyBtn.addEventListener('click', function() {
    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
      showStatus('Please enter an API key', 'error');
      return;
    }
    
    chrome.storage.sync.set({ apiKey: apiKey }, function() {
      showStatus('API key saved!', 'success');
    });
  });

  // Fill form button
  fillFormBtn.addEventListener('click', async function() {
    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
      showStatus('Please enter and save your API key first', 'error');
      return;
    }

    fillFormBtn.disabled = true;
    fillFormBtn.textContent = 'Fetching...';

    try {
      const region = regionSelect.value;
      const url = region
        ? `https://api.api-ninjas.com/v1/randomuser?region=${encodeURIComponent(region)}`
        : 'https://api.api-ninjas.com/v1/randomuser';

      const response = await fetch(url, {
        headers: {
          'X-Api-Key': apiKey
        }
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Invalid API key');
        }
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();

      // Generate card if enabled
      if (enableCardCheckbox.checked) {
        data.cardNumber = generateCardNumber(binPrefixInput.value.trim());
        data.cardExpiry = generateRandomExpiry();
        data.cardCvc = generateRandomCvc();
      }

      // Get active tab and send data to content script
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      await chrome.tabs.sendMessage(tab.id, {
        action: 'fillForm',
        data: data
      });

      showStatus('Form filled successfully!', 'success');
    } catch (error) {
      showStatus(error.message, 'error');
    } finally {
      fillFormBtn.disabled = false;
      fillFormBtn.textContent = 'Fill Form with Random Identity';
    }
  });

  // Generate card only button
  generateCardBtn.addEventListener('click', async function() {
    const binPattern = binPrefixInput.value.trim();
    if (!binPattern) {
      showStatus('Please enter BIN prefix pattern', 'error');
      return;
    }

    generateCardBtn.disabled = true;
    generateCardBtn.textContent = 'Generating...';

    try {
      const cardData = {
        cardNumber: generateCardNumber(binPattern),
        cardExpiry: generateRandomExpiry(),
        cardCvc: generateRandomCvc()
      };

      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      await chrome.tabs.sendMessage(tab.id, {
        action: 'fillForm',
        data: cardData
      });

      showStatus('Card generated successfully!', 'success');
    } catch (error) {
      showStatus(error.message, 'error');
    } finally {
      generateCardBtn.disabled = false;
      generateCardBtn.textContent = 'Generate & Fill Card Only';
    }
  });

  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = 'status ' + type;
    setTimeout(() => {
      statusDiv.className = 'status';
    }, 3000);
  }

  // Luhn algorithm to generate valid credit card number
  function generateCardNumber(pattern) {
    // Replace x/X with random digits
    let number = pattern.replace(/[xX]/g, () => Math.floor(Math.random() * 10));

    // If pattern doesn't have x, just use it as is (assume complete number)
    if (!pattern.includes('x') && !pattern.includes('X')) {
      return number;
    }

    // Calculate Luhn checksum
    const digits = number.split('').map(Number);
    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = digits[i];
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }

    // Calculate check digit
    const checkDigit = (10 - (sum % 10)) % 10;

    // Replace last digit with check digit
    digits[digits.length - 1] = checkDigit;
    return digits.join('');
  }

  function generateRandomExpiry() {
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const year = new Date().getFullYear() + Math.floor(Math.random() * 5) + 1;
    return `${month}/${String(year).slice(-2)}`;
  }

  function generateRandomCvc() {
    return String(Math.floor(Math.random() * 900) + 100);
  }
});
