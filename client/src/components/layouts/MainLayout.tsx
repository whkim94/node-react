import { ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CiSearch, CiDark } from "react-icons/ci";
import { VscSettings } from 'react-icons/vsc';
import { IoNotificationsOutline, IoSettingsOutline } from "react-icons/io5";
import { logout } from '../../store/slices/authSlice';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
}

const MainLayout = ({ children, title = 'Dashboard' }: MainLayoutProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="flex w-full h-full bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-gradient-to-b from-indigo-100 to-indigo-300 p-4 rounded-l-lg">
          <div className="text-center m-4 p-6 bg-white rounded-lg">
            <div className="text-2xl font-bold text-gray-500">LOGO</div>
          </div>
          <nav className="pl-4 mt-6">
            <div className="text-gray-500 text-sm font-semibold mb-8">Menu</div>
            <ul>
              <li className="mb-2 flex items-center">
                <div className="w-3 mr-3"></div>
                <a href="#" className="text-black">Home</a>
              </li>
              <li className="mb-2 flex items-center">
                <svg className="fill-current w-3 h-3 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                  <path d="M285.476 272.971L91.476 466.971C84.686 473.761 73.314 473.761 66.524 466.971L34.524 434.971C27.734 428.181 27.734 416.809 34.524 410.019L194.505 250.038 34.524 90.057C27.734 83.267 27.734 71.895 34.524 65.105L66.524 33.105C73.314 26.315 84.686 26.315 91.476 33.105L285.476 227.105C292.266 233.895 292.266 245.267 285.476 252.057L285.476 272.971z"/>
                </svg>
                <a href="#" className="text-black font-semibold">Invoices</a>
              </li>
              <li className="mb-2 flex items-center">
                <svg className="fill-current w-3 h-3 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                  <path d="M285.476 272.971L91.476 466.971C84.686 473.761 73.314 473.761 66.524 466.971L34.524 434.971C27.734 428.181 27.734 416.809 34.524 410.019L194.505 250.038 34.524 90.057C27.734 83.267 27.734 71.895 34.524 65.105L66.524 33.105C73.314 26.315 84.686 26.315 91.476 33.105L285.476 227.105C292.266 233.895 292.266 245.267 285.476 252.057L285.476 272.971z"/>
                </svg>
                <a href="#" className="text-black">Bills</a>
              </li>
              <li className="mb-2 flex items-center">
                <svg className="fill-current w-3 h-3 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                  <path d="M285.476 272.971L91.476 466.971C84.686 473.761 73.314 473.761 66.524 466.971L34.524 434.971C27.734 428.181 27.734 416.809 34.524 410.019L194.505 250.038 34.524 90.057C27.734 83.267 27.734 71.895 34.524 65.105L66.524 33.105C73.314 26.315 84.686 26.315 91.476 33.105L285.476 227.105C292.266 233.895 292.266 245.267 285.476 252.057L285.476 272.971z"/>
                </svg>
                <a href="#" className="text-black">Expenses</a>
              </li>
              <li className="mb-2 flex items-center">
                <svg className="fill-current w-3 h-3 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                  <path d="M285.476 272.971L91.476 466.971C84.686 473.761 73.314 473.761 66.524 466.971L34.524 434.971C27.734 428.181 27.734 416.809 34.524 410.019L194.505 250.038 34.524 90.057C27.734 83.267 27.734 71.895 34.524 65.105L66.524 33.105C73.314 26.315 84.686 26.315 91.476 33.105L285.476 227.105C292.266 233.895 292.266 245.267 285.476 252.057L285.476 272.971z"/>
                </svg>
                <a href="#" className="text-black">Reports</a>
              </li>
              <li className="mt-8">
                <button 
                  onClick={handleLogout}
                  className="text-red-600 font-semibold hover:text-red-800"
                >
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </aside>
        
        {/* Main Content */}
        <div className="flex-1 pt-1 bg-gradient-to-b from-indigo-100 to-indigo-300">
          <main className="flex-1 bg-gray-50 rounded-3xl h-full">
            <div className="flex justify-between py-8 px-16 items-center">
              <nav className="text-base text-gray-600" aria-label="Breadcrumb">
                <ol className="list-none p-0 inline-flex">
                  <li className="flex items-center">
                    <div className="bg-gray-200 p-2 rounded-md mr-6">
                      <svg className="w-4 h-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                      </svg>
                    </div>
                    <a href="#" className="text-gray-600 hover:text-gray-900 text-lg">Home</a>
                  </li>
                  <li className="flex items-center">
                    <span className="mx-4">/</span>
                    <a href="#" className="text-gray-600 hover:text-gray-900 text-lg">
                      {title}
                    </a>
                  </li>
                </ol>
              </nav>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search" 
                    className="bg-gray-100 border rounded-full py-2 px-4 pl-10 w-96 focus:outline-none focus:ring-2 focus:ring-indigo-300" 
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <CiSearch/>
                  </div>

                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <VscSettings/>
                  </div>
                </div>

                <IoNotificationsOutline className="w-6 h-6 text-gray-600"/>
                <IoSettingsOutline className="w-6 h-6 text-gray-600"/>
                <CiDark className="w-6 h-6 text-gray-600"/>
                <img src="https://media.licdn.com/dms/image/v2/D5603AQFag4njl0dekg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1719606434720?e=1748476800&v=beta&t=qWc9dfs2KZUFp8Sl18wd2ryPbg9Z34c_gSwi2Ine_Ik" alt="user" className="w-10 h-10 rounded-full" />
              </div>
            </div>
            
            <hr className="mb-12 border-gray-200" />
            
            {/* Page Content */}
            <div className="px-16 pb-16">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout; 