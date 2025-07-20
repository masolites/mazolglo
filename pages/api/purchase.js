import { ThirdwebSDK } from "@thirdweb-dev/sdk";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed' 
    });
  }

  try {
    const { walletAddress, amount, email } = req.body;

    // Validate inputs
    if (!walletAddress || !amount || !email) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields' 
      });
    }

    if (isNaN(amount) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid amount' 
      });
    }

    // Initialize SDK
    const sdk = ThirdwebSDK.fromPrivateKey(
      process.env.THIRDWEB_SECRET_KEY,
      "binance",
      {
        clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
      }
    );

    // Get token contract
    const contract = await sdk.getContract(process.env.MZLX_TOKEN_CONTRACT);
    const tokens = Math.floor(amount * 1000); // 1 NGN = 1000 tokens

    // Execute transfer
    const tx = await contract.erc20.transfer(walletAddress, tokens.toString());

    return res.status(200).json({
      success: true,
      message: `Success! ${tokens.toLocaleString()} MZLx tokens sent to ${walletAddress}`,
      txHash: tx.receipt.transactionHash,
    });
  } catch (error) {
    console.error('Purchase error:', error);
    return res.status(500).json({
      success: false,
      message: 'Transaction failed',
      error: error.message || 'Unknown error',
    });
  }
}
