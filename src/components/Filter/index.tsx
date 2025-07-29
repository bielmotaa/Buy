import { View, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { styles } from "./styles";
import { FilterStatus } from "@/types/FilterStatus";
import { CircleCheck } from 'lucide-react-native'
import { StatusIcon } from "../StatusIcon";

type Props = TouchableOpacityProps & {
    status: FilterStatus; //Estou importando o enum FilterStatus para usar como tipo
    isActive: boolean;
}

export function Filter({ status, isActive, ...rest }: Props) {
    return (
        <TouchableOpacity style={[styles.container, {opacity: isActive ? 1 : 0.5}]} 
         {...rest}
         activeOpacity={0.8}
        >
          <StatusIcon status={status} />
          <Text style={styles.title}>{status === FilterStatus.PENDING ? "Pendente" : "Comprados"}</Text>
        </TouchableOpacity>
    )
}