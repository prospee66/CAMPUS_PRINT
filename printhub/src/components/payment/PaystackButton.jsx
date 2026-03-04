import { useState } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PaystackButton({ amount, email, orderRef, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      // Dynamic import of Paystack inline JS
      const PaystackPop = (await import('@paystack/inline-js')).default;
      const popup = new PaystackPop();

      popup.newTransaction({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxx',
        email,
        amount: Math.round(amount * 100), // convert to pesewas
        currency: 'GHS',
        ref: orderRef,
        label: 'PrintHub Order',
        onSuccess: (transaction) => {
          setLoading(false);
          onSuccess(transaction);
        },
        onCancel: () => {
          setLoading(false);
          toast('Payment cancelled. Your order details are saved.', { icon: 'ℹ️' });
          onCancel?.();
        },
      });
    } catch (err) {
      setLoading(false);
      toast.error('Could not initialize payment. Please try again.');
      console.error('Paystack error:', err);
    }
  };

  return (
    <button
      onClick={handlePay}
      disabled={loading || !amount}
      className="btn-primary w-full justify-center text-base py-3.5 rounded-xl"
    >
      {loading ? (
        <><Loader2 size={18} className="animate-spin" /> Processing...</>
      ) : (
        <><CreditCard size={18} /> Pay GH₵ {amount?.toFixed(2)} Now</>
      )}
    </button>
  );
}
