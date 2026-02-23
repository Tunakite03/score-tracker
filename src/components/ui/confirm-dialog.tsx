import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onConfirm: () => void;
   title: string;
   description: string;
   confirmText?: string;
   cancelText?: string;
   variant?: 'danger' | 'warning';
}

export function ConfirmDialog({
   open,
   onOpenChange,
   onConfirm,
   title,
   description,
   confirmText = 'Confirm',
   cancelText = 'Cancel',
   variant = 'danger',
}: ConfirmDialogProps) {
   const handleConfirm = () => {
      onConfirm();
      onOpenChange(false);
   };

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className='sm:max-w-md'>
            <DialogHeader>
               <div className='flex items-center gap-3 mb-2'>
                  <div
                     className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        variant === 'danger' ? 'bg-red-100' : 'bg-amber-100'
                     }`}
                  >
                     <AlertTriangle
                        className={`w-6 h-6 ${variant === 'danger' ? 'text-red-600' : 'text-amber-600'}`}
                     />
                  </div>
                  <DialogTitle className='text-lg'>{title}</DialogTitle>
               </div>
               <DialogDescription className='text-base leading-relaxed'>{description}</DialogDescription>
            </DialogHeader>
            <DialogFooter className='flex-row gap-2 sm:gap-2'>
               <Button
                  type='button'
                  variant='outline'
                  onClick={() => onOpenChange(false)}
                  className='flex-1'
               >
                  {cancelText}
               </Button>
               <Button
                  type='button'
                  onClick={handleConfirm}
                  className={`flex-1 ${
                     variant === 'danger'
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-amber-600 hover:bg-amber-700 text-white'
                  }`}
               >
                  {confirmText}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
