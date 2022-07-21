import { HiViewBoards, HiViewGrid, HiViewList } from "react-icons/hi";

export default function Controls() {
  return (
    <div className="flex mb-6">
      <button>
        <HiViewGrid className="text-3xl fill-gray-800" />
      </button>
      <button>
        <HiViewList className="text-3xl fill-gray-800" />
      </button>
      <button>
        <HiViewBoards className="text-3xl fill-gray-800" />
      </button>
    </div>
  );
}
