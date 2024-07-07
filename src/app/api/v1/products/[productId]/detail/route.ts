import axios from "axios";
import crypto from "crypto";
import https from "https";

export const GET = async (
  req: Request,
  { params }: { params: { productId: string } }
) => {
  const productId = params.productId;

  if (!productId) {
    return new Response("Bad Request", { status: 400 });
  }

  try {
    const { data } = await axios.get(
      `https://gift.kakao.com/a/v2/products/${productId}`,
      {
        httpsAgent: new https.Agent({
          secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const { itemDetails, itemTerms } = data;

    const detail = {
      id: itemDetails.item.id,
      name: itemDetails.item.name,
      imageURL: itemDetails.item.imageUrl,
      wish: {
        isWished: false,
        wishCount: 0,
      },
      price: {
        basicPrice: itemDetails.item.basicPrice,
        discountRate: itemDetails.item.discountRate,
        sellingPrice: itemDetails.item.sellingPrice,
      },
      brandInfo: {
        id: itemDetails.brand.id,
        name: itemDetails.brand.name,
        imageURL: itemDetails.brand.thumbnailUrl,
      },
      isAccessableProductPage: true,
      review: {
        averageRating: itemDetails.review.averageProductRating,
        totalReviewCount: itemDetails.review.totalCount,
      },
      productDescription: {
        displayText:
          itemDetails.item?.usageGuide ?? itemDetails.item?.voucherGuideMessage,
        displayImage: itemDetails.item?.productDetailDescription,
      },
      productDetailInfo: {
        announcements: itemDetails.item.announcements,
        terms: itemTerms,
      },
    };

    return Response.json({ detail });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
};
