// taxRateIndex.js

// ====== Require all state tax rate files ======
const alabamaCountyTaxRates = require('./stateTaxRates/alabamaCountyTaxRates.js');
const alaskaCountyTaxRates = require('./stateTaxRates/alaskaCountyTaxRates.js');
const arizonaCountyTaxRates = require('./stateTaxRates/arizonaCountyTaxRates.js');
const arkansasCountyTaxRates = require('./stateTaxRates/arkansasCountyTaxRates.js');
const californiaCountyTaxRates = require('./stateTaxRates/californiaCountyTaxRates.js');
const coloradoCountyTaxRates = require('./stateTaxRates/coloradoCountyTaxRates.js');
const connecticutCountyTaxRates = require('./stateTaxRates/connecticutCountyTaxRates.js');
const delawareCountyTaxRates = require('./stateTaxRates/delawareCountyTaxRates.js');
const floridaCountyTaxRates = require('./stateTaxRates/floridaCountyTaxRates.js');
const georgiaCountyTaxRates = require('./stateTaxRates/georgiaCountyTaxRates.js');
const hawaiiCountyTaxRates = require('./stateTaxRates/hawaiiCountyTaxRates.js');
const idahoCountyTaxRates = require('./stateTaxRates/idahoCountyTaxRates.js');
const illinoisCountyTaxRates = require('./stateTaxRates/illinoisCountyTaxRates.js');
const indianaCountyTaxRates = require('./stateTaxRates/indianaCountyTaxRates.js');
const iowaCountyTaxRates = require('./stateTaxRates/iowaCountyTaxRates.js');
const kansasCountyTaxRates = require('./stateTaxRates/kansasCountyTaxRates.js');
const kentuckyCountyTaxRates = require('./stateTaxRates/kentuckyCountyTaxRates.js');
const louisianaCountyTaxRates = require('./stateTaxRates/louisianaCountyTaxRates.js');
const maineCountyTaxRates = require('./stateTaxRates/maineCountyTaxRates.js');
const marylandCountyTaxRates = require('./stateTaxRates/marylandCountyTaxRates.js');
const massachusettsCountyTaxRates = require('./stateTaxRates/massachusettsCountyTaxRates.js');
const michiganCountyTaxRates = require('./stateTaxRates/michiganCountyTaxRates.js');
const minnesotaCountyTaxRates = require('./stateTaxRates/minnesotaCountyTaxRates.js');
const mississippiCountyTaxRates = require('./stateTaxRates/mississippiCountyTaxRates.js');
const missouriCountyTaxRates = require('./stateTaxRates/missouriCountyTaxRates.js');
const montanaCountyTaxRates = require('./stateTaxRates/montanaCountyTaxRates.js');
const nebraskaCountyTaxRates = require('./stateTaxRates/nebraskaCountyTaxRates.js');
const nevadaCountyTaxRates = require('./stateTaxRates/nevadaCountyTaxRates.js');
const newHampshireCountyTaxRates = require('./stateTaxRates/newHampshireCountyTaxRates.js');
const newJerseyCountyTaxRates = require('./stateTaxRates/newJerseyCountyTaxRates.js');
const newMexicoCountyTaxRates = require('./stateTaxRates/newMexicoCountyTaxRates.js');
const newYorkCountyTaxRates = require('./stateTaxRates/newYorkCountyTaxRates.js');
const northCarolinaCountyTaxRates = require('./stateTaxRates/northCarolinaCountyTaxRates.js');
const northDakotaCountyTaxRates = require('./stateTaxRates/northDakotaCountyTaxRates.js');
const ohioCountyTaxRates = require('./stateTaxRates/ohioCountyTaxRates.js');
const oklahomaCountyTaxRates = require('./stateTaxRates/oklahomaCountyTaxRates.js');
const oregonCountyTaxRates = require('./stateTaxRates/oregonCountyTaxRates.js');
const pennsylvaniaCountyTaxRates = require('./stateTaxRates/pennsylvaniaCountyTaxRates.js');
const rhodeIslandCountyTaxRates = require('./stateTaxRates/rhodeIslandCountyTaxRates.js');
const southCarolinaCountyTaxRates = require('./stateTaxRates/southCarolinaCountyTaxRates.js');
const southDakotaCountyTaxRates = require('./stateTaxRates/southDakotaCountyTaxRates.js');
const tennesseeCountyTaxRates = require('./stateTaxRates/tennesseeCountyTaxRates.js');
const texasCountyTaxRates = require('./stateTaxRates/texasCountyTaxRates.js');
const utahCountyTaxRates = require('./stateTaxRates/utahCountyTaxRates.js');
const vermontCountyTaxRates = require('./stateTaxRates/vermontCountyTaxRates.js');
const virginiaCountyTaxRates = require('./stateTaxRates/virginiaCountyTaxRates.js');
const washingtonCountyTaxRates = require('./stateTaxRates/washingtonCountyTaxRates.js');
const westVirginiaCountyTaxRates = require('./stateTaxRates/westVirginiaCountyTaxRates.js');
const wisconsinCountyTaxRates = require('./stateTaxRates/wisconsinCountyTaxRates.js');
const wyomingCountyTaxRates = require('./stateTaxRates/wyomingCountyTaxRates.js');
const dcCountyTaxRates = require('./stateTaxRates/dcCountyTaxRates.js');

