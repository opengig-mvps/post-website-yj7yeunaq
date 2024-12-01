"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { isAxiosError } from "axios";
import { useParams } from "next/navigation";
import { LoaderCircleIcon, Edit, Trash } from "lucide-react";
import api from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const postSchema = z.object({
  title: z.string().min(1, "Post title is required"),
  content: z.string().min(1, "Post content is required"),
});

type PostFormData = z.infer<typeof postSchema>;

const ManagePostsPage: React.FC = () => {
  const { data: session } = useSession();
  const { id } = useParams();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [commentsLoading, setCommentsLoading] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentsPage, setCommentsPage] = useState<number>(1);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/users/${session?.user?.id}/posts`);
      setPosts(res?.data?.data);
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      setCommentsLoading(true);
      const res = await api.get(
        `/api/posts/${postId}/comments?page=${commentsPage}`
      );
      setComments((prev) => [...prev, ...res?.data?.data]);
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
      }
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [session]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  const onSubmit = async (data: PostFormData) => {
    try {
      const payload = {
        title: data?.title,
        content: data?.content,
      };

      const response = await api.put(
        `/api/users/${session?.user?.id}/posts/${selectedPost?.id}`,
        payload
      );

      if (response?.data?.success) {
        toast.success("Post updated successfully!");
        fetchPosts();
        setSelectedPost(null);
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  const deletePost = async (postId: string) => {
    try {
      await api.delete(`/api/users/${session?.user?.id}/posts/${postId}`);
      toast.success("Post deleted successfully!");
      fetchPosts();
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleEdit = (post: any) => {
    setSelectedPost(post);
    reset({
      title: post?.title,
      content: post?.content,
    });
  };

  const handleLoadMoreComments = (postId: string) => {
    setCommentsPage((prev) => prev + 1);
    fetchComments(postId);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Manage Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <LoaderCircleIcon className="animate-spin" />
        ) : (
          posts?.map((post) => (
            <Card key={post?.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{post?.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{post?.content}</p>
              </CardContent>
              <CardFooter className="mt-auto flex justify-between">
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => handleEdit(post)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Post</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                          <div>
                            <Input
                              {...register("title")}
                              placeholder="Post Title"
                            />
                            {errors?.title && (
                              <p className="text-red-500 text-sm">
                                {errors?.title?.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <Textarea
                              {...register("content")}
                              placeholder="Post Content"
                            />
                            {errors?.content && (
                              <p className="text-red-500 text-sm">
                                {errors?.content?.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          className="w-full mt-4"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <LoaderCircleIcon className="w-4 h-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save Changes"
                          )}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline">
                        <Trash className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your post.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogAction
                          onClick={() => deletePost(post?.id)}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
      {selectedPost && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Comments</h3>
          <div className="space-y-4">
            {comments?.map((comment) => (
              <Card key={comment?.id}>
                <CardContent>
                  <p className="text-sm">{comment?.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button
            className="mt-4"
            onClick={() => handleLoadMoreComments(selectedPost?.id)}
            disabled={commentsLoading}
          >
            {commentsLoading ? (
              <>
                <LoaderCircleIcon className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Comments"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ManagePostsPage;