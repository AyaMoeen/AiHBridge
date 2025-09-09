import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Target, Lightbulb, Search, MessageSquare, Heart, BookOpen, Github, Trello } from 'lucide-react';

const AboutUsPage = () => {
    const teamMembers = [
        {
            name: "Raghad Taqatqa",
            role: "Backend Developer & Scrum Master",
            responsibilities: "Profiles Management, Community Interactions Management",
            specialty: "Backend Development"
        },
        {
            name: "Aya Moeen",
            role: "Backend Developer & QA Tester",
            responsibilities: "Posts Management, Search Functionality",
            specialty: "Backend Development & Quality Assurance"
        },
        {
            name: "Osama Ghneem",
            role: "Frontend Developer & Documentation Lead",
            responsibilities: "Sign Up/In Pages, Profile Customization",
            specialty: "Frontend Development & Documentation"
        },
        {
            name: "Ahmad Tomeh",
            role: "Frontend Developer & UI/UX Designer",
            responsibilities: "Home Page, Posts Creation & Interaction",
            specialty: "Frontend Development & Design"
        }
    ];

    const keyFeatures = [
        {
            icon: <Users className="w-6 h-6 text-primary" />,
            title: "Authentication & Profiles",
            description: "Secure user registration, login, and profile customization"
        },
        {
            icon: <BookOpen className="w-6 h-6 text-primary" />,
            title: "Content Management",
            description: "Create, edit, and manage posts about AI tools with detailed reviews"
        },
        {
            icon: <Search className="w-6 h-6 text-primary" />,
            title: "Search & Discovery",
            description: "Filter and search tools by categories for easy discovery"
        }
    ];

    const problemsSolved = [
        "Overwhelming number of AI tools released weekly",
        "Scattered and biased information across platforms",
        "Difficulty finding specialized tools quickly",
        "Lack of trust and credibility in existing reviews"
    ];

    const techStack = [
        "React + Vite + TypeScript",
        "TailwindCSS + shadcn/ui",
        "React Router v6",
        "React Context for State Management",
        "Axios for API requests",
        "Framer Motion for Animations"
    ];

    return (
        <div className="min-h-screen to-accent/10">
            {/* Hero Section */}
            <section className="relative py-20 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                        <Lightbulb className="w-4 h-4" />
                        <span className="text-sm font-medium">AI Tools Discovery Platform</span>
                    </div>

                    <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Welcome to AiHBridge
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                        Your community-driven hub for discovering, sharing, and reviewing AI tools across design, programming, business, and education.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        <Badge variant="outline" className="px-4 py-2">
                            <Github className="w-4 h-4 mr-2" />
                            Open Source Project
                        </Badge>
                        <Badge variant="outline" className="px-4 py-2">
                            <Trello className="w-4 h-4 mr-2" />
                            Agile Development
                        </Badge>
                        <Badge variant="outline" className="px-4 py-2">
                            <Users className="w-4 h-4 mr-2" />
                            Community Driven
                        </Badge>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Creating a simple, professional, and community-driven platform where users can make informed decisions about AI tools through authentic community insights.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <Card className="p-6 hover:shadow-lg transition-shadow">
                            <CardContent className="p-0">
                                <div className="flex items-center gap-3 mb-4">
                                    <Target className="w-8 h-8 text-primary" />
                                    <h3 className="text-xl font-semibold">What We're Solving</h3>
                                </div>
                                <ul className="space-y-3">
                                    {problemsSolved.map((problem, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                                            <span className="text-muted-foreground">{problem}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="p-6 hover:shadow-lg transition-shadow">
                            <CardContent className="p-0">
                                <div className="flex items-center gap-3 mb-4">
                                    <Lightbulb className="w-8 h-8 text-primary" />
                                    <h3 className="text-xl font-semibold">Our Solution</h3>
                                </div>
                                <p className="text-muted-foreground mb-4">
                                    AiHBridge acts as a centralized reference hub where authentic user reviews and community feedback help individuals discover the right AI tools for their specific needs.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="secondary">Authentic Reviews</Badge>
                                    <Badge variant="secondary">Community Driven</Badge>
                                    <Badge variant="secondary">Easy Discovery</Badge>
                                    <Badge variant="secondary">Trusted Sources</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Key Features */}
            <section className="py-16 px-6 ">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Key Features</h2>
                        <p className="text-lg text-muted-foreground">
                            Everything you need to discover and share AI tools effectively
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {keyFeatures.map((feature, index) => (
                            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                                <CardContent className="p-0">
                                    <div className="flex justify-center mb-4">
                                        <div className="p-3 bg-primary/10 rounded-lg">
                                            {feature.icon}
                                        </div>
                                    </div>
                                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
                        <p className="text-lg text-muted-foreground">
                            Part of the Market Ready Developer Training – Cohort 2
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {teamMembers.map((member, index) => (
                            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                                <CardContent className="p-0">
                                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-4 mx-auto">
                                        <span className="text-white font-bold text-lg">
                                            {member.name.split(' ').map(n => n[0]).join('')}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-center mb-2">{member.name}</h3>
                                    <p className="text-sm text-primary text-center mb-3">{member.role}</p>
                                    <p className="text-xs text-muted-foreground text-center">{member.responsibilities}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Development Info */}
            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-2xl font-bold mb-6">Development Timeline</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-primary rounded-full" />
                                    <span className="text-sm">
                                        <strong>Phase 1:</strong> Planning & Requirements (Aug 16-21)
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-primary rounded-full" />
                                    <span className="text-sm">
                                        <strong>Phase 2:</strong> System & UI Design (Aug 22-27)
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-primary rounded-full" />
                                    <span className="text-sm">
                                        <strong>Phase 3:</strong> Frontend Development (Aug 28 - Sep 2)
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-primary rounded-full" />
                                    <span className="text-sm">
                                        <strong>Phase 4:</strong> Backend & Integration (Sep 3-11)
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-primary rounded-full" />
                                    <span className="text-sm">
                                        <strong>Phase 5:</strong> Testing & QA (Sep 12-16)
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-primary rounded-full" />
                                    <span className="text-sm">
                                        <strong>Phase 6:</strong> Deployment & Documentation (Sep 17-20)
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold mb-6">Technology Stack</h3>
                            <div className="flex flex-wrap gap-2">
                                {techStack.map((tech, index) => (
                                    <Badge key={index} variant="outline" className="mb-2">
                                        {tech}
                                    </Badge>
                                ))}
                            </div>

                            <div className="mt-8">
                                <h4 className="font-semibold mb-4">Project Links</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Github className="w-4 h-4" />
                                        <span className="text-sm text-muted-foreground">GitHub Repository</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Trello className="w-4 h-4" />
                                        <span className="text-sm text-muted-foreground">Trello Project Board</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Community Section */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Whether you're a developer looking for the latest AI tools, a business owner seeking automation solutions,
                        or an educator exploring AI for learning, AiHBridge is your gateway to discovering the right tools through
                        authentic community experiences.
                    </p>

                    <Card className="p-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                        <CardContent className="p-0">
                            <div className="flex justify-center gap-8 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-primary mb-2">11</div>
                                    <div className="text-sm text-muted-foreground">Use Cases</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-primary mb-2">4</div>
                                    <div className="text-sm text-muted-foreground">Categories</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-primary mb-2">∞</div>
                                    <div className="text-sm text-muted-foreground">AI Tools</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
};

export default AboutUsPage;