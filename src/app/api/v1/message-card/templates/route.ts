import data from "./data.json";

export const GET = async (req: Request) => {
  try {
    const templateList = data.data.map(({ templates }) => templates);

    const templates = templateList.flat();

    return Response.json({ templates });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
};
