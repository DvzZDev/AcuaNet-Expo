import React from 'react';
import { StyleSheet, Text, TextInput, TextProps, TextInputProps } from 'react-native';

// Sobrescribir los componentes Text y TextInput predeterminados
const ThemedText = (props: TextProps) => {
  return <Text {...props} style={[styles.defaultText, props.style]} />;
};

const ThemedTextInput = (props: TextInputProps) => {
  return <TextInput {...props} style={[styles.defaultText, props.style]} />;
};

// Estilos globales
const styles = StyleSheet.create({
  defaultText: {
    fontFamily: 'Inter',
  },
});

// Componente de proveedor de tema
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

// Exportar los componentes para su uso en la aplicación
export { ThemedText as Text, ThemedTextInput as TextInput };