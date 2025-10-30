export type MembershipLevel = 'normal' | 'vip' | 'premium';

export interface IUser {
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  dob?: Date;
  gender?: string;
  isActive?: boolean;
  profileCompleted?: boolean;
  membershipLevel?: MembershipLevel;
  membershipExpiresAt?: Date | null;
  aiMealTokens?: number;
  aiMealTokensLastReset?: Date | null;
}
