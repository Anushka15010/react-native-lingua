const mascotWelcome = require("../assets/images/mascot-welcome.png");
const mascotLogo = require("../assets/images/moscot-logo.png");
const mascotAuth = require("../assets/images/mascot-auth.png");
const earth = require("../assets/images/earth.png");

export const images = {
  mascotWelcome: mascotWelcome?.default ?? mascotWelcome,
  mascotLogo: mascotLogo?.default ?? mascotLogo,
  mascotAuth: mascotAuth?.default ?? mascotAuth,
  mascot: mascotWelcome?.default ?? mascotWelcome,
  earth: earth?.default ?? earth,
};