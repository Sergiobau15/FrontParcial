import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ProductoForm from './pages/products/admin/registro';
import AdministradorConsultaProducto from './pages/products/admin/consulta';
import ClienteConsulta from './pages/products/cliente/consulta';
import ClienteConsultaEspecifica from './pages/products/cliente/consultaEspecifica';
import PaginaPrincipal from './pages/products/index/consulta';
import IndexConsultaEspecifica from './pages/products/index/consultaEspecifica';
import Create from './pages/user/Create';
import Login from './pages/user/Login';
import WelcomeCashier from './pages/user/cashier/WelcomeCashier';
import WelcomeAdmin from './pages/user/admin/WelcomeAdmin';
import AdminUsers from './pages/user/admin/AdminUsers';
import RegisterUser from './pages/user/admin/RegisterUser';
import UpdateUserForm from './pages/user/admin/UpdateUserForm';
import WelcomeStorekeeper from './pages/user/storekeeper/WelcomeStorekeeper';
import Rpedido from './pages/orders/Rpedido';
import Cpedido from './pages/orders/Cpedido';
import Rventa from './pages/sale/Rventa';
import Cventa from './pages/sale/Cventa';
import CartPage from './pages/CartPage';
import UserProfile from './pages/user/UserProfile';
import Footer from './components/Footer';
import DetallesVenta from './pages/sale/detalles';
import { CartProvider } from './pages/CartContext';
import OrdersPage from './pages/orders/OrdersPage';
import PedidosCliente from './pages/products/cliente/PedidosCliente';
import ContraNueva from './pages/user/contraNueva';
import AdministradorConsultaProductoInactivo from './pages/products/admin/consultaInactivo';
import CategoriaForm from './pages/products/admin/registroCategoria';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Router>
      <CartProvider>
        <Routes>
          <Route path="/registrarProducto" element={<ProductoForm />} />
          <Route path="/consultaProducto" element={<AdministradorConsultaProducto />} />
          <Route path="/consultaProductoCliente" element={<ClienteConsulta />} />
          <Route path="/consultaEspecificaCliente/:id" element={<ClienteConsultaEspecifica />} />
          <Route path="/" element={<PaginaPrincipal />} />
          <Route path="/consultaEspecificaIndex/:id" element={<IndexConsultaEspecifica />} />
          <Route path="/registroUsuarioCliente" element={<Create />} />
          <Route path="/login" element={<Login />} />
          <Route path="/clienteProfile" element={<UserProfile />} />
          <Route path="/bienvenidaCajero" element={<WelcomeCashier />} />
          <Route path="/bienvenidaAdministrador" element={<WelcomeAdmin />} />
          <Route path="/usuarios" element={<AdminUsers />} />
          <Route path="/registroUsuarioAdministrador" element={<RegisterUser />} />
          <Route path="/user/admin/update/:userId" element={<UpdateUserForm />} />
          <Route path="/bienvenidaAlmacenista" element={<WelcomeStorekeeper />} />
          <Route path='/user/rpedido' element={<Rpedido />} />
          <Route path='/user/cpedido' element={<Cpedido />} />
          <Route path='/user/rventa' element={<Rventa />} />
          <Route path='/user/cventa' element={<Cventa />} />
          <Route path='/cart' element={<CartPage />} />
          <Route path='/usuarioPerfil/:id' element={<UserProfile />} />
          <Route path='/registroVenta' element={<Rventa />} />
          <Route path='/user/detallesVenta/:id' element={<DetallesVenta />}/>
          <Route path='/ordenes' element={<OrdersPage />}  />
          <Route path="/pedidoCliente" element={<PedidosCliente />} />
          <Route path="/nuevaClave" element={<ContraNueva />} />
          <Route path="/productosInactivos" element={<AdministradorConsultaProductoInactivo />} />
          <Route path="/registrarCategoria" element={<CategoriaForm />} />


        </Routes>
        <Footer />
      </CartProvider>
      </Router>
    </div>
  );
}

export default App;

