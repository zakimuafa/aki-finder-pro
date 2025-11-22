import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Printer } from "lucide-react";

interface CartItem {
  product: {
    id: string;
    name: string;
    type: string;
    stock: number;
    category: string;
    price: number;
  };
  quantity: number;
  customPrice: number;
  customerName?: string;
  transactionDate: string;
}

interface InvoiceProps {
  cart: CartItem[];
  total: number;
  onClose: () => void;
}

const Invoice = ({ cart, total, onClose }: InvoiceProps) => {
  const handlePrint = () => {
    window.print();
  };

  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.customPrice * item.quantity,
      0
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div id="invoice-content" className="print:block">
          {/* Invoice Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">INVOICE</h1>
            <h2 className="text-xl font-semibold text-gray-600">Toko Aki</h2>
            <p className="text-sm text-gray-500">
              Tanggal: {new Date().toLocaleDateString("id-ID")}
            </p>
          </div>

          {/* Customer Info */}
          {cart[0]?.customerName && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">Kepada:</h3>
              <p className="text-gray-600">{cart[0].customerName}</p>
            </div>
          </div>

          {/* Transaction Table */}
          <div className="mb-6">
            <table className="w-full border-collapse border-2 border-gray-800">
              <thead>
                <tr className="bg-gray-700 text-white">
                  <th className="border border-gray-800 px-3 py-2 text-center font-semibold">
                    Banyaknya
                  </th>
                  <th className="border border-gray-800 px-3 py-2 text-center font-semibold">
                    Nama Barang
                  </th>
                  <th className="border border-gray-800 px-3 py-2 text-center font-semibold">
                    Harga
                  </th>
                  <th className="border border-gray-800 px-3 py-2 text-center font-semibold">
                    Jumlah
                  </th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-800 px-3 py-2 text-center">
                      {item.quantity}
                    </td>
                    <td className="border border-gray-800 px-3 py-2">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-xs text-gray-600">{item.product.type}</p>
                    </td>
                    <td className="border border-gray-800 px-3 py-2 text-right">
                      {item.customPrice.toLocaleString("id-ID")}
                    </td>
                    <td className="border border-gray-800 px-3 py-2 text-right">
                      {(item.customPrice * item.quantity).toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
                {/* Empty rows for spacing */}
                {[...Array(Math.max(0, 8 - cart.length))].map((_, i) => (
                  <tr key={`empty-${i}`}>
                    <td className="border border-gray-800 px-3 py-4">&nbsp;</td>
                    <td className="border border-gray-800 px-3 py-4">&nbsp;</td>
                    <td className="border border-gray-800 px-3 py-4">&nbsp;</td>
                    <td className="border border-gray-800 px-3 py-4">&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 mt-8">
            <p>Terima kasih atas kunjungan Anda!</p>
            <p>Toko Aki - Solusi Aki Terpercaya</p>
          </div>
        </div>

        {/* Print Button - Hidden when printing */}
        <div className="flex justify-center gap-4 mt-6 print:hidden">
          <Button onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Cetak Invoice
          </Button>
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-content,
          #invoice-content * {
            visibility: visible;
          }
          #invoice-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Invoice;
