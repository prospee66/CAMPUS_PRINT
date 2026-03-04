import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

import StepIndicator from '../components/order/StepIndicator';
import DropZone from '../components/upload/DropZone';
import PrintOptions from '../components/order/PrintOptions';
import DeliveryStep from '../components/order/DeliveryStep';
import OrderSummary from '../components/order/OrderSummary';
import PaystackButton from '../components/payment/PaystackButton';
import { useOrder } from '../context/OrderContext';
import { useNotifications } from '../context/NotificationContext';
import { calcOrderTotal } from '../utils/priceCalc';
import { generateOrderRef, formatCurrency } from '../utils/orderRef';

const TOTAL_STEPS = 5;

export default function Order() {
  const { state, dispatch } = useOrder();
  const { addNotification } = useNotifications();
  const [step, setStep] = useState(1);
  const [orderRef] = useState(generateOrderRef);
  const [paid, setPaid] = useState(false);
  const navigate = useNavigate();

  const total = calcOrderTotal(state.files, state.printOptions, state.deliveryMethod);

  const canNext = () => {
    if (step === 1) return state.files.length > 0;
    if (step === 3) {
      if (state.deliveryMethod === 'pickup') return !!state.deliveryDetails.timeSlot;
      return !!state.deliveryDetails.location && !!state.deliveryDetails.timeSlot;
    }
    if (step === 5) return !!state.studentInfo.email;
    return true;
  };

  const next = () => {
    if (!canNext()) {
      if (step === 1) toast.error('Please upload at least one file');
      else if (step === 3) toast.error('Please complete delivery details');
      else if (step === 5) toast.error('Please enter your email');
      return;
    }
    setStep(s => Math.min(s + 1, TOTAL_STEPS));
  };

  const back = () => setStep(s => Math.max(s - 1, 1));

  const handlePaymentSuccess = (transaction) => {
    dispatch({ type: 'SET_ORDER_REF', payload: orderRef });
    dispatch({ type: 'SET_PAYMENT_STATUS', payload: 'paid' });
    setPaid(true);
    toast.success('Payment successful! Your order has been placed.');

    // Notify admin
    addNotification({
      type: 'new_order',
      title: 'New Print Order Received',
      message: `${state.studentInfo.name || state.studentInfo.email || 'A customer'} placed order ${orderRef} — ${formatCurrency(total)}`,
      orderRef,
      amount: total,
      customer: state.studentInfo.name || state.studentInfo.email,
      files: state.files.map(f => f.name),
      delivery: state.deliveryMethod,
    });
  };

  if (paid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="card max-w-md w-full text-center py-10">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-accent" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h2>
          <p className="text-gray-500 mb-4">Your payment was successful and your order is now in the queue.</p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-500">Order Reference</p>
            <p className="text-xl font-bold text-primary-600 font-mono">{orderRef}</p>
          </div>
          <p className="text-sm text-gray-500 mb-6">Save your order reference to track your print job status.</p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/track')}
              className="btn-secondary flex-1 justify-center"
            >
              Track Order
            </button>
            <button
              onClick={() => { dispatch({ type: 'RESET' }); setStep(1); setPaid(false); }}
              className="btn-primary flex-1 justify-center"
            >
              New Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Place Your Print Order</h1>
          <p className="text-gray-500 text-sm mt-1">Fast, secure document printing — collected or delivered on campus</p>
        </div>

        <StepIndicator currentStep={step} />

        <div className="card">
          {/* Step 1: Upload */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Upload Your Documents</h2>
              <p className="text-sm text-gray-500 mb-5">Drag & drop your files or click to browse. Up to 10 files per order.</p>
              <DropZone
                files={state.files}
                onChange={files => dispatch({ type: 'SET_FILES', payload: files })}
              />
            </div>
          )}

          {/* Step 2: Print Options */}
          {step === 2 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Configure Print Settings</h2>
              <p className="text-sm text-gray-500 mb-5">Choose how you want your documents printed.</p>
              <PrintOptions
                options={state.printOptions}
                onChange={opts => dispatch({ type: 'SET_PRINT_OPTIONS', payload: opts })}
              />
            </div>
          )}

          {/* Step 3: Delivery */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Delivery Method</h2>
              <p className="text-sm text-gray-500 mb-5">Choose how you want to receive your prints.</p>
              <DeliveryStep
                method={state.deliveryMethod}
                details={state.deliveryDetails}
                onMethodChange={method => dispatch({ type: 'SET_DELIVERY_METHOD', payload: method })}
                onDetailsChange={details => dispatch({ type: 'SET_DELIVERY_DETAILS', payload: details })}
              />
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Review Your Order</h2>
              <p className="text-sm text-gray-500 mb-5">Check your order details before paying.</p>
              <OrderSummary
                files={state.files}
                options={state.printOptions}
                deliveryMethod={state.deliveryMethod}
              />
            </div>
          )}

          {/* Step 5: Payment */}
          {step === 5 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Complete Payment</h2>
              <p className="text-sm text-gray-500 mb-5">Secure payment via Paystack — card, mobile money, or bank transfer.</p>

              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="email" className="label">Your Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@student.edu.gh"
                    value={state.studentInfo.email}
                    onChange={e => dispatch({ type: 'SET_STUDENT_INFO', payload: { email: e.target.value } })}
                    className="input"
                  />
                  <p className="text-xs text-gray-400 mt-1">Order confirmation and receipt will be sent here.</p>
                </div>
                <div>
                  <label htmlFor="name" className="label">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Kofi Mensah"
                    value={state.studentInfo.name}
                    onChange={e => dispatch({ type: 'SET_STUDENT_INFO', payload: { name: e.target.value } })}
                    className="input"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="label">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+233 24 000 0000"
                    value={state.studentInfo.phone}
                    onChange={e => dispatch({ type: 'SET_STUDENT_INFO', payload: { phone: e.target.value } })}
                    className="input"
                  />
                </div>
              </div>

              {/* Mini summary */}
              <div className="bg-primary-50 rounded-xl px-4 py-3 mb-6 flex justify-between items-center">
                <span className="text-gray-700 font-medium">Order Total</span>
                <span className="text-xl font-extrabold text-primary-600">{formatCurrency(total)}</span>
              </div>

              <PaystackButton
                amount={total}
                email={state.studentInfo.email}
                orderRef={orderRef}
                onSuccess={handlePaymentSuccess}
              />

              <p className="text-xs text-gray-400 text-center mt-3">
                🔒 Payments secured by Paystack. We never store your card details.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
            {step > 1 ? (
              <button onClick={back} className="btn-outline">
                <ChevronLeft size={18} /> Back
              </button>
            ) : <div />}
            {step < TOTAL_STEPS && (
              <button onClick={next} className="btn-primary">
                {step === 4 ? 'Proceed to Payment' : 'Continue'} <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
