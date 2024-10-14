import { createStore } from "vuex";
import { v4 as uuid } from 'uuid';
import localforage from "localforage";

interface Comment {
  id: string; // Unique identifier
  content: string; // Comment text
  upvotes: number; // Upvote count
  downvotes: number; // Downvote count
  replies: Comment[]; // Nested replies
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
      // Save after adding the comment
      this.commit('SAVE_COMMENTS_TO_LOCAL'); // Corrected mutation name
    },
    ADD_REPLY(state: State, { id, reply }: { id: string; reply: Comment }) {
      state.comments = findAndUpdateById(state.comments, id, (comment) => {
        comment.replies.push(reply);
        return {}; // Ensure the function returns an empty object for mutations
      });
      // Save after adding the reply
      this.commit('SAVE_COMMENTS_TO_LOCAL'); // Corrected mutation name
    },
    UPVOTE_COMMENT(state: State, id: string) {
      state.comments = findAndUpdateById(state.comments, id, (comment) => ({
        upvotes: comment.upvotes + 1,
      }));
      // Save after upvote
      this.commit('SAVE_COMMENTS_TO_LOCAL'); // Corrected mutation name
    },
    DOWNVOTE_COMMENT(state: State, id: string) {
      state.comments = findAndUpdateById(state.comments, id, (comment) => ({
        downvotes: comment.downvotes + 1,
      }));
      // Save after downvote
      this.commit('SAVE_COMMENTS_TO_LOCAL'); // Corrected mutation name
    },
    SET_COMMENTS(state: State, comments: Comment[]) {
      state.comments = comments;
    },
    SAVE_COMMENTS_TO_LOCAL(state: State) { // Make sure this mutation is defined
      const simplifiedComments = state.comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        upvotes: comment.upvotes,
        downvotes: comment.downvotes,
        replies: comment.replies.map(reply => ({
          id: reply.id,
          content: reply.content,
          upvotes: reply.upvotes,
          downvotes: reply.downvotes,
        })),
      }));
      localforage.setItem('comments', simplifiedComments); // Save to localForage
    },
  },
  actions: {
    async fetchComments({ commit }: { commit: Function }) {
      const comments = await localforage.getItem<Comment[]>('comments');
      if (comments) {
        commit('SET_COMMENTS', comments);
      }
    },
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

    // New getter to return sorted comments
  sortedComments: (state: State) => (sortBy: string) => {
    let sortedComments = [...state.comments];
    
    if (sortBy === 'mostUpvoted') {
      // Sort by most upvoted first
      sortedComments.sort((a, b) => b.upvotes - a.upvotes);
    } 

    return sortedComments;
  }
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
