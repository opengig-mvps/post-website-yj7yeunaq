"use client";

import React, { useState, useEffect } from "react";
import axios, { isAxiosError } from "axios";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircleIcon, Heart, ThumbsDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Post {
  id: string;
  content: string;
  createdAt: string;
  replies: Post[];
  title?: string;
  likes?: number;
  dislikes?: number;
}

const Homepage: React.FC = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
  const [sortCriteria, setSortCriteria] = useState<string>('mostRecent');
  const [filterCriteria, setFilterCriteria] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<{ content: string }>({
    defaultValues: {
      content: "",
    },
  });

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/posts?sort=${sortCriteria}&filter=${filterCriteria}`);
      setPosts(res?.data?.data);
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [sortCriteria, filterCriteria]);

  const onSubmit = async (data: { content: string }) => {
    try {
      setLoading(true);
      const res = await axios.post(`/api/users/${session?.user?.id}/posts`, data);
      if (res?.data?.success) {
        toast.success("Post created successfully!");
        reset();
        fetchPosts();
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLikeDislike = async (postId: string, action: 'like' | 'dislike') => {
    try {
      const res = await axios.post(`/api/posts/${postId}/${action}`);
      if (res?.data?.success) {
        setPosts((prevPosts) =>
          prevPosts?.map((post) =>
            post?.id === postId ? { ...post, ...res?.data?.data } : post
          )
        );
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Posts</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Create New Post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              {...register("content", { required: "Content is required" })}
              placeholder="What's on your mind?"
            />
            {errors?.content && (
              <p className="text-red-500 text-sm">{errors?.content?.message}</p>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderCircleIcon className="w-4 h-4 mr-2 animate-spin" />
                  Creating Post...
                </>
              ) : (
                "Create Post"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>

      <div className="flex justify-between mb-6">
        <Select value={sortCriteria} onValueChange={(e: any) => setSortCriteria(e)}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mostRecent">Most Recent</SelectItem>
            <SelectItem value="mostLiked">Most Liked</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCriteria} onValueChange={(e: any) => setFilterCriteria(e)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="liked">Liked</SelectItem>
            <SelectItem value="disliked">Disliked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loadingPosts ? (
        <LoaderCircleIcon className="animate-spin mx-auto" />
      ) : (
        posts?.map((post: Post) => (
          <Card key={post?.id} className="mb-6">
            <CardHeader>
              <CardTitle>Posted at {new Date(post?.createdAt).toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{post?.content}</p>
              {post?.replies?.length > 0 && (
                <div className="mt-4 ml-4">
                  <h4 className="font-semibold">Replies:</h4>
                  {post?.replies?.map((reply: Post) => (
                    <Card key={reply?.id} className="mt-2">
                      <CardHeader>
                        <CardTitle>Replied at {new Date(reply?.createdAt).toLocaleString()}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{reply?.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleLikeDislike(post?.id, 'like')}
              >
                <Heart className="h-5 w-5" />
                <span>{post?.likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleLikeDislike(post?.id, 'dislike')}
              >
                <ThumbsDown className="h-5 w-5" />
                <span>{post?.dislikes}</span>
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};

export default Homepage;