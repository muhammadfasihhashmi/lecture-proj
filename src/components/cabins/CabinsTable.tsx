import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "../ui/card";
import { useQuery } from "@tanstack/react-query";
import { getCabins } from "@/services/cabins.services";
import AddCabinDialog from "./AddCabinDialog";

const headers = ["Cabins", "Capacity", "Price", "Discount"];

function CabinsTable() {
  const { data: cabins } = useQuery({
    queryKey: ["cabins"],
    queryFn: getCabins,
  });
  console.log(cabins);

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
              </TableRow>
            ))}
            <TableRow></TableRow>
          </TableBody>
        </Table>
      </Card>
      <AddCabinDialog />
    </div>
  );
}

export default CabinsTable;
