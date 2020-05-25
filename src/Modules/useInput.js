import { useState, useCallback } from "react";

export default function useInputState(defaultValue = "") {
  const [state, setState] = useState(defaultValue);
  const onChange = useCallback((event) => setState(event.target.value), []);
  return [state, onChange];
}
