import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { botImage } from "./bot-image";

import { ref, onUnmounted, computed } from "vue";

firebase.initializeApp({
  apiKey: "AIzaSyCGoJMGrIpVVYiz_EpnK_YZbN5tH6AjrFo",
  authDomain: "chat-apps-f81c1.firebaseapp.com",
  projectId: "chat-apps-f81c1",
  storageBucket: "chat-apps-f81c1.firebasestorage.app",
  messagingSenderId: "173611454407",
  appId: "1:173611454407:web:b8f881a08ddedfe94553e2",
  measurementId: "G-DVG5MYZJZE",
});

const auth = firebase.auth();

export function useAuth() {
  const user = ref<any>(null);
  const unsubscribe = auth.onAuthStateChanged((_user) => {
    user.value = _user;
  });
  onUnmounted(unsubscribe);
  const isLogin = computed(() => user.value !== null);

  const signIn = async () => {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithPopup(googleProvider);
  };
  const signOut = () => auth.signOut();

  return { user, isLogin, signIn, signOut };
}

const firestore = firebase.firestore();
const messagesCollection = firestore.collection("messages");
const messagesQuery = messagesCollection
  .orderBy("createdAt", "desc")
  .limit(100);

export function useChat() {
  const messages = ref<any>([]);
  const unsubscribe = messagesQuery.onSnapshot((snapshot) => {
    messages.value = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .reverse();
  });
  onUnmounted(unsubscribe);

  const { user, isLogin } = useAuth();
  const sendMessage = (text: string) => {
    if (!isLogin.value) return;
    const { photoURL, uid, displayName } = user.value;
    messagesCollection.add({
      userName: displayName,
      userId: uid,
      userPhotoURL: photoURL,
      text: text,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    if (
      text === "hi" ||
      text === "halo" ||
      text === "hello" ||
      text === "pagi" ||
      text === "siang"
    )
      setTimeout(() => {
        autoMessage();
      }, 300);
  };
  const autoMessage = () => {
    messagesCollection.add({
      userName: "Bot Aise",
      userId: "01",
      userPhotoURL: botImage,
      text: "Terima kasih telah menghubungi kami. Tapi kami tidak dapat membantu Anda",
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  };

  return { messages, sendMessage };
}
