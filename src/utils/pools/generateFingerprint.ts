import { getCurrentBrowserFingerPrint } from "@rajesh896/broprint.js";

export default async function getFingerprint() {
  return await getCurrentBrowserFingerPrint();
}
