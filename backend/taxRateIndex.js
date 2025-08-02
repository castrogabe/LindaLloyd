// taxRateIndex.js
import alabamaCountyTaxRates from './stateTaxRates/alabamaCountyTaxRates.js';
import alaskaCountyTaxRates from './stateTaxRates/alaskaCountyTaxRates.js';
import arizonaCountyTaxRates from './stateTaxRates/arizonaCountyTaxRates.js';
import arkansasCountyTaxRates from './stateTaxRates/arkansasCountyTaxRates.js';
import californiaCountyTaxRates from './stateTaxRates/californiaCountyTaxRates.js';
import coloradoCountyTaxRates from './stateTaxRates/coloradoCountyTaxRates.js';
import connecticutCountyTaxRates from './stateTaxRates/connecticutCountyTaxRates.js';
import delawareCountyTaxRates from './stateTaxRates/delawareCountyTaxRates.js';
import floridaCountyTaxRates from './stateTaxRates/floridaCountyTaxRates.js';
import georgiaCountyTaxRates from './stateTaxRates/georgiaCountyTaxRates.js';
import hawaiiCountyTaxRates from './stateTaxRates/hawaiiCountyTaxRates.js';
import idahoCountyTaxRates from './stateTaxRates/idahoCountyTaxRates.js';
import illinoisCountyTaxRates from './stateTaxRates/illinoisCountyTaxRates.js';
import indianaCountyTaxRates from './stateTaxRates/indianaCountyTaxRates.js';
import iowaCountyTaxRates from './stateTaxRates/iowaCountyTaxRates.js';
import kansasCountyTaxRates from './stateTaxRates/kansasCountyTaxRates.js';
import kentuckyCountyTaxRates from './stateTaxRates/kentuckyCountyTaxRates.js';
import louisianaCountyTaxRates from './stateTaxRates/louisianaCountyTaxRates.js';
import maineCountyTaxRates from './stateTaxRates/maineCountyTaxRates.js';
import marylandCountyTaxRates from './stateTaxRates/marylandCountyTaxRates.js';
import massachusettsCountyTaxRates from './stateTaxRates/massachusettsCountyTaxRates.js';
import michiganCountyTaxRates from './stateTaxRates/michiganCountyTaxRates.js';
import minnesotaCountyTaxRates from './stateTaxRates/minnesotaCountyTaxRates.js';
import mississippiCountyTaxRates from './stateTaxRates/mississippiCountyTaxRates.js';
import missouriCountyTaxRates from './stateTaxRates/missouriCountyTaxRates.js';
import montanaCountyTaxRates from './stateTaxRates/montanaCountyTaxRates.js';
import nebraskaCountyTaxRates from './stateTaxRates/nebraskaCountyTaxRates.js';
import nevadaCountyTaxRates from './stateTaxRates/nevadaCountyTaxRates.js';
import newHampshireCountyTaxRates from './stateTaxRates/newHampshireCountyTaxRates.js';
import newJerseyCountyTaxRates from './stateTaxRates/newJerseyCountyTaxRates.js';
import newMexicoCountyTaxRates from './stateTaxRates/newMexicoCountyTaxRates.js';
import newYorkCountyTaxRates from './stateTaxRates/newYorkCountyTaxRates.js';
import northCarolinaCountyTaxRates from './stateTaxRates/northCarolinaCountyTaxRates.js';
import northDakotaCountyTaxRates from './stateTaxRates/northDakotaCountyTaxRates.js';
import ohioCountyTaxRates from './stateTaxRates/ohioCountyTaxRates.js';
import oklahomaCountyTaxRates from './stateTaxRates/oklahomaCountyTaxRates.js';
import oregonCountyTaxRates from './stateTaxRates/oregonCountyTaxRates.js';
import pennsylvaniaCountyTaxRates from './stateTaxRates/pennsylvaniaCountyTaxRates.js';
import rhodeIslandCountyTaxRates from './stateTaxRates/rhodeIslandCountyTaxRates.js';
import southCarolinaCountyTaxRates from './stateTaxRates/southCarolinaCountyTaxRates.js';
import southDakotaCountyTaxRates from './stateTaxRates/southDakotaCountyTaxRates.js';
import tennesseeCountyTaxRates from './stateTaxRates/tennesseeCountyTaxRates.js';
import texasCountyTaxRates from './stateTaxRates/texasCountyTaxRates.js';
import utahCountyTaxRates from './stateTaxRates/utahCountyTaxRates.js';
import vermontCountyTaxRates from './stateTaxRates/vermontCountyTaxRates.js';
import virginiaCountyTaxRates from './stateTaxRates/virginiaCountyTaxRates.js';
import washingtonCountyTaxRates from './stateTaxRates/washingtonCountyTaxRates.js';
import westVirginiaCountyTaxRates from './stateTaxRates/westVirginiaCountyTaxRates.js';
import wisconsinCountyTaxRates from './stateTaxRates/wisconsinCountyTaxRates.js';
import wyomingCountyTaxRates from './stateTaxRates/wyomingCountyTaxRates.js';
import dcCountyTaxRates from './stateTaxRates/dcCountyTaxRates.js';

// Map each state abbreviation to its module
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

export { getTaxRate };
