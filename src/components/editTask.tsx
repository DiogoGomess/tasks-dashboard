import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CreateTaskSchema } from "./addTask";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    task: {
        _id: string;
        title: string;
        type: string;
        completed: boolean;
        dueDate: string;
        priority: string;
    };
};

export function EditTask({ isOpen, onClose, task }: ModalProps) {
    const queryClient = useQueryClient();
    const [_, setSelectedPriority] = useState(task.priority);
    const { register, handleSubmit, reset } = useForm<CreateTaskSchema>();

    const { mutateAsync } = useMutation({
        mutationFn: async (formData: CreateTaskSchema) => {
            const response = await axios.put(`https://todolist-backend-5zde.onrender.com/${task._id}`, formData);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Tarefa editada com sucesso!');
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            onClose();
            reset();
        },
        onError: () => {
            toast.error('Erro ao editar a tarefa');
        }
    });

    const onSubmit = handleSubmit(async (formData: CreateTaskSchema) => {
        try {
            await mutateAsync(formData);
        } catch (error) {
            console.error(error);
        }
    });

    const handleClose = () => {
        onClose();
        reset(); // Reset do formulário
    };

    return (
        <div>
            {isOpen && (
                <Dialog open={isOpen} onOpenChange={handleClose}>
                    <DialogContent className="sm:max-w-[425px] bg-zinc-100 rounded">
                        <DialogHeader>
                            <DialogTitle>Edit Task</DialogTitle>
                            <DialogDescription>Edit your task.</DialogDescription>
                        </DialogHeader>
                        <form className="grid gap-4 py-4" onSubmit={onSubmit}>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">
                                    Title
                                </Label>
                                <Input required id="title" className="col-span-3" defaultValue={task.title} {...register('title')} />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="type" className="text-right">
                                    Type
                                </Label>
                                <Input required id="type" className="col-span-3" defaultValue={task.type} {...register('type')} />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="beCompleted" className="text-right">
                                    Day To Be Completed
                                </Label>
                                <Input required id="beCompleted" className="col-span-3" defaultValue={task.dueDate} {...register('dueDate')} />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="priority" className="text-right">
                                    Priority
                                </Label>
                                <Select required defaultValue={task.priority} onValueChange={(value )=> setSelectedPriority(value)
                                }>
                                    <SelectTrigger className="col-span-3 rounded-[7px] font-semibold">
                                        <SelectValue >{task.priority}</SelectValue>
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
                                <Button className="bg-zinc-950 text-white hover:bg-zinc-800 rounded-[7px]" type="submit">Save Changes</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
