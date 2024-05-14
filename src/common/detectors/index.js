import detectControlLogic from "./controlLogic.js";
import detectSensitiveEquality from "./sensitiveEquality.js";
import detectAnonymousTest from "./anonymousTest.js";

export const detectors = [
  // detectAnonymousTest,
  detectControlLogic,
  detectSensitiveEquality,
];
