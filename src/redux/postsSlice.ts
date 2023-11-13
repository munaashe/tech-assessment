import { Post } from '@/utils/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AppState {
  favoritePosts: Post[];
}

const initialState: AppState = {
  favoritePosts: []
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    favoritePost: (state: { favoritePosts: Post[]; }, action: PayloadAction<Post>) => {
      state.favoritePosts.push(action.payload);
    },
    unfavoritePost: (state: { favoritePosts: any[]; }, action: PayloadAction<Post>) => {
      state.favoritePosts = state.favoritePosts.filter(
        (post: any) => post.id !== action.payload.id
      );
    }
  }
});

export const { favoritePost, unfavoritePost } = postSlice.actions;

export default postSlice.reducer;