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
import { editCabin } from "@/services/cabins.services";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Cabins } from "@/types/cabins.types";

// ── Schema ────────────────────────────────────────────────────────────────────
const editCabinFormSchema = z
  .object({
    name: z
      .string()
      .min(3, "Please enter a valid name")
      .max(50, "Name should not exceed 50 characters"),
    // Keep numbers as plain numbers — no transforms — so input === output type
    maxCapacity: z
      .number({ message: "Enter a valid capacity" })
      .min(1, "Enter a valid capacity")
      .max(20, "Cannot host more than 20 guests"),
    regularPrice: z
      .number({ message: "Enter a cabin price" })
      .min(1, "Enter a cabin price")
      .max(10000, "Price is too high"),
    discount: z
      .number({ message: "Enter 0 if no discount" })
      .min(0, "Discount cannot be negative")
      .max(10000, "Discount is too high"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(300, "Description is too long"),
    image: z.instanceof(File).optional(),
  })
  .refine((data) => data.discount < data.regularPrice, {
    message: "Discount must be less than regular price",
    path: ["discount"],
  });

// Both input and output are the same type (no transforms) ─ no mismatch
type EditCabinFormValues = z.infer<typeof editCabinFormSchema>;

// ── Component ─────────────────────────────────────────────────────────────────
function EditCabinForm({ cabin }: { cabin: Cabins }) {
  const queryClient = useQueryClient();

  const form = useForm<EditCabinFormValues>({
    resolver: zodResolver(editCabinFormSchema),
    defaultValues: {
      name: cabin.name,
      maxCapacity: cabin.maxCapacity,
      regularPrice: cabin.regularPrice,
      discount: cabin.discount ?? 0,
      description: cabin.description,
      image: undefined,
    },
  });

  const { mutate: editCabinApi, isPending: isEditingCabin } = useMutation({
    mutationKey: ["edit-cabin", cabin.id],
    mutationFn: editCabin,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
      toast.success(data.message);
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function onSubmit(values: EditCabinFormValues) {
    editCabinApi({ id: cabin.id, updatedCabin: values });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
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

        {/* Capacity */}
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
                  // keep RHF value as number, not string
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price */}
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
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Discount */}
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
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
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

        {/* Image — optional, shows current image as hint */}
        <FormField
          control={form.control}
          name="image"
          render={({ field: { onChange, ref } }) => (
            <FormItem>
              <FormLabel>
                Image{" "}
                <span className="text-muted-foreground text-xs font-normal">
                  (leave empty to keep current)
                </span>
              </FormLabel>
              {cabin.image && (
                <img
                  src={cabin.image}
                  alt="current cabin"
                  className="h-24 w-40 rounded-md object-cover mb-1"
                />
              )}
              <FormControl>
                <Input
                  className="cursor-pointer file:px-2 file:rounded-md file:border-0 file:text-sm file:font-semibold file:text-indigo-600 hover:file:bg-indigo-100 hover:cursor-pointer"
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
            variant="outline"
            className="cursor-pointer mt-5"
            type="button"
            onClick={() => form.reset()}
            disabled={isEditingCabin}
          >
            Reset
          </Button>
          <Button
            disabled={isEditingCabin}
            className="self-center bg-indigo-600 hover:bg-indigo-500 cursor-pointer mt-5"
            type="submit"
          >
            {isEditingCabin ? (
              <>
                Saving
                <Loader2 className="animate-spin ml-2 h-4 w-4" />
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default EditCabinForm;
