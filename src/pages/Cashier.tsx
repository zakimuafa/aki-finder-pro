import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Trash2, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Invoice from "@/components/Invoice";

interface Product {
  id: string;
  name: string;
  type: string;
  stock: number;
  category: string;
  price: number;
}

interface CartItem {
  product: Product;
  quantity: number;
  customPrice: number;
  customerName?: string;
  transactionDate: string;
  warrantyMonths: number;
  downPayment: number;
}

const Cashier = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [open, setOpen] = useState(false);
  const [customPrice, setCustomPrice] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [warrantyMonths, setWarrantyMonths] = useState<number>(6);
  const [downPayment, setDownPayment] = useState("");
  const [showInvoice, setShowInvoice] = useState(false);
  const [processedCart, setProcessedCart] = useState<CartItem[]>([]);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/auth");
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      loadProducts();
    }
  }, [user, isAdmin]);

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .gt("stock", 0)
      .order("name");

    if (!error && data) {
      setProducts(data);
    }
  };

  const addToCart = () => {
    if (!selectedProductId) {
      toast({
        title: "Error",
        description: "Pilih produk terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    if (!customPrice || parseFloat(customPrice) <= 0) {
      toast({
        title: "Error",
        description: "Masukkan harga yang valid",
        variant: "destructive",
      });
      return;
    }

    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;

    if (quantity > product.stock) {
      toast({
        title: "Error",
        description: "Stok tidak mencukupi",
        variant: "destructive",
      });
      return;
    }

    const customPriceNum = parseFloat(customPrice);
    const customerNameStr = customerName.trim() || undefined;
    const downPaymentNum = downPayment ? parseFloat(downPayment) : 0;

    const existingItem = cart.find((item) => item.product.id === product.id);
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        toast({
          title: "Error",
          description: "Stok tidak mencukupi",
          variant: "destructive",
        });
        return;
      }
      setCart(
        cart.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: newQuantity,
                customPrice: customPriceNum,
                customerName: customerNameStr,
                transactionDate,
                warrantyMonths,
                downPayment: downPaymentNum,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          product,
          quantity,
          customPrice: customPriceNum,
          customerName: customerNameStr,
          transactionDate,
          warrantyMonths,
          downPayment: downPaymentNum,
        },
      ]);
    }

    setSelectedProductId("");
    setQuantity(1);
    setCustomPrice("");
    setCustomerName("");
    setTransactionDate(new Date().toISOString().split("T")[0]);
    setWarrantyMonths(6);
    setDownPayment("");
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.customPrice * item.quantity,
      0
    );
  };

  const processTransaction = async () => {
    if (cart.length === 0) {
      toast({
        title: "Error",
        description: "Keranjang kosong",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Insert sales records
      const salesData = cart.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        total_price: item.customPrice * item.quantity,
        created_by: user?.id,
        customer_name: item.customerName,
        sale_date: item.transactionDate,
        warranty_months: item.warrantyMonths,
        down_payment: item.downPayment,
      }));

      const { error } = await supabase.from("sales").insert(salesData);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Transaksi berhasil diproses",
      });

      // Show invoice with the processed cart
      setProcessedCart([...cart]);
      setShowInvoice(true);

      setCart([]);
      loadProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Loading...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-2 mb-8">
            <ShoppingCart className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-secondary">Kasir</h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Input Form */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-foreground">Tambah Produk</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product">Produk</Label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                      >
                        {selectedProductId
                          ? products.find(
                              (product) => product.id === selectedProductId
                            )?.name
                          : "Pilih produk..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Cari produk..." />
                        <CommandEmpty>Tidak ada produk ditemukan.</CommandEmpty>
                        <CommandGroup>
                          {products.map((product) => (
                            <CommandItem
                              key={product.id}
                              value={product.name}
                              onSelect={() => {
                                setSelectedProductId(
                                  selectedProductId === product.id
                                    ? ""
                                    : product.id
                                );
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedProductId === product.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {product.name} - {product.type} (Stok:{" "}
                              {product.stock})
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Jumlah</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customPrice">Harga</Label>
                  <Input
                    id="customPrice"
                    type="number"
                    min="0"
                    placeholder="Masukkan harga"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerName">
                    Nama Tuan/Toko (Opsional)
                  </Label>
                  <Input
                    id="customerName"
                    type="text"
                    placeholder="Masukkan nama tuan atau toko"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transactionDate">Tanggal Transaksi</Label>
                  <Input
                    id="transactionDate"
                    type="date"
                    value={transactionDate}
                    onChange={(e) => setTransactionDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warranty">Garansi</Label>
                  <Select
                    value={warrantyMonths.toString()}
                    onValueChange={(value) => setWarrantyMonths(Number(value))}
                  >
                    <SelectTrigger id="warranty">
                      <SelectValue placeholder="Pilih garansi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 Bulan</SelectItem>
                      <SelectItem value="12">12 Bulan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="downPayment">Uang Muka (Opsional)</Label>
                  <Input
                    id="downPayment"
                    type="number"
                    min="0"
                    placeholder="Masukkan uang muka"
                    value={downPayment}
                    onChange={(e) => setDownPayment(e.target.value)}
                  />
                </div>

                <Button onClick={addToCart} className="w-full">
                  Tambah ke Keranjang
                </Button>
              </CardContent>
            </Card>

            {/* Cart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Keranjang ({cart.length} item)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Keranjang kosong
                  </p>
                ) : (
                  <>
                    <div className="space-y-2 mb-6">
                      {cart.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">
                              {item.product.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {item.product.type} - {item.product.category}
                            </p>
                            {item.customerName && (
                              <p className="text-sm text-foreground font-medium">
                                Customer: {item.customerName}
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground">
                              Tanggal:{" "}
                              {new Date(
                                item.transactionDate
                              ).toLocaleDateString("id-ID")}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Garansi: {item.warrantyMonths} bulan
                            </p>
                            {item.downPayment > 0 && (
                              <p className="text-sm text-foreground font-medium">
                                Uang Muka: Rp {item.downPayment.toLocaleString("id-ID")}
                              </p>
                            )}
                            <p className="text-sm text-foreground">
                              Rp {item.customPrice!.toLocaleString("id-ID")} x{" "}
                              {item.quantity}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="font-bold text-foreground">
                              Rp{" "}
                              {(
                                item.customPrice * item.quantity
                              ).toLocaleString("id-ID")}
                            </p>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromCart(item.product.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-foreground">
                          Total
                        </h3>
                        <p className="text-2xl font-bold text-primary">
                          Rp {getTotalPrice().toLocaleString("id-ID")}
                        </p>
                      </div>
                      <Button
                        onClick={processTransaction}
                        disabled={isProcessing}
                        className="w-full"
                        size="lg"
                      >
                        {isProcessing ? "Memproses..." : "Proses Transaksi"}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {showInvoice && (
        <Invoice
          cart={processedCart}
          total={processedCart.reduce(
            (total, item) => total + item.customPrice * item.quantity,
            0
          )}
          onClose={() => setShowInvoice(false)}
        />
      )}
    </div>
  );
};

export default Cashier;
