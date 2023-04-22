import { useQuery } from "../../utils/trpc";
import AvatarList from "../UI/Avatar/AvatarList";

export default function PoolAnalytics({ id }: { id: string }) {
  const { data: visitors } = useQuery([
    "pools.visitors",
    {
      poolId: id,
    },
  ]);

  const ANONYMOUS_COUNT = visitors?.anonymous.users || 0;
  const REGISTERED_COUNT = visitors?.registered.count || 0;

  const MAX_AVATARS = 5;

  return (
    <div className="my-4">
      <div className="card-solid flex justify-between flex-col !border-indigo-400 border-2 relative">
        <span className="absolute bg-indigo-400 rounded-full px-2 py-1 font-bold -top-3 text-xs">
          Owner Analytics
        </span>
        <h3 className="text-2xl">Analytics</h3>
        <label>Viewers</label>
        <AvatarList
          maxAvatars={MAX_AVATARS}
          additionalUsers={
            REGISTERED_COUNT - MAX_AVATARS > 0
              ? REGISTERED_COUNT - MAX_AVATARS + ANONYMOUS_COUNT
              : ANONYMOUS_COUNT
          }
          showAdditionalUsers={
            ANONYMOUS_COUNT > 0 || REGISTERED_COUNT - MAX_AVATARS > 0
          }
          users={visitors?.registered.users.map((u) => u.user) || []}
        />
      </div>
    </div>
  );
}
