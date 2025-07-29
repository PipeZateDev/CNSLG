import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://admin:sandekrfsc.1@clusterpaginacnslg.2aoh0q7.mongodb.net/?retryWrites=true&w=majority&appName=ClusterPaginaCNSLG";
const client = new MongoClient(uri);

export async function GET() {
  await client.connect();
  const db = client.db('imagenes');
  const data = await db.collection('News').find({}).toArray();
  return NextResponse.json(data.map(({ _id, ...rest }) => rest));
}

export async function PUT(req: NextRequest) {
  const items = await req.json();
  await client.connect();
  const db = client.db('imagenes');
  await db.collection('News').deleteMany({});
  if (items.length > 0) await db.collection('News').insertMany(items);
  return NextResponse.json({ ok: true });
}
