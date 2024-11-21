<script>
export default {
  props: { src: { type: String, default: "" } },
};
</script>

<template>
  <img class="avatar" :src="src" />
</template>
