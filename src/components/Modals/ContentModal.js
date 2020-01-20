import React, { useEffect } from "react";
import { View, Dimensions, ScrollView } from "react-native";
import { isIphoneX } from "../../logic/utils";

const { height } = Dimensions.get("window");
const extraHeightIphoneX = isIphoneX() ? 34 + 44 : 0;
const maxHeight = height - 100 - extraHeightIphoneX;
const ContentModal = ({ content }) => {
  useEffect(() => {
    console.log("Modal: Content Did Mount");
  }, [])
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1
      }}
      style={{ maxHeight }}
    >
      {content}
    </ScrollView>
  );
};

export default ContentModal;
