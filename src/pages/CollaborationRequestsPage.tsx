import { collection, getDoc, getDocs, query, updateDoc, where, doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db, rtdb } from '../firebase/config';
import { CollaborationRequest, Project } from '../types';
import { useAuth } from '../context/AuthContext';
import { push, ref, set } from 'firebase/database';

export const CollaborationRequestsPage = () => {
  const { user } = useAuth();
  const [incoming, setIncoming] = useState<CollaborationRequest[]>([]);
  const [sent, setSent] = useState<CollaborationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const incomingSnap = await getDocs(query(collection(db, 'collaborationRequests'), where('projectOwnerId', '==', user.uid)));
    const sentSnap = await getDocs(query(collection(db, 'collaborationRequests'), where('requesterId', '==', user.uid)));
    setIncoming(incomingSnap.docs.map((d) => ({ id: d.id, ...d.data() } as CollaborationRequest)));
    setSent(sentSnap.docs.map((d) => ({ id: d.id, ...d.data() } as CollaborationRequest)));
    setLoading(false);
  };

  useEffect(() => { void load(); }, [user?.uid]);

  const syncCollaborator = async (item: CollaborationRequest) => {
    const projRef = doc(db, 'projects', item.projectId);
    const snap = await getDoc(projRef);
    if (!snap.exists()) return;
    const project = { id: snap.id, ...snap.data() } as Project;
    const collabs = Array.from(new Set([...(project.collaboratorIds ?? []), item.requesterId]));
    await updateDoc(projRef, { collaboratorIds: collabs });
  };

  const decide = async (item: CollaborationRequest, status: 'accepted' | 'declined') => {
    await updateDoc(doc(db, 'collaborationRequests', item.id), { status });
    if (status === 'accepted') await syncCollaborator(item);
    const noteRef = push(ref(rtdb, `notifications/${item.requesterId}`));
    await set(noteRef, { message: `Your collaboration request was ${status}.`, createdAt: Date.now() });
    await load();
  };

  if (loading) return <p>Loading requests...</p>;

  return (
    <div>
      <section className="card">
        <h2>Incoming Requests</h2>
        {incoming.length === 0 && <p>No incoming requests.</p>}
        {incoming.map((item) => (
          <div key={item.id} className="request-row">
            <div>
              <strong>{item.requesterUsername}</strong>
              <p>{item.message}</p>
              <small>Status: {item.status}</small>
            </div>
            {item.status === 'pending' && (
              <div className="actions">
                <button onClick={() => void decide(item, 'accepted')}>Accept</button>
                <button onClick={() => void decide(item, 'declined')}>Decline</button>
              </div>
            )}
          </div>
        ))}
      </section>

      <section className="card">
        <h2>Sent Requests</h2>
        {sent.length === 0 && <p>No sent requests.</p>}
        {sent.map((item) => (
          <div key={item.id} className="request-row">
            <div>
              <strong>Project: {item.projectId}</strong>
              <p>{item.message}</p>
              <small>Status: {item.status}</small>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};
