import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { AddTaskCard } from '@/components/AddTaskCard'
import { EditTaskCard } from '@/components/EditTaskCard'
import { fetchTasks, updateTask, deleteTask } from '@/lib/api'
import {
  ClipboardListIcon,
  CheckCircle2Icon,
  Trash2Icon,
  EditIcon,
  ClockIcon,
  Loader2Icon,
} from 'lucide-react'

function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all' | 'pending' | 'completed'
  const [editingTask, setEditingTask] = useState(null)
  const [deletingTask, setDeletingTask] = useState(null)

  // Fetch tasks on initial render
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true)
        const data = await fetchTasks()
        setTasks(data)
      } catch (err) {
        toast.error(err.message || 'Failed to load tasks')
      } finally {
        setLoading(false)
      }
    }
    loadTasks()
  }, [])

  // Toggle task completed state
  const handleToggleComplete = async (task) => {
    try {
      const newStatus = !task.complete
      const updated = await updateTask(task._id, { complete: newStatus })
      setTasks(prevTasks => prevTasks.map(t => t._id === task._id ? updated : t))
      toast.success(newStatus ? 'Task completed!' : 'Task marked as pending')
    } catch (err) {
      toast.error(err.message || 'Failed to update status')
    }
  }

  // Handle task added
  const handleTaskAdded = (newTask) => {
    setTasks(prevTasks => [newTask, ...prevTasks])
  }

  // Handle task updated
  const handleTaskUpdated = (updatedTask) => {
    setTasks(prevTasks => prevTasks.map(t => t._id === updatedTask._id ? updatedTask : t))
    setEditingTask(null)
  }

  // Handle delete confirmation dialog
  const handleDeleteConfirm = async () => {
    if (!deletingTask) return
    try {
      await deleteTask(deletingTask._id)
      setTasks(prevTasks => prevTasks.filter(t => t._id !== deletingTask._id))
      toast.success('Task deleted successfully')
    } catch (err) {
      toast.error(err.message || 'Failed to delete task')
    } finally {
      setDeletingTask(null)
    }
  }

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.complete
    if (filter === 'pending') return !task.complete
    return true
  })

  // Statistics
  const totalTasks = tasks.length
  const completedTasksCount = tasks.filter(t => t.complete).length
  const pendingTasksCount = totalTasks - completedTasksCount

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <header className="border-b border-border py-4 px-6 md:px-12 flex items-center justify-between bg-card">
        <div className="flex items-center gap-2.5">
          <ClipboardListIcon className="size-6 text-primary" />
          <h1 className="text-lg font-semibold tracking-tight font-heading">Workspace Tasks</h1>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CheckCircle2Icon className="size-3.5 text-emerald-500" />
            <span>{completedTasksCount} Done</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ClockIcon className="size-3.5 text-amber-500" />
            <span>{pendingTasksCount} Pending</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Create Task Form */}
        <div className="lg:col-span-1">
          <AddTaskCard onTaskAdded={handleTaskAdded} />
        </div>

        {/* Right Side: Tasks List */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Filters card / control bar */}
          <div className="flex items-center justify-between flex-wrap gap-4 border border-border bg-card p-4">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">Show:</span>
              <div className="flex items-center gap-1">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  All ({totalTasks})
                </Button>
                <Button
                  variant={filter === 'pending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('pending')}
                >
                  Pending ({pendingTasksCount})
                </Button>
                <Button
                  variant={filter === 'completed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('completed')}
                >
                  Completed ({completedTasksCount})
                </Button>
              </div>
            </div>
          </div>

          {/* List items */}
          <div className="flex flex-col gap-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Loader2Icon className="size-8 animate-spin mb-2" />
                <span className="text-xs">Loading tasks...</span>
              </div>
            ) : filteredTasks.length === 0 ? (
              <Card className="border-dashed flex flex-col items-center justify-center p-12 text-center">
                <ClipboardListIcon className="size-10 text-muted-foreground/40 mb-3" />
                <CardTitle className="text-sm font-medium mb-1">No Tasks Found</CardTitle>
                <CardDescription className="max-w-xs">
                  {filter === 'all'
                    ? 'Your workspace is clear. Create a task to get started.'
                    : filter === 'pending'
                    ? "You don't have any pending tasks right now."
                    : "No completed tasks yet. Go finish some work!"}
                </CardDescription>
              </Card>
            ) : (
              filteredTasks.map(task => (
                <Card
                  key={task._id}
                  className={`transition-all ${
                    task.complete ? 'opacity-70 bg-muted/20 border-border/60' : 'hover:border-foreground/20'
                  }`}
                >
                  <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="pt-0.5">
                        <Checkbox
                          id={`task-check-${task._id}`}
                          checked={task.complete}
                          onCheckedChange={() => handleToggleComplete(task)}
                          aria-label={`Toggle completion of ${task.title}`}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label
                          htmlFor={`task-check-${task._id}`}
                          className={`text-sm font-medium leading-none cursor-pointer select-none font-heading ${
                            task.complete ? 'line-through text-muted-foreground' : ''
                          }`}
                        >
                          {task.title}
                        </label>
                        <CardDescription className="text-xs">
                          Created {new Date(task.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant={task.complete ? 'default' : 'outline'}>
                        {task.complete ? 'Completed' : 'Pending'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setEditingTask(task)}
                        aria-label="Edit task"
                      >
                        <EditIcon className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="hover:text-destructive text-muted-foreground"
                        onClick={() => setDeletingTask(task)}
                        aria-label="Delete task"
                      >
                        <Trash2Icon className="size-3.5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <p className={`text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap ${
                      task.complete ? 'line-through opacity-80' : ''
                    }`}>
                      {task.description}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Edit Task Dialog */}
      <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task Details</DialogTitle>
            <DialogDescription className="sr-only">
              Edit the form below to update the task details and progress
            </DialogDescription>
          </DialogHeader>
          {editingTask && (
            <EditTaskCard
              key={editingTask._id}
              task={editingTask}
              onTaskUpdated={handleTaskUpdated}
              onCancel={() => setEditingTask(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={!!deletingTask} onOpenChange={(open) => !open && setDeletingTask(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task{' '}
              <strong>&ldquo;{deletingTask?.title}&rdquo;</strong> from your workspace database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDeleteConfirm}
            >
              Delete Task
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster position="bottom-right" />
    </div>
  )
}

export default App
