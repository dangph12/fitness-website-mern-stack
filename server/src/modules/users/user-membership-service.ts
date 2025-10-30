import createHttpError from 'http-errors';
import { Types } from 'mongoose';

import UserModel, { type IUserDocument } from './user-model';
import { type MembershipLevel } from './user-type';

const MEMBERSHIP_DURATION_DAYS = Number(
  process.env.MEMBERSHIP_DURATION_DAYS ?? 30
);

const VIP_DAILY_TOKENS = Number(process.env.VIP_DAILY_AI_TOKENS ?? 3);
const PREMIUM_DAILY_TOKENS = Number(process.env.PREMIUM_DAILY_AI_TOKENS ?? 5);

const DAILY_TOKEN_QUOTAS: Record<MembershipLevel, number> = {
  normal: 0,
  vip: VIP_DAILY_TOKENS,
  premium: PREMIUM_DAILY_TOKENS
};

const ensureObjectId = (id: string | Types.ObjectId): Types.ObjectId => {
  if (id instanceof Types.ObjectId) {
    return id;
  }

  if (!Types.ObjectId.isValid(id)) {
    throw createHttpError(400, 'Invalid userId');
  }

  return new Types.ObjectId(id);
};

const startOfDay = (value: Date): Date => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const calculateExpiryDate = (from: Date): Date => {
  const expiry = new Date(from);
  expiry.setDate(expiry.getDate() + MEMBERSHIP_DURATION_DAYS);
  return expiry;
};

const normalizeLevel = (level?: MembershipLevel | null): MembershipLevel =>
  level ?? 'normal';

const getDailyQuota = (level: MembershipLevel): number =>
  DAILY_TOKEN_QUOTAS[level] ?? 0;

const refreshUserState = (user: IUserDocument, now: Date): boolean => {
  let mutated = false;
  const level = normalizeLevel(user.membershipLevel);
  const expiry = user.membershipExpiresAt
    ? new Date(user.membershipExpiresAt)
    : undefined;

  if (level !== 'normal' && expiry && expiry <= now) {
    user.membershipLevel = 'normal';
    user.membershipExpiresAt = undefined;
    user.aiMealTokens = 0;
    user.aiMealTokensLastReset = undefined;
    return true;
  }

  if (level === 'normal') {
    if ((user.aiMealTokens ?? 0) !== 0 || user.aiMealTokensLastReset) {
      user.aiMealTokens = 0;
      user.aiMealTokensLastReset = undefined;
      mutated = true;
    }
    return mutated;
  }

  const quota = getDailyQuota(level);
  const lastReset = user.aiMealTokensLastReset
    ? new Date(user.aiMealTokensLastReset)
    : undefined;

  if (
    !lastReset ||
    startOfDay(lastReset).getTime() !== startOfDay(now).getTime()
  ) {
    user.aiMealTokens = quota;
    user.aiMealTokensLastReset = now;
    mutated = true;
  } else if (typeof user.aiMealTokens !== 'number' || user.aiMealTokens < 0) {
    user.aiMealTokens = quota;
    mutated = true;
  }

  return mutated;
};

const applyMembershipLevel = async (
  userId: string | Types.ObjectId,
  level: MembershipLevel,
  now = new Date()
): Promise<IUserDocument> => {
  const objectId = ensureObjectId(userId);
  const user = await UserModel.findById(objectId);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  user.membershipLevel = level;

  if (level === 'vip' || level === 'premium') {
    user.membershipExpiresAt = calculateExpiryDate(now);
    user.aiMealTokens = getDailyQuota(level);
    user.aiMealTokensLastReset = now;
  } else {
    user.membershipExpiresAt = undefined;
    user.aiMealTokens = 0;
    user.aiMealTokensLastReset = undefined;
  }

  await user.save();
  return user;
};

const consumeAiMealTokens = async (
  userId: string,
  tokensToConsume = 1,
  now = new Date()
): Promise<{
  remainingTokens: number;
  membershipLevel: MembershipLevel;
  membershipExpiresAt?: Date;
}> => {
  const amount =
    typeof tokensToConsume === 'number' && Number.isFinite(tokensToConsume)
      ? Math.max(1, Math.floor(tokensToConsume))
      : 1;
  const objectId = ensureObjectId(userId);
  const user = await UserModel.findById(objectId);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const mutated = refreshUserState(user, now);
  const level = normalizeLevel(user.membershipLevel);

  if (level !== 'vip' && level !== 'premium') {
    if (mutated) {
      await user.save();
    }
    throw createHttpError(
      403,
      'AI meal generation is available for VIP or Premium members only'
    );
  }

  if ((user.aiMealTokens ?? 0) < amount) {
    if (mutated) {
      await user.save();
    }
    throw createHttpError(
      429,
      'Not enough AI meal tokens remaining for this request. Try a smaller range or wait until tokens refresh.'
    );
  }

  user.aiMealTokens = (user.aiMealTokens ?? 0) - amount;
  await user.save();

  return {
    remainingTokens: user.aiMealTokens ?? 0,
    membershipLevel: normalizeLevel(user.membershipLevel),
    membershipExpiresAt: user.membershipExpiresAt ?? undefined
  };
};

const refreshMembership = async (
  userId: string | Types.ObjectId,
  now = new Date()
): Promise<IUserDocument> => {
  const objectId = ensureObjectId(userId);
  const user = await UserModel.findById(objectId);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  if (refreshUserState(user, now)) {
    await user.save();
  }

  return user;
};

export const userMembershipService = {
  getDailyQuota,
  applyMembershipLevel,
  consumeAiMealTokens,
  refreshMembership,
  calculateExpiryDate
};

export default userMembershipService;
