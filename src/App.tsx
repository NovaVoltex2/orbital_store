import { Route, Routes } from 'react-router'
import AuthLayout from './admin/AuthLayout'
import DashboardPage from './admin/dashboard/pages'
import ProductsPage from './admin/product-management/pages'
import ProductDetailsPage from './admin/product-management/details/pages'
import LoginPage from './admin/login'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/admin" element={<AuthLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="product/:id" element={<ProductDetailsPage />} />
      </Route>
    </Routes>
  )
}

export default App
