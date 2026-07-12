import { useContext } from 'react';
import { UnitsContext } from '../context/unitsContext';
import { UserContext } from '../context/userContext';
import { WeatherContext } from '../context/weatherContext';

type ContextInputType = 'WeatherContext' | 'UserContext' | 'UnitsContext';

export function useCustomContext<T>(contextName: ContextInputType): T {
  const weather = useContext(WeatherContext);
  const user = useContext(UserContext);
  const units = useContext(UnitsContext);

  let context;

  switch (contextName) {
    case 'WeatherContext':
      context = weather;
      break;
    case 'UserContext':
      context = user;
      break;
    case 'UnitsContext':
      context = units;
      break;
    default:
      throw new Error(`${contextName satisfies never} is not a valid context`);
  }

  if (context == null)
    throw new Error(`${contextName} must be called inside a ${contextName}Provider`);

  return context as T;
}
