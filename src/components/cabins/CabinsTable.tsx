import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "../ui/card";
import { useQuery } from "@tanstack/react-query";
import { getCabins } from "@/services/cabins.services";
import { EllipsisVertical } from "lucide-react";
import { Button } from "../ui/button";
import CabinDialog from "./CabinDialog";
import AddCabinForm from "./AddCabinForm";
import EditCabinForm from "./EditCabinForm";

const headers = ["Cabins", "Capacity", "Price", "Discount", ""];

function CabinsTable() {
  const { data: cabins } = useQuery({
    queryKey: ["cabins"],
    queryFn: getCabins,
  });

  return (
    <div className="flex flex-col gap-10">
      <h1 className=" text-4xl font-bold">All Cabins</h1>
      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header, ind) => (
                <TableHead className="w-25" key={ind}>
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {cabins?.map((cabin) => (
              <TableRow key={cabin.id}>
                <TableCell>
                  <img src={cabin.image} className="h-50" />
                </TableCell>
                <TableCell>{cabin.name}</TableCell>
                <TableCell>{cabin.regularPrice}</TableCell>
                <TableCell>{cabin.maxCapacity}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <EllipsisVertical />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuGroup>
                        <DropdownMenuItem>duplicate</DropdownMenuItem>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <CabinDialog
                            variant="actions"
                            btn="edit cabin"
                            heading="edit your cabin here"
                            description="hello i am teaching aima dry principle"
                            cabinForm={<EditCabinForm cabin={cabin} />}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem>delete</DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            <TableRow></TableRow>
          </TableBody>
        </Table>
      </Card>
      <CabinDialog
        btn="add cabin"
        heading="add new cabin"
        description="add a new cabin to ur space"
        cabinForm={<AddCabinForm />}
        variant="button"
      />
    </div>
  );
}

export default CabinsTable;
