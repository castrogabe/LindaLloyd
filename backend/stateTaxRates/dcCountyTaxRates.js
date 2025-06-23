// districtOfColumbiaCountyTaxRates.js

const districtOfColumbiaCountyTaxRates = {
  DC: {
    default: 0.06, // DC base sales tax rate is 6%
    counties: {
      Washington: 0.0, // Entirety of DC is considered one jurisdiction
    },
  },
};

module.exports = districtOfColumbiaCountyTaxRates;
