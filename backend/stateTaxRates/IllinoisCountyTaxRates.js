// illinoisCountyTaxRates.js
const illinoisCountyTaxRates = {
  IL: {
    default: 0.0625, // Illinois state sales tax base
    counties: {
      Cook: 0.1075, // e.g. Cicero, Berwyn
      DuPage: 0.085, // Roselle or Lombard
      Kane: 0.08, // Batavia or Hampshire
      McLean: 0.0875, // Normal and Bloomington
      Peoria: 0.1, // Peoria City + districts
      'Rock Island': 0.085,
      Will: 0.0875, // Joliet
      Lake: 0.0875, // e.g. Vernon Hills
      Champaign: 0.0875, // Champaign city
      Sangamon: 0.0875, // Springfield
      Winnebago: 0.0875, // Rockford
      'St. Clair': 0.0875,
      Madison: 0.0875,
      Tazewell: 0.0875,
      Others: 0.065, // Use this for rural counties with only base rate
    },
  },
};

module.exports = illinoisCountyTaxRates;
