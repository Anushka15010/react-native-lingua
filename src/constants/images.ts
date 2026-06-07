const mascotWelcome = require("../assets/images/mascot-welcome.png");
const mascotLogo = require("../assets/images/moscot-logo.png");

export const images = {
    mascotWelcome: mascotWelcome?.default ?? mascotWelcome,
    mascotLogo: mascotLogo?.default ?? mascotLogo,
    mascot: mascotWelcome?.default ?? mascotWelcome,
  };