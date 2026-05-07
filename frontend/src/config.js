export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '212600000000';

export const STATUS_LABELS = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

export const STATUS_COLORS = {
  pending: 'status-pending',
  confirmed: 'status-confirmed',
  delivered: 'status-delivered',
  cancelled: 'status-cancelled',
};
