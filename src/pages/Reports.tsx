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

interface SalesReport {
  product_id: string;
  product_name: string;
  product_type: string;
  category: string;
  total_quantity: number;
  total_revenue: number;
  sales_ids: string[]; // Track individual sale IDs for deletion
}

type Period = "week" | "month" | "year";

const Reports = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [period, setPeriod] = useState<Period>("month");
  const [reportData, setReportData] = useState<SalesReport[]>([]);
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
          product_id,
          quantity,
          total_price,
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

      // Aggregate data by product
      const aggregated: { [key: string]: SalesReport } = {};

      salesData?.forEach((sale: any) => {
        const productId = sale.product_id;
        if (!aggregated[productId]) {
          aggregated[productId] = {
            product_id: productId,
            product_name: sale.products.name,
            product_type: sale.products.type,
            category: sale.products.category,
            total_quantity: 0,
            total_revenue: 0,
            sales_ids: [],
          };
        }
        aggregated[productId].total_quantity += sale.quantity;
        aggregated[productId].total_revenue += sale.total_price;
        aggregated[productId].sales_ids.push(sale.id);
      });

      // Convert to array and sort by quantity
      const sorted = Object.values(aggregated).sort(
        (a, b) => b.total_quantity - a.total_quantity
      );

      setReportData(sorted);
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

  const handleDeleteSales = async (salesIds: string[], productName: string) => {
    if (!confirm(`Yakin ingin menghapus semua transaksi penjualan untuk ${productName}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("sales")
        .delete()
        .in("id", salesIds);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Transaksi penjualan berhasil dihapus",
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
              ) : reportData.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Belum ada data penjualan untuk periode ini
                </p>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Rank</TableHead>
                        <TableHead>Nama Produk</TableHead>
                        <TableHead>Tipe</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead className="text-right">Terjual</TableHead>
                        <TableHead className="text-right">Total Pendapatan</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.map((item, index) => (
                        <TableRow key={item.product_id}>
                          <TableCell className="font-bold text-primary">
                            #{index + 1}
                          </TableCell>
                          <TableCell className="font-medium">
                            {item.product_name}
                          </TableCell>
                          <TableCell>{item.product_type}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell className="text-right font-semibold">
                            {item.total_quantity} unit
                          </TableCell>
                          <TableCell className="text-right font-semibold text-primary">
                            Rp {item.total_revenue.toLocaleString("id-ID")}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteSales(item.sales_ids, item.product_name)}
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
