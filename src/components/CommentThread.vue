<template>
    <div class="comment-thread">
      <!-- Comment Form -->
      <form @submit.prevent="addComment" class="comment-form">
        <textarea
          v-model="newComment"
          class="comment-input"
          placeholder="Write a comment..."
          required
        ></textarea>
        <button type="submit" class="submit-btn">Post Comment</button>
      </form>
  
      <!-- Comment List -->
      <ul class="comment-list">
        <Comment
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
          @replyToComment="replyToComment"
          @upvote="upvoteComment"
          @downvote="downvoteComment"
        />
      </ul>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { useStore } from 'vuex';
  import Comment from './Comment.vue';
  import { v4 as uuid } from 'uuid'; // Import uuid
  
  const store = useStore();
  const newComment = ref<string>('');
  
  // Add a new comment
  const addComment = (): void => {
    if (newComment.value) {
      store.dispatch('addComment', newComment.value);
      newComment.value = '';
    }
  };
  
  // Handle replying to comments, including nested replies
  const replyToComment = (id: number, replyContent: string): void => {
    const reply = {
      id: uuid(), // Use uuid for reply ID
      content: replyContent,
      upvotes: 0,
      downvotes: 0,
      replies: [],
    };
    store.dispatch('addReply', { id, reply });
  };
  
  // Handle upvoting a comment
  const upvoteComment = (id: number): void => {
    store.dispatch('upvoteComment', id);
    console.log(id, 'upvoted');
  };
  
  const downvoteComment = (id: number): void => {
    store.dispatch('downvoteComment', id);
  };
  
  // Fetch the list of comments from Vuex store
  const comments = computed(() => store.getters.comments);
  </script>
  
  <style lang="scss" scoped>
  .comment-thread {
    max-width: 700px;
    margin: 0 auto;
    padding: 10px;
  }
  
  .comment-form {
    margin-bottom: 20px;
  
    .comment-input {
      width: 100%;
      height: 80px;
      padding: 10px;
      border-radius: 4px;
    }
  
    .submit-btn {
      background-color: #007bff;
      color: white;
      padding: 10px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
  
      &:hover {
        background-color: #0056b3;
      }
    }
  }
  
  .comment-list {
    list-style: none;
    padding-left: 0;
  }
  </style>
  