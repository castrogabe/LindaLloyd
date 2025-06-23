// hawaiiCountyTaxRates.js
const hawaiiCountyTaxRates = {
  HI: {
    default: 0.04, // Hawaii’s General Excise Tax (GET) base rate
    counties: {
      Honolulu: 0.045, // 4.5% (4.0% + 0.5% surcharge) :contentReference[oaicite:1]{index=1}
      Maui: 0.045, // 4.5% (surcharge effective Jan 2024) :contentReference[oaicite:2]{index=2}
      Hawaii: 0.045, // 4.5% (surcharge since Jan 2020) :contentReference[oaicite:3]{index=3}
      Kauai: 0.045, // 4.5% (surcharge since Jan 2019) :contentReference[oaicite:4]{index=4}
      Kalawao: 0.04, // 4.0% (no surcharge) :contentReference[oaicite:5]{index=5}
    },
  },
};

module.exports = hawaiiCountyTaxRates;
