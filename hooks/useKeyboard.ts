import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

export const useKeyboard = () => {
  const [keyboardDidShow, setKeyboardDidShow] = useState(false);
  const [keyboardWillShow, setKeyboardWillShow] = useState(false);

  useEffect(() => {
    const onKeyboardDidShow = () => {
      setKeyboardDidShow(true);
    };

    const onKeyboardDidHide = () => {
      setKeyboardDidShow(false);
    };

    const onKeyboardWillShow = () => {
      setKeyboardWillShow(true);
    };

    const onKeyboardWillHide = () => {
      setKeyboardWillShow(false);
    };

    const didShow = Keyboard.addListener("keyboardDidShow", onKeyboardDidShow);
    const didHide = Keyboard.addListener("keyboardDidHide", onKeyboardDidHide);
    const willShow = Keyboard.addListener("keyboardWillShow", onKeyboardWillShow);
    const willHide = Keyboard.addListener("keyboardWillHide", onKeyboardWillHide);

    return () => {
      didShow.remove();
      didHide.remove();
      willShow.remove();
      willHide.remove();
    };
  }, []);

  return {
    keyboardDidShow,
    keyboardWillShow,
  };
};
