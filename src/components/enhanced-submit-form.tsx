"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
import { toast } from "sonner";
import {
  Loader2,
  Send,
  Plus,
  X,
  MapPin,
  Globe,
  Clock,
  Users,
} from "lucide-react";

// Enhanced schema with new features
const enhancedSubmissionSchema = z.object({
  type: z.enum(["NEW_ENTRY", "NEW_DEFINITION", "NEW_VARIANT", "EDIT_ENTRY"]),
  headword: z.string().min(1, "Headword is required"),
  partOfSpeech: z.string().optional(),
  definition: z.string().min(1, "Definition is required"),
  example: z.string().optional(),
  etymology: z.string().optional(),
  notes: z.string().optional(),
  usageStatus: z.enum(["CURRENT", "ARCHAIC", "REGIONAL", "RARE"]),
  existingEntryId: z.string().optional(),
  regions: z.array(z.string()).min(1, "At least one region is required"),
  variants: z
    .array(
      z.object({
        variant: z.string().min(1, "Variant spelling is required"),
        pronunciation: z.string().optional(),
        regionId: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .optional(),
  audioUrl: z.string().url().optional().or(z.literal("")),
});

type EnhancedSubmissionForm = z.infer<typeof enhancedSubmissionSchema>;

// Mock regions data - in real app, this would come from the database
const mockRegions = [
  { id: "connemara", name: "Connemara", country: "Ireland", county: "Galway" },
  { id: "donegal", name: "Donegal", country: "Ireland", county: "Donegal" },
  { id: "cork", name: "Cork", country: "Ireland", county: "Cork" },
  { id: "kerry", name: "Kerry", country: "Ireland", county: "Kerry" },
  {
    id: "waterford",
    name: "Waterford",
    country: "Ireland",
    county: "Waterford",
  },
  { id: "meath", name: "Meath", country: "Ireland", county: "Meath" },
];

export function EnhancedSubmitForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  const form = useForm<EnhancedSubmissionForm>({
    resolver: zodResolver(enhancedSubmissionSchema),
    defaultValues: {
      type: "NEW_ENTRY",
      usageStatus: "CURRENT",
      regions: [],
      variants: [],
    },
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const handleRegionToggle = (regionId: string) => {
    const currentRegions = form.getValues("regions");
    const newRegions = currentRegions.includes(regionId)
      ? currentRegions.filter(id => id !== regionId)
      : [...currentRegions, regionId];

    form.setValue("regions", newRegions);
    setSelectedRegions(newRegions);
  };

  const onSubmit = async (data: EnhancedSubmissionForm) => {
    setIsSubmitting(true);
    try {
      // In a real app, this would make an API call
      console.log("Enhanced submission data:", data);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success(
        "Entry submitted successfully! It will be reviewed by our editors."
      );
      form.reset();
      setSelectedRegions([]);
    } catch {
      toast.error("Failed to submit entry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Submit Irish Language Entry</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Help grow the Irish language dictionary by contributing words,
          definitions, and regional variants. Your submissions will be reviewed
          by our community of editors.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Send className="w-5 h-5" />
            <span>New Entry Submission</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Submission Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Submission Type</Label>
              <Select
                onValueChange={value => form.setValue("type", value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select submission type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEW_ENTRY">New Word Entry</SelectItem>
                  <SelectItem value="NEW_DEFINITION">New Definition</SelectItem>
                  <SelectItem value="NEW_VARIANT">
                    New Regional Variant
                  </SelectItem>
                  <SelectItem value="EDIT_ENTRY">
                    Edit Existing Entry
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Basic Word Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="headword">Headword *</Label>
                <Input
                  id="headword"
                  {...form.register("headword")}
                  placeholder="Enter the Irish word"
                />
                {form.formState.errors.headword && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.headword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="partOfSpeech">Part of Speech</Label>
                <Select
                  onValueChange={value => form.setValue("partOfSpeech", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select part of speech" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="noun">Noun (Ainmfhocal)</SelectItem>
                    <SelectItem value="verb">Verb (Briathar)</SelectItem>
                    <SelectItem value="adjective">
                      Adjective (Aidiachta)
                    </SelectItem>
                    <SelectItem value="adverb">Adverb (Dobhriathar)</SelectItem>
                    <SelectItem value="preposition">
                      Preposition (Réamhfhocal)
                    </SelectItem>
                    <SelectItem value="pronoun">Pronoun (Forainm)</SelectItem>
                    <SelectItem value="conjunction">
                      Conjunction (Cónasc)
                    </SelectItem>
                    <SelectItem value="interjection">
                      Interjection (Intriacht)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Usage Status */}
            <div className="space-y-2">
              <Label htmlFor="usageStatus">Usage Status</Label>
              <Select
                onValueChange={value =>
                  form.setValue("usageStatus", value as any)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select usage status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CURRENT">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4" />
                      <span>Current - In modern use</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="ARCHAIC">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Archaic - Older form</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="REGIONAL">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>Regional - Specific to certain areas</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="RARE">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>Rare - Seldom used</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Regional Selection */}
            <div className="space-y-3">
              <Label>Regions *</Label>
              <p className="text-sm text-muted-foreground">
                Select the regions where this word is used. You can select
                multiple regions.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {mockRegions.map(region => (
                  <div
                    key={region.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedRegions.includes(region.id)
                        ? "border-primary bg-primary/5"
                        : "border-muted hover:border-primary/50"
                    }`}
                    onClick={() => handleRegionToggle(region.id)}
                  >
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <div>
                        <p className="font-medium">{region.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {region.county}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {form.formState.errors.regions && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.regions.message}
                </p>
              )}
            </div>

            {/* Definition */}
            <div className="space-y-2">
              <Label htmlFor="definition">Definition *</Label>
              <Textarea
                id="definition"
                {...form.register("definition")}
                placeholder="Provide a clear definition in English"
                rows={3}
              />
              {form.formState.errors.definition && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.definition.message}
                </p>
              )}
            </div>

            {/* Example Usage */}
            <div className="space-y-2">
              <Label htmlFor="example">Example Usage</Label>
              <Textarea
                id="example"
                {...form.register("example")}
                placeholder="Provide an example sentence showing how the word is used"
                rows={2}
              />
            </div>

            {/* Regional Variants */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Regional Variants</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendVariant({
                      variant: "",
                      pronunciation: "",
                      regionId: "",
                      notes: "",
                    })
                  }
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Variant
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Add different spellings or pronunciations used in specific
                regions.
              </p>

              {variantFields.map((field, index) => (
                <Card key={field.id} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Variant Spelling *</Label>
                      <Input
                        {...form.register(`variants.${index}.variant`)}
                        placeholder="Regional spelling"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Pronunciation</Label>
                      <Input
                        {...form.register(`variants.${index}.pronunciation`)}
                        placeholder="IPA or phonetic spelling"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Region</Label>
                      <Select
                        onValueChange={value =>
                          form.setValue(`variants.${index}.regionId`, value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockRegions.map(region => (
                            <SelectItem key={region.id} value={region.id}>
                              {region.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <Input
                        {...form.register(`variants.${index}.notes`)}
                        placeholder="Additional notes"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVariant(index)}
                    className="mt-2"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Remove Variant
                  </Button>
                </Card>
              ))}
            </div>

            {/* Etymology */}
            <div className="space-y-2">
              <Label htmlFor="etymology">Etymology</Label>
              <Textarea
                id="etymology"
                {...form.register("etymology")}
                placeholder="Historical origin and development of the word (optional)"
                rows={2}
              />
            </div>

            {/* Additional Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                {...form.register("notes")}
                placeholder="Any additional information, context, or notes"
                rows={2}
              />
            </div>

            {/* Audio URL */}
            <div className="space-y-2">
              <Label htmlFor="audioUrl">Audio Pronunciation URL</Label>
              <Input
                id="audioUrl"
                {...form.register("audioUrl")}
                placeholder="https://example.com/pronunciation.mp3"
                type="url"
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Entry
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
