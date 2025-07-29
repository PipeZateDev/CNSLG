import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);

async function seed() {
  await client.connect();
  const db = client.db('imagenes');

  const banner = [
    {
      Titulo: "Bienvenidos",
      Descripción: "Este es el banner principal.",
      fecha: "2024-06-01",
      link: "https://ejemplo.com/banner"
    }
  ];

  const news = [
    {
      Titulo: "Nueva noticia",
      Descripción: "Se ha publicado una nueva noticia.",
      fecha: "2024-06-02",
      link: "https://ejemplo.com/news"
    }
  ];

  const gallery = [
    {
      Titulo: "Imagen 1",
      Descripción: "Descripción de la imagen 1.",
      fecha: "2024-06-03",
      link: "https://ejemplo.com/gallery1"
    }
  ];

  await db.collection('Banner').deleteMany({});
  await db.collection('Banner').insertMany(banner);

  await db.collection('News').deleteMany({});
  await db.collection('News').insertMany(news);

  await db.collection('Gallery').deleteMany({});
  await db.collection('Gallery').insertMany(gallery);

  await client.close();
  console.log('Datos cargados correctamente.');
}

seed();
