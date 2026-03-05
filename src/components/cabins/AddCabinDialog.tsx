import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import AddCabinForm from "./AddCabinForm";

function AddCabinDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-18 w-50">Add Cabin</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">New Cabin</DialogTitle>
          <DialogDescription className="text-center">
            Add a beautiful cabin to your collection
          </DialogDescription>
        </DialogHeader>
        <AddCabinForm />
      </DialogContent>
    </Dialog>
  );
}

export default AddCabinDialog;
