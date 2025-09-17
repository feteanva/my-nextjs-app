import { redirect } from "next/navigation";

const DashboardPage = () => {
  redirect("/dashboard/settings");
  return null;
};

export default DashboardPage;
