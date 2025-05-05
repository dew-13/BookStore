"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";

type OrderItem = {
  id: string;
  bookId: string;
  title: string;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  totalAmount: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
};

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) {
        setError("User not logged in");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/orders?userId=${user.id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await res.json();
        setOrders(data.orders);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [user]);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>Error: {error}</p>;
  if (orders.length === 0) return <p>No orders found.</p>;

  return (
    <div className="container mx-auto p-4 text-foreground bg-background">
      <h1 className="text-2xl font-bold mb-4">Order History</h1>
      <div className="overflow-x-auto">
        {orders.map((order) => (
<div key={order.id} className="mb-8 border border-gray-600 rounded shadow-sm bg-muted">
  <div className="p-4 border-b border-gray-600 bg-background">
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <p><strong>Total Amount:</strong> LKR {order.totalAmount.toFixed(2)}</p>
              <p><strong>Shipping Address:</strong> {order.address}, {order.city}, {order.state} {order.zipCode}, {order.country}</p>
              <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
            </div>
            <table className="min-w-full divide-y divide-gray-600">
              <thead className="bg-background">
                <tr>
              <th className="w-1/2 px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</th>
              <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
              <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Quantity</th>
              <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Subtotal</th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border divide-gray-600">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="w-1/2 px-6 py-4 whitespace-nowrap text-sm text-foreground">{item.title}</td>
                    <td className="w-1/6 px-6 py-4 whitespace-nowrap text-sm text-foreground">LKR {item.price.toFixed(2)}</td>
                    <td className="w-1/6 px-6 py-4 whitespace-nowrap text-sm text-foreground">{item.quantity}</td>
                    <td className="w-1/6 px-6 py-4 whitespace-nowrap text-sm text-foreground">LKR {(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
