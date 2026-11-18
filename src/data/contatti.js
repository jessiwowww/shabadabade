export const EMAIL = "hello@sharonbertoncello.com";

export const SOCIAL = [
  {
    label: "Instagram",
    value: "@shabadabade",
    href: "https://www.instagram.com/shabadabade/",
  },
  {
    label: "LinkedIn",
    value: "in/sharon-bertoncello",
    href: "https://www.linkedin.com/in/sharon-bertoncello/",
  },
];

export const mailto = (oggetto) =>
  `mailto:${EMAIL}${oggetto ? `?subject=${encodeURIComponent(oggetto)}` : ""}`;
