import joinClassNames from '../utils/joinClassNames';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { AiOutlineMenu } from 'react-icons/ai';
import { menu, close } from '../public/assets';

const DashboardNav = ({ page }) => {
  const [active, setActive] = useState('Profile');
  const [toggle, setToggle] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  });

  let navigation = [
    {
      name: 'Profile',
      href: '/profile',
    },
    {
      name: 'Buy Domain',
      href: '/buy-domain',
    },
    {
      name: 'Search',
      href: '/search',
    },
    {
      name: 'Send Tokens',
      href: '/send-tokens',
    },
  ];

  return (
    mounted && (
      <>
        <nav
          className="hidden  py-6 items-center h-[300px] w-[250px] absolute left-0 top-0 right-0 pt-[40px] navbar md:mt-[500px] mt-0 md:border-r-2 md:border-white md:block"
          aria-label="Sidebar"
        >
          <ul className="list-none ml-10 pl-16 flex flex-col sm:flex justify-start items-start gap-6 flex-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-poppins font-normal cursor-pointer text-[16px] ${
                  active === item.name
                    ? 'text-white bg-dashboardnav-gradient p-1 px-6 rounded-xl'
                    : 'text-dimWhite hover:opacity-80'
                } `}
              >
                <span className="truncate">{item.name}</span>
              </Link>
            ))}
          </ul>
        </nav>
        {/* Mobile Menu */}

        <div className="sm:hidden flex flex-1 justify-end items-end mb-[20px] absolute top-20 right-0 mt-[650px] mr-8">
          <Image
            src={toggle ? close : menu}
            alt="menu"
            className="w-[28px] h-[28px] object-contain"
            onClick={() => setToggle(!toggle)}
          />

          <div
            className={`${
              !toggle ? 'hidden' : 'flex'
            } p-6 bg-black-gradient absolute top-20 right-0  mx-4 my-2 min-w-[140px] rounded-xl sidebar`}
          >
            <ul className="list-none flex justify-end items-start flex-1 flex-col">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-poppins font-normal cursor-pointer mb-6 text-[16px] ${
                    active === item.name
                      ? 'text-white bg-dashboardnav-gradient p-1 px-6 rounded-xl cursor-pointer'
                      : 'text-dimWhite hover:opacity-80'
                  } `}
                >
                  <span className="truncate">{item.name}</span>
                </Link>
              ))}
            </ul>
          </div>
        </div>
      </>
    )
  );
};

export default DashboardNav;
