import { View, Image } from "react-native";
import { styles } from "./styles";
import Button from "@/components/Button";
import { Input } from "@/components/Input";
export default function Home() {
  return (
    <View style={styles.container}>;
      <Image  source={require("@/assets/logo.png")} style={styles.logo} />
     
      <View  style={styles.form}>
      <Input placeholder="O que você deseja comprar?" />
      <Button title="Adcionar" />
      </View>

      <View style={styles.content}>{}</View>
       
    </View>
  )
}