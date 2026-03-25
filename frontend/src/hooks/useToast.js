import { useContext } from 'react';
import { ToastContext } from '../context/ToastContextObject';

export const useToast = () => useContext(ToastContext);
