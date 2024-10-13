<template>
  <div id="app">
    <h1>Reddit-like Comment Thread</h1>
    <CommentThread />
  </div>
</template>

<script lang="ts" setup>
import CommentThread from './components/CommentThread.vue';
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin-top: 20px;

  h1 {
    font-size: 2.5rem;
    color: #333;
  }
}
</style>
