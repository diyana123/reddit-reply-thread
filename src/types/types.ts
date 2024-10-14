
export interface Comment {
    id: string; 
    content: string; 
    upvotes: number; 
    downvotes: number; 
    replies: Comment[]; 
  }