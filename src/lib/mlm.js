import { sendMazolTokens } from './thirdweb';

// Example: Simple 2-level reward logic. Expand for full 1x7 matrix as needed.
export async function handleMLMRewards(db, buyerEmail, amount, referrerEmail) {
  // L0: Self (10%)
  const l0Reward = amount * 0.10;
  // L1: Direct referrer (20%)
  const l1Reward = amount * 0.20;
  // L2: Indirect (referrer's referrer, 25%)
  const l2Reward = amount * 0.25;

  // Find referrer and their referrer
  const referrer = referrerEmail ? await db.collection("users").findOne({ email: referrerEmail }) : null;
  const l2 = referrer && referrer.referrerEmail ? await db.collection("users").findOne({ email: referrer.referrerEmail }) : null;

  // Send rewards
  await sendMazolTokens(buyerEmail, l0Reward);
  if (referrer) await sendMazolTokens(referrer.wallet, l1Reward);
  if (l2) await sendMazolTokens(l2.wallet, l2Reward);

  // Log rewards
  await db.collection("mlm_rewards").insertMany([
    { user: buyerEmail, type: "L0", amount: l0Reward, createdAt: new Date() },
    { user: referrerEmail, type: "L1", amount: l1Reward, createdAt: new Date() },
    { user: l2 ? l2.email : null, type: "L2", amount: l2Reward, createdAt: new Date() },
  ]);
}
