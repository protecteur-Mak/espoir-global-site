import { useState, useCallback } from 'react';

interface PaymentPayload {
  amount: number;
  customer_email: string;
  customer_phone_number?: string;
  description?: string;
}

export function useFedaPay() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initPayment = useCallback(async (payload: PaymentPayload) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Si le serveur a ignoré un doublon vide (Statut 204), on s'arrête proprement
      if (response.status === 204) {
        setLoading(false);
        return null;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue lors de la transaction.");
      }

      setLoading(false);
      return data; // Contient la réponse de FedaPay (ex: l'URL de redirection)

    } catch (err: any) {
      console.error("Erreur d'initialisation du paiement :", err.message);
      setError(err.message || "Impossible de traiter le paiement.");
      setLoading(false);
      throw err;
    }
  }, []); // Le tableau vide garantit que la fonction n'est pas recréée inutilement, stoppant la boucle infinie

  return {
    initPayment,
    loading,
    error,
  };
}
