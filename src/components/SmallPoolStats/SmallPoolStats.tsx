import { formatDistanceToNow, isPast } from "date-fns";
import { PoolStatsProps } from "../PoolStats/PoolStats";

export default function SmallPoolStats({ message, expiresAt }: PoolStatsProps) {
  return (
    <div className="flex justify-between mb-2">
      <p className="text-sm opacity-50">{message}</p>
      <p className="text-sm opacity-50">
        Expires
        <time className={`-mb-1`}>
          {expiresAt
            ? !isPast(expiresAt)
              ? " in " + formatDistanceToNow(expiresAt)
              : " in 1 minute"
            : " never"}
        </time>
      </p>
    </div>
  );
}
