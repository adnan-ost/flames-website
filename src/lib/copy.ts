import { CHARGES } from "./site";

/**
 * Shared copy that must stay identical wherever it appears.
 *
 * The serving-suggestion notice is a design rule carried over from the previous
 * site: it accompanies dish photography everywhere it is shown.
 */
export const SERVING_SUGGESTION =
  "Photographs are serving suggestions. Presentation and accompaniments may vary.";

/**
 * Shown wherever prices are. Built from CHARGES so the sentence and the data can
 * never disagree — change a rate there and this follows.
 */
export const PRICE_NOTICE =
  `Prices exclude a ${CHARGES.servicePercent}% service charge and ` +
  `${CHARGES.tax.jurisdiction} sales tax: ${CHARGES.tax.cardPercent}% on card, ` +
  `mobile wallet and QR payments, ${CHARGES.tax.cashPercent}% on cash.`;
