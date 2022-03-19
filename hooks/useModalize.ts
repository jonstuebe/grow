import { useCallback, useRef } from "react";
import { Modalize } from "react-native-modalize";

export const useModalize = () => {
  const ref = useRef<Modalize>(null);

  const open = useCallback(() => {
    ref.current?.open();
  }, []);

  const close = useCallback(() => {
    ref.current?.close();
  }, []);

  return {
    ref,
    open,
    close,
  };
};
