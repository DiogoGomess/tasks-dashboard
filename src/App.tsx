import { Bell, ArrowUpNarrowWide, Blocks, Search, Pencil, X, Check } from 'lucide-react'
import { SideBar } from './components/sidebar'
import { AddTask } from './components/addTask'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Table,
  TableBody, TableCell, TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import axios from 'axios'
import { toast } from 'sonner'
import { EditTask } from './components/editTask'

export type TaskSchema = {
  _id: string,
  title: string,
  type: string,
  completed: boolean,
  dueDate: string,
  priority: string,
}

export function App() {
  const queryClient = useQueryClient();
  const [filterTask, setFilterTask] = useState('')
  const [editTask, setEditTask] = useState<TaskSchema | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [taskId, setTaskId] = useState('');
  const { data: tasks, isLoading } = useQuery<TaskSchema[]>({
    queryKey: ['tasks'],
    queryFn: () => axios.get('https://todolist-backend-5zde.onrender.com').then((response) => {

      return response.data
    }),
  })

  const { mutateAsync } = useMutation({
    mutationFn: async (taskId: string) => {
      return await axios.delete(`https://todolist-backend-5zde.onrender.com/${taskId}`).then((response) => response.data)
    },
    onSuccess: () => {
      setOpen(false);

      toast.success('Tarefa eliminada com sucesso!')
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

    },
    onError: () => {
      toast.error('Erro ao excluir a tarefa');
    }
  })

  const { mutateAsync: completeTaskFn } = useMutation({
    mutationFn: async (taskId: string) => {

      const response = await axios.put(`https://todolist-backend-5zde.onrender.com/${taskId}`, {
        completed: true
      })

      return response.data
    },
    onSuccess: () => {
      setOpen(false);

      toast.success('Tarefa completada!')
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

    },
    onError: () => {
      toast.error('Erro ao concluir a tarefa');
    }
  })

  const { mutateAsync: cancelTaskDoneFn } = useMutation({
    mutationFn: async (taskId: string) => {

      const response = await axios.put(`https://todolist-backend-5zde.onrender.com/${taskId}`, {
        completed: false,
      })

      return response.data
    },
    onSuccess: () => {
      setOpen(false);

      toast.success('Tarefa cancelada com sucesso!')
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

    },
    onError: () => {
      toast.error('Erro ao cancelar a tarefa');
    }
  })


  if (isLoading) {
    return <div>Loading...</div>
  }


  const openDialog = (task: TaskSchema) => {
    console.log(task);
    setEditTask(task);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };


  const filteredTasks = tasks?.filter((task) => task.title.toLowerCase().includes(filterTask.toLowerCase()))

  function removeTask(id: string) {
    setOpen(true)
    setTaskId(id)
    return taskId
  }



  return (
    <div className='flex relative'>
      <SideBar />
      <main className='flex-1  ml-72 overflow-y-auto'>
        <div className='bg-zinc-50 py-7 px-20 shadow-lg overflow-hidden'>
          <div className='flex justify-between items-center'>
            <strong className='text-2xl font-semibold'>Explore Task</strong>
            <div className='flex flex-row items-center gap-3'>
              <Bell size={20} />
              <img src="https://avatars.githubusercontent.com/u/72983510?v=4" className='size-12 object-cover rounded-full ring-2 ring-zinc-500' alt="" />
            </div>
          </div>
          <div className='flex items-center justify-between py-7'>
            <div className='relative'>
              <input
                type="text"
                placeholder='Search Task...'
                className='bg-transparent outline-none text-zinc-600 ring-1 ring-zinc-400/65 rounded-[7px] w-[400px] p-2 placeholder:text-zinc-600'
                value={filterTask}
                onChange={
                  (event) => {
                    setFilterTask(event.target.value)
                  }
                } />
              <Search size={20} className='pointer-events-none absolute top-1/2 transform -translate-y-1/2 right-3 text-zinc-600' />
            </div>
            <div className='flex gap-5'>
              <a href="#" className='flex gap-2 bg-transparent outline-none ring-1 ring-zinc-400/65 rounded-[7px] py-2 px-5 font-semibold hover:bg-zinc-200'>
                <Blocks />
                Category
              </a>
              <a href="#" className='flex gap-2 bg-transparent outline-none ring-1 ring-zinc-400/65 rounded-[7px] py-2 px-5 font-semibold hover:bg-zinc-200'>
                <ArrowUpNarrowWide />
                Sort by: Deadline
              </a>

            </div>
          </div>
        </div>

        <AddTask />
        <Table >
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Day to Complete</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks && filteredTasks?.map((task) => {
              return (
                task.completed ? (
                  <TableRow key={task._id}>
                    <TableCell className="font-medium line-through">{task.title}</TableCell>
                    <TableCell className='line-through'>{task.type}</TableCell>
                    <TableCell className='line-through'>{task.dueDate}</TableCell>
                    <TableCell className='line-through'>{task.priority}</TableCell>
                    <TableCell>
                      <p className='font-bold text-green-500'>Completed <span className='text-zinc-950'>/</span>
                        <span className='text-xs text-red-500 hover:underline cursor-pointer' onClick={() => cancelTaskDoneFn(task._id)}>Cancel</span></p>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={task._id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>{task.type}</TableCell>
                    <TableCell>{task.dueDate}</TableCell>
                    <TableCell>{task.priority}</TableCell>
                    <TableCell>
                      <div className='flex gap-2'>
                        <Pencil onClick={()=> {openDialog(task)}} className='hover:text-zinc-800' />
                        <X className='bg-red-600 rounded text-zinc-50 hover:bg-red-800'
                          onClick={() => removeTask(task._id)}
                        />
                        <Check className='bg-green-600 rounded text-zinc-50 hover:bg-green-800'
                          onClick={async () => completeTaskFn(task._id)} />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              )
            })}
          </TableBody>
        </Table>

        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent className='bg-zinc-200  '>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete task?</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              Are you sure you want to remove this task?
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel className='bg-zinc-300 text-zinc-950 rounded-[7px] border-none hover:bg-zinc-400'>Cancel</AlertDialogCancel>
              <AlertDialogAction className='bg-red-600 text-zinc-50 rounded-[7px] border-none hover:bg-red-700'
                onClick={async () => mutateAsync(taskId)}
              >Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
            
        {editTask && <EditTask isOpen={isDialogOpen} onClose={closeDialog} task={editTask} />}

      </main>
    </div>
  )
}



