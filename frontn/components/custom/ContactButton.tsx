import { Button } from "../ui/button";
import { Mail } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function ContactButton() {
  return (


        <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button
            className="bg-[#8343FF] font-semibold tracking-tighter  border-2 border-black py-6 text-2xl hover:bg-[#733cdf] cursor-pointer rounded-2xl shadow-[0px_6px_0px_0px_rgba(0,_0,_0,_0.8)] hover:shadow-[0px_2px_0px_0px_rgba(0,_0,_0,_0.8)] hover:translate-y-2"
            >
                <div className="flex flex-row items-center justify-center gap-3 p-4">
                    <Mail className="size-6" strokeWidth={3} /> Contact
                </div>
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="border-3 border-black bg-[#ffffff]">
            <AlertDialogHeader>
            <AlertDialogTitle className="text-black text-xl">Envie de me contacter ?</AlertDialogTitle>
            <AlertDialogDescription className="text-lg space-x-2">
                Pour un projet, une collaboration ou simplement pour échanger, n'hésitez pas à me contacter via :

            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#8343FF] font-semibold tracking-tighter  text-white hover:text-white border-2 border-black py-4 text-lg hover:bg-[#733cdf] cursor-pointer rounded-2xl shadow-[0px_6px_0px_0px_rgba(0,_0,_0,_0.8)] hover:shadow-[0px_2px_0px_0px_rgba(0,_0,_0,_0.8)] hover:translate-y-2"
            >
                Annuler
            </AlertDialogCancel>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
  );
}
