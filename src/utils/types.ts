
export interface Post {
    id: number;
    authorId: number;
    title: string;
    body: string;
    author: any;
}


export interface Profile {
    id: number;
    name: string;
    email: string;
    imageUrl: string;
}

export interface PostCardProps {
    post: Post;
}

export interface Comment {
    postId: number;
    text: string;
    profileId: number;
    profile: any;
}
