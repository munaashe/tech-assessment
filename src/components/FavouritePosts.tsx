'use client'

import { AppState } from '@/redux/postsSlice';
import React from 'react'
import { useSelector } from 'react-redux'
import PostCard from './PostCard';

const FavouritePosts = () => {
    const favouritePosts = useSelector((state: any) => state?.favoritePosts);
    return (
        <div className='p-4'>
            {favouritePosts?.map((post: any) => (
                <PostCard
                    key={post.id}
                    post={post}
                />
            ))}
        </div>
    )
}

export default FavouritePosts