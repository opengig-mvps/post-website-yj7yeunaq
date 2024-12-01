import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type LikeRequestBody = {
  isLike: boolean;
  userId: number;
};

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const postId = parseInt(params.postId, 10);
    if (isNaN(postId)) {
      return NextResponse.json({ success: false, message: 'Invalid post ID' }, { status: 400 });
    }

    const body: LikeRequestBody = await request.json();
    const { isLike, userId } = body;

    if (isNaN(userId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const post = await prisma.post.findFirst({ where: { id: postId } });
    if (!post) {
      return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 });
    }

    const existingLike = await prisma.like.findFirst({
      where: { userId, postId },
    });

    if (existingLike) {
      await prisma.like.updateMany({
        where: { userId, postId },
        data: { isLike, updatedAt: new Date() },
      });
    } else {
      await prisma.like.create({
        data: {
          isLike,
          userId,
          postId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    const likeCount = await prisma.like.count({ where: { postId, isLike: true } });
    const dislikeCount = await prisma.like.count({ where: { postId, isLike: false } });

    return NextResponse.json({
      success: true,
      message: isLike ? 'Post liked successfully!' : 'Post disliked successfully!',
      data: { postId, likeCount, dislikeCount },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error updating like status:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', data: error }, { status: 500 });
  }
}