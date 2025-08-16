"use client"
import { useIsMobile } from "@/hooks/use-mobile";
import {
    Dialog,
    DialogContent,
    DialogHeader, 
    DialogTitle,
    DialogDescription 
} from "@/components/ui/dialog"

import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription
} from "@/components/ui/drawer"

interface ResponsiveDialogProps {
    title: string,
    descriptioin: string,
    children: React.ReactNode,
    open: boolean,
    onOpenChange: (open: boolean) => void;
};

export const ResponsiveDialog = ({
    title,
    descriptioin,
    children,
    open,
    onOpenChange
}: ResponsiveDialogProps) => {
    const isMobile = useIsMobile();

    if(isMobile){
        return(
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>
                            {title}
                        </DrawerTitle>
                        <DrawerDescription>
                            {descriptioin}
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4">
                        {children}
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription> { descriptioin } </DialogDescription>
                </DialogHeader>
                { children }
            </DialogContent>
        </Dialog>
    )
}