import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import useFetch from "@/hooks/useFetch";
import { addNewCompany } from "@/api/apiCompanies";
import { BarLoader } from "react-spinners";
import { useEffect } from "react";

const schema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  logo: z
    .any()
    .refine((file) => file?.length > 0, {
      message: "Company Logo is required",
    })
    .refine(
      (file) =>
        file?.[0] &&
        (file[0].type === "image/png" ||
          file[0].type === "image/jpeg" ||
          file[0].type === "image/webp"),
      { message: "Only PNG, JPEG or WEBP images are allowed" }
    ),
});

const AddCompany = ({ fetchCompanies }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const {
    loading: loadingAddCompany,
    fn: fnAddCompany,
    error: errorAddCompany,
    data: dataAddCompany,
  } = useFetch(addNewCompany);

  const onSubmit = (data) => {
    fnAddCompany({
      ...data,
      logo: data.logo[0],
    });
  };
  useEffect(() => {
    if (dataAddCompany?.length > 0) fetchCompanies();
  }, [loadingAddCompany, dataAddCompany, fetchCompanies]);

  return (
    <Drawer>
      <DrawerTrigger>
        <Button variant={"outline"} type={"button"}>
          Add Company
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add A New Company</DrawerTitle>
        </DrawerHeader>

        <form className="flex gap-4 p-4 pb-0">
          <Input
            type="text"
            placeholder={"Company Name"}
            {...register("name")}
          />

          <Input
            type="file"
            accept="image/*"
            {...register("logo")}
            className={"px-3 text-gray-600"}
          />
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="bg-[#118ab2] hover:bg-[#0d6c8f] text-amber-50"
          >
            Add Logo
          </Button>
        </form>
        {errors.name && (
          <p className="text-orange-500">{errors.name.message}</p>
        )}
        {errors.logo && (
          <p className="text-orange-500">{errors.logo.message}</p>
        )}
        {loadingAddCompany && <BarLoader color="#ff7b00" width={"100%"} />}
        {errorAddCompany?.message && (
          <p className="text-orange-500">{errorAddCompany?.message}</p>
        )}
        <DrawerFooter>
          <DrawerClose>
            <Button
              type={"button"}
              className="bg-[#ef476f] hover:bg-[#d93a5d] text-amber-50 w-full"
            >
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddCompany;
