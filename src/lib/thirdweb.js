import { ThirdwebSDK } from "thirdweb";
const sdk = new ThirdwebSDK("binance"); // or your chain

export async function createPlatformWallet(email) {
  const wallet = sdk.wallet.generate();
  return wallet.address;
}
