import { ThirdwebSDK } from "thirdweb";

const sdk = new ThirdwebSDK("binance", {
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
});

export async function createPlatformWallet(email) {
  const wallet = sdk.wallet.generate();
  return wallet.address;
}

export async function sendMazolTokens(to, amount) {
  const contract = await sdk.getContract(process.env.MAZOL_CONTRACT_ADDRESS);
  await contract.erc20.transfer(to, amount);
}
