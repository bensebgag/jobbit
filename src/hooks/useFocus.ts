import { useState } from "react";
import useClickOutside from "@/hooks/useClickOutside";

export default function useFocus() {
  const [isFocused, setIsFocused] = useState(false);
  const ref = useClickOutside(() => setIsFocused(false));
  const handleFocus = () => setIsFocused(true);

  return { ref, isFocused, handleFocus, setIsFocused };
}
