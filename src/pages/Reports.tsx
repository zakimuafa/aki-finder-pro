import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart3, TrendingUp, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SaleTransaction {
  id: string;
  product_name: string;
  product_type: string;
  category: string;
  customer_name: string | null;
  sale_date: string;
  quantity: number;
  total_price: number;
}

type Period = "week" | "month" | "year";

const Reports = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [period, setPeriod] = useState<Period>("month");
  const [transactions, setTransactions] = useState<SaleTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/auth");
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      loadReport();
    }
  }, [user, isAdmin, period]);

  const getDateFilter = () => {
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return startDate.toISOString();
  };

  const loadReport = async () => {
    setIsLoading(true);
    try {
      const startDate = getDateFilter();

      const { data: salesData, error } = await supabase
        .from("sales")
        .select(
          `
          id,
          quantity,
          total_price,
          customer_name,
          sale_date,
          products (
            name,
            type,
            category
          )
        `
        )
        .gte("sale_date", startDate)
        .order("sale_date", { ascending: false });

      if (error) throw error;

      // Map to transaction format
      const transactions: SaleTransaction[] =
        salesData?.map((sale: any) => ({
          id: sale.id,
          product_name: sale.products.name,
          product_type: sale.products.type,
          category: sale.products.category,
          customer_name: sale.customer_name,
          sale_date: sale.sale_date,
          quantity: sale.quantity,
          total_price: sale.total_price,
        })) || [];

      setTransactions(transactions);
    } catch (error) {
      console.error("Error loading report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPeriodLabel = () => {
    switch (period) {
      case "week":
        return "Minggu Ini";
      case "month":
        return "Bulan Ini";
      case "year":
        return "Tahun Ini";
    }
  };

  const handleDeleteTransaction = async (
    transactionId: string,
    productName: string
  ) => {
    if (!confirm(`Yakin ingin menghapus transaksi ${productName}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("sales")
        .delete()
        .eq("id", transactionId);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Transaksi berhasil dihapus",
      });

      loadReport();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
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
            <BarChart3 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-secondary">
              Laporan Penjualan
            </h1>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Produk Terlaris - {getPeriodLabel()}
                </CardTitle>
                <Select
                  value={period}
                  onValueChange={(value) => setPeriod(value as Period)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Minggu Ini</SelectItem>
                    <SelectItem value="month">Bulan Ini</SelectItem>
                    <SelectItem value="year">Tahun Ini</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center text-muted-foreground py-8">
                  Loading...
                </p>
              ) : transactions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Belum ada data penjualan untuk periode ini
                </p>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Nama Produk</TableHead>
                        <TableHead>Tipe</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead className="text-right">Jumlah</TableHead>
                        <TableHead className="text-right">Total Harga</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            {new Date(transaction.sale_date).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {transaction.product_name}
                          </TableCell>
                          <TableCell>{transaction.product_type}</TableCell>
                          <TableCell>{transaction.category}</TableCell>
                          <TableCell>
                            {transaction.customer_name || "-"}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {transaction.quantity} unit
                          </TableCell>
                          <TableCell className="text-right font-semibold text-primary">
                            Rp {transaction.total_price.toLocaleString("id-ID")}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleDeleteTransaction(
                                  transaction.id,
                                  transaction.product_name
                                )
                              }
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;
