export const EMAIL = "hello@sharonbertoncello.com";

export const SOCIAL = [
  {
    label: "Instagram",
    value: "@sharonbertoncello",
    href: "https://www.instagram.com/sharonbertoncello",
  },
  {
    label: "LinkedIn",
    value: "in/sharonbertoncello",
    href: "https://www.linkedin.com/in/sharonbertoncello",
  },
];

export const mailto = (oggetto) =>
  `mailto:${EMAIL}${oggetto ? `?subject=${encodeURIComponent(oggetto)}` : ""}`;
