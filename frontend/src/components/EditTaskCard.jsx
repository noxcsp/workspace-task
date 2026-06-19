import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { updateTask } from '@/lib/api'
import { toast } from 'sonner'
import { SaveIcon } from 'lucide-react'

export function EditTaskCard({ task, onTaskUpdated, onCancel }) {
  const [title, setTitle] = useState(task?.title || '')
  const [description, setDescription] = useState(task?.description || '')
  const [complete, setComplete] = useState(task?.complete || false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!title.trim()) {
      newErrors.title = 'Title is required'
    } else if (title.length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters'
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const updatedTask = await updateTask(task._id, {
        title: title.trim(),
        description: description.trim(),
        complete,
      })
      toast.success('Task updated successfully')
      if (onTaskUpdated) {
        onTaskUpdated(updatedTask)
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full border-none shadow-none ring-0">
      <form onSubmit={handleSubmit}>
        <CardHeader className="px-0 pt-0">
          <CardTitle>Edit Task</CardTitle>
          <CardDescription>Update the details and status of this task</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <FieldGroup className="flex flex-col gap-4">
            <Field data-invalid={!!errors.title}>
              <FieldLabel htmlFor="edit-task-title">Task Title</FieldLabel>
              <Input
                id="edit-task-title"
                placeholder="Write a clear title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
                aria-invalid={!!errors.title}
              />
              <FieldError>{errors.title}</FieldError>
            </Field>

            <Field data-invalid={!!errors.description}>
              <FieldLabel htmlFor="edit-task-desc">Task Description</FieldLabel>
              <Textarea
                id="edit-task-desc"
                placeholder="Detail what needs to be done..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                aria-invalid={!!errors.description}
              />
              <FieldError>{errors.description}</FieldError>
            </Field>

            <Field orientation="horizontal" className="py-2">
              <Checkbox
                id="edit-task-complete"
                checked={complete}
                onCheckedChange={(checked) => setComplete(!!checked)}
                disabled={loading}
              />
              <FieldLabel htmlFor="edit-task-complete" className="cursor-pointer">
                Mark as Completed
              </FieldLabel>
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 px-0 pb-0">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            <SaveIcon data-icon="inline-start" />
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
