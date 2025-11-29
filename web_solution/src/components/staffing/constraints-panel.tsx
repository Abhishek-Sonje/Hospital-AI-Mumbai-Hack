"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export function ConstraintsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Constraints</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Max Weekly Hours per Staff</Label>
          <div className="flex items-center gap-4">
            <Slider defaultValue={[48]} max={60} step={1} className="flex-1" />
            <span className="w-12 text-sm font-medium">48h</span>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Min Coverage (ICU)</Label>
          <div className="flex items-center gap-4">
            <Slider defaultValue={[3]} max={10} step={1} className="flex-1" />
            <span className="w-12 text-sm font-medium">3</span>
          </div>
        </div>
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="consecutive-nights">Allow Consecutive Nights</Label>
          <Switch id="consecutive-nights" />
        </div>
        <div className="pt-4">
          <Button className="w-full" variant="secondary">
            Update Constraints
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
