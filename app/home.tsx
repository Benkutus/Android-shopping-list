import React, { useEffect, useState } from "react";
import { Text, View, TextInput, FlatList, Modal, StyleSheet, TouchableOpacity } from "react-native";
import { db, auth } from "../firebaseConfig";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import { Entypo, AntDesign, FontAwesome6 } from "@expo/vector-icons";

// <Entypo name="log-out" size={24} color="black" /> log out logo
// <AntDesign name="shoppingcart" size={24} color="black" />

export default function HomeScreen() {
    const router = useRouter()
    const [modalVisible, setModalVisible] = useState(false);
    const [products, setProducts] = useState<{
        id: string;
        name: string;
        price: number;
        count: number;
        total: number;
    }[]>([]);
    const [productName, setProductName] = useState("")
    const [price, setPrice] = useState("")
    const [count, setCount] = useState("")

    useEffect(() => {
        fetchProducts()
    },[])

    const fetchProducts = async () => {
        const querySnapshot = await getDocs(collection(db, "e07-shopping-list"))

        const productsList = querySnapshot.docs.map((doc) => {
            const data = doc.data() as {name:string;price:number;count:number;total:number}
            return {
                id: doc.id, ...data 
            }
        })
        setProducts(productsList)
    }

    const addProduct = async () => {
        if (!productName) return

        await addDoc(collection(db, "e07-shopping-list"), {
            name: productName,
            price: parseFloat(price),
            count: parseInt(count),
            total: parseFloat(price) * parseInt(count)
        })
        setProductName("")
        setPrice("")
        setCount("")
        fetchProducts()
    } 

    const removeProduct = async(id: string) => {
        await deleteDoc(doc(db, "e07-shopping-list", id))
        fetchProducts()
    }

    const handleLogout = async() => {
        await signOut(auth)
        router.replace("/") //home screen
    }

    const totalItems = products.reduce((sum, product) => sum + product.count, 0)
    const totalPrice = products.reduce((sum, product) => sum + product.total, 0)

    return(
        <View style={styles.container}>
            <TouchableOpacity style={styles.logout} onPress={handleLogout}>
                <Entypo name="log-out" size={30} color="black" />
            </TouchableOpacity>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.productCart}>
                        <View style={styles.productDetails}>
                            <View style={styles.productTitle}>
                                <AntDesign name="shoppingcart" size={24} color="black" style={styles.cartIcon} />
                                <Text style={styles.productName}>{item.name}</Text>
                            </View>
                            <View style={styles.productLine}>
                                <Text style={styles.productPrice}>Price: {item.price.toFixed(2)} €</Text>
                                <Text style={styles.productCount}>Count: {item.count}</Text>
                                <Text style={styles.productTotal}>Total: {item.total.toFixed(2)} €</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => removeProduct(item.id)}>
                            <FontAwesome6 name="trash-can" size={20} color="black" style={styles.remove}/>
                        </TouchableOpacity>
                    </View>
                )}
            />

            <View>
                <Text style={styles.totalText}>Total items in cart: {totalItems}</Text>
                <Text style={styles.totalText}>Total price: {totalPrice.toFixed(2)} €</Text>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <AntDesign name="pluscircle" size={50} color="black" />
            </TouchableOpacity>

            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add Product</Text>
                        <TextInput style={styles.input} placeholder="Product" value={productName} onChangeText={setProductName} />
                        <TextInput style={styles.input} placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" />
                        <TextInput style={styles.input} placeholder="Count" value={count} onChangeText={setCount} keyboardType="numeric" />
                        <View style={styles.modalButton}>
                            <TouchableOpacity style={styles.modalAdd} onPress={addProduct}>
                                <Text style={styles.modalAddText}>Add</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}>
                                <Text style={styles.modalCancelText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        borderBottomWidth: 1,
        padding: 10,
        marginBottom: 10
    },
    logout: {
        alignSelf: "flex-end",
        paddingBottom: 5,
        paddingLeft: 5
    },
    productCart: {
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: "center"
    },
    cartIcon: {
        marginRight: 10,
    },
    productDetails: {
        flex: 1,
        paddingLeft: 10,
    },
    productTitle: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5
    },
    productLine: {
        flexDirection: "row",
        alignContent: "space-between",
    },
    remove: {
        marginRight: 5,
    },
    productName: {
        fontWeight: "bold",
        fontSize: 20
    },
    productPrice: {
        color: "#323232",
        fontSize: 16,
    },
    productCount: {
        fontSize: 16,
        color: "#323232",
        paddingHorizontal: 20
    },
    productTotal: {
        fontSize: 16,
        color: "#323232",
    },
    addButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "60%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    modalButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    modalAdd: {
        backgroundColor: "#115a5e",
        width: "40%",
        padding: 10,
        borderRadius: 5,
    },
    modalAddText: {
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
    },
    modalCancel: {
        width: "40%",
        backgroundColor: "#115a5e",
        padding: 10,
        borderRadius: 5,
    },
    modalCancelText: {
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
    },
    totalText: {
        fontSize: 16,
        fontWeight: "bold",
    }
})