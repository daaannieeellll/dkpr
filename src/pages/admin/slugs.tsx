import AliasListItem from "../../components/aliasListItem";
import AdminLayout from "../../components/layouts/admin";
import { api } from "../../utils/api";
import { type NextPageWithLayout } from "../_app";

const Slugs: NextPageWithLayout = () => {
  const { data } = api.urls.getAllURLs.useQuery();

  const createURL = api.urls.createShortUrl.useMutation();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const url = formData.get("url") as string;
    const slug = formData.get("slug") as string;
    if (url && slug) {
      createURL.mutate({ url, slug });
    }
  };
  return (
    <>
      <section className="font-code text-white">
        <h2 className="font-medium">Create a new short url</h2>
        <form onSubmit={onSubmit} className="flex flex-col gap-2">
          <label htmlFor="url">URL</label>
          <input type="text" name="url" id="url" className="bg-neutral-900" />
          <label htmlFor="slug">Slug</label>
          <input type="text" name="slug" id="slug" className="bg-neutral-900" />
          <button type="submit">Create</button>
        </form>
      </section>

      <section className="divide-y divide-gray-300">
        {data &&
          data.map((shortUrl, idx) => (
            <>
              <AliasListItem key={idx} shortUrl={shortUrl} />
            </>
          ))}
      </section>
    </>
  );
};

Slugs.getLayout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
export default Slugs;
