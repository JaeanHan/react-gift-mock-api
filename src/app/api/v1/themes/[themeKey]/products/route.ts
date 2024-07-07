import data from "./data.json";

export const GET = (
  req: Request,
  { params }: { params: { themeKey: string } }
) => {
  const { searchParams } = new URL(req.url);
  const pageToken = searchParams.get("pageToken") ?? "0";
  const maxResults = searchParams.get("maxResults") ?? "10";
  const themeKey = params.themeKey;

  if (!themeKey) {
    return new Response("Bad Request", { status: 400 });
  }

  try {
    // @ts-ignore
    const rawProducts = data?.[themeKey];

    if (!rawProducts) {
      return new Response("Bad Request", { status: 400 });
    }

    // rawProducts 를 maxResults 만큼 이중 배열로 변경
    const products = chunk(rawProducts, parseInt(maxResults));

    const currentProducts = (products?.[parseInt(pageToken)] ?? []).map(
      (product) => ({
        // @ts-ignore
        id: product.productId,
        // @ts-ignore
        name: product.name,
        // @ts-ignore
        imageURL: product.imageUrl,
        wish: {
          isWished: false,
          wishCount: 0,
        },
        price: {
          // @ts-ignore
          basicPrice: product.salePrice,
          // @ts-ignore
          discountRate: product.discountPercent,
          // @ts-ignore
          sellingPrice: product.discountedPrice,
        },
        brandInfo: {
          // @ts-ignore
          id: product.brandId,
          // @ts-ignore
          name: product.brandName,
          // @ts-ignore
          imageURL: product.image?.imageUrl,
        },
      })
    );

    return Response.json({
      products: currentProducts,
      nextPageToken: products[parseInt(pageToken) + 1]
        ? `${parseInt(pageToken) + 1}`
        : undefined,
      pageInfo: {
        totalResults: rawProducts.length,
        resultsPerPage: parseInt(maxResults),
      },
    });
  } catch {
    return new Response("Internal Server Error", { status: 500 });
  }
};

function chunk(data = [], size = 1) {
  return Array.from(
    { length: Math.ceil(data.length / size) }, // 새 배열의 길이를 결정
    (_, index) => data.slice(index * size, (index + 1) * size) // 각 청크를 생성
  );
}
