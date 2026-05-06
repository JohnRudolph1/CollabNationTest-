import { Link } from 'react-router-dom';
import { Project } from '../types';

interface Props {
  project: Project;
  score: number;
  onVote: (projectId: string, value: 1 | -1) => void;
  onCollaborate: (project: Project) => void;
  busy: boolean;
}

export const PostCard = ({ project, score, onVote, onCollaborate, busy }: Props) => (
  <article className="card">
    <div className="meta"><strong>{project.ownerUsername}</strong> · {new Date(project.createdAt).toLocaleString()}</div>
    <Link to={`/projects/${project.id}`}><h3>{project.title}</h3></Link>
    <p>{project.body}</p>
    <div>{project.skills.map((s) => <span key={s} className="tag">#{s}</span>)}</div>
    <div className="actions">
      <button onClick={() => onVote(project.id, 1)}>▲</button>
      <span>{score}</span>
      <button onClick={() => onVote(project.id, -1)}>▼</button>
      <Link to={`/projects/${project.id}`}>comment</Link>
      <button disabled={busy} onClick={() => onCollaborate(project)}>{busy ? 'sending...' : 'collaborate'}</button>
    </div>
  </article>
);
