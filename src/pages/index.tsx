import SearchBar from "@/components/SearchBar";
import { useEffect, useState } from "react";
import { Post } from "@/utils/types";
import PostCard from "@/components/PostCard";




export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);
  useEffect(() => {
    const getData = () => {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/posts`)
        .then(response => response.json())
        .then(data => {
          // Fetch profile for each post's author
          const profilePromises = data.map(async (post: { authorId: any; }) => {
            try {
              const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/profiles/${post.authorId}`);
              const profileData = await response.json();
              return ({
                ...post,
                author: profileData
              });
            } catch (error) {
              return console.error(error);
            }
          });

          Promise.all(profilePromises)
            .then(postsData => {
              setPosts(postsData);
            })
            .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
    }
    getData();
  }, [])
  useEffect(() => {
    if (posts.length > 0) {
      setFilteredPosts(posts)
    }
  }, [posts]);
  const handleSearch = (searchTerm: string) => {
    if (searchTerm === '') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts?.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.author.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center p-4">
      <div className="w-1/2">
        <SearchBar onSearch={handleSearch} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 gap-2 items-center justify-center p-4 py-8 ">
        {filteredPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
