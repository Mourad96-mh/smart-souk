import { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import AdminLayout from '../../components/AdminLayout';
import { STATUS_LABELS, STATUS_COLORS, WHATSAPP_NUMBER } from '../../config';

const STATUSES = ['', 'pending', 'confirmed', 'delivered', 'cancelled'];
const STATUS_FILTER_LABELS = {
  '': 'Toutes',
  pending: 'En attente',
  confirmed: 'Confirmées',
  delivered: 'Livrées',
  cancelled: 'Annulées',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const load = () => {
    setLoading(true);
    const path = filter ? `/orders?status=${filter}` : '/orders';
    api
      .get(path, true)
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, [filter]);

  const updateStatus = async (id, status) => {
    try {
      const updated = await api.patch(`/orders/${id}/status`, { status }, true);
      setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm('Supprimer cette commande ?')) return;
    try {
      await api.delete(`/orders/${id}`, true);
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const openWhatsApp = (order) => {
    const itemLines = order.items
      .map((i) => `- ${i.name} x${i.quantity}: ${(i.price * i.quantity).toFixed(2)} MAD`)
      .join('\n');
    const message =
      `*Confirmation Commande ${order.orderNumber}*\n\n` +
      `Bonjour ${order.customer.name},\n` +
      `Votre commande est confirmée !\n\n` +
      `*Articles:*\n${itemLines}\n\n` +
      `*Total: ${order.total.toFixed(2)} MAD*\n` +
      `Paiement: Cash à la livraison`;
    window.open(
      `https://wa.me/${order.customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  return (
    <AdminLayout title="Commandes">
      <div className="admin-card">
        <div className="admin-card-header">
          <h2>{orders.length} commande{orders.length !== 1 ? 's' : ''}</h2>
          <div className="filter-tabs">
            {STATUSES.map((s) => (
              <button
                key={s}
                className={`filter-tab${filter === s ? ' active' : ''}`}
                onClick={() => setFilter(s)}
              >
                {STATUS_FILTER_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        <div className="table-wrap">
          {loading ? (
            <div className="page-loader">
              <div className="spinner spinner-dark" />
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-table">Aucune commande</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>N°</th>
                  <th>Client</th>
                  <th>Articles</th>
                  <th>Total</th>
                  <th>Statut</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td style={{ fontWeight: 700, color: 'var(--primary)', whiteSpace: 'nowrap' }}>
                      {o.orderNumber}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{o.customer.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {o.customer.phone}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {o.customer.city}
                      </div>
                    </td>
                    <td style={{ maxWidth: 200 }}>
                      {o.items.map((item, i) => (
                        <div key={i} style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          {item.name} x{item.quantity}
                        </div>
                      ))}
                    </td>
                    <td style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {o.total.toFixed(2)} MAD
                    </td>
                    <td>
                      <select
                        className="status-select"
                        value={o.status}
                        onChange={(e) => updateStatus(o._id, e.target.value)}
                      >
                        {['pending', 'confirmed', 'delivered', 'cancelled'].map((s) => (
                          <option key={s} value={s}>
                            {STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                      {new Date(o.createdAt).toLocaleDateString('fr-MA')}
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn btn-sm"
                          style={{ background: '#25d366', color: 'white' }}
                          onClick={() => openWhatsApp(o)}
                          title="Contacter via WhatsApp"
                        >
                          WA
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteOrder(o._id)}
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
