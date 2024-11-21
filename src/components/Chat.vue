<script>
import { ref, watch, nextTick } from "vue";
import { useAuth, useChat } from "../firebase";

import SendIcon from "./SendIcon.vue";
import Message from "./Message.vue";

export default {
  components: { Message, SendIcon },
  setup() {
    const { user, isLogin } = useAuth();
    const { messages, sendMessage } = useChat();

    const bottom = ref(null);
    watch(
      messages,
      () => {
        nextTick(() => {
          bottom.value?.scrollIntoView({ behavior: "smooth" });
        });
      },
      { deep: true }
    );

    const message = ref("");
    const send = () => {
      sendMessage(message.value);
      message.value = "";
    };

    return { user, isLogin, messages, bottom, message, send };
  },
};
</script>

<template>
  <div class="container-sm bg-slate-200 mt-16 mx-auto">
    <div class="h-[calc(100vh-120px)]">
      <div class="pt-2 mx-5">
        <Message
          v-for="{ id, text, userPhotoURL, userName, userId } in messages"
          :key="id"
          :name="userName"
          :photo-url="userPhotoURL"
          :sender="userId === user?.uid"
        >
          {{ text }}
        </Message>
      </div>
    </div>
  </div>

  <div class="bottom">
    <div class="container-sm mx-auto">
      <form v-if="isLogin" @submit.prevent="send">
        <input v-model="message" placeholder="Message" required />
        <button type="submit">
          <SendIcon />
        </button>
      </form>
    </div>
  </div>
</template>
