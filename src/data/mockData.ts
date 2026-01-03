export interface Member {
  id: string;
  name: string;
  nameKo: string;
  image: string;
  tasteDescription: string;
  tags: string[];
}

export interface Item {
  id: string;
  memberId: string;
  image: string;
  category: string;
  tags: string[];
  price: string;
  productUrl: string;
}

export const members: Member[] = [
  {
    id: "karina",
    name: "Karina",
    nameKo: "카리나",
    image:
      "https://images.unsplash.com/photo-1647857555740-65b4a22f6426?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    tasteDescription: "Chic · Girl Crush · Futuristic",
    tags: ["시크", "걸크러시", "미니멀", "슬림핏", "모던"],
  },
  {
    id: "winter",
    name: "Winter",
    nameKo: "윈터",
    image:
      "https://images.unsplash.com/photo-1728475702035-3b3ad788fd95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    tasteDescription: "Cute · Feminine · Playful",
    tags: ["페미닌", "러블리", "캐주얼", "스트릿", "컬러풀"],
  },
  {
    id: "giselle",
    name: "Giselle",
    nameKo: "지젤",
    image:
      "https://images.unsplash.com/photo-1761771777368-3c10d3c39e12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    tasteDescription: "Edgy · Street · Bold",
    tags: ["스트릿", "힙합", "오버핏", "레이어드", "유니크"],
  },
  {
    id: "ningning",
    name: "NingNing",
    nameKo: "닝닝",
    image:
      "https://images.unsplash.com/photo-1762254321931-852fe54b4579?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    tasteDescription: "Elegant · Sophisticated · Classic",
    tags: ["우아", "클래식", "엘레강스", "페미닌", "세련"],
  },
];

export const items: Item[] = [
  // Karina's items
  {
    id: "item-1",
    memberId: "karina",
    image:
      "https://images.unsplash.com/photo-1613915617430-8ab0fd7c6baf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    category: "Blazer",
    tags: ["시크", "미니멀", "슬림핏"],
    price: "₩320,000",
    productUrl: "#",
  },
  {
    id: "item-2",
    memberId: "karina",
    image:
      "https://images.unsplash.com/photo-1729379913152-bf10f56a38b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    category: "Mini Skirt",
    tags: ["걸크러시", "모던", "블랙"],
    price: "₩180,000",
    productUrl: "#",
  },
  {
    id: "item-3",
    memberId: "karina",
    image:
      "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    category: "Leather Jacket",
    tags: ["시크", "걸크러시", "레더"],
    price: "₩450,000",
    productUrl: "#",
  },
  {
    id: "item-4",
    memberId: "karina",
    image:
      "https://images.unsplash.com/photo-1763888647863-d6d0c7383151?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    category: "Tailored Pants",
    tags: ["미니멀", "슬림핏", "모던"],
    price: "₩240,000",
    productUrl: "#",
  },
  // Winter's items
  {
    id: "item-5",
    memberId: "winter",
    image:
      "https://images.unsplash.com/photo-1715176531842-7ffda4acdfa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    category: "Knit Cardigan",
    tags: ["페미닌", "러블리", "코지"],
    price: "₩160,000",
    productUrl: "#",
  },
  {
    id: "item-6",
    memberId: "winter",
    image:
      "https://images.unsplash.com/photo-1657349038547-b18a07fb4329?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    category: "Denim Jacket",
    tags: ["캐주얼", "스트릿", "컬러풀"],
    price: "₩190,000",
    productUrl: "#",
  },
  {
    id: "item-7",
    memberId: "winter",
    image:
      "https://images.unsplash.com/photo-1753589435506-cfd036fba85e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    category: "Mini Dress",
    tags: ["페미닌", "러블리", "프린트"],
    price: "₩280,000",
    productUrl: "#",
  },
  {
    id: "item-8",
    memberId: "winter",
    image:
      "https://images.unsplash.com/photo-1581327512021-fa236549e4b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    category: "Sneakers",
    tags: ["캐주얼", "스트릿", "컬러풀"],
    price: "₩140,000",
    productUrl: "#",
  },
  // Giselle's items
  {
    id: "item-9",
    memberId: "giselle",
    image:
      "https://images.unsplash.com/photo-1721111260570-456f3306f8d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    category: "Oversized Hoodie",
    tags: ["스트릿", "힙합", "오버핏"],
    price: "₩150,000",
    productUrl: "#",
  },
  {
    id: "item-10",
    memberId: "giselle",
    image:
      "https://images.unsplash.com/photo-1649850874075-49e014357b9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    category: "Cargo Pants",
    tags: ["스트릿", "유니크", "레이어드"],
    price: "₩210,000",
    productUrl: "#",
  },
  {
    id: "item-11",
    memberId: "giselle",
    image:
      "https://images.unsplash.com/photo-1760126070359-5b82710274fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    category: "Bomber Jacket",
    tags: ["스트릿", "힙합", "오버핏"],
    price: "₩380,000",
    productUrl: "#",
  },
  {
    id: "item-12",
    memberId: "giselle",
    image:
      "https://images.unsplash.com/photo-1682397125546-0a0d621a33fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    category: "Platform Boots",
    tags: ["유니크", "걸크러시", "스트릿"],
    price: "₩290,000",
    productUrl: "#",
  },
  // NingNing's items
  {
    id: "item-13",
    memberId: "ningning",
    image:
      "https://images.unsplash.com/photo-1761117228880-df2425bd70da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    category: "Silk Blouse",
    tags: ["우아", "엘레강스", "페미닌"],
    price: "₩260,000",
    productUrl: "#",
  },
  {
    id: "item-14",
    memberId: "ningning",
    image:
      "https://images.unsplash.com/photo-1763766273194-2b47767adba3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    category: "Pleated Skirt",
    tags: ["클래식", "우아", "세련"],
    price: "₩220,000",
    productUrl: "#",
  },
  {
    id: "item-15",
    memberId: "ningning",
    image:
      "https://images.unsplash.com/photo-1563671889-7bfa8c578a7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    category: "Trench Coat",
    tags: ["클래식", "엘레강스", "세련"],
    price: "₩520,000",
    productUrl: "#",
  },
  {
    id: "item-16",
    memberId: "ningning",
    image:
      "https://images.unsplash.com/photo-1624242527040-8afb0c37e69b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    category: "Heeled Loafers",
    tags: ["우아", "페미닌", "클래식"],
    price: "₩310,000",
    productUrl: "#",
  },
];
