"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  Flag,
  Edit3,
  Eye,
  Users,
  AlertTriangle,
  MessageSquare,
  Calendar,
  MapPin,
  BookOpen,
  Loader2,
  Copy,
} from "lucide-react";

// Mock data - in real app, this would come from API calls
const mockSubmissions = [
  {
    id: "1",
    type: "NEW_ENTRY",
    headword: "sláinte",
    definition: "health, cheers (when toasting)",
    partOfSpeech: "noun",
    usageStatus: "CURRENT",
    regions: ["connemara", "donegal", "cork"],
    variants: [
      {
        variant: "sláinte mhaith",
        pronunciation: "/ˈslɑːntʲə va/",
        region: "connemara",
      },
    ],
    etymology: "From Old Irish sláinte",
    notes: "Commonly used in toasts",
    audioUrl: "",
    submittedBy: "john_doe@example.com",
    submittedAt: "2024-01-15T10:30:00Z",
    status: "PENDING",
  },
  {
    id: "2",
    type: "NEW_DEFINITION",
    headword: "craic",
    definition: "fun, entertainment, good times",
    partOfSpeech: "noun",
    usageStatus: "CURRENT",
    regions: ["connemara", "donegal"],
    variants: [],
    etymology: "",
    notes: "Informal usage",
    audioUrl: "",
    submittedBy: "mary_smith@example.com",
    submittedAt: "2024-01-14T15:45:00Z",
    status: "PENDING",
  },
];

const mockReports = [
  {
    id: "1",
    entryId: "entry_123",
    headword: "póg",
    reason: "INAPPROPRIATE",
    description:
      "This word contains inappropriate content for a family dictionary",
    reportedBy: "user@example.com",
    reportedAt: "2024-01-15T09:15:00Z",
    status: "PENDING",
  },
  {
    id: "2",
    entryId: "entry_456",
    headword: "bád",
    reason: "INCORRECT",
    description: "The pronunciation guide is wrong for the Connemara dialect",
    reportedBy: "native_speaker@example.com",
    reportedAt: "2024-01-14T16:20:00Z",
    status: "PENDING",
  },
];

const mockSuggestions = [
  {
    id: "1",
    entryId: "entry_789",
    headword: "cara",
    type: "DEFINITION",
    currentValue: "friend",
    suggestedValue: "friend, companion (close friend)",
    reason:
      "The current definition is too brief and doesn't capture the depth of meaning in Irish",
    suggestedBy: "linguist@example.com",
    suggestedAt: "2024-01-15T11:00:00Z",
    status: "PENDING",
  },
];

