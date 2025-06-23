// wyomingCountyTaxRates.js
const wyomingCountyTaxRates = {
  WY: {
    default: 0.04, // State base rate (4%)
    counties: {
      // Counties with only state tax (no extra penny)
      BigHorn: 0.0,
      Campbell: 0.0,
      Carbon: 0.0,
      Converse: 0.0,
      Crook: 0.0,
      Fremont: 0.0,
      Goshen: 0.0,
      HotSprings: 0.0,
      Johnson: 0.0,
      Laramie: 0.01, // Laramie County has 5th penny
      Lincoln: 0.01,
      Natrona: 0.01,
      Niobrara: 0.01,
      Park: 0.01,
      Platte: 0.01,
      Sheridan: 0.01,
      Sublette: 0.0,
      Sweetwater: 0.01,
      Teton: 0.03, // Teton County: 1% + 2% spec purpose :contentReference[oaicite:6]{index=6}
      Uinta: 0.01,
      Washakie: 0.01,
      Weston: 0.01,
    },
  },
};

module.exports = wyomingCountyTaxRates;
