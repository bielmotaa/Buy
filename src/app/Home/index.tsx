import { View, Image, TouchableOpacity, Text, FlatList, Alert } from "react-native";
import { styles } from "./styles";
import Button from "@/components/Button";
import { Input } from "@/components/Input";
import { Filter } from "@/components/Filter";
import { FilterStatus } from "@/types/FilterStatus";
import { Item } from "@/components/Item";
import { useEffect, useState } from "react";
import { itemsStorage, ItemStorage } from "@/storage/itemsStorage";

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

/*
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
 
]*/
export default function Home() {

  // ao colocar <FilterStatus> eu estou dizendo que o filter é do tipo FilterStatus
  // eu posso fazer uma inferencia de tipo, colocando (filter.PENDING)
  // ao colocar um tipo inicial em useState, eu estou dizendo que o filter é do tipo FilterStatus e que o valor inicial é undefined
  const [filter, setFilter] = useState(FilterStatus.PENDING)
   const [description, setDescription] = useState("")
   const [items, setItems] = useState<ItemStorage[]>([])

   function update(value: FilterStatus) {
    setFilter(value)
   }

   async function handleAddItem() {
    if(description.trim().length === 0) {
      return Alert.alert("Atenção", "Adicione um item para comprar")
    }
    const newItem = {
      id: Math.random().toString(36).substring(2), //gera um id aleatório
      description: description,
      status: FilterStatus.PENDING
    }

    //prevState é o estado anterior, e newItem é o novo item
    //uso o ... para espalhar o estado anterior, e adicionar o novo item
    //setItems((prevState : ItemStorage[]) => [...prevState, newItem])

    //salvando o item no storage
    await itemsStorage.addItem(newItem)
    //atualizando o estado com o novo item

    await itmesByStatus()
    setFilter(FilterStatus.PENDING)
    Alert.alert("Sucesso",`${newItem.description} adicionado com sucesso`)
    setDescription("")
   }

   async function itmesByStatus() {
    try {
      // eu passo o filter para a funcao getItemsByStatus, 
      // para que ela retorne os itens de acordo com o status
      const response = await itemsStorage.getItemsByStatus(filter)
      setItems(response)
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os itens")
    }
    
   }

   async function handleRemoveItem(id: string) {
    try {
      await itemsStorage.removeItem(id)
      //atualizo o estado com os itens atualizados
      await itmesByStatus()
      Alert.alert("Sucesso", "Item removido com sucesso")
    } catch (error) {
      Alert.alert("Erro", "Não foi possível remover o item")
    }
   }

   async function handleClearAllItems() {
    try {
      Alert.alert("Atenção", "Tem certeza que deseja remover todos os itens?", [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Remover",
          onPress: async () => {
            //removendo todos os itens do storage
            await itemsStorage.clearAllItems()
            //atualizo o estado com os itens atualizados
            // await itmesByStatus()
            setItems([]) 
            // assim eu limpo o estado, e 
            // nao preciso chamar a funcao itmesByStatus
            // uma forma mais simples de fazer isso 
            Alert.alert("Sucesso", "Todos os itens foram removidos")
          }
        }
      ])
    } catch (error) {
      Alert.alert("Erro", "Não foi possível remover os itens")
    }
   }

   async function handleToggleItemStatus(id: string) {
    try {
      //aqui eu mudo o status do item
      await itemsStorage.toggleItemStatus(id)
      //aqui eu atualizo o estado com os itens atualizados
      await itmesByStatus()
      //aqui eu mostro uma mensagem de sucesso
      Alert.alert("Sucesso", "Status do item alterado com sucesso")
    } catch (error) {
      Alert.alert("Erro", "Não foi possível alterar o status do item")
    }
   }

   useEffect(() => {
    // esse .then é para eu pegar a resposta da funcao getItems e armazenar no meu estado items
    // ele 'e tipo um async await, mas como eu nao quero usar o async await pq nao 
    // pode usar no useEffect, eu uso o .then
    // esse response é o array de itens que eu peguei da funcao getItems
    /*itemsStorage.getItems().then((response) => {
      setItems(response)
    })*/
      itmesByStatus()
   }, [filter])                                                      

  return (
    <View style={styles.container}>
      <Image  source={require("@/assets/logo.png")} style={styles.logo} />
     
      <View  style={styles.form}>
      <Input 
        placeholder="O que você deseja comprar?" 
        // onChangeText={(value) => setDescription(value)}  //o value é o valor do input, e o setDescription é a função que atualiza o estado description
        // forma mais reduzida de fazer o onChangeText
        onChangeText={setDescription}
         // o value é o valor do input, e o setDescription é a 
         // função que atualiza o estado description
         // isso ajuda pq eu deixo o input de forma controlada, ou seja,
         //  eu controlo o valor do input pelo pelo value
        value={description}
       />
      <Button title="Adcionar" onPress={handleAddItem} />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
        {
          //Renderizando os filtros, como no meu array FILTERS_STATUS, eu tenho 2 filtros, então eu vou renderizar 2 filtros
          //O MAP É UMA FUNÇÃO QUE PERCORRE O ARRAY E RENDERIZA CADA ITEM DO ARRAY
          //devo passar o key para o filter, pois o react precisa de um key para identificar o componente
          //isso ajuda para eu reutilizar o componente sem repetir o mesmo componente, eu apenas adciono no meu array FILTERS_STATUS
          FILTERS_STATUS.map((status) => (
            <Filter key={status} 
              status={status} 
              isActive={filter === status}
              onPress={() => setFilter(status)}
            />
          ))
        }

        <TouchableOpacity style={styles.clearButton} onPress={handleClearAllItems}>
          <Text style={styles.clearText}>Limpar</Text>
        </TouchableOpacity>
        </View>

        <FlatList 
          data={items}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Item
              data={item} 
              onStatus={() => handleToggleItemStatus(item.id)}
              onRemove={() => handleRemoveItem(item.id)}

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