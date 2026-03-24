import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, CreditCard, ShoppingCart, RefreshCw, Receipt } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const statusColor = (status: string) => {
  switch (status) {
    case "completed": case "active": case "verified": return "default";
    case "pending": case "pending_verification": return "secondary";
    case "failed": case "cancelled": case "expired": return "destructive";
    default: return "outline";
  }
};

const TransactionHistory = () => {
  const { user } = useAuth();

  const { data: payments, isLoading: loadingPayments } = useQuery({
    queryKey: ["payments", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("payments").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: transactions, isLoading: loadingTransactions } = useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("transactions").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: orders, isLoading: loadingOrders } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: subscriptions, isLoading: loadingSubs } = useQuery({
    queryKey: ["subscriptions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("subscriptions").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const formatDate = (d: string) => format(new Date(d), "dd MMM yyyy, hh:mm a");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(210,80%,45%)] text-primary-foreground py-4 px-4">
        <div className="container mx-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/20" asChild>
            <Link to="/"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <h1 className="text-lg font-semibold">Transaction History</h1>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{payments?.length ?? 0}</p>
                <p className="text-xs text-muted-foreground">Payments</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-accent/50 flex items-center justify-center">
                <Receipt className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{transactions?.length ?? 0}</p>
                <p className="text-xs text-muted-foreground">Transactions</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-secondary/50 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{orders?.length ?? 0}</p>
                <p className="text-xs text-muted-foreground">Orders</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <RefreshCw className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{subscriptions?.length ?? 0}</p>
                <p className="text-xs text-muted-foreground">Subscriptions</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="payments" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          </TabsList>

          {/* Payments */}
          <TabsContent value="payments">
            <Card>
              <CardHeader><CardTitle className="text-base">Payment History</CardTitle></CardHeader>
              <CardContent>
                {loadingPayments ? <p className="text-muted-foreground text-sm">Loading...</p> :
                  !payments?.length ? <p className="text-muted-foreground text-sm">No payments recorded yet.</p> : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Parcel</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>UPI Txn ID</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.map((p) => (
                          <TableRow key={p.id}>
                            <TableCell className="text-sm">{formatDate(p.created_at)}</TableCell>
                            <TableCell className="font-mono text-sm">{p.parcel_id}</TableCell>
                            <TableCell className="font-semibold">₹{p.amount}</TableCell>
                            <TableCell className="font-mono text-sm">{p.upi_transaction_id || "—"}</TableCell>
                            <TableCell><Badge variant={statusColor(p.status)}>{p.status}</Badge></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader><CardTitle className="text-base">Transaction History</CardTitle></CardHeader>
              <CardContent>
                {loadingTransactions ? <p className="text-muted-foreground text-sm">Loading...</p> :
                  !transactions?.length ? <p className="text-muted-foreground text-sm">No transactions yet.</p> : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((t) => (
                          <TableRow key={t.id}>
                            <TableCell className="text-sm">{formatDate(t.created_at)}</TableCell>
                            <TableCell><Badge variant="outline">{t.type}</Badge></TableCell>
                            <TableCell className="text-sm">{t.description || "—"}</TableCell>
                            <TableCell className="font-semibold">₹{t.amount}</TableCell>
                            <TableCell><Badge variant={statusColor(t.status)}>{t.status}</Badge></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders */}
          <TabsContent value="orders">
            <Card>
              <CardHeader><CardTitle className="text-base">Order History</CardTitle></CardHeader>
              <CardContent>
                {loadingOrders ? <p className="text-muted-foreground text-sm">Loading...</p> :
                  !orders?.length ? <p className="text-muted-foreground text-sm">No orders yet.</p> : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Order #</TableHead>
                          <TableHead>Parcel</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((o) => (
                          <TableRow key={o.id}>
                            <TableCell className="text-sm">{formatDate(o.created_at)}</TableCell>
                            <TableCell className="font-mono text-sm">{o.order_number}</TableCell>
                            <TableCell className="text-sm">{o.parcel_id || "—"}</TableCell>
                            <TableCell className="font-semibold">₹{o.amount}</TableCell>
                            <TableCell className="text-sm">{o.payment_method}</TableCell>
                            <TableCell><Badge variant={statusColor(o.status)}>{o.status}</Badge></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscriptions */}
          <TabsContent value="subscriptions">
            <Card>
              <CardHeader><CardTitle className="text-base">Subscriptions</CardTitle></CardHeader>
              <CardContent>
                {loadingSubs ? <p className="text-muted-foreground text-sm">Loading...</p> :
                  !subscriptions?.length ? <p className="text-muted-foreground text-sm">No subscriptions yet.</p> : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Plan</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Start</TableHead>
                          <TableHead>End</TableHead>
                          <TableHead>Auto-Renew</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subscriptions.map((s) => (
                          <TableRow key={s.id}>
                            <TableCell className="font-semibold capitalize">{s.plan_name}</TableCell>
                            <TableCell>₹{s.amount}</TableCell>
                            <TableCell className="text-sm">{formatDate(s.start_date)}</TableCell>
                            <TableCell className="text-sm">{s.end_date ? formatDate(s.end_date) : "—"}</TableCell>
                            <TableCell>{s.auto_renew ? "Yes" : "No"}</TableCell>
                            <TableCell><Badge variant={statusColor(s.status)}>{s.status}</Badge></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TransactionHistory;
