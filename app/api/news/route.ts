import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export const runtime = 'nodejs';

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);

export async function GET() {
  await client.connect();
  const db = client.db('imagenes');
  const data = await db.collection('News').find({}).toArray();
  return NextResponse.json(data.map(({ _id, ...rest }) => rest));
}

export async function PUT(req: NextRequest) {
  const { items } = await req.json();
  await client.connect();
  const db = client.db('imagenes');
  await db.collection('News').deleteMany({});
  if (items && items.length > 0) await db.collection('News').insertMany(items);
  return NextResponse.json({ ok: true });
}