// ====== Map each state abbreviation to its module ======
const stateModules = {
  AL: alabamaCountyTaxRates,
  AK: alaskaCountyTaxRates,
  AZ: arizonaCountyTaxRates,
  AR: arkansasCountyTaxRates,
  CA: californiaCountyTaxRates,
  CO: coloradoCountyTaxRates,
  CT: connecticutCountyTaxRates,
  DE: delawareCountyTaxRates,
  FL: floridaCountyTaxRates,
  GA: georgiaCountyTaxRates,
  HI: hawaiiCountyTaxRates,
  ID: idahoCountyTaxRates,
  IL: illinoisCountyTaxRates,
  IN: indianaCountyTaxRates,
  IA: iowaCountyTaxRates,
  KS: kansasCountyTaxRates,
  KY: kentuckyCountyTaxRates,
  LA: louisianaCountyTaxRates,
  ME: maineCountyTaxRates,
  MD: marylandCountyTaxRates,
  MA: massachusettsCountyTaxRates,
  MI: michiganCountyTaxRates,
  MN: minnesotaCountyTaxRates,
  MS: mississippiCountyTaxRates,
  MO: missouriCountyTaxRates,
  MT: montanaCountyTaxRates,
  NE: nebraskaCountyTaxRates,
  NV: nevadaCountyTaxRates,
  NH: newHampshireCountyTaxRates,
  NJ: newJerseyCountyTaxRates,
  NM: newMexicoCountyTaxRates,
  NY: newYorkCountyTaxRates,
  NC: northCarolinaCountyTaxRates,
  ND: northDakotaCountyTaxRates,
  OH: ohioCountyTaxRates,
  OK: oklahomaCountyTaxRates,
  OR: oregonCountyTaxRates,
  PA: pennsylvaniaCountyTaxRates,
  RI: rhodeIslandCountyTaxRates,
  SC: southCarolinaCountyTaxRates,
  SD: southDakotaCountyTaxRates,
  TN: tennesseeCountyTaxRates,
  TX: texasCountyTaxRates,
  UT: utahCountyTaxRates,
  VT: vermontCountyTaxRates,
  VA: virginiaCountyTaxRates,
  WA: washingtonCountyTaxRates,
  WV: westVirginiaCountyTaxRates,
  WI: wisconsinCountyTaxRates,
  WY: wyomingCountyTaxRates,
  DC: dcCountyTaxRates,
};

// ====== Tax Rate Lookup Function ======
const getTaxRate = (stateAbbr, countyName = '') => {
  if (!stateAbbr) return 0;

  const upperAbbr = stateAbbr.toUpperCase();
  const stateData = stateModules[upperAbbr];
  if (!stateData) return 0;

  const stateTaxConfig = stateData[upperAbbr];
  if (!stateTaxConfig) return 0;

  const defaultRate = stateTaxConfig.default || 0;
  const counties = stateTaxConfig.counties || {};

  if (!countyName) return defaultRate;

  const normalizedCounty = countyName.trim().toLowerCase();
  const countyEntry = Object.entries(counties).find(
    ([key]) => key.toLowerCase() === normalizedCounty
  );

  if (!countyEntry) {
    console.warn(`⚠️ County "${countyName}" not found in ${upperAbbr}`);
    return defaultRate;
  }

  const [, countyRate] = countyEntry;
  return defaultRate + countyRate;
};

module.exports = { getTaxRate };
