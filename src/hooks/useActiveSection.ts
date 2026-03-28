import { createContext, useContext } from 'react';

export const ActiveSectionContext = createContext<string>('hero');

export function useActiveSection() {
  return useContext(ActiveSectionContext);
}
