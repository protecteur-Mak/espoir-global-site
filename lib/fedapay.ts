// lib/fedapay.ts
import { FedaPay } from 'fedapay';

export const initiatePayment = (amount: number, description: string) => {
  // Vérification : s'assurer que le code ne tourne que dans le navigateur
  if (typeof window !== 'undefined') {
    FedaPay.setPublicKey(process.env.NEXT_PUBLIC_FEDAPAY_PUBLIC_KEY || '');
    
    FedaPay.init({
      public_key: process.env.NEXT_PUBLIC_FEDAPAY_PUBLIC_KEY || '',
      transaction: {
        amount: amount,
        description: description
      }
    });
  } else {
    console.warn("FedaPay ne peut être initialisé que côté client.");
  }
};
