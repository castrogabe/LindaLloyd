// washingtonCountyTaxRates.js
const washingtonCountyTaxRates = {
  WA: {
    default: 0.065, // Washington state base rate (6.5%)
    counties: {
      Adams: 0.014, // 8.9% typical
      Asotin: 0.015,
      Benton: 0.02,
      Chelan: 0.015,
      Clallam: 0.015,
      Clark: 0.022,
      Columbia: 0.015,
      Cowlitz: 0.018,
      Douglas: 0.015,
      Ferry: 0.014,
      Franklin: 0.019,
      Garfield: 0.014,
      Grant: 0.017,
      GraysHarbor: 0.017,
      Island: 0.017,
      Jefferson: 0.017,
      King: 0.025, // Seattle metro, total often 10.1%–10.25%
      Kitsap: 0.021,
      Kittitas: 0.015,
      Klickitat: 0.015,
      Lewis: 0.015,
      Lincoln: 0.014,
      Mason: 0.015,
      Okanogan: 0.015,
      Pacific: 0.015,
      PendOreille: 0.014,
      Pierce: 0.024, // Tacoma metro
      SanJuan: 0.014,
      Skagit: 0.017,
      Skamania: 0.015,
      Snohomish: 0.024, // Everett metro
      Spokane: 0.024, // Spokane metro
      Stevens: 0.014,
      Thurston: 0.023,
      Wahkiakum: 0.014,
      WallaWalla: 0.019,
      Whatcom: 0.021,
      Whitman: 0.017,
      Yakima: 0.02,
    },
  },
};

module.exports = washingtonCountyTaxRates;
