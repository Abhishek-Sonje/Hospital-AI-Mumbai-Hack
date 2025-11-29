"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { RosterTable } from "@/components/staffing/roster-table";
import { ConstraintsPanel } from "@/components/staffing/constraints-panel";
import { RiskSummary } from "@/components/staffing/risk-summary";
import { getStaffList } from "@/lib/api";
import { Staff } from "@/lib/types";
import { CalendarIcon, Download, RefreshCw, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function StaffSchedulingPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      const data = await getStaffList();
      setStaffList(data);
      setLoading(false);
    };
    fetchStaff();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Staff Scheduling</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Approve Schedule
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-muted/40 p-4 rounded-lg border">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
              <SelectItem value="icu">ICU</SelectItem>
              <SelectItem value="pediatrics">Pediatrics</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="doctor">Doctor</SelectItem>
              <SelectItem value="nurse">Nurse</SelectItem>
              <SelectItem value="technician">Technician</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="secondary" onClick={() => {}}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Re-run AI
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3 space-y-6">
          <RosterTable staffList={staffList} />
        </div>
        <div className="space-y-6">
          <ConstraintsPanel />
          <RiskSummary />
        </div>
      </div>
    </div>
  );
}
