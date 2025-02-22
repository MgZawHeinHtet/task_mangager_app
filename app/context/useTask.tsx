import { useQuery, useQueryClient } from "@tanstack/react-query";
import getTasks from "../services/apiTasks"

export function useTask(){
    const queryClient = useQueryClient()

    const {isLoading,data ,error} = useQuery({
        queryKey: ["tasks"],
        queryFn:()=>  getTasks()
    })

}