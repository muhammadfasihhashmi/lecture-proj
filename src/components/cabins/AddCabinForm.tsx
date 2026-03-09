import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCabin } from "@/services/cabins.services";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const addCabinFormSchema = z
  .object({
    name: z
      .string("Enter cabin name")
      .min(3, "Please enter a valid name")
      .max(50, "Name should not exceed 50 characters"),
    maxCapacity: z
      .transform(Number)
      .pipe(
        z
          .number("Enetr cabin capacity")
          .min(1, "Enter a valid capacity")
          .max(20, "Cannot host more than 20 guests"),
      ),
    regularPrice: z
      .transform(Number)
      .pipe(
        z
          .number("Enter cabin price")
          .min(1, "Enter a cabin price")
          .max(10000, "Price is too high"),
      ),
    discount: z
      .transform(Number)
      .pipe(
        z
          .number("Enter 0 if no discount")
          .min(0, "Discount cannot be negative")
          .max(10000, "Discount is too high"),
      ),
    description: z
      .string("Missing description")
      .min(10, "Description must be at least 10 characters")
      .max(300, "Description is too long"),
    image: z.instanceof(File, { message: "Please select an image" }),
  })
  .refine((data) => data.discount < data.regularPrice, {
    message: "Discount must be less than regular price",
    path: ["discount"],
  });

export type AddCabinInputsType = z.infer<typeof addCabinFormSchema>;

function AddCabinForm() {
  const queryClient = useQueryClient();
  const form = useForm<AddCabinInputsType>({
    resolver: zodResolver(addCabinFormSchema),
    defaultValues: {
      name: "",
      maxCapacity: 0,
      discount: 0,
      regularPrice: 0,
      description: "",
    },
  });

  const { mutate: addCabinApi, isPending: isAddingCabin } = useMutation({
    mutationKey: ["add-cabin"],
    mutationFn: addCabin,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function onSubmit(values: AddCabinInputsType) {
    addCabinApi(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cabin name</FormLabel>
              <FormControl>
                <Input placeholder="Enter cabin name" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="maxCapacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacity</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter cabin capacity"
                  type="number"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="regularPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter cabin price"
                  type="number"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="discount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter cabin discount"
                  type="number"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter cabin description"
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field: { onChange, ref } }) => (
            <FormItem>
              <FormLabel>image</FormLabel>
              <FormControl>
                <Input
                  className="cursor-pointer file:px-2
                     file:rounded-md file:border-0 file:text-s file:font-semibold file:text-indigo-600 hover:file:bg-indigo-100 hover:cursor-pointer"
                  type="file"
                  accept="image/*"
                  onChange={(e) => onChange(e.target.files?.[0])}
                  ref={ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-3">
          <Button
            variant={"outline"}
            className=" cursor-pointer mt-5"
            type="button"
            // onClick={() => {
            //   form.reset();
            //   setShow(false);
            // }}
            disabled={isAddingCabin}
          >
            Cancel
          </Button>
          <Button
            disabled={isAddingCabin}
            className="self-center bg-indigo-600 hover:bg-indigo-500 cursor-pointer mt-5"
            type="submit"
          >
            {isAddingCabin ? (
              <>
                creating
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              </>
            ) : (
              "Create cabin"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default AddCabinForm;
