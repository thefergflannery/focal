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
import { Edit3, Send, Loader2, Lightbulb } from "lucide-react";

const suggestionSchema = z.object({
  type: z.enum([
    "HEADWORD",
    "DEFINITION",
    "ETYMOLOGY",
    "NOTES",
    "PRONUNCIATION",
    "USAGE_STATUS",
    "REGION",
  ]),
  currentValue: z.string().optional(),
  suggestedValue: z.string().min(1, "Suggested value is required"),
  reason: z
    .string()
    .min(
      10,
      "Please provide a reason for your suggestion (at least 10 characters)"
    ),
});

type SuggestionForm = z.infer<typeof suggestionSchema>;

interface SuggestEditProps {
  entryId: string;
  entryHeadword: string;
  currentData: {
    headword?: string;
    definition?: string;
    etymology?: string;
    notes?: string;
    pronunciation?: string;
    usageStatus?: string;
    regions?: string[];
  };
}

export function SuggestEdit({
  entryId,
  entryHeadword,
  currentData,
}: SuggestEditProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SuggestionForm>({
    resolver: zodResolver(suggestionSchema),
    defaultValues: {
      type: "DEFINITION",
      currentValue: "",
      suggestedValue: "",
      reason: "",
    },
  });

  const suggestionTypes = [
    {
      value: "HEADWORD",
      label: "Headword",
      description: "Suggest a different spelling or form of the word",
    },
    {
      value: "DEFINITION",
      label: "Definition",
      description: "Improve or correct the English definition",
    },
    {
      value: "ETYMOLOGY",
      label: "Etymology",
      description: "Add or correct information about word origins",
    },
    {
      value: "NOTES",
      label: "Notes",
      description: "Add additional context or usage notes",
    },
    {
      value: "PRONUNCIATION",
      label: "Pronunciation",
      description: "Add or correct pronunciation guide (IPA/phonetic)",
    },
    {
      value: "USAGE_STATUS",
      label: "Usage Status",
      description:
        "Update whether the word is current, archaic, regional, or rare",
    },
    {
      value: "REGION",
      label: "Region",
      description: "Add or remove regional associations",
    },
  ];

  const handleTypeChange = (type: string) => {
    form.setValue("type", type as any);

    // Auto-populate current value based on type
    let currentValue = "";
    switch (type) {
      case "HEADWORD":
        currentValue = currentData.headword || "";
        break;
      case "DEFINITION":
        currentValue = currentData.definition || "";
        break;
      case "ETYMOLOGY":
        currentValue = currentData.etymology || "";
        break;
      case "NOTES":
        currentValue = currentData.notes || "";
        break;
      case "PRONUNCIATION":
        currentValue = currentData.pronunciation || "";
        break;
      case "USAGE_STATUS":
        currentValue = currentData.usageStatus || "";
        break;
      case "REGION":
        currentValue = currentData.regions?.join(", ") || "";
        break;
    }

    form.setValue("currentValue", currentValue);
  };

  const onSubmit = async (data: SuggestionForm) => {
    setIsSubmitting(true);
    try {
      // In a real app, this would make an API call
      console.log("Suggestion data:", {
        ...data,
        entryId,
        entryHeadword,
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success(
        "Suggestion submitted successfully! Our editors will review it."
      );
      form.reset();
      setIsOpen(false);
    } catch {
      toast.error("Failed to submit suggestion. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <Edit3 className="w-4 h-4 mr-1" />
          Suggest Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5" />
            <span>Suggest Edit</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Suggesting edit for:{" "}
              <span className="font-medium">{entryHeadword}</span>
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">What would you like to edit? *</Label>
              <Select onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select what to edit" />
                </SelectTrigger>
                <SelectContent>
                  {suggestionTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {type.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.type && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.type.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentValue">Current Value</Label>
              <Textarea
                id="currentValue"
                {...form.register("currentValue")}
                placeholder="Current value (auto-filled)"
                rows={2}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="suggestedValue">Suggested Change *</Label>
              <Textarea
                id="suggestedValue"
                {...form.register("suggestedValue")}
                placeholder="Enter your suggested improvement..."
                rows={3}
              />
              {form.formState.errors.suggestedValue && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.suggestedValue.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Suggestion *</Label>
              <Textarea
                id="reason"
                {...form.register("reason")}
                placeholder="Explain why this change would improve the entry..."
                rows={3}
              />
              {form.formState.errors.reason && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.reason.message}
                </p>
              )}
            </div>

            <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>Wiki-style editing:</strong> Your suggestions will be
                reviewed by our community editors. If approved, they'll be
                incorporated into the entry with credit to you.
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
                    Submit Suggestion
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
