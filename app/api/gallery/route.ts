import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);

export async function GET(req: NextRequest) {
  await client.connect();
  const db = client.db('imagenes');
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'Gallery';
  const data = await db.collection(type).find({}).toArray();
  return NextResponse.json(data.map(({ _id, ...rest }) => rest));
}

export async function PUT(req: NextRequest) {
  const { type = 'Gallery', items } = await req.json();
  await client.connect();
  const db = client.db('imagenes');
  await db.collection(type).deleteMany({});
  if (items && items.length > 0) await db.collection(type).insertMany(items);
  return NextResponse.json({ ok: true });
}
