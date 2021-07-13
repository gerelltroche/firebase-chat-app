import './App.css';

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {useState} from "react";

firebase.initializeApp({
    apiKey: "AIzaSyDOcRfXmdNP3rlLPLMW_yW86Ip77d1OJz8",
    authDomain: "chat-app-bd78d.firebaseapp.com",
    projectId: "chat-app-bd78d",
    storageBucket: "chat-app-bd78d.appspot.com",
    messagingSenderId: "667313490770",
    appId: "1:667313490770:web:6c3dd3b205e62e98cc488b",
    measurementId: "G-X0GR51HW10"
})

const auth = firebase.auth()
const firestore = firebase.firestore()

function App() {

    const [user] = useAuthState(auth)

    return (
        <div className="App">
            <header>
                <h1>Messageboard</h1>
                <SignOut />
            </header>
            <section>
                {user ? <ChatRoom/> : <SignIn/>}
            </section>
        </div>
    );
}

const SignIn = () => {
    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider()
        auth.signInWithPopup(provider)
    }

    return (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
    )
}

const SignOut = () => {
    return auth.currentUser && (
        <button id='signout' onClick={() => auth.signOut()}>Sign Out</button>
    )
}

const ChatRoom = () => {
    const messagesRef = firestore.collection('messages')
    const query = messagesRef.orderBy('createdAt').limit(25)

    const [messages] = useCollectionData(query, {idField: 'id'})

    const [formValue, setFormValue] = useState('')

    const sendMessage = async(e) => {

        e.preventDefault()

        const { uid, photoURL } = auth.currentUser
        const tempval = formValue
        setFormValue('')
        await messagesRef.add({
            text: tempval,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            photoURL
        })



    }

    return (
        <div id='messageContainer'>
            <div>
                {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
                {!messages && 'No Messages'}
            </div>

            <form onSubmit={(e) => sendMessage(e)}>
                <input value={formValue} onChange={(e)=> setFormValue(e.target.value)} type="text"/>
                <button type={'Submit'}>Send</button>
            </form>
        </div>
    )
}

const ChatMessage = (props) => {
    const { text, uid, photoURL } = props.message

    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

    return (
        <div className={`message ${messageClass}`}>
            <img src={photoURL} alt={`profile`} />
            <p>{text}</p>
        </div>
    )
}

export default App;
