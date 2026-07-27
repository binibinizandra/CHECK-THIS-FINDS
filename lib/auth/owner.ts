import "server-only";

export const OWNER_USER_ID = "user_3GtTKgVKA7gxgyyo0MN7SuaS4BI";

export function isOwner(userId: string | null): userId is string {
  return userId === OWNER_USER_ID;
}
