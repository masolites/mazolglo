import { sendMazolTokens } from './thirdweb';

export async function handleAffiliateRewards(db, buyerEmail, referrerEmail, buyerWallet, amount) {
  // Buyer: 1% fiat, 1% Mazol
  // Referrer: 1.5% fiat, 1.5% Mazol
  const buyerFiat = amount * 0.01;
  const buyerMazol = amount * 0.01;
  const refFiat = amount * 0.015;
  const refMazol = amount * 0.015;

  const referrer = await db.collection("users").findOne({ email: referrerEmail });

  // Log rewards
  await db.collection("affiliate_rewards").insertMany([
    { user: buyerEmail, type: "fiat", amount: buyerFiat, createdAt: new Date() },
    { user: buyerEmail, type: "mazol", amount: buyerMazol, createdAt: new Date() },
    { user: referrerEmail, type: "fiat", amount: refFiat, createdAt: new Date() },
    { user: referrerEmail, type: "mazol", amount: refMazol, createdAt: new Date() },
  ]);

  // Send Mazol tokens
  await sendMazolTokens(buyerWallet, buyerMazol);
  if (referrer) await sendMazolTokens(referrer.wallet, refMazol);

  // TODO: Credit fiat rewards to platform wallet balances
}
