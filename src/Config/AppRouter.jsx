import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Signup from '../Pages/Signup'
import Login from '../Pages/Login'
import Navbar from '../Component/Navbar'
import Dashboard from '../Pages/Dasboard'
import Create from '../Pages/Create'
import About from '../Pages/About'
import Contact from '../Pages/Contact'

function Layout() {
  const location = useLocation();

  const hideNavbarRoutes = ['/signup', '/login',];

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path='/' element ={<Dashboard />} />
        {/* <Route path='/' element={<Signup />} /> */}
        <Route path='/signup' element={<Signup />} />
        <Route path='/create' element={<Create />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dash' element={<Dashboard />} />
      </Routes>
    </>
  );
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default AppRouter;