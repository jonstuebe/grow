import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

export const useKeyboard = () => {
  const [keyboardDidShow, setKeyboardDidShow] = useState(false);
  const [keyboardWillShow, setKeyboardWillShow] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const onKeyboardDidShow = (e: any) => {
      setKeyboardDidShow(true);
      setKeyboardHeight(e.endCoordinates.height);
    };

    const onKeyboardDidHide = () => {
      setKeyboardDidShow(false);
      setKeyboardHeight(0);
    };

    const onKeyboardWillShow = () => {
      setKeyboardWillShow(true);
    };

    const onKeyboardWillHide = () => {
      setKeyboardWillShow(false);
    };

    const didShow = Keyboard.addListener("keyboardDidShow", onKeyboardDidShow);
    const didHide = Keyboard.addListener("keyboardDidHide", onKeyboardDidHide);
    const willShow = Keyboard.addListener(
      "keyboardWillShow",
      onKeyboardWillShow
    );
    const willHide = Keyboard.addListener(
      "keyboardWillHide",
      onKeyboardWillHide
    );

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
    keyboardHeight,
  };
};
