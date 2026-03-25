import { useContext } from 'react';
import { LayoutContext } from '../context/LayoutContextObject';

export const useLayout = () => useContext(LayoutContext);
