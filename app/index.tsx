import React, {useState} from "react";
import {View, Text, TextInput, Button, StyleSheet} from "react-native";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';

export default function LoginScreen() {
    const router = useRouter()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password)
            router.push("/home")
        }
        catch (error) {
            alert((error as Error).message)
        }
    }

    return(
        <View style={styles.header}>
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <Text style={styles.title}>AC9692 kauppalista</Text>
                    <AntDesign name="taobao-square" size={100} color="black" /> {/* Taobao logo (chinese online store logo) */}
                </View>
                <View style={styles.background}>
                    <Text>Email</Text>
                    <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Enter email" keyboardType="email-address" />
                    <Text>Password</Text>
                    <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Enter password" secureTextEntry />
                    <Button title="Login" onPress={handleLogin} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flex: 1,
        backgroundColor: "#fff"
    },
    container: {
        justifyContent: "center",
        padding: 10,
    },
    input: {
        padding: 8,
        borderBottomWidth: 1,
        marginBottom: 10,
    },
    imageContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 100,
        marginBottom: 100
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 10
    },
    background: {
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "gray",
        padding: 10
    }
})