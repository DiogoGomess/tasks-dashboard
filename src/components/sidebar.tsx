import { ClipboardCheck, LayoutGrid, Settings } from 'lucide-react'
export function SideBar() {
    return (
        <aside className="bg-zinc-50 h-screen w-72  flex flex-col items-center fixed">
            <h1 className="flex font-bold text-xl mt-10">Tasker</h1>
            <div className='mt-40 flex flex-col gap-2 w-full '>
                <a href="" className='flex items-center justify-start gap-2 hover:bg-zinc-200 py-2 mx-8 px-3 hover:rounded group'>
                    <LayoutGrid size={30} className='text-zinc-600 group-hover:text-zinc-900' />
                    <span className='font-semibold text-md text-zinc-600 group-hover:text-zinc-900 '>Home</span>
                </a>
                <a href="" className='flex items-center justify-start gap-2 hover:bg-zinc-200 py-2 mx-8 px-3 hover:rounded group'>
                    <ClipboardCheck size={30} className='text-zinc-600 group-hover:text-zinc-900' />
                    <span className='font-semibold text-md text-zinc-600 group-hover:text-zinc-900'>Tasks</span>
                </a>
                <a href="" className='flex items-center justify-start gap-2 hover:bg-zinc-200 py-2 mx-8 px-3 hover:rounded group'>
                    <Settings size={30} className='text-zinc-600 group-hover:text-zinc-900' />
                    <span className='font-semibold text-md text-zinc-600 group-hover:text-zinc-900'>Settings</span>
                </a>
            </div>
        </aside>
    )
}