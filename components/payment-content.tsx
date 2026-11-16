import React, { useState, useEffect } from 'react';
import { ShieldCheck, CreditCard, Smartphone, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface PaymentContentProps {
  onSuccess?: (response: any) => void;
}

const PREDEFINED_AMOUNTS = [
  1000, 2000, 5000, 10000, 20000, 25000, 30000, 35000, 50000, 100000
];

export const PaymentContent: React.FC<PaymentContentProps> = ({ onSuccess }) => {
  const [amount, setAmount] = useState<number>(5000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'fedapay' | 'mobile_money'>('fedapay');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  // Vérifier si l'utilisateur revient d'une redirection FedaPay avec un ID de transaction dans l'URL
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const txId = queryParams.get('id') || queryParams.get('transaction_id');
    
    if (txId) {
      setTransactionId(txId);
      verifyTransactionStatus(txId);
    }
  }, []);

  // Fonction pour interroger le backend et s'assurer que le webhook a bien validé/encaissé le don
  const verifyTransactionStatus = async (txId: string) => {
    setVerifying(true);
    setError('');

    try {
      // Appel API vers votre backend pour vérifier si le webhook a confirmé l'encaissement
      // Exemple : const res = await fetch(`/api/verify-payment?id=${txId}`);
      // const data = await res.json();

      // Simulation de la vérification de la confirmation par le webhook
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Simulation du résultat renvoyé par le serveur après traitement du webhook FedaPay
      const isConfirmedByWebhook = true; // Remplacer par data.status === 'approved'

      if (isConfirmedByWebhook) {
        setSuccess(true);
        if (onSuccess) onSuccess({ transactionId: txId, status: 'approved' });
      } else {
        setError('Le paiement n\'a pas encore été validé ou a échoué. Aucun don enregistré.');
        setSuccess(false);
      }
    } catch (err) {
      setError('Impossible de vérifier l\'état du paiement auprès du serveur.');
    } finally {
      setVerifying(false);
    }
  };

  const handleAmountSelect = (val: number) => {
    setAmount(val);
    setCustomAmount('');
    setError('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomAmount(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0) {
      setAmount(num);
    }
    setError('');
  };

  const validateUemoaPhone = (phone: string): boolean => {
    const cleanPhone = phone.replace(/\s+/g, '');
    const phoneRegex = /^(\+?[0-9]{8,15})$/;
    return phoneRegex.test(cleanPhone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (amount <= 0) {
      setError('Veuillez sélectionner ou entrer un montant valide en F CFA.');
      return;
    }

    if (paymentMethod === 'mobile_money' && !validateUemoaPhone(phoneNumber)) {
      setError('Veuillez entrer un numéro de téléphone mobile valide pour la zone UEMOA.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        amount,
        currency: 'XOF',
        description: 'Contribution / Don - Espoir Global',
        customer: {
          phone_number: phoneNumber,
        },
      };

      console.log('Initiating FedaPay transaction & setting up webhook expectation:', payload);

      // Simulation de l'appel pour générer le lien de paiement FedaPay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirection simulée vers FedaPay
      window.location.href = `?id=fedapay_tx_simulated_${Date.now()}`;
      
    } catch (err: any) {
      setError('Une erreur est survenue lors de l\'initialisation du paiement. Veuillez réessayer.');
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-8 text-center">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800">Vérification de l'encaissement...</h3>
        <p className="text-gray-600 text-sm mt-2">
          Nous patientons la confirmation du webhook FedaPay avant d'afficher votre reçu.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-6 md:p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Soutenir Espoir Global</h2>
        <p className="text-gray-600 text-sm mt-1">
          Choisissez un montant en Franc CFA (F CFA) pour contribuer à nos actions.
        </p>
      </div>

      {success ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-green-800">Merci pour votre don !</h3>
          <p className="text-green-700 text-sm mt-1">
            Le paiement a été confirmé et encaissé avec succès.
          </p>
          <p className="text-emerald-800 font-bold text-md mt-2">
            Montant : {amount.toLocaleString()} F CFA
          </p>
          <button
            onClick={() => {
              setSuccess(false);
              setPhoneNumber('');
              window.history.replaceState({}, document.title, window.location.pathname);
            }}
            className="mt-5 px-6 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition"
          >
            Effectuer un autre don
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Grille des montants prédéfinis */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Montants rapides (F CFA)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {PREDEFINED_AMOUNTS.map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => handleAmountSelect(val)}
                  className={`py-2.5 px-3 text-sm font-medium rounded-xl border transition-all ${
                    amount === val && !customAmount
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {val.toLocaleString()} F
                </button>
              ))}
            </div>
          </div>

          {/* Montant personnalisé */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Ou entrez un montant personnalisé (F CFA)
            </label>
            <div className="relative">
              <input
                type="number"
                min="100"
                step="100"
                value={customAmount}
                onChange={handleCustomAmountChange}
                placeholder="Ex: 15000"
                className="w-full pl-4 pr-16 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">
                F CFA
              </span>
            </div>
          </div>

          {/* Mode de paiement */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Mode de paiement
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('fedapay')}
                className={`flex items-center justify-center gap-2 p-3.5 border rounded-xl font-medium transition ${
                  paymentMethod === 'fedapay'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <span>FedaPay / Carte</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('mobile_money')}
                className={`flex items-center justify-center gap-2 p-3.5 border rounded-xl font-medium transition ${
                  paymentMethod === 'mobile_money'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <span>Mobile Money</span>
              </button>
            </div>
          </div>

          {/* Numéro de téléphone pour Mobile Money / UEMOA */}
          {paymentMethod === 'mobile_money' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Numéro de téléphone (Zone UEMOA / ex: +228...)
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+228 90 00 00 00"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800"
              />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Bouton de validation */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>
              {loading ? 'Redirection vers FedaPay...' : `Payer ${amount.toLocaleString()} F CFA`}
            </span>
          </button>
        </form>
      )}
    </div>
  );
};