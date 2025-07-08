import Nav from "@/app/components/Nav";
import NavLink from "@/app/components/Nav/NavLink";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Nav>
        <NavLink href="/admin">Dashboard</NavLink>
        <NavLink href="/admin/products">Products</NavLink>
        <NavLink href="/admin/users">Users</NavLink>
        <NavLink href="/admin/orders">Orders</NavLink>
      </Nav>
      <div className="container my-6">{children}</div>
    </>
  );
}
