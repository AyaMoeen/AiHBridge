// src/components/common/DemoCredentials.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, User, Lock } from 'lucide-react';

interface DemoCredentialsProps {
    onFillCredentials: (email: string, password: string) => void;
}

export const DemoCredentials: React.FC<DemoCredentialsProps> = ({ onFillCredentials }) => {
    const demoEmail = 'john@example.com';
    const demoPassword = 'password123';

    const handleFillCredentials = () => {
        onFillCredentials(demoEmail, demoPassword);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Demo Credentials
                </CardTitle>
                <CardDescription className="text-blue-600">
                    Use these credentials to test the login functionality (Mock API)
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-sm">Email:</span>
                        <span className="text-sm text-gray-700">{demoEmail}</span>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(demoEmail)}
                        className="h-7 px-2"
                    >
                        <Copy className="h-3 w-3" />
                    </Button>
                </div>

                <div className="flex items-center justify-between p-2 bg-white rounded border">
                    <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-sm">Password:</span>
                        <span className="text-sm text-gray-700">{demoPassword}</span>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(demoPassword)}
                        className="h-7 px-2"
                    >
                        <Copy className="h-3 w-3" />
                    </Button>
                </div>

                <Button
                    onClick={handleFillCredentials}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                >
                    Fill Credentials Automatically
                </Button>
            </CardContent>
        </Card>
    );
};