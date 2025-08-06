import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://<usuario>:<password>@<cluster>/<dbname>?retryWrites=true&w=majority";
const DB_NAME = process.env.MONGODB_DB || "cnslg";
const COLLECTION = "RedesSociales";

async function getClient() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  return client;
}

export async function GET(req: NextRequest) {
  const client = await getClient();
  try {
    const db = client.db(DB_NAME);
    const posts = await db.collection(COLLECTION)
      .find({})
      .sort({ fecha: -1, _id: -1 })
      .toArray();
    return NextResponse.json(posts.map(p => ({
      ...p,
      id: p._id?.toString?.() ?? "",
      _id: undefined,
    })));
  } catch (e) {
    return NextResponse.json({ error: "Error al obtener publicaciones" }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(req: NextRequest) {
  const client = await getClient();
  try {
    const body = await req.json();
    const { url, type, title, fecha } = body;
    if (!url || !type || !fecha) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }
    const db = client.db(DB_NAME);
    const result = await db.collection(COLLECTION).insertOne({
      url,
      type,
      title,
      fecha,
      createdAt: new Date(),
    });
    return NextResponse.json({ ok: true, id: result.insertedId });
  } catch (e) {
    return NextResponse.json({ error: "Error al guardar publicación" }, { status: 500 });
  } finally {
    await client.close();
  }
}
