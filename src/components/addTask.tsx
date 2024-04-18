import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { PlusCircle } from "lucide-react"
import { useForm } from 'react-hook-form'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from 'sonner'
import axios from "axios"



const createTaskSchema = z.object({
    title: z.string().min(3).max(255),
    type: z.string().min(3).max(255),
    dueDate: z.string().min(3).max(255),
    completed: z.boolean(),
    priority: z.string().min(3).max(255),
})

export type CreateTaskSchema = z.infer<typeof createTaskSchema>

export function AddTask() {
    const [open, setOpen] = useState(false);
    const [selectedPriority, setSelectedPriority] = useState("");
    const queryClient = useQueryClient()
    const { register, handleSubmit, reset } = useForm<CreateTaskSchema>()

    const { mutateAsync: createTaskFn } = useMutation({
        mutationFn: async (data: CreateTaskSchema) => {
            try {
                const response = await axios.post('https://todolist-backend-5zde.onrender.com', {
                    title: data.title,
                    type: data.type,
                    dueDate: data.dueDate,
                    completed: false,
                    priority: data.priority,
                });
                return response.data;
            } catch (error) {
                console.error('Erro ao criar tarefa:', error);
                throw error; // Relança o erro para ser capturado pelo código que chama a mutationFn
            }
        },
        onSuccess() {
            queryClient.invalidateQueries({queryKey:['tasks']});
            reset()
        }
    })

    async function handleCreateTask(data: CreateTaskSchema) {
        const capitalizedPriority = selectedPriority.charAt(0).toUpperCase() + selectedPriority.slice(1);

        try {

            await createTaskFn({
                title: data.title,
                type: data.type,
                dueDate: data.dueDate,
                completed: false,
                priority: capitalizedPriority,
            })
            toast.success('Tarefa criada com sucesso!')
            setOpen(false);



        } catch (err) {
            toast.error('Erro ao criar tarefa.')
        }


    }

    return (
        <div className='flex justify-between items-center py-7 pr-20'>
            <h1 className='font-bold text-lg px-7'>My Tasks</h1>


            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <a href="#" className='flex gap-2 bg-zinc-950 text-white outline-none rounded-[7px] py-2 px-5 font-semibold hover:bg-zinc-900'>
                        <PlusCircle />
                        Add Task
                    </a>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-zinc-100 rounded">
                    <DialogHeader>
                        <DialogTitle>New Task</DialogTitle>
                        <DialogDescription>
                            Add new task to your list.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(handleCreateTask)} className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <Input required id="title" className="col-span-3" {...register('title')} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">
                                Type
                            </Label>
                            <Input required id="type" className="col-span-3" {...register('type')} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="beCompleted" className="text-right">
                                Day To Be Completed
                            </Label>
                            <Input required id="beCompleted" className="col-span-3" {...register('dueDate')} />

                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="beCompleted" className="text-right">
                                Priority
                            </Label>
                            <Select required onValueChange={(value) => setSelectedPriority(value)}>
                                <SelectTrigger className="col-span-3 rounded-[7px] font-semibold">
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-50 rounded-[7px]">
                                    <SelectGroup>
                                        <SelectLabel>Priority</SelectLabel>
                                        <SelectItem value="normal" className="hover:bg-zinc-800">Normal</SelectItem>
                                        <SelectItem value="important" className="hover:bg-zinc-800">Important</SelectItem>
                                        <SelectItem value="urgent" className="hover:bg-zinc-800">Urgent</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                        </div>
                        <DialogFooter>
                            <Button className="bg-zinc-950 text-white hover:bg-zinc-800 rounded-[7px]" type="submit">Add Task</Button>
                        </DialogFooter>
                    </form>

                </DialogContent>
            </Dialog>

        </div>
    )
}