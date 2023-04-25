import AdminLayout from "../../components/layouts/admin";
import { type NextPageWithLayout } from "../_app";

const Admin: NextPageWithLayout = () => {
  return (
    <div className="text-white">
      <section>
        <h1 className="font-code text-xl">Admin Dashboard</h1>
      </section>
    </div>
  );
};

Admin.getLayout = (page: React.ReactNode) => (
  <AdminLayout>
    <>{page}</>
  </AdminLayout>
);
export default Admin;
