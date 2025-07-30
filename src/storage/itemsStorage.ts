import AsyncStorage from "@react-native-async-storage/async-storage";
import { Item } from "@/components/Item";
import { FilterStatus } from "@/types/FilterStatus";

const ITEMS_STORAGE_KEY = "@buys:items" //Essa é a chave do AsyncStorage  que vai armazenar os itens

export type ItemStorage = {
    id: string
    description: string
    status: FilterStatus
}

// toda funcao do asyncStorage é assincrona, por isso o await e o async
// esse Promise<ItemStorage[]> é uma promessa de que a funcao vai retornar um array de ItemStorage
// se fosse Promise<ItemStorage> seria uma promessa de que a funcao vai retornar um (1) ItemStorage

 async function getItems() : Promise<ItemStorage[]> {
    try {
        // eu acesso dados do meu banco ATRAVES DA MINHA CHAVE QUE É ITEMS_STORAGE_KEY
        const storage = await AsyncStorage.getItem(ITEMS_STORAGE_KEY)
        // meu storage é uma string, entao eu preciso parsear para um array de ItemStorage
        return storage ? JSON.parse(storage) : []
        // JSON.parse é uma funcao que transforma uma string em um objeto
        // se o storage for null, eu retorno um array vazio
    } catch (error) {
       throw 'GET_ITEMS_ERROR'+ error
    }
}

//metodo para retornar de acordo com o status

async function getItemsByStatus(status: FilterStatus) : Promise<ItemStorage[]>{
    try {
       const items = await getItems()

       // eu filtro os itens de acordo com o status
       // se o status for PENDING, eu retorno os itens que tem o status PENDING
       // se o status for DONE, eu retorno os itens que tem o status DONE
       // esse status 'e o que eu passo como parametro na funcao
       return items.filter(item => item.status === status)
    } catch (error) {
        throw 'GET_ITEMS_BY_STATUS_ERROR'+ error
    }
}


//aqui eu salvo um array de itens
async function saveItem(item: ItemStorage[]): Promise<void> {
    try {
        // eu devo converter o newItems para uma string, pois o AsyncStorage so aceita string
        // pois ele esta como um json de objetos
        await AsyncStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(item))
    } catch (error) {
        throw 'SAVE_ITEM_ERROR'+ error
    }
}

//aqui eu salvo um unico item e retorno o array de itens
// eu nao uso diretamente o saveItem, pois ele salva um array de itens
// eu uso o addItem para salvar os itens e enviar o array de itens para o saveItem
async function addItem(newItem: ItemStorage): Promise<ItemStorage[]> {
    try {
        const items = await getItems()
        const newItems = [...items, newItem]
        await saveItem(newItems)

        //retorno o array de itens
        return newItems
    } catch (error) {
        throw 'ADD_ITEM_ERROR'+ error
    }
}

async function removeItem(id: string): Promise<void> {
    try {
        const items = await getItems()
        // aqui eu retorno todos os itens que nao tem o id que eu passei como parametro
        const newItems = items.filter(item => item.id !== id)
        // e salvo o novo array de itens sem o item que eu quero remover
        await saveItem(newItems)
     
    } catch (error) {
        throw 'REMOVE_ITEM_ERROR'+ error
    }
}


async function clearAllItems(): Promise<void> {
    try {
        //se eu quero limpar todos os itens, eu removo a chave do AsyncStorage
        await AsyncStorage.removeItem(ITEMS_STORAGE_KEY)
    } catch (error) {
        throw 'CLEAR_ALL_ITEMS_ERROR'+ error
    }
}

//aqui eu mudo o status do item
async function toggleItemStatus(id: string): Promise<void> {
    try {
        //aqui eu pego todos os itens
        const items = await getItems()

        //aqui eu mapeio todos os itens
        const updatedItems = items.map((item) =>
            item.id === id // aqui eu verifico se o id do item é igual ao id que eu passei como parametro
            ? {
                ...item, //aqui eu pego todas as propriedades do item
                status: // mudo aqui a propriedade status do item, eu seja eu passo separado a propriedade que quero mudar
                item.status === FilterStatus.PENDING
                ? FilterStatus.DONE 
                : FilterStatus.PENDING //aqui eu mudo o status do item
            }  : item // se o id do item nao for igual ao id que eu passei como parametro, eu retorno o item original
        )

        //aqui eu salvo o novo array de itens
        await saveItem(updatedItems)
    } catch (error) {
        throw 'TOGGLE_ITEM_STATUS_ERROR'+ error
    }
}

// eu criei um objeto com as funcoes que eu quero usar
// eu posso usar essa funcao em qualquer lugar do meu codigo
export const itemsStorage = {
    getItems,
    getItemsByStatus,
    addItem,
    removeItem,
    clearAllItems,
    toggleItemStatus
}