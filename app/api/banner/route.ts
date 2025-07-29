export const dynamic = "force-dynamic";
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://admin:sandekrfsc.1@clusterpaginacnslg.2aoh0q7.mongodb.net/?retryWrites=true&w=majority&appName=ClusterPaginaCNSLG";
const client = new MongoClient(uri);

export async function GET() {
  await client.connect();
  const db = client.db('imagenes');
  const data = await db.collection('Banner').find({}).toArray();
  return NextResponse.json(data.map(({ _id, ...rest }) => rest));
}

export async function PUT(req: NextRequest) {
  const { items } = await req.json();
  await client.connect();
  const db = client.db('imagenes');
  const collection = db.collection('Banner');

  // Obtener todos los documentos actuales
  const currentDocs = await collection.find({}).toArray();

  // Eliminar los que ya no están en items
  const itemsLinks = items.map((item: any) => item.link);
  const toDelete = currentDocs.filter(doc => !itemsLinks.includes(doc.link));
  if (toDelete.length > 0) {
    await collection.deleteMany({ link: { $in: toDelete.map(doc => doc.link) } });
  }

  // Insertar o actualizar los que están en items
  for (const item of items) {
    await collection.updateOne(
      { link: item.link },
      { $set: item },
      { upsert: true }
    );
  }

  return NextResponse.json({ ok: true });
}
