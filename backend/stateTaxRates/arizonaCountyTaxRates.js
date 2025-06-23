// arizonaCountyTaxRates.js
const arizonaCountyTaxRates = {
  AZ: {
    defaultStateRate: 0.056, // Arizona base state rate (5.6%)
    counties: {
      Apache: 0.005, // 0.5%
      Cochise: 0.01, // 1.0%
      Coconino: 0.013, // 1.3%
      Gila: 0.01, // 1.0%
      Graham: 0.01, // 1.0%
      Greenlee: 0.005, // 0.5%
      LaPaz: 0.01, // 1.0%
      Maricopa: 0.007, // 0.7%
      Mohave: 0.0, // 0.0%
      Navajo: 0.0083, // 0.83%
      Pima: 0.005, // 0.5%
      Pinal: 0.011, // 1.1%
      SantaCruz: 0.01, // 1.0%
      Yavapai: 0.0075, // 0.75%
      Yuma: 0.01112, // 1.112%
    },
    // Note: City-level TPT varies by jurisdiction and business activity
  },
};

module.exports = arizonaCountyTaxRates;
