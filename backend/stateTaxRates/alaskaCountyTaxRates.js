// alaskaCountyTaxRates.js
const alaskaCountyTaxRates = {
  AK: {
    default: 0.0, // Alaska has no state sales tax
    counties: {
      // Boroughs/cities levy their own local taxes; examples:
      Juneau: 0.05, // 5% in the City & Borough of Juneau :contentReference[oaicite:2]{index=2}
      'Ketchikan Gateway Borough': 0.025, // 2.5% borough-only tax :contentReference[oaicite:3]{index=3}
      Yakutat: 0.05, // Yakutat Borough 5% :contentReference[oaicite:4]{index=4}
      Aleknagik: 0.05, // City of Aleknagik 5% :contentReference[oaicite:5]{index=5}
      // …and many others, up to ~108 taxing jurisdictions.
    },
  },
};

module.exports = alaskaCountyTaxRates;
