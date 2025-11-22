import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import logo from "@/assets/logo-toko-aki-new.jpg";

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
  warrantyMonths: number;
  downPayment: number;
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

  const getWarrantyEndDate = (transactionDate: string, months: number) => {
    const date = new Date(transactionDate);
    date.setMonth(date.getMonth() + months);
    return date.toLocaleDateString("id-ID");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div id="invoice-content" className="print:block text-black">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <img src={logo} alt="Logo" className="w-20 h-20" />
              <div>
                <h1 className="text-4xl font-bold text-blue-600 mb-1">Dr. Battery</h1>
                <p className="text-sm text-gray-700">Jl. Raya Banjaran barat no 154  Kab.Bandung</p>
                <p className="text-sm text-gray-700">Telp:085220361903/089677696426</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-700">
                Tanggal: {cart[0]?.transactionDate || new Date().toLocaleDateString("id-ID")}
              </p>
              <p className="text-sm text-gray-700">Bandung</p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-6">
            <div className="border-2 border-gray-800 p-2">
              <p className="text-sm font-semibold text-gray-700">TUAN/TOKO:</p>
              <p className="text-sm text-gray-700 min-h-[20px]">
                {cart[0]?.customerName || "-"}
              </p>
            </div>
          </div>

          {/* Transaction Table */}
          <div className="mb-6">
            <table className="w-full border-collapse border-2 border-gray-800">
              <thead>
                <tr className="bg-gray-700 text-white">
                  <th className="border border-gray-800 px-2 py-1 text-center font-semibold w-[10%]">
                    Banyaknya
                  </th>
                  <th className="border border-gray-800 px-2 py-1 text-center font-semibold w-[50%]">
                    Nama Barang
                  </th>
                  <th className="border border-gray-800 px-2 py-1 text-center font-semibold w-[20%]">
                    Harga
                  </th>
                  <th className="border border-gray-800 px-2 py-1 text-center font-semibold w-[20%]">
                    Jumlah
                  </th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-800 px-2 py-1 text-center text-gray-700">
                      {item.quantity}
                    </td>
                    <td className="border border-gray-800 px-2 py-1 text-gray-700">
                      {item.product.name}
                    </td>
                    <td className="border border-gray-800 px-2 py-1 text-right text-gray-700">
                      {item.customPrice.toLocaleString("id-ID")}
                    </td>
                    <td className="border border-gray-800 px-2 py-1 text-right text-gray-700">
                      {(item.customPrice * item.quantity).toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
                {/* Empty rows for spacing */}
                {[...Array(Math.max(0, 8 - cart.length))].map((_, i) => (
                  <tr key={`empty-${i}`}>
                    <td className="border border-gray-800 px-2 py-2">&nbsp;</td>
                    <td className="border border-gray-800 px-2 py-2">&nbsp;</td>
                    <td className="border border-gray-800 px-2 py-2">&nbsp;</td>
                    <td className="border border-gray-800 px-2 py-2">&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Section */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Left Column - Bank Details and Warranty */}
            <div>
              <div className="border-2 border-gray-800 p-3 mb-3">
                <p className="text-sm font-semibold text-gray-700 mb-2">REKENING BANK:</p>
                <p className="text-sm text-gray-700">BCA: 3370720397</p>
              </div>
              <div className="border-2 border-gray-800 p-3">
                <p className="text-sm font-semibold text-gray-700 mb-2">GARANSI:</p>
                <p className="text-sm text-gray-700">
                  {cart[0]?.warrantyMonths} Bulan
                </p>
                <p className="text-sm text-gray-700">
                  S/d: {cart[0] && getWarrantyEndDate(cart[0].transactionDate, cart[0].warrantyMonths)}
                </p>
              </div>
            </div>

            {/* Right Column - Payment Details */}
            <div>
              <div className="border-2 border-gray-800 p-3 mb-3">
                <div className="flex justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-700">JUMLAH:</p>
                  <p className="text-sm text-gray-700">Rp {getTotalPrice().toLocaleString("id-ID")}</p>
                </div>
                <div className="flex justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-700">UANG MUKA:</p>
                  <p className="text-sm text-gray-700">Rp {(cart[0]?.downPayment || 0).toLocaleString("id-ID")}</p>
                </div>
                <div className="flex justify-between border-t-2 border-gray-800 pt-2">
                  <p className="text-sm font-bold text-gray-700">SISA:</p>
                  <p className="text-sm font-bold text-gray-700">Rp {(getTotalPrice() - (cart[0]?.downPayment || 0)).toLocaleString("id-ID")}</p>
                </div>
              </div>
              
              {/* Signature Section */}
              <div className="border-2 border-gray-800 p-3">
                <p className="text-sm text-center text-gray-700 mb-12">Hormat Kami,</p>
                <p className="text-sm text-center text-gray-700 font-semibold">_____________</p>
              </div>
            </div>
          </div>

          {/* Bottom Note */}
          <div className="text-center text-xs text-gray-500 mt-4">
            <p>Terima kasih atas kunjungan Anda!</p>
            <p>Dr. Battery - Solusi Aki Terpercaya</p>
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
        @page {
          size: landscape;
          margin: 1cm;
        }
        
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