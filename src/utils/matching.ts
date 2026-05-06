import { Project, UserProfile } from '../types';

export const calculateMatchScore = (user: UserProfile, project: Project): number => {
  const skillOverlap = user.skills.filter((skill) => project.skills.includes(skill)).length;
  const skillScore = project.skills.length ? (skillOverlap / project.skills.length) * 50 : 0;
  const interestOverlap = user.interests.filter((interest) => project.title.toLowerCase().includes(interest.toLowerCase())).length;
  const interestScore = Math.min(20, interestOverlap * 10);
  const availabilityScore = user.availability ? 15 : 0;
  const activityScore = user.updatedAt && Date.now() - user.updatedAt < 1000 * 60 * 60 * 24 * 14 ? 15 : 0;
  return Math.round(skillScore + interestScore + availabilityScore + activityScore);
};
