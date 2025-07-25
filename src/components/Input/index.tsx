import { TextInput, TextInputProps } from "react-native";
import { styles } from "./styles";

//O TextInputProps é um tipo que já vem do react-native, e ele já tem todas as propriedades que o TextInput pode receber
//Assim, você pode passar qualquer propriedade que o TextInput aceita, como placeholder, value,
export function Input({ ...rest }: TextInputProps) {
  return (
    <TextInput style={styles.container} {...rest} />
  )
}