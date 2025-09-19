// src/components/common/AuthStatus.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, LogOut, RefreshCw, Shield, Clock } from 'lucide-react';
import { tokenManager } from '@/utils/tokenManager';

export const AuthStatus: React.FC = () => {
    const { user, isAuthenticated, logout, refreshUser } = useAuth();

    if (!isAuthenticated || !user) {
        return null;
    }

    const handleLogout = () => {
        logout();
    };

    const handleRefreshUser = async () => {
        try {
            await refreshUser();
        } catch (error) {
            console.error('Failed to refresh user:', error);
        }
    };

    const tokenData = tokenManager.getTokenData();
    const tokenExpiry = tokenManager.getTokenExpiryTime();

    return (
        <Card className="m-4">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                    <Shield className="h-5 w-5" />
                    Authentication Status
                </CardTitle>
                <CardDescription>
                    Current session information
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* User Info */}
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex-shrink-0">
                        {user.profile_picture ? (
                            <img
                                src={user.profile_picture}
                                alt={user.name}
                                className="h-10 w-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                                <User className="h-5 w-5 text-white" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {user.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                            {user.email}
                        </p>
                        {user.bio && (
                            <p className="text-xs text-gray-400 mt-1">
                                {user.bio}
                            </p>
                        )}
                    </div>
                </div>

                {/* Token Information */}
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Token Information</h4>
                    <div className="text-xs text-gray-500 space-y-1">
                        <div className="flex justify-between">
                            <span>Access Token:</span>
                            <span className="font-mono">
                                {tokenData?.accessToken ? '✓ Present' : '✗ Missing'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Refresh Token:</span>
                            <span className="font-mono">
                                {tokenData?.refreshToken ? '✓ Present' : '✗ Missing'}
                            </span>
                        </div>
                        {tokenExpiry && (
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    Token Expires:
                                </span>
                                <span className="font-mono text-xs">
                                    {tokenExpiry.toLocaleString()}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Interests */}
                {user.interests && user.interests.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">Interests</h4>
                        <div className="flex flex-wrap gap-1">
                            {user.interests.map((interest: string, index: number) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                                >
                                    {interest}
                                </span>
                            ))}

                            {/* {user.interests.map((interest, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                                >
                                    {interest}
                                </span>
                            ))} */}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t">
                    <Button
                        onClick={handleRefreshUser}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                    >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Refresh User
                    </Button>
                    <Button
                        onClick={handleLogout}
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                    >
                        <LogOut className="h-4 w-4 mr-1" />
                        Logout
                    </Button>
                </div>

                {/* Session Storage Info */}
                <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500">
                        Session will expire when browser tab is closed
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

function useAuth(): { user: any; isAuthenticated: any; logout: any; refreshUser: any; } {
    throw new Error('Function not implemented.');
}
