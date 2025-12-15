import { NextRequest, NextResponse } from 'next/server';
import { Idea } from '@/lib/models/Idea';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Idea ID is required' },
        { status: 400 }
      );
    }

    const idea = await Idea.findById(id);

    if (!idea) {
      return NextResponse.json(
        { error: 'Idea not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        idea: {
          id: idea._id,
          title: idea.title,
          image: idea.image,
          categories: idea.categories,
          preview: idea.preview,
          fullContent: idea.fullContent,
          price: idea.price,
          sellerId: idea.sellerId,
          sellerName: idea.sellerName,
          sellerTwitter: idea.sellerTwitter,
          sellerWalletAddress: idea.sellerWalletAddress,
          preferredChain: idea.preferredChain,
          sellerIdeasSold: idea.sellerIdeasSold,
          salesCount: idea.salesCount,
          aiRating: idea.aiRating,
          createdAt: idea.createdAt.toISOString(),
          status: idea.status,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Fetch idea error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch idea' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { Idea as IdeaModel } from '@/lib/models/Idea';
import { Idea } from '@/lib/types';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = params;

    const idea = await IdeaModel.findById(id);
    if (!idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    const result: Idea = {
      id: (idea._id as any)?.toString?.() ?? '',
      title: idea.title,
      image: idea.image,
      categories: idea.categories,
      preview: idea.preview,
      fullContent: idea.fullContent,
      price: idea.price,
      sellerId: idea.sellerId,
      sellerName: idea.sellerName,
      sellerTwitter: idea.sellerTwitter,
      sellerWalletAddress: idea.sellerWalletAddress,
      preferredChain: idea.preferredChain,
      sellerIdeasSold: idea.sellerIdeasSold,
      salesCount: idea.salesCount,
      aiRating: idea.aiRating,
      createdAt: idea.createdAt.toISOString(),
      status: idea.status,
    };

    return NextResponse.json({ success: true, idea: result }, { status: 200 });
  } catch (error: any) {
    console.error('Get idea error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to load idea' },
      { status: 500 }
    );
  }
}


