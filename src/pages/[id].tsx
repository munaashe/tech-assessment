'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import { Post, Profile, Comment } from '@/utils/types';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '@/redux/postsSlice';
import { unfavoritePost, favoritePost } from '@/redux/postsSlice';

const PostPage = () => {
    const [post, setPost] = useState<Post | null>(null)
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [commentLoading, setCommentLoading] = useState<boolean>(false);
    const router = useRouter();

    const dispatch = useDispatch();
    const favoritePosts = useSelector((state: any) => state?.favoritePosts);

    const isFavorited = favoritePosts?.includes(post);

    const handleFavorite = () => {
        if (isFavorited) {
            dispatch(unfavoritePost(post!));
            console.log('ran')
        } else {
            dispatch(favoritePost(post!));
        }
    };

    const getPost = () => {
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/posts/${router.query.id}`)
            .then(response => response.json())
            .then((postData: Post) => {
                setPost(postData);

                fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/profiles/${postData.authorId}`)
                    .then(response => response.json())
                    .then((profileData: Profile) => {
                        setPost(prevPost => ({
                            ...prevPost!,
                            author: profileData
                        }));
                    })
                    .catch(error => console.error(error));
            })
            .catch(error => console.error(error));
    };
    const getComments = () => {
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/posts/${router.query.id}/comments`)
            .then(response => response.json())
            .then((commentsData: Comment[]) => {
                // Fetch profile for each comment's author
                const profilePromises = commentsData.map(async (comment: Comment) => {
                    try {
                        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/profiles/${comment.profileId}`);
                        const profileData = await response.json();
                        return ({
                            ...comment,
                            profile: profileData
                        });
                    } catch (error) {
                        console.error(error);
                        return {
                            ...comment,
                            profile: null
                        };
                    }
                });
                Promise.all(profilePromises)
                    .then(commentsData => {
                        setComments(commentsData);
                    })
                    .catch(error => console.error(error));
            })
            .catch(error => console.log(error))
    }

    useEffect(() => {
        if (router.query.id !== "") {
            getPost();
            getComments();
        }
    }, [router.query.id])

    const handleAddComment = async () => {
        setCommentLoading(true)
        try {
            // Fetch the logged-in user's profile
            const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/my-profile`);
            const profileData = await profileResponse.json();
            const profileId = profileData.id;

            // Create the comment payload
            const commentPayload = {
                text: newComment,
                profileId: profileId
            };

            // Send the add comment request
            const addCommentResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/posts/${router.query.id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(commentPayload)
            });

            if (addCommentResponse.ok) {
                setNewComment('');
                getComments();
                setCommentLoading(false)
            } else {
                console.log(addCommentResponse.json())
                setCommentLoading(false)
            }
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div className="max-w-2xl mx-auto p-4">
            {post && (
                <div className="bg-white rounded shadow p-4 mb-4">
                    <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
                    <p className="text-gray-600 mb-4">By {post.author?.name}</p>
                    <p>{post.body}</p>
                </div>
            )}
            {isFavorited ? (
                <div onClick={handleFavorite} className='cursor-pointer h-8 w-8'>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="heart-icon"
                        viewBox="0 0 24 24"
                        fill="#ff0000"
                    >
                        <path d="M12 21.35l-1.45-1.32C4.53 14.95 1 11.72 1 7.75 1 4.42 3.42 2 6.75 2c1.93 0 3.68 1.13 4.75 2.87C13.57 3.13 15.32 2 17.25 2 20.58 2 23 4.42 23 7.75c0 3.97-3.53 8.2-10.55 12.28L12 21.35z" />
                    </svg>
                </div>
            ) : (
                <div onClick={handleFavorite} className='cursor-pointer h-8 w-8'>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="heart-icon"
                        viewBox="0 0 24 24"
                        fill="#808080"
                    >
                        <path d="M12 21.35l-1.45-1.32C4.53 14.95 1 11.72 1 7.75 1 4.42 3.42 2 6.75 2c2.07 0 3.81 1.39 4.5 3.3C12.45 3.39 14.19 2 16.26 2 19.58 2 22 4.42 22 7.75c0 3.97-3.53 8.2-10.55 12.28L12 21.35z" />
                    </svg>
                </div>
            )}

            <div className="bg-white rounded shadow p-4 mb-4 mt-12">
                <h2 className="text-xl font-bold mb-4">Add Comment</h2>
                <textarea
                    className="w-full rounded border p-2 mb-4"
                    rows={4}
                    placeholder="Write your comment..."
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                />
                {commentLoading ? (
                    <div role="status">
                        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>

                ) : (
                    <button
                        className="bg-blue-700 hover:bg-blue-300 text-white font-bold py-2 px-4 rounded-xl shadow-md"
                        onClick={handleAddComment}
                    >
                        Add Comment
                    </button>
                )}
            </div>


            {comments.length > 0 && (
                <div className="bg-white rounded-xl shadow p-4">
                    <h2 className="text-xl font-bold mb-4">Comments</h2>
                    {comments.map((comment, index) => (
                        <div key={index} className="mb-4">
                            <p className="font-bold">{comment.profile?.name}</p>
                            <p>{comment.text}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PostPage;
