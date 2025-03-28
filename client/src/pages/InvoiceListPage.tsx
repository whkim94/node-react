import MainLayout from '../components/layouts/MainLayout';
import InvoiceList from '../components/InvoiceList';

const InvoiceListPage = () => {
  return (
    <MainLayout title="Invoices">
      <InvoiceList />
    </MainLayout>
  );
};

export default InvoiceListPage; 