/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer } from 'react';

const initialState = {
  files: [],
  printOptions: {
    paperSize: 'a4',
    colorMode: 'bw',
    sides: 'single',
    copies: 1,
    binding: 'none',
    pageRange: '',
    specialInstructions: '',
  },
  deliveryMethod: 'pickup',
  deliveryDetails: { timeSlot: '', location: '' },
  studentInfo: { name: '', email: '', phone: '' },
  orderRef: null,
  paymentStatus: null,
};

function orderReducer(state, action) {
  switch (action.type) {
    case 'SET_FILES':
      return { ...state, files: action.payload };
    case 'SET_PRINT_OPTIONS':
      return { ...state, printOptions: { ...state.printOptions, ...action.payload } };
    case 'SET_DELIVERY_METHOD':
      return { ...state, deliveryMethod: action.payload };
    case 'SET_DELIVERY_DETAILS':
      return { ...state, deliveryDetails: { ...state.deliveryDetails, ...action.payload } };
    case 'SET_STUDENT_INFO':
      return { ...state, studentInfo: { ...state.studentInfo, ...action.payload } };
    case 'SET_ORDER_REF':
      return { ...state, orderRef: action.payload };
    case 'SET_PAYMENT_STATUS':
      return { ...state, paymentStatus: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [state, dispatch] = useReducer(orderReducer, initialState);
  return (
    <OrderContext.Provider value={{ state, dispatch }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder must be used within OrderProvider');
  return ctx;
}
