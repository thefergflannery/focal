"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Flag, AlertTriangle, Send, Loader2 } from "lucide-react";

const reportSchema = z.object({
  reason: z.enum([
    "INAPPROPRIATE",
    "INCORRECT",
    "DUPLICATE",
    "SPAM",
    "COPYRIGHT",
    "OTHER",
  ]),
  description: z
    .string()
    .min(10, "Please provide a detailed description (at least 10 characters)"),
});

type ReportForm = z.infer<typeof reportSchema>;

interface ReportContentProps {
  entryId?: string;
  definitionId?: string;
  variantId?: string;
  entryHeadword?: string;
  definitionText?: string;
  variantText?: string;
}

export function ReportContent({
  entryId,
  definitionId,
  variantId,
  entryHeadword,
  definitionText,
  variantText,
}: ReportContentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReportForm>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      reason: "INCORRECT",
      description: "",
    },
  });

  const getContentDescription = () => {
    if (entryHeadword) return `word "${entryHeadword}"`;
    if (definitionText)
      return `definition "${definitionText.substring(0, 50)}..."`;
    if (variantText) return `variant "${variantText}"`;
    return "content";
  };

  const onSubmit = async (data: ReportForm) => {
    setIsSubmitting(true);
    try {
      // In a real app, this would make an API call
      console.log("Report data:", {
        ...data,
        entryId,
        definitionId,
        variantId,
        contentDescription: getContentDescription(),
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success(
        "Report submitted successfully. Our moderators will review it shortly."
      );
      form.reset();
      setIsOpen(false);
    } catch {
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const reasonOptions = [
    {
      value: "INAPPROPRIATE",
      label: "Inappropriate Content",
      description: "Contains offensive, inappropriate, or harmful content",
    },
    {
      value: "INCORRECT",
      label: "Incorrect Information",
      description: "Contains factually incorrect Irish language information",
    },
    {
      value: "DUPLICATE",
      label: "Duplicate Entry",
      description: "This content already exists elsewhere in the dictionary",
    },
    {
      value: "SPAM",
      label: "Spam or Irrelevant",
      description: "Unrelated to Irish language or appears to be spam",
    },
    {
      value: "COPYRIGHT",
      label: "Copyright Violation",
      description: "Violates copyright or intellectual property rights",
    },
    {
      value: "OTHER",
      label: "Other",
      description: "Other issue not covered by the above categories",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <Flag className="w-4 h-4 mr-1" />
          Report
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Report Content</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Reporting:{" "}
              <span className="font-medium">{getContentDescription()}</span>
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Report *</Label>
              <Select
                onValueChange={value => form.setValue("reason", value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {reasonOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {option.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.reason && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.reason.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description *</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Please provide specific details about why you're reporting this content. This helps our moderators understand and address the issue."
                rows={4}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> Reports are reviewed by our community
                moderators. False reports may result in account restrictions.
              </p>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Report
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
