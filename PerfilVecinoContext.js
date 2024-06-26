import React, { createContext, useState } from 'react';

export const PerfilVecinoContext = createContext();

export const PerfilVecinoProvider = ({ children }) => {
  const [perfilVecino, setPerfilVecino] = useState(null);

  return (
    <PerfilVecinoContext.Provider value={{ perfilVecino, setPerfilVecino }}>
      {children}
    </PerfilVecinoContext.Provider>
  );
};
