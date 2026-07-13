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
  {
    name: 'Laptop Gamer Pro',
    description: 'Laptop de 15.6" con RTX 4060, 16GB RAM',
    price: 4500000, stock: 15, categorySlug: 'electronica',
    image_url: 'https://cdn.mos.cms.futurecdn.net/3ivdk2QPZVDmzLCVsN3qVA.jpg',
  },
  {
    name: 'Mouse Inalámbrico',
    description: 'Mouse ergonómico con sensor óptico de 4000 DPI',
    price: 85000, stock: 50, categorySlug: 'electronica',
    image_url: 'https://imgs.search.brave.com/Y3V4ocN8RliFVLklG70hCVZCnGFLbbGFY_MvqAiL4jw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9odHRw/Mi5tbHN0YXRpYy5j/b20vRF9RX05QXzJY/XzY2NjE2Ni1NTEE5/OTkzMjA0ODM4N18x/MTIwMjUtRS53ZWJw',
  },
  {
    name: 'Auriculares Bluetooth',
    description: 'Auriculares con cancelación de ruido activa',
    price: 320000, stock: 30, categorySlug: 'electronica',
    image_url: 'https://imgs.search.brave.com/Kgs25JKbzdbw_64Maup-Va59M9LuQEY4XQUJx1iUP_s/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMtbmEuc3NsLWlt/YWdlcy1hbWF6b24u/Y29tL2ltYWdlcy9J/LzcxRlhaMUw2TmdM/LmpwZw',
  },
  {
    name: 'Camiseta Básica Algodón',
    description: 'Camiseta 100% algodón, varios colores',
    price: 45000, stock: 100, categorySlug: 'ropa',
    image_url: 'https://imgs.search.brave.com/81G9FjLm4VxAYdTaqOe79KcGInIuIlTiKlmB6bMXPOY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9taW5p/bWFsaXNtYnJhbmQu/Y29tL2Nkbi9zaG9w/L2ZpbGVzL3ByaW1l/ci1wbGFuby1jYW1p/c2V0YS1vdmVyc2l6/ZS1ibGFuY2FfMTAy/NHgxMDI0LmpwZz92/PTE3MzgwNzY3MDI',
  },
  {
    name: 'Jeans Slim Fit',
    description: 'Jeans de mezclilla azul slim fit',
    price: 180000, stock: 40, categorySlug: 'ropa',
    image_url: 'https://imgs.search.brave.com/IA_1SMJNZl_f4kjAzlcDFxbhfwQ7DsTyNQdgpqUVqOo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMud3JhbmdsZXIu/Y29tL2lzL2ltYWdl/L1dyYW5nbGVyLzEx/MjM4MTg3MC1BTFQ0/PyRLRFAtTEFSR0Uy/JA',
  },
  {
    name: 'Chaqueta Impermeable',
    description: 'Chaqueta outdoor impermeable con capucha',
    price: 350000, stock: 20, categorySlug: 'ropa',
    image_url: 'https://imgs.search.brave.com/IAC_0H2L__EKP865nZkHDFoNdoenngRml1LMzQr3Kk0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9odHRw/Mi5tbHN0YXRpYy5j/b20vRF9RX05QXzJY/Xzk5MTg4OC1NTFY3/OTM5MTY3MjA0Nl8w/OTIwMjQtRS53ZWJw',
  },
  {
    name: 'Lámpara de Escritorio LED',
    description: 'Lámpara LED con 3 niveles de intensidad',
    price: 120000, stock: 25, categorySlug: 'hogar',
    image_url: 'https://imgs.search.brave.com/bUx5frN4X5duJoPy9DyEy14RlExox37Z9eHn0xAW18I/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9odHRw/Mi5tbHN0YXRpYy5j/b20vRF9RX05QXzJY/Xzk3ODcwMi1NTEE5/ODQ5MTgxMDE5Ml8x/MTIwMjUtRS53ZWJw',
  },
  {
    name: 'Juego de Sábanas',
    description: 'Sábanas de microfibra, tamaño queen',
    price: 95000, stock: 35, categorySlug: 'hogar',
    image_url: 'https://imgs.search.brave.com/hWJGvhosN6VF_TAG9YQgykbl6Xh503shAJi9epfdQWw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLmVi/YXlpbWcuY29tL2lt/YWdlcy9nL2dVOEFB/ZVN3QTRGcHhOQ2Ev/cy1sOTYwLndlYnA',
  },
  {
    name: 'Balón de Fútbol',
    description: 'Balón oficial tamaño 5, material sintético',
    price: 75000, stock: 60, categorySlug: 'deportes',
    image_url: 'https://imgs.search.brave.com/8BrblszcPADJVblN_O2J2HSANExWghxX_aH0bof0-bU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/YmVzdGJ1eXNvY2Nl/ci5jb20vY2RuL3No/b3AvZmlsZXMvMDg1/MTY2XzAxX2J2Lmpw/Zz92PTE3Nzk4OTQ4/MDAmd2lkdGg9NDYw',
  },
  {
    name: 'Mancuernas Ajustables',
    description: 'Par de mancuernas ajustables de 20kg',
    price: 280000, stock: 18, categorySlug: 'deportes',
    image_url: 'https://imgs.search.brave.com/JIdSyk3fIw9P46xmcnJFs1C6N2uhPz-0K4vfYkveofE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5hZGVvLmNvbS9t/a3AvZGYzMjg2MmUw/Njc1YTFmZDIwMWE5/MzlmOTUxMzQxZTIv/bWVkaWEuanBnP3dp/ZHRoPTY0MA',
  },
  {
    name: 'Café Especial Colombia',
    description: 'Café en grano 100% arábica, tueste medio',
    price: 55000, stock: 80, categorySlug: 'alimentos',
    image_url: 'https://imgs.search.brave.com/WVI4k9Ga6j0iEqUWIlz7tfbP5Qu37T4q2dzfYJ23UJM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jb2xv/bWJpYW5jb2ZmZWUu/dXMvY2RuL3Nob3Av/ZmlsZXMvYmFzdGls/bGEtcHJlbWl1bS1y/b2FzdGVkLWNvbG9t/Ymlhbi1jb2ZmZWUt/MjUwNDIxX2Y3Y2M1/N2QxLTk3MjktNDFm/OC1hODgxLTM2NWYx/YmFkYTk0MS5wbmc_/dj0xNzgxODI2Mzg5/JndpZHRoPTIwNDg',
  },
  {
    name: 'Aceite de Oliva Extra Virgen',
    description: 'Aceite de oliva prensado en frío 500ml',
    price: 42000, stock: 45, categorySlug: 'alimentos',
    image_url: 'https://imgs.search.brave.com/Hg5kpRESo46aGl9Gk6JhVVEys3FJh71N6zv_U_pWONc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLm5p/bmltZy5jb20vb3Jp/Z2luYWxzLzBjL2Fk/Lzk0LzBjYWQ5NGQw/Y2E2Y2VlMWI2MTRj/ZTRkN2Y0OGI2N2Vi/LmpwZw',
  },
];

async function seed() {
  await dataSource.initialize();
  console.log('DB connected');

  await dataSource.query('CREATE EXTENSION IF NOT EXISTS unaccent');

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
