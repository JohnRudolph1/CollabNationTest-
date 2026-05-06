import { CollaborationRequest, Project, UserProfile } from '../types';

export const profileCompleteness = (profile: UserProfile): number => {
  const checks = [
    profile.username?.length >= 2,
    Boolean(profile.bio && profile.bio.length >= 20),
    profile.skills.length >= 3,
    profile.interests.length >= 2,
    Boolean(profile.avatar),
    Boolean(profile.availability)
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
};

export const collaborationScore = (projects: Project[], requests: CollaborationRequest[]): number => {
  const userProjects = projects.length;
  const accepted = requests.filter((r) => r.status === 'accepted').length;
  const declined = requests.filter((r) => r.status === 'declined').length;
  const base = userProjects * 8 + accepted * 12 - declined * 4;
  return Math.max(0, Math.min(100, base));
};
