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
      <div className="bg-white p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div id="invoice-content" className="print:block text-black print:text-[11px]">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo" className="w-16 h-16" />
              <div>
                <h1 className="text-2xl font-bold text-blue-600 mb-1">Dr. Battery</h1>
                <p className="text-xs text-gray-700">Jl. Raya Banjaran barat no 154  Kab.Bandung</p>
                <p className="text-xs text-gray-700">Telp:085220361903/089677696426</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-700">
                Tanggal: {cart[0]?.transactionDate ? new Date(cart[0].transactionDate).toLocaleDateString("id-ID", { day: '2-digit', month: '2-digit', year: 'numeric' }) : new Date().toLocaleDateString("id-ID", { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </p>
              <p className="text-xs text-gray-700">Bandung</p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-3">
            <div className="border-2 border-gray-800 p-1.5">
              <p className="text-xs font-semibold text-gray-700">TUAN/TOKO:</p>
              <p className="text-xs text-gray-700 min-h-[16px]">
                {cart[0]?.customerName || "-"}
              </p>
            </div>
          </div>

          {/* Transaction Table */}
          <div className="mb-3">
            <table className="w-full border-collapse border-2 border-gray-800 text-xs">
              <thead>
                <tr className="bg-gray-200 text-black">
                  <th className="border border-gray-800 px-1.5 py-0.5 text-center font-semibold w-[10%]">
                    Banyaknya
                  </th>
                  <th className="border border-gray-800 px-1.5 py-0.5 text-center font-semibold w-[50%]">
                    Nama Barang
                  </th>
                  <th className="border border-gray-800 px-1.5 py-0.5 text-center font-semibold w-[20%]">
                    Harga
                  </th>
                  <th className="border border-gray-800 px-1.5 py-0.5 text-center font-semibold w-[20%]">
                    Jumlah
                  </th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-800 px-1.5 py-0.5 text-center text-gray-700">
                      {item.quantity}
                    </td>
                    <td className="border border-gray-800 px-1.5 py-0.5 text-gray-700">
                      {item.product.name}
                    </td>
                    <td className="border border-gray-800 px-1.5 py-0.5 text-right text-gray-700">
                      {item.customPrice.toLocaleString("id-ID")}
                    </td>
                    <td className="border border-gray-800 px-1.5 py-0.5 text-right text-gray-700">
                      {(item.customPrice * item.quantity).toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
                {/* Empty rows for spacing */}
                {[...Array(Math.max(0, 3 - cart.length))].map((_, i) => (
                  <tr key={`empty-${i}`}>
                    <td className="border border-gray-800 px-1.5 py-1">&nbsp;</td>
                    <td className="border border-gray-800 px-1.5 py-1">&nbsp;</td>
                    <td className="border border-gray-800 px-1.5 py-1">&nbsp;</td>
                    <td className="border border-gray-800 px-1.5 py-1">&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Section */}
          <div className="mb-3">
            <div className="grid grid-cols-2 gap-2">
              {/* Left Column - Bank Details and Warranty */}
              <div className="space-y-2">
                <div className="border-2 border-gray-800 p-1.5">
                  <p className="text-xs font-semibold text-gray-700 mb-1">REKENING BANK:</p>
                  <p className="text-xs text-gray-700">BCA: 3370720397</p>
                </div>
                <div className="border-2 border-gray-800 p-1.5">
                  <p className="text-xs font-semibold text-gray-700 mb-1">GARANSI:</p>
                  <p className="text-xs text-gray-700">
                    {cart[0]?.warrantyMonths} Bulan
                  </p>
                  <p className="text-xs text-gray-700">
                    S/d: {cart[0] && getWarrantyEndDate(cart[0].transactionDate, cart[0].warrantyMonths)}
                  </p>
                </div>
              </div>

              {/* Right Column - Payment Details */}
              <div className="h-full">
                <div className="border-2 border-gray-800 p-1.5 h-full flex flex-col justify-between">
                  <div className="flex justify-between">
                    <p className="text-sm font-semibold text-gray-700">UANG MUKA:</p>
                    <p className="text-sm text-gray-700">Rp {(cart[0]?.downPayment || 0).toLocaleString("id-ID")}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm font-semibold text-gray-700">JUMLAH:</p>
                    <p className="text-sm text-gray-700">Rp {getTotalPrice().toLocaleString("id-ID")}</p>
                  </div>
                  <div className="flex justify-between border-t-2 border-gray-800 pt-1 mt-1">
                    <p className="text-sm font-bold text-gray-700">TOTAL:</p>
                    <p className="text-sm font-bold text-gray-700">Rp {(getTotalPrice() - (cart[0]?.downPayment || 0)).toLocaleString("id-ID")}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Signature Row */}
            <div className="mt-4 flex justify-between px-8">
              <div className="w-1/2 text-center">
                <p className="text-xs text-gray-700 mb-8">Penerima,</p>
                <p className="text-xs text-gray-700 font-semibold">_____________</p>
              </div>
              <div className="w-1/2 text-center">
                <p className="text-xs text-gray-700 mb-8">Hormat Kami,</p>
                <p className="text-xs text-gray-700 font-semibold">_____________</p>
              </div>
            </div>
          </div>

          {/* Bottom Note */}
          <div className="text-center text-[10px] text-gray-500 mt-2">
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