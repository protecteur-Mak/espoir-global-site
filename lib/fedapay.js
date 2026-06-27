// lib/fedapay.js
import { FedaPay } from 'fedapay';

// Initialisation avec la clé publique stockée en variable d'environnement
FedaPay.setPublicKey(process.env.NEXT_PUBLIC_FEDAPAY_PUBLIC_KEY);

export const initiatePayment = (amount, description) => {
  return FedaPay.init({
    public_key: process.env.NEXT_PUBLIC_FEDAPAY_PUBLIC_KEY,
    transaction: {
      amount: amount,
      description: description
    }
  });
