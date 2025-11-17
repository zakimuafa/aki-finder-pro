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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, LogOut } from "lucide-react";
import { z } from "zod";

const categories = [
  "Aki Motor",
  "Aki Mobil",
  "Aki Second",
  "Klem",
  "Kondom",
  "Kabel Paralel",
  "Aki Bekas",
];

const productSchema = z.object({
  name: z.string().trim().min(1, "Nama produk tidak boleh kosong").max(200),
  type: z.string().trim().min(1, "Tipe tidak boleh kosong").max(100),
  stock: z.number().int().min(0, "Stok harus positif"),
  category: z.string().min(1, "Kategori harus dipilih"),
});

interface Product {
  id: string;
  name: string;
  type: string;
  stock: number;
  category: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading, signOut } = useAuth();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    stock: "" as string | number,
    category: "",
  });

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
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProducts(data);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      stock: 0,
      category: "",
    });
    setEditingId(null);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = productSchema.safeParse({
      ...formData,
      stock: formData.stock === "" ? 0 : Number(formData.stock),
    });
    if (!validation.success) {
      const newErrors: { [key: string]: string } = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) newErrors[err.path[0].toString()] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const productData = {
        name: formData.name,
        type: formData.type,
        stock: formData.stock === "" ? 0 : Number(formData.stock),
        category: formData.category,
        price: 0, // Default price since it's required by database schema
      };

      if (editingId) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingId);

        if (error) throw error;

        toast({
          title: "Berhasil",
          description: "Produk berhasil diupdate",
        });
      } else {
        const { error } = await supabase.from("products").insert([productData]);

        if (error) throw error;

        toast({
          title: "Berhasil",
          description: "Produk berhasil ditambahkan",
        });
      }

      resetForm();
      loadProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      type: product.type,
      stock: product.stock,
      category: product.category,
    });
    setEditingId(product.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (!error) {
      toast({
        title: "Berhasil",
        description: "Produk berhasil dihapus",
      });
      loadProducts();
    } else {
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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-secondary">
              Admin Dashboard
            </h1>
            <Button variant="destructive" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Form */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-foreground">
                  {editingId ? "Edit Produk" : "Tambah Produk"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Produk</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Tipe / Volt</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger
                        className={errors.type ? "border-destructive" : ""}
                      >
                        <SelectValue placeholder="Pilih tipe / volt" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12</SelectItem>
                        <SelectItem value="24">24</SelectItem>
                        <SelectItem value="Universal">Universal</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.type && (
                      <p className="text-sm text-destructive">{errors.type}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock">Stok</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stock:
                            e.target.value === "" ? "" : Number(e.target.value),
                        })
                      }
                      className={errors.stock ? "border-destructive" : ""}
                      placeholder="Masukkan jumlah stok"
                    />
                    {errors.stock && (
                      <p className="text-sm text-destructive">{errors.stock}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger
                        className={errors.category ? "border-destructive" : ""}
                      >
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-sm text-destructive">
                        {errors.category}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      {editingId ? (
                        "Update"
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" /> Tambah
                        </>
                      )}
                    </Button>
                    {editingId && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetForm}
                      >
                        Batal
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Table */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Daftar Produk ({products.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Tipe</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Stok</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center text-muted-foreground"
                          >
                            Belum ada produk
                          </TableCell>
                        </TableRow>
                      ) : (
                        products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">
                              {product.name}
                            </TableCell>
                            <TableCell>{product.type}</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>{product.stock}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(product)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(product.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
