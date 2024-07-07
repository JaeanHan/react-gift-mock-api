import axios from "axios";
import crypto from "crypto";
import https from "https";

export const GET = async (
  req: Request,
  { params }: { params: { productId: string } }
) => {
  const productId = params.productId;

  const axiosConfig = {
    httpsAgent: new https.Agent({
      secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  if (!productId) {
    return new Response("Bad Request", { status: 400 });
  }

  try {
    const [{ data: detailData }, { data: optionsData }] = await Promise.all([
      axios.get(
        `https://gift.kakao.com/a/v2/products/${productId}`,
        axiosConfig
      ),
      axios.get(
        `https://gift.kakao.com/a/v1/products/${productId}/options`,
        axiosConfig
      ),
    ]);

    const options = {
      productId: detailData.itemDetails.item.id,
      productName: detailData.itemDetails.item.name,
      productPrice: detailData.itemDetails.item.sellingPrice,
      hasOption: detailData.itemDetails.item.hasOption,
      giftOrderLimit: 100,
      names: optionsData.names,
      options: optionsData.combinationOptions,
    };

    return Response.json({ options });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
};
