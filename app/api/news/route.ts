export const dynamic = "force-dynamic";
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

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
  const collection = db.collection('News');

  const currentDocs = await collection.find({}).toArray();
  const itemsLinks = items.map((item: any) => item.link);
  const toDelete = currentDocs.filter(doc => !itemsLinks.includes(doc.link));
  if (toDelete.length > 0) {
    await collection.deleteMany({ link: { $in: toDelete.map(doc => doc.link) } });
  }
  for (const item of items) {
    await collection.updateOne(
      { link: item.link },
      { $set: item },
      { upsert: true }
    );
  }
  return NextResponse.json({ ok: true });
}
