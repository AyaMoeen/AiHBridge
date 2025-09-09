import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, PlusCircle, CheckCircle, AlertCircle, Star, Wand2, Globe, Plus } from "lucide-react";

export default function CreatePostPage() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

    const [formData, setFormData] = useState({
        toolName: "",
        toolUrl: "",
        description: "",
        categories: [] as string[],
        newCategory: "",
        rating: 0,
        opinion: "",
    });

    const categories = [
        "Design Tools",
        "Programming",
        "Business & Productivity",
        "Education & Learning",
        "Content Creation",
        "Data Analysis",
        "Marketing",
        "Communication",
    ];

    const handleInputChange = (field: string, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleCategoryToggle = (category: string) => {
        setFormData((prev) => ({
            ...prev,
            categories: prev.categories.includes(category)
                ? prev.categories.filter((c) => c !== category)
                : [...prev.categories, category],
        }));
    };

    const addNewCategory = () => {
        if (formData.newCategory.trim() && !categories.includes(formData.newCategory.trim())) {
            setFormData((prev) => ({
                ...prev,
                categories: [...prev.categories, formData.newCategory.trim()],
                newCategory: "",
            }));
        }
    };

    const handleRatingClick = (rating: number) => {
        setFormData((prev) => ({ ...prev, rating }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setSubmitStatus("success");
            setIsSubmitting(false);

            setTimeout(() => {
                navigate("/");
            }, 2000);
        }, 2000);
    };

    const isFormValid =
        formData.toolName && formData.description && formData.categories.length > 0 && formData.rating > 0;

    if (submitStatus === "success") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Post Created Successfully!</h2>
                    <p className="text-muted-foreground">Your AI tool has been shared with the community.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Button variant="outline" onClick={() => navigate("/")} className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Feed
                </Button>
                <div className="flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-primary" />
                    <h1 className="text-2xl font-bold">Share an AI Tool</h1>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <PlusCircle className="w-5 h-5 text-primary" />
                        Create New Post
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Tool Name */}
                    <div>
                        <Label htmlFor="toolName">Tool Name *</Label>
                        <Input
                            id="toolName"
                            placeholder="e.g., ChatGPT, Midjourney, Figma"
                            value={formData.toolName}
                            onChange={(e) => handleInputChange("toolName", e.target.value)}
                            className="mt-1 border-gray-200"
                        />
                    </div>

                    {/* URL */}
                    <div>
                        <Label htmlFor="toolUrl">Tool URL</Label>
                        <Input
                            id="toolUrl"
                            placeholder="https://example.com"
                            value={formData.toolUrl}
                            onChange={(e) => handleInputChange("toolUrl", e.target.value)}
                            className="mt-1 border-gray-200"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe what this AI tool does..."
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            rows={4}
                            className="mt-1 border-gray-200"
                        />
                    </div>

                    {/* Categories */}
                    <div>
                        <Label>Categories *</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {categories.map((category) => (
                                <Button
                                    key={category}
                                    type="button"
                                    variant={formData.categories.includes(category) ? "default" : "outline"}
                                    onClick={() => handleCategoryToggle(category)}
                                    size="sm"
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>
                        <div className="flex gap-2 mt-3">
                            <Input
                                placeholder="Add new category"
                                value={formData.newCategory}
                                onChange={(e) => handleInputChange("newCategory", e.target.value)}
                                className="border-gray-200"
                            />
                            <Button type="button" onClick={addNewCategory} variant="secondary">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Rating */}
                    <div>
                        <Label>Your Rating *</Label>
                        <div className="flex items-center gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => handleRatingClick(star)}
                                    className="p-1 "
                                >
                                    <Star
                                        className={`w-6 h-6 ${star <= formData.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                            }`}
                                    />
                                </button>
                            ))}
                            <span className="ml-2 text-sm">{formData.rating > 0 ? `${formData.rating}/5` : "No rating"}</span>
                        </div>
                    </div>

                    {/* Opinion */}
                    <div>
                        <Label htmlFor="opinion">Your Opinion</Label>
                        <Textarea
                            id="opinion"
                            placeholder="Share your thoughts about this tool..."
                            value={formData.opinion}
                            onChange={(e) => handleInputChange("opinion", e.target.value)}
                            rows={3}
                            className="mt-1 border-gray-200"
                        />
                    </div>

                    {/* Validation */}
                    {!isFormValid && (
                        <div className="flex items-center gap-2 p-3 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
                            <AlertCircle className="w-5 h-5" />
                            <span className="text-sm">
                                Please fill in the required fields: Tool Name, Description, Categories, and Rating
                            </span>
                        </div>
                    )}

                    {/* Submit */}
                    <div className="flex justify-end pt-4">
                        <Button onClick={handleSubmit} disabled={!isFormValid || isSubmitting} className="min-w-[120px]">
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                    Publishing...
                                </>
                            ) : (
                                <>
                                    <Globe className="w-4 h-4 mr-2" />
                                    Publish Post
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
