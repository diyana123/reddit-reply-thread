import { createStore } from "vuex";
import { v4 as uuid } from 'uuid'; // Import uuid

interface Comment {
  id: string; // Ensure id type is string
  content: string; // Adjust content type to string
  upvotes: number;
  downvotes: number;
  replies: Comment[];
}

export interface State {
  comments: Comment[];
}

// Inside index.ts (Vuex Store)

export default createStore<State>({
  state: {
    comments: [],
  },
  mutations: {
    ADD_COMMENT(state: State, comment: Comment) {
      state.comments.push(comment);
    },
    ADD_REPLY(state: State, { id, reply }: { id: string; reply: Comment }) {
      // Ensure the update function returns an empty object
      state.comments = findAndUpdateById(state.comments, id, (comment) => {
        comment.replies.push(reply);
        return {}; // Ensure the function returns an empty object for mutations
      });
    },
    UPVOTE_COMMENT(state: State, id: string) {
      console.log("Before update:", JSON.stringify(state.comments, null, 2));
      state.comments = findAndUpdateById(state.comments, id, (comment) => ({
        upvotes: comment.upvotes + 1,
      }));
      console.log("After update:", JSON.stringify(state.comments, null, 2));
    },
    DOWNVOTE_COMMENT(state: State, id: string) {
      state.comments = findAndUpdateById(state.comments, id, (comment) => ({
        downvotes: comment.downvotes + 1, // Increment the downvotes
      }));
    },
  },
  actions: {
    addComment({ commit }: { commit: Function }, content: string) {
      const newComment: Comment = {
        id: uuid(), // Use uuid for comment ID
        content,
        upvotes: 0,
        downvotes: 0,
        replies: [],
      };
      commit("ADD_COMMENT", newComment);
    },
    addReply({ commit }: { commit: Function }, { id, reply }: { id: string; reply: Comment }) {
      commit("ADD_REPLY", { id, reply });
    },
    upvoteComment({ commit }: { commit: Function }, id: string) {
      commit("UPVOTE_COMMENT", id);
    },
    downvoteComment({ commit }: { commit: Function }, id: string) {
      commit("DOWNVOTE_COMMENT", id);
    },
  },
  getters: {
    comments: (state: State) => state.comments,
  },
});

function findAndUpdateById(
  comments: Comment[],
  id: string,
  updateFn: (comment: Comment) => Partial<Comment>
): Comment[] {
  return comments.map((comment) => {
    // If the current comment matches the id, update it and stop recursion
    if (comment.id === id) {
      return {
        ...comment,
        ...updateFn(comment),
      };
    }

    // Check and update replies recursively only if the id hasn't been matched yet
    if (comment.replies && comment.replies.length > 0) {
      const updatedReplies = findAndUpdateById(comment.replies, id, updateFn);

      // Return the updated comment with its replies only if a reply was updated
      if (updatedReplies !== comment.replies) {
        return {
          ...comment,
          replies: updatedReplies,
        };
      }
    }

    // No changes made, return the comment as is
    return comment;
  });
}
