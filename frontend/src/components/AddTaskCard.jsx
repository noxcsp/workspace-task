import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { createTask } from '@/lib/api'
import { toast } from 'sonner'
import { PlusIcon } from 'lucide-react'

export function AddTaskCard({ onTaskAdded }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
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

    setLoading(false)
    try {
      setLoading(true)
      const newTask = await createTask({ title: title.trim(), description: description.trim() })
      toast.success('Task created successfully')
      setTitle('')
      setDescription('')
      setErrors({})
      if (onTaskAdded) {
        onTaskAdded(newTask)
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setTitle('')
    setDescription('')
    setErrors({})
  }

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Create New Task</CardTitle>
          <CardDescription>Add a new task to your workspace dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className="flex flex-col gap-4">
            <Field data-invalid={!!errors.title}>
              <FieldLabel htmlFor="add-task-title">Task Title</FieldLabel>
              <Input
                id="add-task-title"
                placeholder="Write a clear title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
                aria-invalid={!!errors.title}
              />
              <FieldError>{errors.title}</FieldError>
            </Field>

            <Field data-invalid={!!errors.description}>
              <FieldLabel htmlFor="add-task-desc">Task Description</FieldLabel>
              <Textarea
                id="add-task-desc"
                placeholder="Detail what needs to be done..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                aria-invalid={!!errors.description}
              />
              <FieldError>{errors.description}</FieldError>
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </Button>
          <Button type="submit" disabled={loading}>
            <PlusIcon data-icon="inline-start" />
            {loading ? 'Creating...' : 'Add Task'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
