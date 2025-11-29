"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";

export function AutoDraft() {
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    // Mock AI generation
    setTimeout(() => {
      setDraft(
        "⚠️ High AQI Alert: Air quality is expected to reach hazardous levels (AQI &gt; 300) tomorrow. Please wear masks and limit outdoor activities. Hospital ER is prepared for respiratory cases."
      );
      setLoading(false);
    }, 1500);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          AI Auto-Draft
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Target Audience</Label>
          <Select defaultValue="public">
            <SelectTrigger>
              <SelectValue placeholder="Select audience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">General Public</SelectItem>
              <SelectItem value="staff">Hospital Staff</SelectItem>
              <SelectItem value="patients">High-Risk Patients</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Trigger Event</Label>
          <Select defaultValue="aqi">
            <SelectTrigger>
              <SelectValue placeholder="Select trigger" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aqi">AQI Spike (&gt;200)</SelectItem>
              <SelectItem value="festival">Diwali/Festival</SelectItem>
              <SelectItem value="epidemic">Flu Season</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Tone</Label>
          <Select defaultValue="informative">
            <SelectTrigger>
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="informative">Informative</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="reassuring">Reassuring</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Generated Message</Label>
          <Textarea
            placeholder="AI generated draft will appear here..."
            className="min-h-[120px]"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            className="w-full bg-purple-600 hover:bg-purple-700"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Draft
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
