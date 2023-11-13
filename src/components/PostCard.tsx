import { PostCardProps } from "@/utils/types";
import Image from "next/image";
import Link from "next/link";


function PostCard({ post }: PostCardProps) {
    return (

        <div className="bg-white shadow-md rounded-lg p-4 py-8 mb-4">
            <h2 className="text-xl font-bold mb-2 text-center">{post.title}</h2>
            <div className="flex items-center justify-start pt-8">
                {/*<Image
                    src={post.author.imageUrl}
                    alt={post.author.name}
                    fill
                    className="w-10 h-10 rounded-full mr-2"
    />*/}
                <div>
                    <p className="font-semibold text-sm"><span className="italic">By: </span>{post.author.name}</p>
                    <p className="text-gray-500 text-xs">{post.author.email}</p>
                </div>
            </div>
            <Link href={`/${post.id}`} target="_blank">
                <div className="pt-2 cursor-pointer text-center text-blue-700 hover:text-blue-300">
                    Read more
                </div>
            </Link>
        </div>
    );
}

export default PostCard;
