import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type PostRequestBody = {
  content: string;
  parentId?: number | null;
};

export async function POST(request: Request) {
  try {
    const body: PostRequestBody = await request.json();

    const { content, parentId } = body;
    if (!content) {
      return NextResponse.json({ success: false, message: 'Content is required' }, { status: 400 });
    }

    const newPost = await prisma.post.create({
      data: {
        content,
        parentId: parentId ? parentId : null,
        userId: 1, // Assuming userId is 1 for now, replace with actual userId
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Post created successfully!',
      data: {
        id: newPost.id,
        userId: newPost.userId,
        content: newPost.content,
        parentId: newPost.parentId,
        createdAt: newPost.createdAt.toISOString(),
        updatedAt: newPost.updatedAt.toISOString(),
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating post:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', data: error }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    // Parse query parameters for sorting and filtering
    const url = new URL(request.url);
    const sort = url.searchParams.get('sort') || 'createdAt';
    const order = url.searchParams.get('order') || 'desc';

    // Retrieve posts from the database with sorting
    const posts = await prisma.post.findMany({
      orderBy: {
        [sort]: order,
      },
      include: {
        likes: true,
      },
    });

    // Map posts to include like and dislike counts
    const responseData = posts.map((post: any) => ({
      id: post.id,
      userId: post.userId,
      content: post.content,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      likeCount: post.likes.filter((like: any) => like.isLike).length,
      dislikeCount: post.likes.filter((like: any) => !like.isLike).length,
    }));

    // Return the response
    return NextResponse.json({
      success: true,
      message: 'Posts fetched successfully!',
      data: responseData,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      data: error,
    }, { status: 500 });
  }
}