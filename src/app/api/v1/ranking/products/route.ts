import data from "./data.json";

export const GET = (req: Request, res: Response) => {
  const { searchParams } = new URL(req.url);
  const targetType = searchParams.get("targetType") ?? "ALL";
  const rankType = searchParams.get("rankType") ?? "MANY_WISH";

  try {
    // @ts-ignore
    const filteredData = data?.[targetType]?.[rankType];

    if (!filteredData) {
      return new Response("Bad Request", { status: 400 });
    }

    // @ts-ignore
    const products = filteredData.map(({ rankingItem }) => ({
      id: rankingItem.id,
      name: rankingItem.name,
      imageURL: rankingItem.imageUrl,
      wish: {
        isWished: false,
        wishCount: rankingItem.wish.wishCount,
      },
      price: rankingItem.price,
      brandInfo: {
        id: rankingItem.brand.id,
        name: rankingItem.brand.name,
        imageURL: rankingItem.brand.imageUrl,
      },
    }));

    return Response.json({
      products,
    });
  } catch {
    return new Response("Internal Server Error", { status: 500 });
  }
};
