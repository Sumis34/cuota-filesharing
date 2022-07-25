import { useEffect, useState } from "react";

interface TimeoutToggleProps {
  ms: number;
  defaultValue?: boolean;
  toggleTo?: boolean;
}

const useTimeoutToggle = ({
  ms,
  defaultValue = false,
  toggleTo = false,
}: TimeoutToggleProps) => {
  const [toggle, setToggle] = useState(defaultValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      setToggle(toggleTo);
    }, ms);

    return () => {
      clearTimeout(timer);
    };
  }, [toggle]);

  return [toggle, setToggle] as const;
};

export default useTimeoutToggle;
