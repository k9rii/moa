const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export const OUTFIT_IMAGE = (outfitId: string) =>
  `${SUPABASE_URL}/storage/v1/object/public/outfits/${outfitId}.jpg`;

export const AVATAR_IMAGE = (path: string) =>
  `${SUPABASE_URL}/storage/v1/object/public/avatars/${path}`;
