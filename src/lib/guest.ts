export const GUEST_ID_KEY = "eyewear_guest_id";

export const getGuestId = (): string => {
  if (typeof window === "undefined") return "";
  let guestId = localStorage.getItem(GUEST_ID_KEY);
  if (!guestId) {
    guestId = `guest-${crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(GUEST_ID_KEY, guestId);
  }
  return guestId;
};
