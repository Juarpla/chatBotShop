import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList, SafeAreaView, Animated} from 'react-native';
import * as productsContext from '@/data/products.json';
import {GEMINI_API_KEY} from '@/constants';

// Define message type with strict sender values
type Message = {
    text: string;
    sender: "user" | "gemini";
};

// Define the chat screen with a chat input and message list
export default function ChatScreen() {
    const [msg, setMsg] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);

    // Handle the send button click
    const handleButtonClick = async () => {
        if (!msg.trim()) return;

        // Add user message to the list
        const userMessage: Message = { text: msg, sender: 'user' };
        setMessages(prevMessages => [userMessage, ...prevMessages]);
        setMsg(""); // Clear the input

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `
                                    You are an AI assistant for Idaho Supermarket. Always follow these guidelines:
                                    
                                    1. Interaction Context:
                                    Context of available products:
                                    ${JSON.stringify(productsContext, null, 2)}
                                    
                                    2. User Query Instructions:
                                    - If the user's query is clear and related to products, provide helpful information
                                    - If the query is vague or unclear, ask for more specific details about products in Idaho Supermarket
                                    - Always maintain a friendly, helpful tone
                                    
                                    User Query: ${msg}
                                    
                                    Respond appropriately based on the above guidelines.
                                    `
                                },
                            ],
                        },
                    ],
                }),
            });

            const data = await response.json();
            console.log("Full API Response:", data);

            const content = data.candidates?.[0]?.content;
            console.log("Content:", content);

            const reply = content?.parts?.[0]?.text || "No response";

            // Add Gemini response to the list
            const geminiMessage: Message = { text: reply, sender: 'gemini' };
            setMessages(prevMessages => [geminiMessage, ...prevMessages]);
        } catch (error) {
            console.error("Error:", error);
            const errorMessage: Message = { text: "Error occurred", sender: 'gemini' };
            setMessages(prevMessages => [errorMessage, ...prevMessages]);
        }
    };

    const messageSave = (text: string) => {
        setMsg(text);
        console.log(text);
    };

    const renderItem = ({ item }: { item: Message }) => (
        <View style={[styles.message, item.sender === 'user' ? styles.userMessage : styles.geminiMessage]}>
            <Text style={[styles.messageText, item.sender === 'user' ? styles.userMessageText : styles.geminiMessageText]}>
                {item.text}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {messages.length === 0 && (
                <Animated.View style={styles.welcomeContainer}>
                    <Text style={styles.welcomeText}>Welcome Shopper</Text>
                </Animated.View>
            )}

            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.messagesContainer}
                inverted // To make sure old messages are at the top

            />
            <View style={styles.inputView}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Your Query ..."
                    value={msg}
                    onChangeText={messageSave}
                    placeholderTextColor="black"
                />
                <TouchableOpacity style={styles.button} onPress={handleButtonClick}>
                    <Text style={styles.buttonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#808080',
    },
    messagesContainer: {
        padding: 10,
    },
    message: {
        maxWidth: '80%',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    userMessage: {
        backgroundColor: '#116a93',
        alignSelf: 'flex-end',
    },
    geminiMessage: {
        backgroundColor: 'white',
        alignSelf: 'flex-start',
    },
    messageText: {
        color: 'white',
    },
    userMessageText: {
        color: 'white',
    },
    geminiMessageText: {
        color: 'black',
    },
    inputView: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 15,
        paddingBottom: 70,
        backgroundColor: '#808080',
    },
    input: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 15,
        marginRight: 10,
        color:'black'
    },
    button: {
        backgroundColor: '#116a93',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    welcomeContainer: {
        position: 'absolute',
        top: '40%',
        alignSelf: 'center',
    },
    welcomeText: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
    },
});
