import data from "./data.json";

export const GET = (req: Request, res: Response) => {
  try {
    const themes = data.data.map(({ theme }) => ({
      id: theme.id,
      key: theme.linkUrl.split("/")[3],
      label: theme.name,
      imageURL: theme.images[0],
      title: theme.title,
      description: theme.description,
      backgroundColor: theme.backgroundColor,
    }));

    return Response.json({
      themes,
    });
  } catch {
    return new Response("Internal Server Error", { status: 500 });
  }
};
