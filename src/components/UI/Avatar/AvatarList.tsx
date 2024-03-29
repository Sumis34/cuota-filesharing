import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../tooltip";
import Avatar from "./Avatar";

interface AvatarListProps {
  users: User[];
  additionalUsers: number;
  showAdditionalUsers: boolean;
  maxAvatars: number;
}

interface User {
  name: string | null;
  image: string | null;
  id: string;
  tooltip: string;
}

const AVATAR_OFFSET = 15;

export default function AvatarList({
  users,
  showAdditionalUsers,
  additionalUsers,
  maxAvatars,
}: AvatarListProps) {
  return (
    <ul className="flex">
      {users.slice(0, maxAvatars).map((user, i) => {
        return (
          <li
            key={user.id}
            className="relative"
            style={{
              marginLeft: i * -AVATAR_OFFSET,
              zIndex: i,
            }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Avatar
                      className="w-12 aspect-square border-neutral-900 border-4 rounded-2xl"
                      url={user.image}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{user.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
        );
      })}
      {showAdditionalUsers && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="rounded-2xl border-neutral-900 border-4 bg-neutral-600 flex justify-center items-center w-12 aspect-square"
                style={{
                  marginLeft:
                    (users.length || 0) === 1
                      ? -AVATAR_OFFSET
                      : ((users.length || 0) - 1) * -AVATAR_OFFSET,
                  zIndex: users.length,
                }}
              >
                +{additionalUsers}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                And {additionalUsers} anonymous{" "}
                {additionalUsers > 1 ? "users" : "user"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </ul>
  );
}
