"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";

const submissionSchema = z.object({
  type: z.enum(["NEW_ENTRY", "NEW_DEFINITION", "NEW_VARIANT", "EDIT_ENTRY"]),
  headword: z.string().min(1, "Headword is required"),
  partOfSpeech: z.string().optional(),
  definition: z.string().min(1, "Definition is required"),
  example: z.string().optional(),
  etymology: z.string().optional(),
  notes: z.string().optional(),
  existingEntryId: z.string().optional(),
  regionId: z.string().optional(),
});

type SubmissionForm = z.infer<typeof submissionSchema>;

export function SubmitForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("new-entry");

  const form = useForm<SubmissionForm>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      type: "NEW_ENTRY",
    },
  });

  const onSubmit = async (data: SubmissionForm) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Submission created successfully!");
        form.reset();
        setActiveTab("new-entry");
      } else {
        toast.error(result.message || "Failed to create submission");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to create submission");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Submission</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="new-entry">New Entry</TabsTrigger>
            <TabsTrigger value="definition">Add Definition</TabsTrigger>
            <TabsTrigger value="variant">Add Variant</TabsTrigger>
            <TabsTrigger value="edit">Edit Entry</TabsTrigger>
          </TabsList>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-6"
          >
            <TabsContent value="new-entry" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="headword">Headword *</Label>
                  <Input
                    id="headword"
                    {...form.register("headword")}
                    placeholder="Enter the Irish word"
                  />
                  {form.formState.errors.headword && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.headword.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="partOfSpeech">Part of Speech</Label>
                  <Select
                    onValueChange={value =>
                      form.setValue("partOfSpeech", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select part of speech" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="noun">Noun</SelectItem>
                      <SelectItem value="verb">Verb</SelectItem>
                      <SelectItem value="adjective">Adjective</SelectItem>
                      <SelectItem value="adverb">Adverb</SelectItem>
                      <SelectItem value="preposition">Preposition</SelectItem>
                      <SelectItem value="conjunction">Conjunction</SelectItem>
                      <SelectItem value="interjection">Interjection</SelectItem>
                      <SelectItem value="pronoun">Pronoun</SelectItem>
                      <SelectItem value="determiner">Determiner</SelectItem>
                      <SelectItem value="phrase">Phrase</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="definition">Definition *</Label>
                <Textarea
                  id="definition"
                  {...form.register("definition")}
                  placeholder="Enter the definition"
                  rows={3}
                />
                {form.formState.errors.definition && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.definition.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="example">Example</Label>
                <Input
                  id="example"
                  {...form.register("example")}
                  placeholder="Example sentence or usage"
                />
              </div>

              <div>
                <Label htmlFor="etymology">Etymology</Label>
                <Textarea
                  id="etymology"
                  {...form.register("etymology")}
                  placeholder="Word origin and history"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  {...form.register("notes")}
                  placeholder="Additional notes or context"
                  rows={2}
                />
              </div>

              <input
                type="hidden"
                {...form.register("type")}
                value="NEW_ENTRY"
              />
            </TabsContent>

            <TabsContent value="definition" className="space-y-4">
              <div>
                <Label htmlFor="existingEntryId">Existing Entry</Label>
                <Input
                  id="existingEntryId"
                  {...form.register("existingEntryId")}
                  placeholder="Enter the headword of existing entry"
                />
              </div>

              <div>
                <Label htmlFor="definition">New Definition *</Label>
                <Textarea
                  id="definition"
                  {...form.register("definition")}
                  placeholder="Enter the new definition"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="example">Example</Label>
                <Input
                  id="example"
                  {...form.register("example")}
                  placeholder="Example sentence or usage"
                />
              </div>

              <input
                type="hidden"
                {...form.register("type")}
                value="NEW_DEFINITION"
              />
            </TabsContent>

            <TabsContent value="variant" className="space-y-4">
              <div>
                <Label htmlFor="existingEntryId">Existing Entry</Label>
                <Input
                  id="existingEntryId"
                  {...form.register("existingEntryId")}
                  placeholder="Enter the headword of existing entry"
                />
              </div>

              <div>
                <Label htmlFor="headword">Variant Form *</Label>
                <Input
                  id="headword"
                  {...form.register("headword")}
                  placeholder="Enter the variant form"
                />
              </div>

              <div>
                <Label htmlFor="definition">Pronunciation</Label>
                <Input
                  id="definition"
                  {...form.register("definition")}
                  placeholder="IPA pronunciation (e.g., /slɑːntʃə/)"
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  {...form.register("notes")}
                  placeholder="Regional notes or context"
                  rows={2}
                />
              </div>

              <input
                type="hidden"
                {...form.register("type")}
                value="NEW_VARIANT"
              />
            </TabsContent>

            <TabsContent value="edit" className="space-y-4">
              <div>
                <Label htmlFor="existingEntryId">Entry to Edit</Label>
                <Input
                  id="existingEntryId"
                  {...form.register("existingEntryId")}
                  placeholder="Enter the headword of entry to edit"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="headword">New Headword</Label>
                  <Input
                    id="headword"
                    {...form.register("headword")}
                    placeholder="Updated headword"
                  />
                </div>

                <div>
                  <Label htmlFor="partOfSpeech">Part of Speech</Label>
                  <Select
                    onValueChange={value =>
                      form.setValue("partOfSpeech", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select part of speech" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="noun">Noun</SelectItem>
                      <SelectItem value="verb">Verb</SelectItem>
                      <SelectItem value="adjective">Adjective</SelectItem>
                      <SelectItem value="adverb">Adverb</SelectItem>
                      <SelectItem value="preposition">Preposition</SelectItem>
                      <SelectItem value="conjunction">Conjunction</SelectItem>
                      <SelectItem value="interjection">Interjection</SelectItem>
                      <SelectItem value="pronoun">Pronoun</SelectItem>
                      <SelectItem value="determiner">Determiner</SelectItem>
                      <SelectItem value="phrase">Phrase</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="definition">Updated Definition</Label>
                <Textarea
                  id="definition"
                  {...form.register("definition")}
                  placeholder="Updated definition"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="etymology">Etymology</Label>
                <Textarea
                  id="etymology"
                  {...form.register("etymology")}
                  placeholder="Word origin and history"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="notes">Edit Notes</Label>
                <Textarea
                  id="notes"
                  {...form.register("notes")}
                  placeholder="Explain what you're changing and why"
                  rows={3}
                />
              </div>

              <input
                type="hidden"
                {...form.register("type")}
                value="EDIT_ENTRY"
              />
            </TabsContent>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{isSubmitting ? "Submitting..." : "Submit"}</span>
              </Button>
            </div>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  );
}
