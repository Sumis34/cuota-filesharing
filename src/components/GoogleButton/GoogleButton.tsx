import { AiOutlineGoogle } from "react-icons/ai";
import Button from "../../components/UI/Button";

export default function GoogleButton({ onClick }: { onClick: () => void }) {
  return (
    <Button onClick={onClick} className="flex items-center !px-3 gap-2 font-sans font-normal">
      <AiOutlineGoogle className="text-2xl" />
      <span>Sign in with Google</span>
    </Button>
  );
}
