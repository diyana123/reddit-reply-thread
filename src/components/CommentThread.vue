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
  
      <!-- Sorting Options -->
      <div class="sorting-options">
        <label for="sortBy">Sort By:</label>
        <select v-model="sortBy" id="sortBy">
          <option value="mostUpvoted">Most Upvoted</option>
         
        </select>
      </div>
  
      <!-- Comment List -->
      <ul class="comment-list">
        <Comment
          v-for="comment in sortedComments"
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
  import { ref, computed } from 'vue';
  import { useStore } from 'vuex';
  import Comment from './Comment.vue';
  
  const store = useStore();
  const newComment = ref<string>('');
  const sortBy = ref<string>('mostUpvoted'); // State to track the sorting option
  
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
      id: new Date().getTime(), // Generate a unique ID (using timestamp)
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
  };
  
  // Handle downvoting a comment
  const downvoteComment = (id: number): void => {
    store.dispatch('downvoteComment', id);
  };
  
  // Fetch sorted comments from Vuex store based on sorting option
  const sortedComments = computed(() => store.getters.sortedComments(sortBy.value));
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
  
  .sorting-options {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
  
    select {
      margin-left: 10px;
      padding: 5px;
      border-radius: 4px;
    }
  }
  
  .comment-list {
    list-style: none;
    padding-left: 0;
  }
  </style>
  