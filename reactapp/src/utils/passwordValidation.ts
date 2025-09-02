export interface PasswordStrength {
    score: number; // 0-4
    feedback: string[];
    isValid: boolean;
}

export interface PasswordRequirement {
    label: string;
    met: boolean;
}

export function validatePassword(password: string): PasswordStrength {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) {
        score += 1;
    } else {
        feedback.push("At least 8 characters");
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
        score += 1;
    } else {
        feedback.push("At least one lowercase letter");
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
        score += 1;
    } else {
        feedback.push("At least one uppercase letter");
    }

    // Number check
    if (/\d/.test(password)) {
        score += 1;
    } else {
        feedback.push("At least one number");
    }

    // Special character check
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
        score += 1;
    } else {
        feedback.push("At least one special character");
    }

    return {
        score: Math.min(score, 4),
        feedback,
        isValid: score >= 4 && password.length >= 8
    };
}

export function getPasswordRequirements(password: string): PasswordRequirement[] {
    return [
        {
            label: "At least 8 characters",
            met: password.length >= 8
        },
        {
            label: "At least one lowercase letter",
            met: /[a-z]/.test(password)
        },
        {
            label: "At least one uppercase letter",
            met: /[A-Z]/.test(password)
        },
        {
            label: "At least one number",
            met: /\d/.test(password)
        },
        {
            label: "At least one special character",
            met: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
        }
    ];
}

export function getPasswordStrengthLabel(score: number): string {
    switch (score) {
        case 0:
        case 1:
            return "Very Weak";
        case 2:
            return "Weak";
        case 3:
            return "Good";
        case 4:
            return "Strong";
        default:
            return "Very Weak";
    }
}

export function getPasswordStrengthColor(score: number): string {
    switch (score) {
        case 0:
        case 1:
            return "bg-red-500";
        case 2:
            return "bg-orange-500";
        case 3:
            return "bg-yellow-500";
        case 4:
            return "bg-green-500";
        default:
            return "bg-red-500";
    }
}
