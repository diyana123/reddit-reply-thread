<template>
  <li class="comment-item">
    <div class="comment-wrapper">
      <!-- line to connect replies -->
      <div v-if="hasReplies" class="line-connector"></div>

      <div class="comment-body">
        <div class="comment-header">
          <span class="author">Username</span>
        
        </div>

        <div class="comment-content">
          <p>{{ comment.content }}</p>
        </div>

        <div class="comment-actions">
          <button
            @click.stop="
              () => {
                console.log('Upvote clicked for', comment.id);
                $emit('upvote', comment.id);
              }
            "
            class="action-btn upvote-btn"
          >
            <span class="icon">⬆</span> {{ comment.upvotes }}
          </button>

          <button
            @click.stop="
              () => {
                console.log('Downvote clicked for', comment.id);
                $emit('downvote', comment.id);
              }
            "
            class="action-btn downvote-btn"
          >
            <span class="icon">⬇</span> {{ comment.downvotes }}
          </button>

          <button @click="toggleReplyForm" class="reply-btn">Reply</button>
        </div>

        <!-- Reply Form -->
        <form
          v-if="showReplyForm"
          @submit.prevent="addReply"
          class="reply-form"
        >
          <textarea
            v-model="replyContent"
            placeholder="Write a reply..."
            class="reply-input"
            required
          ></textarea>
          <button type="submit" class="reply-submit-btn">Post Reply</button>
        </form>
      </div>
    </div>

    <!-- Show/Hide Replies Button -->
    <button
      v-if="hasReplies && collapsed"
      @click="toggleReplies"
      class="toggle-replies-btn"
    >
      Show Replies ({{ comment.replies.length }})
    </button>
    <button
      v-if="hasReplies && !collapsed"
      @click="toggleReplies"
      class="toggle-replies-btn"
    >
      Hide Replies
    </button>

    <!-- Nested Replies -->
    <ul v-if="hasReplies && !collapsed" class="nested-replies">
      <Comment
        v-for="reply in comment.replies"
        :key="reply.id"
        :comment="reply"
        @replyToComment="onReplyToComment"
        @upvote="
          (replyId) => {
            console.log('Upvote clicked for reply', replyId);
            $emit('upvote', replyId);
          }
        "
        @downvote="
          (replyId) => {
            console.log('Downvote clicked for reply', replyId);
            $emit('downvote', replyId);
          }
        "
      />
    </ul>
  </li>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import Comment from "./Comment.vue";
import { Comment as CommentType } from '../types/types';


// interface Comment {
//   id: number;
//   content: string;
//   upvotes: number;
//   downvotes: number;
//   replies: Comment[];
 
// }

const props = defineProps<{ comment: CommentType }>();
const emit = defineEmits(["replyToComment", "upvote", "downvote"]);

const showReplyForm = ref(false);
const replyContent = ref<string>("");

// State to control whether replies are collapsed or expanded
const collapsed = ref(true);

// Check if there are replies
const hasReplies = computed(() => (props.comment.replies || []).length > 0);

// Toggle reply form visibility
const toggleReplyForm = () => {
  showReplyForm.value = !showReplyForm.value;
};

// Add reply to comment
const addReply = (): void => {
  if (replyContent.value) {
    emit("replyToComment", props.comment.id, replyContent.value);
    replyContent.value = "";
    showReplyForm.value = false;
  }
};

// Toggle replies visibility
const toggleReplies = () => {
  collapsed.value = !collapsed.value;
};

// Handle replies to replies
const onReplyToComment = (parentId: number, replyContent: string): void => {
  emit("replyToComment", parentId, replyContent);
};


</script>

<style lang="scss" scoped>
.comment-item {
  display: flex;
  flex-direction: column;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  margin-bottom: 8px;

  .author {
    font-weight: bold;
  }

  .timestamp {
    font-size: 12px;
    color: #999;
  }
}

.comment-content {
  font-size: 14px;
  margin-bottom: 10px;
}

.comment-actions {
  display: flex;
  align-items: center;
  font-size: 14px;

  .action-btn {
    background: none;
    border: none;
    color: #007bff;
    margin-right: 10px;
    cursor: pointer;

    .icon {
      margin-right: 5px;
    }

    &:hover {
      text-decoration: underline;
    }
  }

  .reply-btn {
    background: none;
    border: none;
    color: #007bff;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
}

.reply-form {
  margin-top: 10px;

  .reply-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 5px;
  }

  .reply-submit-btn {
    background-color: #28a745;
    color: white;
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #218838;
    }
  }
}

.nested-replies {
  list-style: none;
  margin-left: 20px;
  padding-left: 10px;
  border-left: 2px solid #ddd;
  margin-top: 10px;
}

.toggle-replies-btn {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  margin-top: 10px;
  padding: 5px 10px;
  font-size: 14px;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #e9f5ff;
    color: #0056b3;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
  }
}

</style>
