import AliasListItem from "../../components/aliasListItem";
import { api } from "../../utils/api";

const Admin = () => {
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
        <div>
            <section>
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p>Here you can create new short urls and view stats for existing ones.</p>
            </section>

            <section>
                <h2>Create a new short url</h2>
                <form onSubmit={onSubmit}>
                    <label htmlFor="url">URL</label>
                    <input type="text" name="url" id="url" />
                    <label htmlFor="slug">Slug</label>
                    <input type="text" name="slug" id="slug" />
                    <button type="submit">Create</button>
                </form>
            </section>

            <section className="divide-y divide-gray-300">
                {data && data
                    .map((shortUrl, idx) => (
                        <AliasListItem key={idx} shortUrl={shortUrl} />
                    ))}
            </section>
        </div>
    );
};

export default Admin;