// marylandCountyTaxRates.js
const marylandCountyTaxRates = {
  MD: {
    default: 0.06, // Maryland state sales tax (6%)
    counties: {
      Allegany: 0.06,
      'Anne Arundel': 0.06,
      Baltimore: 0.06,
      Calvert: 0.06,
      Caroline: 0.06,
      Carroll: 0.06,
      Cecil: 0.06,
      Charles: 0.06,
      Dorchester: 0.06,
      Frederick: 0.06,
      Garrett: 0.06,
      Harford: 0.06,
      Howard: 0.06,
      Kent: 0.06,
      Montgomery: 0.06,
      "Prince George's": 0.06,
      "Queen Anne's": 0.06,
      Somerset: 0.06,
      "St. Mary's": 0.06,
      Talbot: 0.06,
      Washington: 0.06,
      Wicomico: 0.06,
      Worcester: 0.06,
      'Baltimore City': 0.06, // independent city treated as county
    },
  },
};

module.exports = marylandCountyTaxRates;
