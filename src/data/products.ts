export interface Product {
  id: string;
  name: string;
  type: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
}

export const products: Product[] = [
  // Aki Motor
  {
    id: "1",
    name: "GS Astra Premium",
    type: "12V 5Ah",
    price: 185000,
    stock: 15,
    category: "Aki Motor",
  },
  {
    id: "2",
    name: "Yuasa MF",
    type: "12V 7Ah",
    price: 225000,
    stock: 8,
    category: "Aki Motor",
  },
  {
    id: "3",
    name: "Incoe Gold",
    type: "12V 5Ah",
    price: 165000,
    stock: 20,
    category: "Aki Motor",
  },
  // Aki Mobil
  {
    id: "4",
    name: "GS Astra NS60",
    type: "12V 45Ah",
    price: 650000,
    stock: 12,
    category: "Aki Mobil",
  },
  {
    id: "5",
    name: "Yuasa NS40Z",
    type: "12V 35Ah",
    price: 550000,
    stock: 5,
    category: "Aki Mobil",
  },
  {
    id: "6",
    name: "Incoe NS70",
    type: "12V 65Ah",
    price: 850000,
    stock: 7,
    category: "Aki Mobil",
  },
  // Aki Second
  {
    id: "7",
    name: "Aki Second Motor",
    type: "12V 5Ah",
    price: 95000,
    stock: 3,
    category: "Aki Second",
  },
  {
    id: "8",
    name: "Aki Second Mobil",
    type: "12V 45Ah",
    price: 350000,
    stock: 2,
    category: "Aki Second",
  },
  // Klem
  {
    id: "9",
    name: "Klem Aki Besar",
    type: "Universal",
    price: 25000,
    stock: 50,
    category: "Klem",
  },
  {
    id: "10",
    name: "Klem Aki Kecil",
    type: "Universal",
    price: 15000,
    stock: 60,
    category: "Klem",
  },
  // Kondom Kabel Paralel
  {
    id: "11",
    name: "Kondom Kabel Merah",
    type: "10mm",
    price: 8000,
    stock: 100,
    category: "Kondom Kabel Paralel",
  },
  {
    id: "12",
    name: "Kondom Kabel Hitam",
    type: "10mm",
    price: 8000,
    stock: 100,
    category: "Kondom Kabel Paralel",
  },
  // Aki Bekas
  {
    id: "13",
    name: "Aki Bekas Motor",
    type: "12V 5Ah",
    price: 50000,
    stock: 10,
    category: "Aki Bekas",
  },
  {
    id: "14",
    name: "Aki Bekas Mobil",
    type: "12V 45Ah",
    price: 200000,
    stock: 5,
    category: "Aki Bekas",
  },
];
