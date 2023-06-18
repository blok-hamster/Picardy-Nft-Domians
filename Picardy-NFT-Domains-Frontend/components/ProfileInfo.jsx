import Head from 'next/head';
import DashboardNav from './DashboardNav';

const ProfileInfo = () => {
  return (
    <div className="flex items-center">
      <Head>
        <title>My Dashboard | Picardy</title>
        <meta name="description" content="Manage your events and RSVPs" />
      </Head>
      <div className="flex flex-wrap px-3 h-full ">
        <DashboardNav />
      </div>
    </div>
  );
};

export default ProfileInfo;
