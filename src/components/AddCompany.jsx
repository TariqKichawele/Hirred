import { createCompany } from "@/api/companies";
import { 
    Drawer, 
    DrawerTrigger, 
    DrawerContent, 
    DrawerHeader, 
    DrawerTitle, 
    DrawerFooter, 
    DrawerClose 
} from "@/components/ui/drawer"
import useFetch from "@/hooks/usefetch";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BarLoader } from "react-spinners";
import { useEffect } from "react";

const schema = z.object({
    name: z.string().min(1, { message: "Company name is required" }),
    logo: z
      .any()
      .refine(
        (file) =>
          file[0] &&
          (file[0].type === "image/png" || 
          file[0].type === "image/jpeg" || 
          file[0].type === "image/jpg" || 
          file[0].type === "image/webp" ||
          file[0].type === "image/svg+xml"),
        {
          message: "Only Images are allowed",
        }
      ),
})

// eslint-disable-next-line react/prop-types
const AddCompanyDrawer = ({ fetchCompanies }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });

    const { 
        fn: createCompanyFn, 
        isLoading: isLoadingCompany, 
        error: errorCompany, 
        data: dataCompany 
    } = useFetch(createCompany)

    const onSubmit = async (data) => {
        createCompanyFn({
            ...data,
            logo: data.logo[0]
        });
    };

    useEffect(() => {
        if(dataCompany?.length > 0) {
            fetchCompanies();
        }
    }, [isLoadingCompany, dataCompany?.length, fetchCompanies])


  return (
    <Drawer>
      <DrawerTrigger>
        <Button type="button" size="sm" variant="secondary">
          Add Company
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add a New Company</DrawerTitle>
        </DrawerHeader>
        <form className="flex gap-2 p-4 pb-0">
          {/* Company Name */}
          <Input 
            placeholder="Company name"
            {...register("name")}
          />

          {/* Company Logo */}
          <Input
            type="file"
            accept="image/*"
            className=" file:text-gray-500"
            {...register("logo")}
          />

          {/* Add Button */}
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            variant="destructive"
            className="w-40"
          >
            Add
          </Button>
        </form>
        <DrawerFooter>
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          {errors.logo && <p className="text-red-500">{errors.logo.message}</p>}
          {errorCompany?.message && (
            <p className="text-red-500">{errorCompany?.message}</p>
          )}
          {isLoadingCompany && <BarLoader width={"100%"} color="#36d7b7" />}
          <DrawerClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default AddCompanyDrawer