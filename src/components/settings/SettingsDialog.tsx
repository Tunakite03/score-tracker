import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { useLanguage } from '@/i18n/LanguageContext';
import type { Language } from '@/i18n/translations';
import { Globe } from 'lucide-react';

interface SettingsDialogProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
   const { language, setLanguage, t } = useLanguage();

   const handleLanguageChange = (lang: Language) => {
      setLanguage(lang);
   };

   return (
      <Dialog
         open={open}
         onOpenChange={onOpenChange}
      >
         <DialogContent className='max-w-sm'>
            <DialogHeader>
               <DialogTitle className='flex items-center gap-2'>
                  <Globe className='w-5 h-5' />
                  {t('settings')}
               </DialogTitle>
               <DialogDescription className='sr-only'>{t('settings')} configuration options</DialogDescription>
            </DialogHeader>

            <div className='space-y-6 py-4'>
               {/* Language Section */}
               <div className='space-y-3'>
                  <h3 className='text-sm font-medium text-neutral-700'>{t('language')}</h3>
                  <div className='grid grid-cols-2 gap-2'>
                     <Button
                        variant={language === 'en' ? 'default' : 'outline'}
                        onClick={() => handleLanguageChange('en')}
                        className='w-full'
                     >
                        <span className='mr-2'>🇺🇸</span>
                        {t('english')}
                     </Button>
                     <Button
                        variant={language === 'vi' ? 'default' : 'outline'}
                        onClick={() => handleLanguageChange('vi')}
                        className='w-full'
                     >
                        <span className='mr-2'>🇻🇳</span>
                        {t('vietnamese')}
                     </Button>
                  </div>
               </div>

               {/* Theme Section (placeholder for future) */}
               {/* <div className="space-y-3">
            <h3 className="text-sm font-medium text-neutral-700">{t('theme')}</h3>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" className="w-full">
                {t('light')}
              </Button>
              <Button variant="outline" className="w-full">
                {t('dark')}
              </Button>
              <Button variant="outline" className="w-full">
                {t('system')}
              </Button>
            </div>
          </div> */}
            </div>

            <div className='flex justify-end pt-4 border-t'>
               <Button onClick={() => onOpenChange(false)}>{t('close')}</Button>
            </div>
         </DialogContent>
      </Dialog>
   );
}
