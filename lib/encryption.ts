/**
 * SE Encryption - Using Saudi Electric's actual encryption method
 * Key discovered from SE's configuration: "sec@123456#sec@1"
 */

import CryptoJS from "crypto-js";

/**
 * SE's actual encryption key from their configuration
 */
const SE_ENCRYPTION_KEY = "sec@123456#sec@1";

/**
 * Encode string to Base64
 */
export function encodeBase64(str: string): string {
  return Buffer.from(str).toString("base64");
}

/**
 * Decode Base64 string
 */
export function decodeBase64(str: string): string {
  return Buffer.from(str, "base64").toString();
}

/**
 * SE's exact encryption method (AES-128-CBC with key=IV)
 * This replicates their exact encryption function
 */
function seEncrypt(accountNumber: string): string {
  try {
    const key = CryptoJS.enc.Utf8.parse(SE_ENCRYPTION_KEY);
    const iv = CryptoJS.enc.Utf8.parse(SE_ENCRYPTION_KEY); // Same as key!

    return CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(accountNumber.toString()),
      key,
      {
        keySize: 16,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    ).toString();
  } catch (error) {
    console.error("SE encryption error:", error);
    // Fallback to simple base64 if crypto fails
    return encodeBase64(accountNumber);
  }
}

/**
 * SE's exact decryption method (for testing/debugging)
 */
export function seDecrypt(ciphertext: string): string {
  try {
    const key = CryptoJS.enc.Utf8.parse(SE_ENCRYPTION_KEY);
    const iv = CryptoJS.enc.Utf8.parse(SE_ENCRYPTION_KEY); // Same as key!

    return CryptoJS.AES.decrypt(ciphertext, key, {
      keySize: 16,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("SE decryption error:", error);
    return "";
  }
}

/**
 * Main encryption function for contract accounts
 * Uses SE's real encryption method
 */
export function encryptContractAccount(accountNumber: string): string {
  // Clean the account number (remove non-digits)
  const cleanAccount = accountNumber.replace(/\D/g, "");

  // Use SE's real encryption
  return seEncrypt(cleanAccount);
}

/**
 * Add a known encryption mapping (for backwards compatibility)
 * Note: Not needed anymore since we have SE's real encryption
 */
export function addKnownEncryption(
  accountNumber: string,
  encryptedValue: string
): void {
  console.log(
    `Note: addKnownEncryption is deprecated. Using SE's real encryption instead.`
  );
  console.log(
    `Account ${accountNumber} -> SE encryption: ${encryptContractAccount(
      accountNumber
    )}`
  );
}

/**
 * Test SE encryption key (for validation)
 */
export function testSEEncryptionKey(testKey: string): boolean {
  const testAccount = "30016129779";
  const expectedEncryption = "sjPFyTFCO88/r3oY4DSJww==";

  try {
    const key = CryptoJS.enc.Utf8.parse(testKey);
    const iv = CryptoJS.enc.Utf8.parse(testKey);

    const result = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(testAccount.toString()),
      key,
      {
        keySize: 16,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    ).toString();

    const match = result === expectedEncryption;

    if (match) {
      console.log(`✅ Key "${testKey}" works!`);
    }

    return match;
  } catch (error) {
    console.error("Test encryption error:", error);
    return false;
  }
}

/**
 * Generate encrypted contract account (async version for compatibility)
 */
export async function generateEncryptedContractAccount(
  accountNumber: string
): Promise<string> {
  return encryptContractAccount(accountNumber);
}

/**
 * Synchronous version for backward compatibility
 */
export function generateEncryptedContractAccountSync(
  accountNumber: string
): string {
  return encryptContractAccount(accountNumber);
}
