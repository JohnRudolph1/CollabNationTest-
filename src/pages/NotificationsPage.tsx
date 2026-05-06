import { onValue, ref, remove } from 'firebase/database';
import { useEffect, useState } from 'react';
import { rtdb } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

export const NotificationsPage = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Array<{ id: string; message: string }>>([]);

  useEffect(() => {
    if (!user) return;
    const node = ref(rtdb, `notifications/${user.uid}`);
    return onValue(node, (snap) => {
      const data = snap.val() ?? {};
      setItems(Object.entries(data).map(([id, value]) => ({ id, message: (value as { message?: string }).message ?? 'Notification' })));
    });
  }, [user?.uid]);

  const clear = async (id: string) => {
    if (!user) return;
    await remove(ref(rtdb, `notifications/${user.uid}/${id}`));
  };

  return (
    <div className="card">
      <h2>Notifications</h2>
      {items.length === 0 && <p>No notifications yet.</p>}
      {items.map((item) => (
        <div key={item.id} className="request-row">
          <p>{item.message}</p>
          <button onClick={() => void clear(item.id)}>Dismiss</button>
        </div>
      ))}
    </div>
  );
};
