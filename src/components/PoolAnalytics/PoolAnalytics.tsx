import { useQuery } from "../../utils/trpc";
import AvatarList from "../UI/Avatar/AvatarList";

export default function PoolAnalytics({ id }: { id: string }) {
  const { data: visitors } = useQuery([
    "pools.visitors",
    {
      poolId: id,
    },
  ]);

  const anonymousCount = visitors?.anonymous.users || 0;
  const registeredCount = visitors?.registered.count || 0;
  const total = anonymousCount + registeredCount;

  const MAX_AVATARS = 5;

  return (
    <div className="my-4">
      <div className="card-solid flex justify-between flex-col !border-indigo-400 border-2 relative">
        <span className="absolute bg-indigo-400 rounded-full px-2 py-1 font-bold -top-3 text-xs">
          Owner Analytics
        </span>
        <h3 className="text-2xl">Analytics</h3>
        <label>Viewers</label>
        {total === 0 && <p className="opacity-40">No views</p>}
        <AvatarList
          maxAvatars={MAX_AVATARS}
          additionalUsers={
            registeredCount - MAX_AVATARS > 0
              ? registeredCount - MAX_AVATARS + anonymousCount
              : anonymousCount
          }
          showAdditionalUsers={
            anonymousCount > 0 || registeredCount - MAX_AVATARS > 0
          }
          users={
            visitors?.registered.users.map((u) => ({
              ...u.user,
              tooltip: `${u.user.name} • ${u.views} ${
                u.views > 1 ? "views" : "view"
              }`,
            })) || []
          }
        />
      </div>
    </div>
  );
}
