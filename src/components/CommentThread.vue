<template>
    <div class="comment-thread">
      <!-- Comment Form -->
      <form @submit.prevent="addComment" class="comment-form">
        <div class="textarea-container">
          <textarea
            v-model="newComment"
            class="comment-input"
            placeholder="Write a comment..."
            required
          ></textarea>
        </div>
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
    display: flex; /* Use flexbox for alignment */
    flex-direction: column; /* Align items in a column */
    align-items: center; /* Center items horizontally */
  
    .textarea-container {
      width: 100%; /* Make the container full width */
      display: flex; /* Use flexbox for centering */
      justify-content: center; /* Center the textarea */
    }
  
    .comment-input {
      width: 100%;
      height: 80px;
      padding: 10px;
      border-radius: 4px;
      resize: none; /* Prevents resizing on mobile devices */
      font-size: 1rem; /* Base font size for better readability */
    }
  
    .submit-btn {
      background-color: #007bff;
      color: white;
      padding: 10px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem; /* Ensure button is readable on mobile */
      margin-top: 10px; /* Add spacing above the button */
  
      &:hover {
        background-color: #0056b3;
      }
    }
  }
  
  .sorting-options {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
  
    label {
      margin-right: 10px; /* Spacing between label and select */
    }
  
    select {
      padding: 5px;
      border-radius: 4px;
      font-size: 1rem; /* Base font size for better readability */
    }
  }
  
  .comment-list {
    list-style: none;
    padding-left: 0;
  }
  
  /* Media Queries for Responsiveness */
  @media (max-width: 600px) {
    .comment-input {
      height: 60px; /* Reduce height on smaller screens */
      font-size: 0.9rem; /* Slightly smaller font size for better fit */
    }
  
    .submit-btn {
      width: 100%; /* Full width button on mobile */
      padding: 12px; /* Slightly larger padding */
      font-size: 1rem; /* Ensure button text is readable */
    }
  
    .sorting-options {
      flex-direction: column; /* Stack label and select on smaller screens */
      align-items: flex-start; /* Align to the left */
    }
  
    label {
      margin-bottom: 5px; /* Space between label and select */
    }
  }
  </style>
  