import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    Mail,
    MessageSquare,
    Users,
    Github,
    Trello,
    Send,
    MapPin,
    Clock,
    CheckCircle,
    AlertCircle,
    Bug,
    Lightbulb,
    Heart,
    User
} from 'lucide-react';

const ContactUsPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        category: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'success' | null>(null);
    // const [submitStatus, setSubmitStatus] = useState(null);

    const contactReasons = [
        {
            icon: <Bug className="w-6 h-6 text-red-500" />,
            title: "Bug Report",
            description: "Found an issue? Let us know so we can fix it quickly.",
            category: "bug"
        },
        {
            icon: <Lightbulb className="w-6 h-6 text-yellow-500" />,
            title: "Feature Request",
            description: "Have an idea for a new feature? We'd love to hear it!",
            category: "feature"
        },
        {
            icon: <Heart className="w-6 h-6 text-pink-500" />,
            title: "General Feedback",
            description: "Share your thoughts about the platform.",
            category: "feedback"
        },
        {
            icon: <Users className="w-6 h-6 text-blue-500" />,
            title: "Partnership",
            description: "Interested in collaborating with us?",
            category: "partnership"
        }
    ];

    const teamContacts = [
        {
            name: "Raghad Taqatqa",
            role: "Backend Developer & Scrum Master",
            specialty: "Profiles & Community Features",
            avatar: "RT"
        },
        {
            name: "Aya Moeen",
            role: "Backend Developer & QA Tester",
            specialty: "Posts Management & Search",
            avatar: "AM"
        },
        {
            name: "Osama Ghneem",
            role: "Frontend Developer & Documentation Lead",
            specialty: "Authentication & Documentation",
            avatar: "OG"
        },
        {
            name: "Ahmad Tomeh",
            role: "Frontend Developer & UI/UX Designer",
            specialty: "UI/UX & Post Interactions",
            avatar: "AT"
        }
    ];

    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData(prev => ({
    //         ...prev,
    //         [name]: value
    //     }));
    // };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const handleCategorySelect = (category:string) => {
        setFormData(prev => ({
            ...prev,
            category: category,
            subject: category === 'bug' ? 'Bug Report: ' :
                category === 'feature' ? 'Feature Request: ' :
                    category === 'feedback' ? 'Feedback: ' :
                        category === 'partnership' ? 'Partnership Inquiry: ' : ''
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate form submission
        setTimeout(() => {
            setSubmitStatus('success');
            setIsSubmitting(false);
            setFormData({
                name: '',
                email: '',
                subject: '',
                category: '',
                message: ''
            });
        }, 2000);
    };

    return (
        <div className="min-h-screen  to-accent/10">
            {/* Hero Section */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm font-medium">Get in Touch</span>
                    </div>

                    <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Contact Us
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                        Have questions, feedback, or want to contribute to AiHBridge? We'd love to hear from you!
                    </p>
                </div>
            </section>

            {/* Quick Contact Options */}
            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">How Can We Help?</h2>
                        <p className="text-lg text-muted-foreground">
                            Choose the topic that best matches your inquiry
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {contactReasons.map((reason, index) => (
                            <Card
                                key={index}
                                className={`p-6 cursor-pointer transition-all hover:shadow-lg ${formData.category === reason.category
                                        ? 'ring-2 ring-primary bg-primary/5'
                                        : 'hover:border-primary/50'
                                    }`}
                                onClick={() => handleCategorySelect(reason.category)}
                            >
                                <CardContent className="p-0 text-center">
                                    <div className="flex justify-center mb-4">
                                        <div className="p-3 bg-background rounded-lg shadow-sm">
                                            {reason.icon}
                                        </div>
                                    </div>
                                    <h3 className="font-semibold mb-2">{reason.title}</h3>
                                    <p className="text-sm text-muted-foreground">{reason.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form and Info */}
            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <Card className="p-8">
                            <CardHeader className="p-0 mb-6">
                                <CardTitle className="flex items-center gap-2">
                                    <Send className="w-5 h-5 text-primary" />
                                    Send us a Message
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="p-0">
                                {submitStatus === 'success' && (
                                    <div className="flex items-center gap-2 p-4 mb-6 bg-green-50 text-green-700 rounded-lg border border-green-200">
                                        <CheckCircle className="w-5 h-5" />
                                        <span>Thank you! Your message has been sent successfully.</span>
                                    </div>
                                )}

                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Full Name *
                                            </label>
                                            <Input
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Your full name"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Email Address *
                                            </label>
                                            <Input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="your.email@example.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Subject *
                                        </label>
                                        <Input
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            placeholder="Brief description of your inquiry"
                                            required
                                        />
                                    </div>

                                    {formData.category && (
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Category
                                            </label>
                                            <Badge variant="outline" className="capitalize">
                                                {formData.category}
                                            </Badge>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Message *
                                        </label>
                                        <Textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            placeholder="Please provide details about your inquiry..."
                                            rows={6}
                                            required
                                        />
                                    </div>

                                    <Button
                                        onClick={handleSubmit}
                                        className="w-full"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4 mr-2" />
                                                Send Message
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <div className="space-y-8">
                            {/* Project Info */}
                            <Card className="p-6">
                                <CardHeader className="p-0 mb-4">
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-primary" />
                                        Project Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0 space-y-4">
                                    <div>
                                        <h4 className="font-medium mb-2">Program</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Market Ready Developer Training – Cohort 2
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">Development Period</h4>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Clock className="w-4 h-4" />
                                            August 16 - September 20, 2024
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">Project Links</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Github className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm text-muted-foreground">GitHub Repository</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Trello className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm text-muted-foreground">Trello Project Board</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Response Time */}
                            <Card className="p-6">
                                <CardHeader className="p-0 mb-4">
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-primary" />
                                        Response Time
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Bug Reports</span>
                                            <Badge variant="destructive">24-48 hours</Badge>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Feature Requests</span>
                                            <Badge variant="secondary">3-5 days</Badge>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">General Inquiries</span>
                                            <Badge variant="outline">1-3 days</Badge>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Partnerships</span>
                                            <Badge variant="outline">5-7 days</Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Alternative Contact */}
                            <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                                <CardContent className="p-0">
                                    <h4 className="font-medium mb-3 flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-primary" />
                                        Need Immediate Help?
                                    </h4>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        For urgent technical issues or critical bugs that affect platform functionality,
                                        you can also reach out through our GitHub issues page for faster response.
                                    </p>
                                    <Button variant="outline" size="sm" className="w-full">
                                        <Github className="w-4 h-4 mr-2" />
                                        Report on GitHub
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Meet the Team Behind AiHBridge</h2>
                        <p className="text-lg text-muted-foreground">
                            Our dedicated team of developers working to make AI tool discovery seamless
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {teamContacts.map((member, index) => (
                            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                                <CardContent className="p-0">
                                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-4 mx-auto">
                                        <span className="text-white font-bold text-lg">
                                            {member.avatar}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold mb-1">{member.name}</h3>
                                    <p className="text-sm text-primary mb-2">{member.role}</p>
                                    <p className="text-xs text-muted-foreground mb-4">{member.specialty}</p>
                                    <Button variant="outline" size="sm" className="w-full">
                                        <User className="w-4 h-4 mr-2" />
                                        View Profile
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Preview */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Before reaching out, you might find your answer in our FAQ section
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 text-left">
                        <Card className="p-6">
                            <h4 className="font-semibold mb-2">How do I report a bug?</h4>
                            <p className="text-sm text-muted-foreground">
                                Use the bug report form above or create an issue on our GitHub repository with detailed steps to reproduce the problem.
                            </p>
                        </Card>
                        <Card className="p-6">
                            <h4 className="font-semibold mb-2">Can I contribute to the project?</h4>
                            <p className="text-sm text-muted-foreground">
                                Yes! We welcome contributions. Contact us about partnership opportunities or check our GitHub for contribution guidelines.
                            </p>
                        </Card>
                        <Card className="p-6">
                            <h4 className="font-semibold mb-2">How do I suggest a new feature?</h4>
                            <p className="text-sm text-muted-foreground">
                                Select "Feature Request" above and describe your idea. We review all suggestions and prioritize based on community needs.
                            </p>
                        </Card>
                        <Card className="p-6">
                            <h4 className="font-semibold mb-2">Is the platform open source?</h4>
                            <p className="text-sm text-muted-foreground">
                                Yes, AiHBridge is an open source project developed as part of our training program. Check our GitHub for the source code.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactUsPage;