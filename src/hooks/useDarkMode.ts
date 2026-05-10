import { useDarkMode as useDarkModeContext } from '../context/DarkmodeContext';

export const useDarkMode = () => {
  return useDarkModeContext();
};