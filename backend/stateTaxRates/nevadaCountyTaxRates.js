// nevadaCountyTaxRates.js
const nevadaCountyTaxRates = {
  NV: {
    default: 0.0685, // Nevada state base rate (6.85%)
    counties: {
      'Carson City': 0.01075,
      Churchill: 0.0075,
      Clark: 0.01525,
      Douglas: 0.0025,
      Elko: 0.0025,
      Esmeralda: 0.0,
      Eureka: 0.0,
      Humboldt: 0.0,
      Lander: 0.0025,
      Lincoln: 0.0025,
      Lyon: 0.0025,
      Mineral: 0.0,
      Nye: 0.0075,
      Pershing: 0.0025,
      Storey: 0.0075,
      Washoe: 0.01465,
      'White Pine': 0.00925,
    },
  },
};

module.exports = nevadaCountyTaxRates;
