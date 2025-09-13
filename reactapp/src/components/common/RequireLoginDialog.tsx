import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface RequireLoginDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function RequireLoginDialog({
    open,
    onOpenChange,
}: RequireLoginDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className=" w-[90%] top-50 -ml-50  text-center rounded-2xl shadow-lg">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold">
                        Login Required
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600">
                        You need an account to like, save, or comment on posts.
                        <br />
                        Please log in or sign up to continue.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogAction
                    className="mx-auto w-32 mt-4"
                    onClick={() => onOpenChange(false)}
                >
                    OK
                </AlertDialogAction>
            </AlertDialogContent>
        </AlertDialog>
    );
}
