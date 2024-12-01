import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type DislikeRequestBody = {
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

    const body: DislikeRequestBody = await request.json();
    const { isLike, userId } = body;

    if (typeof isLike !== 'boolean' || isNaN(userId)) {
      return NextResponse.json({ success: false, message: 'Invalid request body' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const post = await prisma.post.findFirst({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 });
    }

    const existingLike = await prisma.like.findFirst({
      where: { postId, userId },
    });

    if (existingLike) {
      await prisma.like.updateMany({
        where: { postId, userId },
        data: { isLike: false },
      });
    } else {
      await prisma.like.create({
        data: {
          postId,
          userId,
          isLike: false,
        },
      });
    }

    const likeCount = await prisma.like.count({
      where: { postId, isLike: true },
    });

    const dislikeCount = await prisma.like.count({
      where: { postId, isLike: false },
    });

    return NextResponse.json({
      success: true,
      message: 'Post disliked successfully!',
      data: { postId, likeCount, dislikeCount },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error disliking post:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', data: error }, { status: 500 });
  }
}