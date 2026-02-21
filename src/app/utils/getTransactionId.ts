import crypto from "crypto";
export const getTransactionId = () => {
  // const date = Date.now();
  // const randomNumber = Math.floor(Math.random() * 1000);
  const cryptoId = crypto.randomBytes(6).toString("hex");
  return `tran_${cryptoId}`;
};
