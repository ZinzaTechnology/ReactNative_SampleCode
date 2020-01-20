import React, { useRef } from "react";
import { View, TextInput, Text, TouchableWithoutFeedback } from "react-native";
import styles from "./styles/FormInputStyle";
const FormInput = props => {
  const {
    containStyle,
    label,
    error,
    accessibilityLabel,
    ...otherProps
  } = props;
  const refInput = useRef();
  const focusInput = () => {
    refInput && refInput.focus();
  };
  return (
    <View style={containStyle}>
      {label && label.length > 0 && <Text style={styles.label}>{label}</Text>}
      <TouchableWithoutFeedback
        onPress={focusInput}
        accessible={false}
        accessibilityLabel={accessibilityLabel}
      >
        <TextInput
          ref={refInput}
          accessible={true}
          style={styles.inputStyles}
          {...otherProps}
          importantForAccessibility="no"
        />
      </TouchableWithoutFeedback>
      {error && error.length > 0 && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default FormInput;
