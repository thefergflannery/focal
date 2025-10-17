"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Clock, Check, X, AlertCircle, MessageSquare } from "lucide-react";

interface Submission {
  id: string;
  type: string;
  status: string;
  data: any;
  notes: string | null;
  submittedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
  editReviews: Array<{
    id: string;
    status: string;
    comments: string | null;
    reviewedAt: string;
    reviewer: {
      id: string;
      name: string | null;
      role: string;
    };
  }>;
}

export default function QueuePage() {
  const { data: session, status } = useSession();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    if (
      session &&
      (session.user.role === "EDITOR" || session.user.role === "ADMIN")
    ) {
      fetchSubmissions();
    }
  }, [session]);

  const fetchSubmissions = async (status = "PENDING") => {
    try {
      const response = await fetch(`/api/submissions?status=${status}`);
      const data = await response.json();

      if (data.success) {
        setSubmissions(data.submissions);
      } else {
        toast.error("Failed to fetch submissions");
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Failed to fetch submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (
    submissionId: string,
    reviewStatus: string,
    comments?: string
  ) => {
    try {
      const response = await fetch(`/api/submissions/${submissionId}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: reviewStatus,
          comments,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Review submitted successfully");
        fetchSubmissions(activeTab.toLowerCase());
      } else {
        toast.error(data.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "APPROVED":
        return <Check className="w-4 h-4" />;
      case "REJECTED":
        return <X className="w-4 h-4" />;
      case "NEEDS_REVISION":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "APPROVED":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "REJECTED":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "NEEDS_REVISION":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4" />
            <div className="h-96 bg-muted rounded" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (
    !session ||
    (session.user.role !== "EDITOR" && session.user.role !== "ADMIN")
  ) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-center space-x-2">
                  <AlertCircle className="w-6 h-6" />
                  <span>Access Denied</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  You need editor or admin privileges to access the moderation
                  queue.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Moderation Queue</h1>
          <p className="text-muted-foreground">
            Review and moderate user submissions to maintain the quality of our
            dictionary.
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={value => {
            setActiveTab(value);
            fetchSubmissions(
              value === "pending" ? "PENDING" : value.toUpperCase()
            );
          }}
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="needs_revision">Needs Revision</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 mt-6">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-muted rounded w-1/4" />
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-4 bg-muted rounded w-1/2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : submissions.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground">
                    No {activeTab} submissions found.
                  </p>
                </CardContent>
              </Card>
            ) : (
              submissions.map(submission => (
                <Card key={submission.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          {getStatusIcon(submission.status)}
                          <span>{submission.type.replace(/_/g, " ")}</span>
                        </CardTitle>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={getStatusColor(submission.status)}>
                            {submission.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Submitted by{" "}
                            {submission.user.name || submission.user.email}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Submission Data */}
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">
                        Submission Details:
                      </h4>
                      <div className="space-y-2 text-sm">
                        {Object.entries(submission.data).map(([key, value]) => (
                          <div key={key} className="flex">
                            <span className="font-medium w-32 capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}:
                            </span>
                            <span className="text-muted-foreground">
                              {String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {submission.notes && (
                      <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center space-x-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>Notes:</span>
                        </h4>
                        <p className="text-sm">{submission.notes}</p>
                      </div>
                    )}

                    {/* Reviews */}
                    {submission.editReviews.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold">Previous Reviews:</h4>
                        {submission.editReviews.map(review => (
                          <div
                            key={review.id}
                            className="border-l-4 border-primary/20 pl-4 py-2"
                          >
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge className={getStatusColor(review.status)}>
                                {review.status}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                by {review.reviewer.name || "Unknown"} on{" "}
                                {new Date(
                                  review.reviewedAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            {review.comments && (
                              <p className="text-sm text-muted-foreground">
                                {review.comments}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    {submission.status === "PENDING" && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            handleReview(submission.id, "APPROVED")
                          }
                          className="flex items-center space-x-1"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleReview(submission.id, "NEEDS_REVISION")
                          }
                          className="flex items-center space-x-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          <span>Needs Revision</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleReview(submission.id, "REJECTED")
                          }
                          className="flex items-center space-x-1"
                        >
                          <X className="w-4 h-4" />
                          <span>Reject</span>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