export function ModerationDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("submissions");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewDecision, setReviewDecision] = useState<
    "APPROVED" | "REJECTED" | "NEEDS_REVISION"
  >("APPROVED");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleReview = async (item: any, decision: string) => {
    setIsProcessing(true);
    try {
      // In a real app, this would make an API call
      console.log("Review decision:", {
        item,
        decision,
        comment: reviewComment,
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success(`Submission ${decision.toLowerCase()} successfully!`);
      setReviewDialogOpen(false);
      setSelectedItem(null);
      setReviewComment("");
    } catch {
      toast.error("Failed to process review. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const openReviewDialog = (item: any) => {
    setSelectedItem(item);
    setReviewDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="text-yellow-600 border-yellow-600"
          >
            Pending
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge variant="default" className="text-green-600 border-green-600">
            Approved
          </Badge>
        );
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>;
      case "NEEDS_REVISION":
        return (
          <Badge variant="secondary" className="text-blue-600 border-blue-600">
            Needs Revision
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "NEW_ENTRY":
        return <BookOpen className="w-4 h-4" />;
      case "NEW_DEFINITION":
        return <Edit3 className="w-4 h-4" />;
      case "NEW_VARIANT":
        return <MapPin className="w-4 h-4" />;
      default:
        return <Edit3 className="w-4 h-4" />;
    }
  };

  const getReasonIcon = (reason: string) => {
    switch (reason) {
      case "INAPPROPRIATE":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "INCORRECT":
        return <XCircle className="w-4 h-4 text-orange-500" />;
      case "DUPLICATE":
        return <Copy className="w-4 h-4 text-blue-500" />;
      default:
        return <Flag className="w-4 h-4" />;
    }
  };

  if (
    !session ||
    (session.user.role !== "EDITOR" && session.user.role !== "ADMIN")
  ) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
          <p className="text-muted-foreground">
            You need editor or admin privileges to access the moderation
            dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Moderation Dashboard</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Review and moderate community submissions, reports, and suggestions to
          maintain quality and accuracy.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger
            value="submissions"
            className="flex items-center space-x-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Submissions ({mockSubmissions.length})</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center space-x-2">
            <Flag className="w-4 h-4" />
            <span>Reports ({mockReports.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="suggestions"
            className="flex items-center space-x-2"
          >
            <Edit3 className="w-4 h-4" />
            <span>Suggestions ({mockSuggestions.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* Submissions Tab */}
        <TabsContent value="submissions" className="space-y-4">
          {mockSubmissions.map(submission => (
            <Card
              key={submission.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(submission.type)}
                    <div>
                      <CardTitle className="text-lg">
                        {submission.headword}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">
                          {submission.type.replace("_", " ")}
                        </Badge>
                        {getStatusBadge(submission.status)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <Users className="w-4 h-4" />
                      <span>{submission.submittedBy}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Definition:</Label>
                    <p className="text-muted-foreground">
                      {submission.definition}
                    </p>
                  </div>

                  {submission.partOfSpeech && (
                    <div className="flex items-center space-x-2">
                      <Label className="text-sm font-medium">
                        Part of Speech:
                      </Label>
                      <Badge variant="secondary">
                        {submission.partOfSpeech}
                      </Badge>
                    </div>
                  )}

                  {submission.regions.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Label className="text-sm font-medium">Regions:</Label>
                      <div className="flex flex-wrap gap-1">
                        {submission.regions.map(region => (
                          <Badge
                            key={region}
                            variant="outline"
                            className="text-xs"
                          >
                            {region}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {submission.variants.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">Variants:</Label>
                      <div className="mt-1 space-y-1">
                        {submission.variants.map((variant, index) => (
                          <div
                            key={index}
                            className="text-sm text-muted-foreground"
                          >
                            <span className="font-medium">
                              {variant.variant}
                            </span>
                            {variant.pronunciation && (
                              <span className="ml-2">
                                [{variant.pronunciation}]
                              </span>
                            )}
                            {variant.region && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                {variant.region}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {submission.etymology && (
                    <div>
                      <Label className="text-sm font-medium">Etymology:</Label>
                      <p className="text-muted-foreground text-sm">
                        {submission.etymology}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openReviewDialog(submission)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Review
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleReview(submission, "APPROVED")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleReview(submission, "REJECTED")}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleReview(submission, "NEEDS_REVISION")}
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Request Revision
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          {mockReports.map(report => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {getReasonIcon(report.reason)}
                    <div>
                      <CardTitle className="text-lg">
                        Report: {report.headword}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">{report.reason}</Badge>
                        {getStatusBadge(report.status)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(report.reportedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <Users className="w-4 h-4" />
                      <span>{report.reportedBy}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Description:</Label>
                    <p className="text-muted-foreground">
                      {report.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openReviewDialog(report)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                  <div className="flex space-x-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleReview(report, "RESOLVED")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Resolve
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleReview(report, "DISMISSED")}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Dismiss
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Suggestions Tab */}
        <TabsContent value="suggestions" className="space-y-4">
          {mockSuggestions.map(suggestion => (
            <Card
              key={suggestion.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Edit3 className="w-4 h-4" />
                    <div>
                      <CardTitle className="text-lg">
                        {suggestion.headword}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">{suggestion.type}</Badge>
                        {getStatusBadge(suggestion.status)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(suggestion.suggestedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <Users className="w-4 h-4" />
                      <span>{suggestion.suggestedBy}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">
                      Current Value:
                    </Label>
                    <p className="text-muted-foreground bg-muted p-2 rounded">
                      {suggestion.currentValue}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">
                      Suggested Change:
                    </Label>
                    <p className="text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-2 rounded">
                      {suggestion.suggestedValue}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Reason:</Label>
                    <p className="text-muted-foreground">{suggestion.reason}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openReviewDialog(suggestion)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Review
                  </Button>
                  <div className="flex space-x-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleReview(suggestion, "IMPLEMENTED")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Implement
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleReview(suggestion, "REJECTED")}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Item</DialogTitle>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="decision">Decision</Label>
                <Select
                  value={reviewDecision}
                  onValueChange={(value: any) => setReviewDecision(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="APPROVED">Approve</SelectItem>
                    <SelectItem value="REJECTED">Reject</SelectItem>
                    <SelectItem value="NEEDS_REVISION">
                      Request Revision
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="comment">Review Comment</Label>
                <Textarea
                  id="comment"
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  placeholder="Add any comments or feedback for the submitter..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setReviewDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleReview(selectedItem, reviewDecision)}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
