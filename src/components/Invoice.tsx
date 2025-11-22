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
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-start gap-4">
              <img src="/logo-toko-aki.png" alt="Logo" className="w-20 h-20" />
              <div>
                <h1 className="text-4xl font-bold text-blue-600 mb-1">Dr. Battery</h1>
                <div className="text-xs text-gray-600 space-y-0.5">
                  <p># WET BATTERY (AKI BASAH)</p>
                  <p># HYBRID (RENDAH PERAWATAN)</p>
                  <p># MF BATTERY KERING</p>
                </div>
                <p className="text-sm mt-2 text-gray-700">
                  ☎ 085 220 361 903 , 089 677 696 426
                </p>
              </div>
            </div>
            <div className="text-right text-sm">
              <p className="mb-2">
                Bandung, {cart[0]?.transactionDate ? new Date(cart[0].transactionDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "..........................."} {new Date().getFullYear()} ...........
              </p>
              <div className="border-t border-gray-400 pt-2 mt-2">
                <p className="font-semibold">TUAN</p>
                <p className="font-semibold">TOKO</p>
              </div>
              <p className="mt-2 border-t border-gray-400 pt-2">
                {cart[0]?.customerName || "......................................................."}
              </p>
              <p className="border-t border-gray-400 pt-2 mt-2">
                .......................................................
              </p>
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

          {/* Footer Section */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-semibold mb-1">Nomor Rekening</p>
              <p className="text-blue-600 font-semibold">BCA.337 0720397</p>
              <p className="text-xs">a.n Dany Ramdani</p>
            </div>
            <div className="text-center">
              <p className="mb-1">Garansi :</p>
              <p className="mb-4">Bulan :</p>
              <p className="text-xs mt-8">Penerima,</p>
            </div>
            <div className="text-right">
              <p className="font-semibold mb-1">Jumlah</p>
              <p className="font-semibold mb-1">Uang Muka</p>
              <p className="border-t border-gray-400 pt-1 font-bold text-lg">
                {getTotalPrice().toLocaleString("id-ID")}
              </p>
              <p className="font-semibold mb-1">Sisa</p>
              <p className="border-t border-gray-400 pt-1"></p>
              <p className="text-xs mt-4">Hormat Kami,</p>
            </div>
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
