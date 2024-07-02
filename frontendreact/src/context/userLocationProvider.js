import React, { createContext, useState, useContext, useEffect } from 'react';

const LocationContext = createContext();

export const useLocation = () => useContext(LocationContext);