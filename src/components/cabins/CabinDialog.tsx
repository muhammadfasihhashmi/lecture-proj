import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

function CabinDialog({
  btn,
  heading,
  description,
  cabinForm,
  variant,
}: {
  btn: string;
  heading: string;
  description: string;
  cabinForm: React.ReactNode;
  variant: string;
}) {
  return (
    <Dialog>
      {variant === "button" ? (
        <DialogTrigger asChild>
          <Button className="h-18 w-50">{btn}</Button>
        </DialogTrigger>
      ) : (
        <DialogTrigger>{btn}</DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">{heading}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>
        <>{cabinForm}</>
      </DialogContent>
    </Dialog>
  );
}

export default CabinDialog;
