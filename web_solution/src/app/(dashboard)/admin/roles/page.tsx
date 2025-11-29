"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/lib/types";
import { MoreHorizontal, Shield, UserPlus } from "lucide-react";

// Mock Users
const users: User[] = [
  {
    id: "1",
    name: "Dr. Aditi Sharma",
    role: "Admin",
    department: "Administration",
    avatarUrl: "https://github.com/shadcn.png",
  },
  {
    id: "2",
    name: "Rahul Verma",
    role: "Planner",
    department: "Operations",
  },
  {
    id: "3",
    name: "Dr. Raj Gupta",
    role: "Doctor",
    department: "Cardiology",
  },
  {
    id: "4",
    name: "Priya Singh",
    role: "Nurse",
    department: "ICU",
  },
];

export default function RolesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Roles & Access</h1>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Avatar>
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Shield className="h-3 w-3 text-muted-foreground" />
                    {user.role}
                  </div>
                </TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Active
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
