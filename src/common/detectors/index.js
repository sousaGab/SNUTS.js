// import detectSensitiveEquality from "./sensitiveEquality.js";
import detectAnonymousTest from "./anonymousTest.js";
import detectCommentsOnlyTest from "./commentsOnlyTest.js";
import detectGeneralFixture from "./generalFixture.js";
import detectTestWithoutDescription from "./testWithoutDescription.js";
import detectTranscriptingTest from "./transcriptingTest.js";
import detectOvercommentedTest from "./overcommented.js";

export const detectors = [
  detectAnonymousTest,
  // detectSensitiveEquality,
  detectCommentsOnlyTest,
  detectGeneralFixture,
  detectTestWithoutDescription,
  detectTranscriptingTest,
  detectOvercommentedTest,
];
