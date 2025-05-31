import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  MapPin,
  Camera,
  Upload,
  X,
  CheckCircle,
  Smartphone,
} from "lucide-react";

const issueCategories = [
  "Road & Transportation",
  "Sanitation & Waste",
  "Street Lighting",
  "Water & Drainage",
  "Public Safety",
  "Parks & Recreation",
  "Noise Pollution",
  "Other",
];

const priorityLevels = [
  { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "high", label: "High", color: "bg-red-100 text-red-800" },
];

export default function ReportPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
    location: "",
    coordinates: null,
  });
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newAttachments = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removeAttachment = (id) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            coordinates: { lat: latitude, lng: longitude },
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to get your location. Please enter it manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      // Reset form after successful submission
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          title: "",
          description: "",
          category: "",
          priority: "",
          location: "",
          coordinates: null,
        });
        setAttachments([]);
      }, 3000);
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Report Issue</h1>
          <p className="text-muted-foreground">
            Report problems in your city for quick resolution.
          </p>
        </div>
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-900">
                Issue Reported Successfully!
              </h3>
              <p className="text-gray-600">
                Your issue has been submitted and assigned a tracking ID. You'll
                receive updates as it progresses through our system.
              </p>
              <Badge className="bg-blue-100 text-blue-800">
                Tracking ID: ISS-{Date.now().toString().slice(-6)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Report Issue</h1>
        <p className="text-muted-foreground">
          Report problems in your city for quick resolution.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* AR Reporting Option */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              AR-Enhanced Reporting
            </CardTitle>
            <CardDescription>
              Use your mobile device's camera for more accurate issue reporting
              with automatic detection and location tagging.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Camera className="h-4 w-4 mr-2" />
              Launch AR Reporter (Mobile Only)
            </Button>
          </CardContent>
        </Card>

        {/* Standard Form */}
        <Card>
          <CardHeader>
            <CardTitle>Report a City Issue</CardTitle>
            <CardDescription>
              Help us improve our city by reporting issues you encounter.
              Provide as much detail as possible for faster resolution.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Issue Title *</Label>
                <Input
                  id="title"
                  placeholder="Brief description of the issue"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </div>

              {/* Category and Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select issue category" />
                    </SelectTrigger>
                    <SelectContent>
                      {issueCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Level *</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) =>
                      handleInputChange("priority", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityLevels.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                priority.color.split(" ")[0]
                              }`}
                            />
                            {priority.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of the issue, including when you noticed it and any relevant context..."
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={4}
                  required
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <div className="flex gap-2">
                  <Input
                    id="location"
                    placeholder="Enter address or coordinates"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getCurrentLocation}
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
                {formData.coordinates && (
                  <p className="text-sm text-green-600">
                    ✓ GPS coordinates captured
                  </p>
                )}
              </div>

              {/* File Attachments */}
              <div className="space-y-2">
                <Label htmlFor="attachments">Photos/Videos (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload photos or videos to help illustrate the issue
                  </p>
                  <input
                    type="file"
                    id="attachments"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("attachments").click()
                    }
                  >
                    Choose Files
                  </Button>
                </div>

                {/* Attachment List */}
                {attachments.length > 0 && (
                  <div className="space-y-2">
                    {attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          <span className="text-sm">{attachment.name}</span>
                          <span className="text-xs text-gray-500">
                            ({(attachment.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachment(attachment.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Submitting..." : "Submit Issue Report"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      title: "",
                      description: "",
                      category: "",
                      priority: "",
                      location: "",
                      coordinates: null,
                    });
                    setAttachments([]);
                  }}
                >
                  Clear Form
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
