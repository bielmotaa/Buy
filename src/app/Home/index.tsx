import { View, Image, TouchableOpacity, Text, FlatList } from "react-native";
import { styles } from "./styles";
import Button from "@/components/Button";
import { Input } from "@/components/Input";
import { Filter } from "@/components/Filter";
import { FilterStatus } from "@/types/FilterStatus";
import { Item } from "@/components/Item";

//Criando um array de filtros para usar no componente Filter DO TIPO FilterStatus
//DESSA FORMA, PODEMOS USAR O MAP PARA RENDERIZAR OS FILTROS
const FILTERS_STATUS : FilterStatus[] = [ FilterStatus.PENDING, FilterStatus.DONE,]

//Criando um array de itens para usar no componente Item DO TIPO ItemData
//Esse
//O map é uma função que percorre o array e retorna um novo array com os itens modificados
//O _ é um placeholder para o index, que não é usado
//O index é o índice do item no array
//O length é o tamanho do array, que é 10
// => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] ou seja no index apos a seta é o index do item no array
// O String(index) é para converter o index em uma string, pois o FlatList precisa de uma string como key
//const ITEMS = Array.from({ length: 100 }).map((_, index) => String(index))

const ITEMS =[
  {
    id: "1",
    description: "Arroz",
    status: FilterStatus.PENDING
  },
  {
    id: "2",
    description: "Feijão",
    status: FilterStatus.DONE
  },
  {
    id: "3",
    description: "Carne",
    status: FilterStatus.PENDING
  },
  {
    id: "4",
    description: "Frutas",
    status: FilterStatus.DONE
  },
 
]
export default function Home() {
  return (
    <View style={styles.container}>
      <Image  source={require("@/assets/logo.png")} style={styles.logo} />
     
      <View  style={styles.form}>
      <Input placeholder="O que você deseja comprar?" />
      <Button title="Adcionar" />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
        {
          //Renderizando os filtros, como no meu array FILTERS_STATUS, eu tenho 2 filtros, então eu vou renderizar 2 filtros
          //O MAP É UMA FUNÇÃO QUE PERCORRE O ARRAY E RENDERIZA CADA ITEM DO ARRAY
          //devo passar o key para o filter, pois o react precisa de um key para identificar o componente
          //isso ajuda para eu reutilizar o componente sem repetir o mesmo componente, eu apenas adciono no meu array FILTERS_STATUS
          FILTERS_STATUS.map((status) => (
            <Filter key={status} status={status} isActive />
          ))
        }

        <TouchableOpacity style={styles.clearButton}>
          <Text style={styles.clearText}>Limpar</Text>
        </TouchableOpacity>
        </View>

        <FlatList 
          data={ITEMS}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Item
              data={item} 
              onStatus={() => console.log("mudar o status")}
              onRemove={() => console.log("remover")}
            />
          )}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => <Text style={styles.empty}>Nenhum item aqui.</Text>}
        />
      </View>
    </View>
  )
}