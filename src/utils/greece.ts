const ALPHABET = [
  "Alpha",
  "Beta",
  "Gamma",
  "Delta",
  "Epsilon",
  "Zeta",
  "Eta",
  "Theta",
  "Iota",
  "Kappa",
  "Lambda",
  "My",
  "Ny",
  "Xi",
  "Omikron",
  "Pi",
  "Rho",
  "Sigma",
  "Tau",
  "Ypsilon",
  "Phi",
  "Chi",
  "Psi",
  "Omega",
];

const getRandomLetter = () => {
  return ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
};

export { getRandomLetter, ALPHABET };
