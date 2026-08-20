import { createContext, useContext } from 'react';
import { periodData, type PeriodData, type PeriodId } from '../../data/period';

/* The window every card on the scoreboard reads. It is a context
   rather than a prop because the cards are leaves of a bento grid,
   and threading the period through the grid would put a data
   concern in a layout component. */
export const PeriodContext = createContext<PeriodId>('session');

export function usePeriod(): { id: PeriodId; data: PeriodData } {
  const id = useContext(PeriodContext);
  return { id, data: periodData(id) };
}
