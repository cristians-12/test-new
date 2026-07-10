import { DataSource } from 'typeorm';
import { Category } from './categories/category.entity';
import { Product } from './products/product.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root_secret',
  database: process.env.DB_NAME || 'test_db',
  entities: [Category, Product],
  synchronize: true,
});

const categories = [
  { name: 'Electrónica', slug: 'electronica', description: 'Dispositivos electrónicos y gadgets' },
  { name: 'Ropa', slug: 'ropa', description: 'Prendas de vestir para hombre y mujer' },
  { name: 'Hogar', slug: 'hogar', description: 'Artículos para el hogar y decoración' },
  { name: 'Deportes', slug: 'deportes', description: 'Equipamiento y ropa deportiva' },
  { name: 'Alimentos', slug: 'alimentos', description: 'Productos alimenticios y bebidas' },
];

const products = [
  { name: 'Laptop Gamer Pro', description: 'Laptop de 15.6" con RTX 4060, 16GB RAM', price: 4500000, stock: 15, categorySlug: 'electronica' },
  { name: 'Mouse Inalámbrico', description: 'Mouse ergonómico con sensor óptico de 4000 DPI', price: 85000, stock: 50, categorySlug: 'electronica' },
  { name: 'Auriculares Bluetooth', description: 'Auriculares con cancelación de ruido activa', price: 320000, stock: 30, categorySlug: 'electronica' },
  { name: 'Camiseta Básica Algodón', description: 'Camiseta 100% algodón, varios colores', price: 45000, stock: 100, categorySlug: 'ropa' },
  { name: 'Jeans Slim Fit', description: 'Jeans de mezclilla azul slim fit', price: 180000, stock: 40, categorySlug: 'ropa' },
  { name: 'Chaqueta Impermeable', description: 'Chaqueta outdoor impermeable con capucha', price: 350000, stock: 20, categorySlug: 'ropa' },
  { name: 'Lámpara de Escritorio LED', description: 'Lámpara LED con 3 niveles de intensidad', price: 120000, stock: 25, categorySlug: 'hogar' },
  { name: 'Juego de Sábanas', description: 'Sábanas de microfibra, tamaño queen', price: 95000, stock: 35, categorySlug: 'hogar' },
  { name: 'Balón de Fútbol', description: 'Balón oficial tamaño 5, material sintético', price: 75000, stock: 60, categorySlug: 'deportes' },
  { name: 'Mancuernas Ajustables', description: 'Par de mancuernas ajustables de 20kg', price: 280000, stock: 18, categorySlug: 'deportes' },
  { name: 'Café Especial Colombia', description: 'Café en grano 100% arábica, tueste medio', price: 55000, stock: 80, categorySlug: 'alimentos' },
  { name: 'Aceite de Oliva Extra Virgen', description: 'Aceite de oliva prensado en frío 500ml', price: 42000, stock: 45, categorySlug: 'alimentos' },
];

async function seed() {
  await dataSource.initialize();
  console.log('DB connected');

  const categoryRepo = dataSource.getRepository(Category);
  const productRepo = dataSource.getRepository(Product);

  for (const cat of categories) {
    const exists = await categoryRepo.findOneBy({ slug: cat.slug });
    if (!exists) {
      await categoryRepo.save(categoryRepo.create(cat));
      console.log(`Category "${cat.name}" created`);
    }
  }

  for (const prod of products) {
    const exists = await productRepo.findOneBy({ name: prod.name });
    if (exists) continue;

    const category = await categoryRepo.findOneBy({ slug: prod.categorySlug });
    if (!category) {
      console.log(`Category "${prod.categorySlug}" not found, skipping "${prod.name}"`);
      continue;
    }

    const { categorySlug, ...data } = prod;
    await productRepo.save(productRepo.create({ ...data, category_id: category.id }));
    console.log(`Product "${prod.name}" created`);
  }

  console.log('Seed completed');
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
