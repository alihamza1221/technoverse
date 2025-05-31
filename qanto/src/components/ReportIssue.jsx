import { useState } from "react";
import axios from "axios";
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
  AlertCircle,
} from "lucide-react";

const issueCategories = [
  "Potholes",
  "Sanitation",
  "Electricity",
  "Traffic",
  "Water Supply",
  "Public Safety",
  "Road Maintenance",
  "Garbage Disposal",
  "Other",
];

const priorityLevels = [
  { value: "Low", label: "Low", color: "bg-green-100 text-green-800" },
  { value: "Medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "High", label: "High", color: "bg-red-100 text-red-800" },
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

    try {
      const token = localStorage.getItem("token");

      // Prepare form data for submission
      const issueData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        location: formData.location,
        coordinates: formData.coordinates,
      };

      // Create FormData for file uploads
      const submitData = new FormData();

      // Append issue data as JSON
      //submitData.append("issueData", JSON.stringify(issueData));

      //   // Append files if any
      //   attachments.forEach((attachment, index) => {
      //     submitData.append(`attachments`, attachment.file);
      //   });

      // Make API call to create issue
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/issues`,
        issueData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Issue created successfully:", response.data);
      setSubmitted(true);

      // Reset form after successful submission

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
    } catch (error) {
      console.error("Error creating issue:", error);
      alert(
        error.response?.data?.message ||
          "Failed to submit issue. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 p-8 text-white">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Report Issue</h1>
            <p className="text-green-100 text-lg">
              Report problems in your city for quick resolution.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
        </div>

        <Card className="max-w-2xl mx-auto border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden">
          <CardContent className="pt-6">
            <div className="text-center space-y-6 py-8">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-green-800 mb-2">
                  Issue Reported Successfully!
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Your issue has been submitted and assigned a tracking ID.
                  You'll receive updates as it progresses through our system.
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2 shadow-sm">
                Tracking ID: ISS-{Date.now().toString().slice(-6)}
              </Badge>
              <Button
                className="mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
                onClick={() => setSubmitted(false)}
              >
                Report Another Issue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Report Issue</h1>
          <p className="text-green-100 text-lg">
            Report problems in your city for quick resolution.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* AR Reporting Option */}
        <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              AR-Enhanced Reporting
            </CardTitle>
            <CardDescription className="text-blue-100">
              Use your mobile device's camera for more accurate issue reporting
              with automatic detection and location tagging.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="secondary"
              className="w-full font-medium shadow-md hover:shadow-lg transition-all"
            >
              <Camera className="h-4 w-4 mr-2" />
              Launch AR Reporter (Mobile Only)
            </Button>
          </CardContent>
        </Card>

        {/* Standard Form */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-green-600" />
              Report a City Issue
            </CardTitle>
            <CardDescription>
              Help us improve our city by reporting issues you encounter.
              Provide as much detail as possible for faster resolution.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Issue Title *
                </Label>
                <Input
                  id="title"
                  placeholder="Brief description of the issue"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500 shadow-sm"
                />
              </div>

              {/* Category and Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">
                    Category *
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500 shadow-sm">
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
                  <Label htmlFor="priority" className="text-sm font-medium">
                    Priority Level *
                  </Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) =>
                      handleInputChange("priority", value)
                    }
                  >
                    <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500 shadow-sm">
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
                <Label htmlFor="description" className="text-sm font-medium">
                  Detailed Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of the issue, including when you noticed it and any relevant context..."
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={4}
                  required
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500 shadow-sm resize-none"
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium">
                  Location *
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="location"
                    placeholder="Enter address or coordinates"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    required
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500 shadow-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getCurrentLocation}
                    className="border-gray-300 hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
                {formData.coordinates && (
                  <p className="text-sm text-green-600 flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" /> GPS coordinates
                    captured
                  </p>
                )}
              </div>

              {/* File Attachments */}
              <div className="space-y-2">
                <Label htmlFor="attachments" className="text-sm font-medium">
                  Photos/Videos (Optional)
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
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
                    className="border-gray-300 hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                  >
                    Choose Files
                  </Button>
                </div>

                {/* Attachment List */}
                {attachments.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          <span className="text-sm font-medium">
                            {attachment.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({(attachment.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachment(attachment.id)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Submit Issue Report"
                  )}
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
                  className="border-gray-300 hover:bg-gray-100"
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
