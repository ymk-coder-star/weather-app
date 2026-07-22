import { getWeatherIconSrc, type WeatherIconType } from '../utilities/weatherIcons';

type Props = {
  type: WeatherIconType;
  className?: string;
  title?: string;
  isDay?: boolean;
};

export default function WeatherIcon({
  type,
  className = 'h-8 w-8',
  title,
  isDay = true,
}: Props) {
  const src = getWeatherIconSrc(type, isDay);

  return (
    <img
      src={src}
      alt={title ?? ''}
      {...(title ? { title } : {})}
      className={className}
      aria-hidden={title ? undefined : true}
      draggable={false}
    />
  );
}
