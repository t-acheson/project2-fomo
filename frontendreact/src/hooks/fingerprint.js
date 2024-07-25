import FingerprintJS from '@fingerprintjs/fingerprintjs';

const getFingerprint = async () => {
  // Initialize the agent at application startup.
  const fp = await FingerprintJS.load();

  // Get the visitor identifier when you need it.
  const result = await fp.get();

  // The visitor identifier:
  return result.visitorId;
};

export default getFingerprint;
